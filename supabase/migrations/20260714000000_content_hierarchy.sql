-- HYPE LIVE — content hierarchy (additive on 20260314000000_initial_schema)
-- Channel → Program → Season? → Episode
-- Stream (live) → Recording (1:1 MVP) → Episode (VOD)

-- ---------------------------------------------------------------------------
-- Alter programs
-- ---------------------------------------------------------------------------
alter table public.programs
  add column if not exists banner_url text;

alter table public.programs
  add column if not exists is_active boolean not null default true;

-- ---------------------------------------------------------------------------
-- seasons
-- ---------------------------------------------------------------------------
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  number integer,
  title text not null,
  year integer,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index seasons_program_number_uidx
  on public.seasons (program_id, number)
  where number is not null;

create index seasons_program_id_idx on public.seasons (program_id);

create trigger seasons_set_updated_at
  before update on public.seasons
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- hosts
-- ---------------------------------------------------------------------------
create table public.hosts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger hosts_set_updated_at
  before update on public.hosts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- program_hosts
-- ---------------------------------------------------------------------------
create table public.program_hosts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  host_id uuid not null references public.hosts (id) on delete cascade,
  role text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (program_id, host_id)
);

create index program_hosts_program_id_idx on public.program_hosts (program_id);
create index program_hosts_host_id_idx on public.program_hosts (host_id);

-- ---------------------------------------------------------------------------
-- recordings (MVP: one recording per stream)
-- ---------------------------------------------------------------------------
create table public.recordings (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid not null unique references public.streams (id) on delete cascade,
  provider_recording_id text,
  playback_id text,
  duration_seconds integer,
  thumbnail_url text,
  status text not null default 'processing'
    check (status in ('processing', 'ready', 'failed', 'archived')),
  created_at timestamptz not null default now(),
  ready_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.recordings is 'MVP: one recording per stream (stream_id unique).';

create index recordings_status_idx on public.recordings (status);

create trigger recordings_set_updated_at
  before update on public.recordings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- episodes
-- ---------------------------------------------------------------------------
create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  season_id uuid references public.seasons (id) on delete set null,
  source_stream_id uuid references public.streams (id) on delete set null,
  source_recording_id uuid references public.recordings (id) on delete set null,
  title text not null,
  description text,
  episode_number integer,
  aired_at timestamptz,
  duration_seconds integer,
  thumbnail_url text,
  playback_id text,
  status text not null default 'draft'
    check (status in ('draft', 'processing', 'published', 'unavailable', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index episodes_program_id_idx on public.episodes (program_id);
create index episodes_season_id_idx on public.episodes (season_id);
create index episodes_status_idx on public.episodes (status);
create index episodes_source_stream_id_idx on public.episodes (source_stream_id);
create index episodes_aired_at_idx on public.episodes (aired_at);

create trigger episodes_set_updated_at
  before update on public.episodes
  for each row execute function public.set_updated_at();

-- Validate season belongs to the same program as the episode
create or replace function public.validate_episode_season_program()
returns trigger
language plpgsql
as $$
begin
  if new.season_id is not null then
    if not exists (
      select 1
      from public.seasons s
      where s.id = new.season_id
        and s.program_id = new.program_id
    ) then
      raise exception 'season.program_id must match episode.program_id';
    end if;
  end if;
  return new;
end;
$$;

create trigger episodes_validate_season_program
  before insert or update on public.episodes
  for each row execute function public.validate_episode_season_program();

-- ---------------------------------------------------------------------------
-- program_follows
-- ---------------------------------------------------------------------------
create table public.program_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, program_id)
);

create index program_follows_user_id_idx on public.program_follows (user_id);
create index program_follows_program_id_idx on public.program_follows (program_id);

-- ---------------------------------------------------------------------------
-- Alter watch_progress for episodes
-- ---------------------------------------------------------------------------
alter table public.watch_progress
  add column if not exists episode_id uuid references public.episodes (id) on delete cascade;

alter table public.watch_progress
  alter column video_id drop not null;

create index if not exists watch_progress_episode_id_idx
  on public.watch_progress (episode_id);

create unique index if not exists watch_progress_user_episode_uidx
  on public.watch_progress (user_id, episode_id)
  where episode_id is not null;

-- ---------------------------------------------------------------------------
-- Data migration: videos → episodes
-- ---------------------------------------------------------------------------
insert into public.episodes (
  id,
  program_id,
  season_id,
  source_stream_id,
  source_recording_id,
  title,
  description,
  episode_number,
  aired_at,
  duration_seconds,
  thumbnail_url,
  playback_id,
  status,
  published_at,
  created_at,
  updated_at
)
select
  v.id,
  coalesce(
    v.program_id,
    (
      select p.id
      from public.programs p
      where p.channel_id = v.channel_id
      order by p.created_at
      limit 1
    )
  ),
  null,
  v.stream_id,
  null,
  v.title,
  v.description,
  null,
  v.published_at,
  v.duration_seconds,
  v.thumbnail_url,
  v.playback_id,
  case v.status
    when 'ready' then 'published'
    when 'processing' then 'processing'
    when 'failed' then 'unavailable'
    else 'archived'
  end,
  v.published_at,
  v.created_at,
  v.updated_at
from public.videos v
where v.program_id is not null
   or exists (
     select 1
     from public.programs p
     where p.channel_id = v.channel_id
   )
on conflict (id) do nothing;

-- Create recordings for videos that have a stream_id (1:1 with stream)
insert into public.recordings (
  id,
  stream_id,
  provider_recording_id,
  playback_id,
  duration_seconds,
  thumbnail_url,
  status,
  created_at,
  ready_at,
  updated_at
)
select
  gen_random_uuid(),
  v.stream_id,
  null,
  v.playback_id,
  v.duration_seconds,
  v.thumbnail_url,
  case v.status
    when 'ready' then 'ready'
    when 'processing' then 'processing'
    when 'failed' then 'failed'
    else 'archived'
  end,
  v.created_at,
  case when v.status = 'ready' then coalesce(v.published_at, v.updated_at) else null end,
  v.updated_at
from public.videos v
where v.stream_id is not null
  and not exists (
    select 1 from public.recordings r where r.stream_id = v.stream_id
  );

-- Link episodes to recordings via shared stream
update public.episodes e
set source_recording_id = r.id
from public.recordings r
where e.source_stream_id = r.stream_id
  and e.source_recording_id is null;

-- Backfill watch_progress.episode_id from video_id where episode exists
update public.watch_progress wp
set episode_id = wp.video_id
where wp.episode_id is null
  and wp.video_id is not null
  and exists (
    select 1 from public.episodes e where e.id = wp.video_id
  );

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.seasons enable row level security;
alter table public.hosts enable row level security;
alter table public.program_hosts enable row level security;
alter table public.recordings enable row level security;
alter table public.episodes enable row level security;
alter table public.program_follows enable row level security;

-- seasons
create policy "seasons_select_public"
  on public.seasons for select
  using (true);

create policy "seasons_insert_authorized"
  on public.seasons for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "seasons_update_authorized"
  on public.seasons for update
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = seasons.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "seasons_delete_authorized"
  on public.seasons for delete
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = seasons.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer'])
    )
  );

-- hosts (catalog; manageable by staff of any channel)
create policy "hosts_select_public"
  on public.hosts for select
  using (true);

create policy "hosts_insert_authorized"
  on public.hosts for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.channel_members cm
      where cm.user_id = auth.uid()
        and cm.role = any (array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "hosts_update_authorized"
  on public.hosts for update
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.channel_members cm
      where cm.user_id = auth.uid()
        and cm.role = any (array['channel_admin', 'producer', 'creator'])
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.channel_members cm
      where cm.user_id = auth.uid()
        and cm.role = any (array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "hosts_delete_authorized"
  on public.hosts for delete
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.channel_members cm
      where cm.user_id = auth.uid()
        and cm.role = any (array['channel_admin', 'producer'])
    )
  );

-- program_hosts
create policy "program_hosts_select_public"
  on public.program_hosts for select
  using (true);

create policy "program_hosts_insert_authorized"
  on public.program_hosts for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "program_hosts_update_authorized"
  on public.program_hosts for update
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_hosts.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "program_hosts_delete_authorized"
  on public.program_hosts for delete
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_hosts.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer'])
    )
  );

-- recordings: public ready; staff see all for their channel
create policy "recordings_select_public_or_staff"
  on public.recordings for select
  using (
    status = 'ready'
    or public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = recordings.stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "recordings_insert_authorized"
  on public.recordings for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "recordings_update_authorized"
  on public.recordings for update
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = recordings.stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "recordings_delete_authorized"
  on public.recordings for delete
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = recordings.stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer'])
    )
  );

-- episodes: public published; staff see all for their channel
create policy "episodes_select_public_or_staff"
  on public.episodes for select
  using (
    status = 'published'
    or public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = episodes.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "episodes_insert_authorized"
  on public.episodes for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "episodes_update_authorized"
  on public.episodes for update
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = episodes.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer', 'creator'])
    )
  );

create policy "episodes_delete_authorized"
  on public.episodes for delete
  to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.programs p
      where p.id = episodes.program_id
        and public.has_channel_role(p.channel_id, array['channel_admin', 'producer'])
    )
  );

-- program_follows (own only)
create policy "program_follows_select_own"
  on public.program_follows for select
  to authenticated
  using (auth.uid() = user_id);

create policy "program_follows_insert_own"
  on public.program_follows for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "program_follows_delete_own"
  on public.program_follows for delete
  to authenticated
  using (auth.uid() = user_id);

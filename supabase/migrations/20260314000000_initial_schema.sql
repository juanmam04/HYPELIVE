-- HYPE LIVE — initial schema
-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  role text not null default 'viewer'
    check (role in ('viewer', 'creator', 'producer', 'channel_admin', 'platform_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Prevent clients from elevating their own role
create or replace function public.prevent_profile_role_elevation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null
       and auth.uid() = old.id
       and coalesce(auth.jwt() ->> 'role', '') <> 'service_role'
    then
      -- Only platform_admin (via service role / privileged path) may change roles.
      -- Block self-service role changes from authenticated clients.
      raise exception 'No se puede modificar el rol del perfil desde el cliente';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_elevation
  before update on public.profiles
  for each row execute function public.prevent_profile_role_elevation();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_username text;
  meta_display text;
  meta_avatar text;
begin
  meta_username := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    split_part(new.email, '@', 1),
    'user_' || substr(replace(new.id::text, '-', ''), 1, 12)
  );
  meta_display := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    meta_username
  );
  meta_avatar := nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), '');

  insert into public.profiles (id, username, display_name, avatar_url, role)
  values (
    new.id,
    meta_username,
    meta_display,
    meta_avatar,
    'viewer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- channels
-- ---------------------------------------------------------------------------
create table public.channels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  logo_url text,
  banner_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger channels_set_updated_at
  before update on public.channels
  for each row execute function public.set_updated_at();

create index channels_slug_idx on public.channels (slug);

-- ---------------------------------------------------------------------------
-- channel_members
-- ---------------------------------------------------------------------------
create table public.channel_members (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null
    check (role in ('viewer', 'creator', 'producer', 'channel_admin')),
  created_at timestamptz not null default now(),
  unique (channel_id, user_id)
);

create index channel_members_channel_id_idx on public.channel_members (channel_id);
create index channel_members_user_id_idx on public.channel_members (user_id);

-- Helpers for RLS (security definer to avoid recursive policy checks)
create or replace function public.is_channel_member(p_channel_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.channel_members cm
    where cm.channel_id = p_channel_id
      and cm.user_id = auth.uid()
  );
$$;

create or replace function public.has_channel_role(p_channel_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.channel_members cm
    where cm.channel_id = p_channel_id
      and cm.user_id = auth.uid()
      and cm.role = any (p_roles)
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'platform_admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- programs
-- ---------------------------------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels (id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  artwork_url text,
  schedule_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (channel_id, slug)
);

create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

create index programs_channel_id_idx on public.programs (channel_id);
create index programs_slug_idx on public.programs (slug);

-- ---------------------------------------------------------------------------
-- streams
-- ---------------------------------------------------------------------------
create table public.streams (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels (id) on delete cascade,
  program_id uuid references public.programs (id) on delete set null,
  title text not null,
  description text,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'starting', 'live', 'processing', 'ended', 'failed')),
  scheduled_for timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  viewer_count integer not null default 0,
  thumbnail_url text,
  playback_id text,
  provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger streams_set_updated_at
  before update on public.streams
  for each row execute function public.set_updated_at();

create index streams_channel_id_idx on public.streams (channel_id);
create index streams_program_id_idx on public.streams (program_id);
create index streams_status_idx on public.streams (status);
create index streams_scheduled_for_idx on public.streams (scheduled_for);

-- ---------------------------------------------------------------------------
-- videos
-- ---------------------------------------------------------------------------
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels (id) on delete cascade,
  stream_id uuid references public.streams (id) on delete set null,
  program_id uuid references public.programs (id) on delete set null,
  title text not null,
  description text,
  status text not null default 'processing'
    check (status in ('processing', 'ready', 'failed', 'archived')),
  duration_seconds integer,
  thumbnail_url text,
  playback_id text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger videos_set_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();

create index videos_channel_id_idx on public.videos (channel_id);
create index videos_stream_id_idx on public.videos (stream_id);
create index videos_program_id_idx on public.videos (program_id);
create index videos_status_idx on public.videos (status);
create index videos_published_at_idx on public.videos (published_at);

-- ---------------------------------------------------------------------------
-- chat_messages
-- ---------------------------------------------------------------------------
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid not null references public.streams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null
    check (char_length(content) > 0 and char_length(content) <= 500),
  stream_offset_seconds integer,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index chat_messages_stream_id_idx on public.chat_messages (stream_id);
create index chat_messages_user_id_idx on public.chat_messages (user_id);
create index chat_messages_created_at_idx on public.chat_messages (created_at);

-- ---------------------------------------------------------------------------
-- follows
-- ---------------------------------------------------------------------------
create table public.follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel_id uuid not null references public.channels (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, channel_id)
);

create index follows_user_id_idx on public.follows (user_id);
create index follows_channel_id_idx on public.follows (channel_id);

-- ---------------------------------------------------------------------------
-- watch_progress
-- ---------------------------------------------------------------------------
create table public.watch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  progress_seconds integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create trigger watch_progress_set_updated_at
  before update on public.watch_progress
  for each row execute function public.set_updated_at();

create index watch_progress_user_id_idx on public.watch_progress (user_id);
create index watch_progress_video_id_idx on public.watch_progress (video_id);

-- ---------------------------------------------------------------------------
-- device_pairings
-- ---------------------------------------------------------------------------
create table public.device_pairings (
  id uuid primary key default gen_random_uuid(),
  pairing_code text not null,
  tv_device_id text not null,
  user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'waiting'
    check (status in ('waiting', 'paired', 'expired', 'cancelled')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  paired_at timestamptz
);

create index device_pairings_pairing_code_idx on public.device_pairings (pairing_code);
create index device_pairings_tv_device_id_idx on public.device_pairings (tv_device_id);
create index device_pairings_user_id_idx on public.device_pairings (user_id);
create index device_pairings_status_idx on public.device_pairings (status);

create or replace function public.expire_device_pairings()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.device_pairings
  set status = 'expired'
  where status = 'waiting'
    and expires_at < now();

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

grant execute on function public.expire_device_pairings() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.programs enable row level security;
alter table public.streams enable row level security;
alter table public.videos enable row level security;
alter table public.chat_messages enable row level security;
alter table public.follows enable row level security;
alter table public.watch_progress enable row level security;
alter table public.device_pairings enable row level security;

-- profiles
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- channels
create policy "channels_select_public"
  on public.channels for select
  using (true);

create policy "channels_insert_authenticated"
  on public.channels for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "channels_update_admin_producer"
  on public.channels for update
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(id, array['channel_admin', 'producer'])
  )
  with check (
    public.is_platform_admin()
    or public.has_channel_role(id, array['channel_admin', 'producer'])
  );

create policy "channels_delete_admin"
  on public.channels for delete
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(id, array['channel_admin'])
  );

-- channel_members
create policy "channel_members_select_members"
  on public.channel_members for select
  to authenticated
  using (
    public.is_platform_admin()
    or public.is_channel_member(channel_id)
  );

create policy "channel_members_insert_admin"
  on public.channel_members for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin'])
  );

create policy "channel_members_update_admin"
  on public.channel_members for update
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin'])
  )
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin'])
  );

create policy "channel_members_delete_admin"
  on public.channel_members for delete
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin'])
  );

-- programs
create policy "programs_select_public"
  on public.programs for select
  using (true);

create policy "programs_insert_authorized"
  on public.programs for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  );

create policy "programs_update_authorized"
  on public.programs for update
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  )
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  );

create policy "programs_delete_authorized"
  on public.programs for delete
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer'])
  );

-- streams
create policy "streams_select_public"
  on public.streams for select
  using (true);

create policy "streams_insert_authorized"
  on public.streams for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  );

create policy "streams_update_authorized"
  on public.streams for update
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  )
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  );

create policy "streams_delete_authorized"
  on public.streams for delete
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer'])
  );

-- videos
create policy "videos_select_public"
  on public.videos for select
  using (true);

create policy "videos_insert_authorized"
  on public.videos for insert
  to authenticated
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  );

create policy "videos_update_authorized"
  on public.videos for update
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  )
  with check (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer', 'creator'])
  );

create policy "videos_delete_authorized"
  on public.videos for delete
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_channel_role(channel_id, array['channel_admin', 'producer'])
  );

-- chat_messages
create policy "chat_messages_select_public"
  on public.chat_messages for select
  using (deleted_at is null);

create policy "chat_messages_insert_authenticated"
  on public.chat_messages for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.streams s
      where s.id = stream_id
        and s.status in ('live', 'starting')
    )
  );

create policy "chat_messages_delete_own_or_moderator"
  on public.chat_messages for update
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = chat_messages.stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer'])
    )
  )
  with check (
    auth.uid() = user_id
    or public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = chat_messages.stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer'])
    )
  );

-- Soft-delete via update; also allow hard delete for owners/mods
create policy "chat_messages_hard_delete_own_or_moderator"
  on public.chat_messages for delete
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_platform_admin()
    or exists (
      select 1
      from public.streams s
      where s.id = chat_messages.stream_id
        and public.has_channel_role(s.channel_id, array['channel_admin', 'producer'])
    )
  );

-- follows
create policy "follows_select_own"
  on public.follows for select
  to authenticated
  using (auth.uid() = user_id);

create policy "follows_insert_own"
  on public.follows for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "follows_delete_own"
  on public.follows for delete
  to authenticated
  using (auth.uid() = user_id);

-- watch_progress
create policy "watch_progress_select_own"
  on public.watch_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "watch_progress_insert_own"
  on public.watch_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "watch_progress_update_own"
  on public.watch_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "watch_progress_delete_own"
  on public.watch_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- device_pairings (pairing flow: TV creates/polls by code; user claims pairing)
create policy "device_pairings_select_pairing_flow"
  on public.device_pairings for select
  using (
    status = 'waiting'
    or auth.uid() = user_id
    or public.is_platform_admin()
  );

create policy "device_pairings_insert_waiting"
  on public.device_pairings for insert
  with check (
    status = 'waiting'
    and user_id is null
    and expires_at > now()
  );

create policy "device_pairings_update_own"
  on public.device_pairings for update
  to authenticated
  using (
    (status = 'waiting' and user_id is null)
    or auth.uid() = user_id
    or public.is_platform_admin()
  )
  with check (
    auth.uid() = user_id
    or public.is_platform_admin()
  );

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.chat_messages;

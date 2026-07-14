import { hasWebSupabaseEnv, hasExpoSupabaseEnv } from "@hypelive/config";
import {
  createBrowserClient,
  channelToDomain,
  chatMessageToDomain,
  episodeToDomain,
  episodeToVideo,
  followToDomain,
  programFollowToDomain,
  programHostToDomain,
  programToDomain,
  recordingToDomain,
  seasonToDomain,
  streamToDomain,
  watchProgressToDomain,
  type HypeliveSupabaseClient,
} from "@hypelive/database";
import type {
  Channel,
  ChannelDetail,
  ChatMessage,
  Episode,
  Follow,
  HomeFeed,
  Program,
  ProgramDetail,
  ProgramFollow,
  Stream,
  StudioSummary,
  Video,
  WatchProgress,
} from "@hypelive/types";
import {
  mockChannels,
  mockChat,
  mockEpisodes,
  mockHomeFeed,
  mockProgramHosts,
  mockPrograms,
  mockSeasons,
  mockStreams,
  mockStudioSummary,
  mockWatchProgress,
} from "./mock-data";

export type ApiClientOptions = {
  supabase?: HypeliveSupabaseClient | null;
  /**
   * Force mock mode when true.
   * Defaults to false (prefer Supabase). If there is no client and `useMock`
   * is not explicitly `false`, queries fall back to mock data.
   */
  useMock?: boolean;
};

function resolveClient(options?: ApiClientOptions): HypeliveSupabaseClient | null {
  if (options?.useMock === true) return null;
  if (options?.supabase) return options.supabase;

  const env = process.env;
  const webReady = hasWebSupabaseEnv(env);
  const expoReady = hasExpoSupabaseEnv(env);

  if (webReady) {
    return createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL!,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  if (expoReady) {
    return createBrowserClient(
      env.EXPO_PUBLIC_SUPABASE_URL!,
      env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return null;
}

function shouldUseMock(
  options: ApiClientOptions | undefined,
  client: HypeliveSupabaseClient | null,
): boolean {
  if (options?.useMock === true) return true;
  if (!client && options?.useMock !== false) return true;
  return false;
}

function enrichStream(
  stream: Stream,
  channels: Channel[] = mockChannels,
  programs: Program[] = mockPrograms,
): Stream {
  if (stream.channel && (stream.program !== undefined || stream.programId == null)) {
    return stream;
  }
  const channel = channels.find((c) => c.id === stream.channelId) ?? stream.channel;
  const program =
    stream.programId == null
      ? null
      : (programs.find((p) => p.id === stream.programId) ?? stream.program ?? null);
  return { ...stream, channel, program };
}

function enrichEpisode(episode: Episode): Episode {
  if (episode.program && episode.channel) return episode;
  const program =
    mockPrograms.find((p) => p.id === episode.programId) ?? episode.program;
  const channel = program
    ? mockChannels.find((c) => c.id === program.channelId) ?? episode.channel
    : episode.channel;
  const season = episode.seasonId
    ? mockSeasons.find((s) => s.id === episode.seasonId) ?? episode.season
    : null;
  return { ...episode, program, channel, season };
}

function startOfTodayIso(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfTodayIso(): string {
  const d = new Date();
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

function sortEpisodesByNumber(a: Episode, b: Episode): number {
  const an = a.episodeNumber ?? Number.MAX_SAFE_INTEGER;
  const bn = b.episodeNumber ?? Number.MAX_SAFE_INTEGER;
  if (an !== bn) return an - bn;
  return (a.airedAt ?? "").localeCompare(b.airedAt ?? "");
}

export async function getFeaturedStream(
  options?: ApiClientOptions,
): Promise<Stream | null> {
  const live = await getLiveStreams(options);
  return live[0] ?? null;
}

export async function getLiveStreams(
  options?: ApiClientOptions,
): Promise<Stream[]> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockStreams
      .filter((s) => s.status === "live")
      .map((s) => enrichStream(s));
  }

  const { data, error } = await client
    .from("streams")
    .select("*")
    .eq("status", "live")
    .order("viewer_count", { ascending: false });

  if (error || !data) {
    if (options?.useMock === false) return [];
    return mockStreams
      .filter((s) => s.status === "live")
      .map((s) => enrichStream(s));
  }
  return data.map((row) => enrichStream(streamToDomain(row)));
}

export async function getUpcomingStreams(
  options?: ApiClientOptions,
): Promise<Stream[]> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockStreams
      .filter((s) => s.status === "scheduled")
      .sort((a, b) =>
        (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""),
      )
      .map((s) => enrichStream(s));
  }

  const { data, error } = await client
    .from("streams")
    .select("*")
    .eq("status", "scheduled")
    .order("scheduled_for", { ascending: true })
    .limit(30);

  if (error || !data) {
    if (options?.useMock === false) return [];
    return mockStreams
      .filter((s) => s.status === "scheduled")
      .map((s) => enrichStream(s));
  }
  return data.map((row) => enrichStream(streamToDomain(row)));
}

export async function getFeaturedChannels(
  options?: ApiClientOptions,
): Promise<Channel[]> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockChannels.filter((c) => c.isVerified);
  }

  const { data, error } = await client
    .from("channels")
    .select("*")
    .eq("is_verified", true)
    .order("name", { ascending: true })
    .limit(20);

  if (error || !data) {
    if (options?.useMock === false) return [];
    return mockChannels.filter((c) => c.isVerified);
  }
  return data.map(channelToDomain);
}

export async function getHomeFeed(
  options?: ApiClientOptions,
): Promise<HomeFeed> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) return mockHomeFeed;

  const [
    liveRes,
    scheduleRes,
    recentRes,
    channelsRes,
    programsRes,
    episodesRes,
  ] = await Promise.all([
    client
      .from("streams")
      .select("*")
      .eq("status", "live")
      .order("viewer_count", { ascending: false })
      .limit(20),
    client
      .from("streams")
      .select("*")
      .eq("status", "scheduled")
      .gte("scheduled_for", startOfTodayIso())
      .lte("scheduled_for", endOfTodayIso())
      .order("scheduled_for", { ascending: true })
      .limit(20),
    client
      .from("streams")
      .select("*")
      .eq("status", "ended")
      .order("ended_at", { ascending: false })
      .limit(20),
    client
      .from("channels")
      .select("*")
      .eq("is_verified", true)
      .order("name", { ascending: true })
      .limit(20),
    client
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("title", { ascending: true })
      .limit(20),
    client
      .from("episodes")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12),
  ]);

  if (
    liveRes.error ||
    scheduleRes.error ||
    recentRes.error ||
    channelsRes.error ||
    programsRes.error ||
    episodesRes.error
  ) {
    if (options?.useMock === false) {
      return {
        featured: null,
        liveNow: [],
        todaySchedule: [],
        recentStreams: [],
        featuredChannels: [],
        popularPrograms: [],
        recentEpisodes: [],
        continueWatching: [],
      };
    }
    return mockHomeFeed;
  }

  const liveNow = (liveRes.data ?? []).map((row) =>
    enrichStream(streamToDomain(row)),
  );
  const todaySchedule = (scheduleRes.data ?? []).map((row) =>
    enrichStream(streamToDomain(row)),
  );
  const recentStreams = (recentRes.data ?? []).map((row) =>
    enrichStream(streamToDomain(row)),
  );
  const featuredChannels = (channelsRes.data ?? []).map(channelToDomain);
  const popularPrograms = (programsRes.data ?? []).map(programToDomain);
  const recentEpisodes = (episodesRes.data ?? []).map((row) =>
    enrichEpisode(episodeToDomain(row)),
  );

  return {
    featured: liveNow[0] ?? null,
    liveNow,
    todaySchedule,
    recentStreams,
    featuredChannels,
    popularPrograms,
    recentEpisodes,
    continueWatching: [],
    programs: popularPrograms,
  };
}

export async function getChannelBySlug(
  slug: string,
  options?: ApiClientOptions,
): Promise<Channel | null> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockChannels.find((c) => c.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from("channels")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (options?.useMock === false) return null;
    return mockChannels.find((c) => c.slug === slug) ?? null;
  }
  return channelToDomain(data);
}

export async function getChannelDetail(
  slug: string,
  options?: ApiClientOptions,
): Promise<ChannelDetail | null> {
  const channel = await getChannelBySlug(slug, options);
  if (!channel) return null;

  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    const programs = mockPrograms.filter((p) => p.channelId === channel.id);
    const channelStreams = mockStreams.filter((s) => s.channelId === channel.id);
    const liveStream =
      channelStreams.find((s) => s.status === "live") ?? null;
    const nextStream =
      channelStreams
        .filter((s) => s.status === "scheduled")
        .sort((a, b) =>
          (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""),
        )[0] ?? null;
    const schedule = channelStreams
      .filter((s) => s.status === "scheduled" || s.status === "live")
      .map((s) => enrichStream(s));
    const programIds = new Set(programs.map((p) => p.id));
    const recentEpisodes = mockEpisodes
      .filter((e) => programIds.has(e.programId) && e.status === "published")
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      .slice(0, 12)
      .map(enrichEpisode);
    const specialEvents = channelStreams
      .filter((s) => s.programId == null)
      .map((s) => enrichStream(s));

    return {
      channel,
      liveStream: liveStream ? enrichStream(liveStream) : null,
      nextStream: nextStream ? enrichStream(nextStream) : null,
      programs,
      schedule,
      recentEpisodes,
      specialEvents,
    };
  }

  const [programsRes, streamsRes, episodesRes] = await Promise.all([
    client
      .from("programs")
      .select("*")
      .eq("channel_id", channel.id)
      .eq("is_active", true)
      .order("title", { ascending: true }),
    client
      .from("streams")
      .select("*")
      .eq("channel_id", channel.id)
      .order("scheduled_for", { ascending: true }),
    client
      .from("episodes")
      .select("*, programs!inner(channel_id)")
      .eq("programs.channel_id", channel.id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12),
  ]);

  const programs = (programsRes.data ?? []).map(programToDomain);
  const streams = (streamsRes.data ?? []).map((row) =>
    enrichStream(streamToDomain(row), [channel], programs),
  );
  const liveStream = streams.find((s) => s.status === "live") ?? null;
  const nextStream =
    streams
      .filter((s) => s.status === "scheduled")
      .sort((a, b) =>
        (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""),
      )[0] ?? null;

  return {
    channel,
    liveStream,
    nextStream,
    programs,
    schedule: streams.filter(
      (s) => s.status === "scheduled" || s.status === "live",
    ),
    recentEpisodes: (episodesRes.data ?? []).map((row) =>
      enrichEpisode(episodeToDomain(row)),
    ),
    specialEvents: streams.filter((s) => s.programId == null),
  };
}

export async function getProgramBySlug(
  channelSlug: string,
  programSlug: string,
  options?: ApiClientOptions,
): Promise<Program | null> {
  const channel = await getChannelBySlug(channelSlug, options);
  if (!channel) return null;

  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    const program = mockPrograms.find(
      (p) => p.channelId === channel.id && p.slug === programSlug,
    );
    return program ? { ...program, channel } : null;
  }

  const { data, error } = await client
    .from("programs")
    .select("*")
    .eq("channel_id", channel.id)
    .eq("slug", programSlug)
    .maybeSingle();

  if (error || !data) {
    if (options?.useMock === false) return null;
    const program = mockPrograms.find(
      (p) => p.channelId === channel.id && p.slug === programSlug,
    );
    return program ? { ...program, channel } : null;
  }
  return { ...programToDomain(data), channel };
}

export async function getProgramDetail(
  channelSlug: string,
  programSlug: string,
  options?: ApiClientOptions,
): Promise<ProgramDetail | null> {
  const program = await getProgramBySlug(channelSlug, programSlug, options);
  if (!program?.channel) return null;
  const channel = program.channel;

  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    const hosts = mockProgramHosts
      .filter((ph) => ph.programId === program.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const programStreams = mockStreams.filter((s) => s.programId === program.id);
    const liveStream =
      programStreams.find((s) => s.status === "live") ?? null;
    const upcomingStream =
      programStreams
        .filter((s) => s.status === "scheduled")
        .sort((a, b) =>
          (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""),
        )[0] ?? null;
    const seasons = mockSeasons.filter((s) => s.programId === program.id);
    const episodes = mockEpisodes
      .filter((e) => e.programId === program.id && e.status === "published")
      .sort(sortEpisodesByNumber)
      .map(enrichEpisode);
    const latestEpisode = [...episodes]
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))[0] ?? null;

    return {
      program: { ...program, channel },
      channel,
      hosts,
      liveStream: liveStream ? enrichStream(liveStream) : null,
      upcomingStream: upcomingStream ? enrichStream(upcomingStream) : null,
      seasons,
      episodes,
      latestEpisode,
    };
  }

  const [hostsRes, streamsRes, seasonsRes, episodesRes] = await Promise.all([
    client
      .from("program_hosts")
      .select("*")
      .eq("program_id", program.id)
      .order("display_order", { ascending: true }),
    client
      .from("streams")
      .select("*")
      .eq("program_id", program.id)
      .order("scheduled_for", { ascending: true }),
    client
      .from("seasons")
      .select("*")
      .eq("program_id", program.id)
      .order("number", { ascending: true }),
    client
      .from("episodes")
      .select("*")
      .eq("program_id", program.id)
      .eq("status", "published")
      .order("episode_number", { ascending: true }),
  ]);

  const streams = (streamsRes.data ?? []).map((row) =>
    enrichStream(streamToDomain(row), [channel], [program]),
  );
  const episodes = (episodesRes.data ?? []).map((row) =>
    enrichEpisode(episodeToDomain(row)),
  );
  const latestEpisode = [...episodes]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))[0] ?? null;

  return {
    program: { ...program, channel },
    channel,
    hosts: (hostsRes.data ?? []).map(programHostToDomain),
    liveStream: streams.find((s) => s.status === "live") ?? null,
    upcomingStream:
      streams
        .filter((s) => s.status === "scheduled")
        .sort((a, b) =>
          (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""),
        )[0] ?? null,
    seasons: (seasonsRes.data ?? []).map(seasonToDomain),
    episodes,
    latestEpisode,
  };
}

export async function getEpisodeById(
  id: string,
  options?: ApiClientOptions,
): Promise<Episode | null> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    const episode = mockEpisodes.find((e) => e.id === id);
    return episode ? enrichEpisode(episode) : null;
  }

  const { data, error } = await client
    .from("episodes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (options?.useMock === false) return null;
    const episode = mockEpisodes.find((e) => e.id === id);
    return episode ? enrichEpisode(episode) : null;
  }
  return enrichEpisode(episodeToDomain(data));
}

export async function getProgramEpisodes(
  programId: string,
  options?: ApiClientOptions,
): Promise<Episode[]> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockEpisodes
      .filter((e) => e.programId === programId && e.status === "published")
      .sort(sortEpisodesByNumber)
      .map(enrichEpisode);
  }

  const { data, error } = await client
    .from("episodes")
    .select("*")
    .eq("program_id", programId)
    .eq("status", "published")
    .order("episode_number", { ascending: true });

  if (error || !data) {
    if (options?.useMock === false) return [];
    return mockEpisodes
      .filter((e) => e.programId === programId && e.status === "published")
      .map(enrichEpisode);
  }
  return data.map((row) => enrichEpisode(episodeToDomain(row)));
}

export async function getRelatedEpisodes(
  episodeId: string,
  options?: ApiClientOptions,
): Promise<Episode[]> {
  const episode = await getEpisodeById(episodeId, options);
  if (!episode) return [];

  const siblings = await getProgramEpisodes(episode.programId, options);
  return siblings.filter((e) => e.id !== episodeId).slice(0, 8);
}

export async function getNextEpisode(
  episodeId: string,
  options?: ApiClientOptions,
): Promise<Episode | null> {
  const episode = await getEpisodeById(episodeId, options);
  if (!episode) return null;
  const siblings = await getProgramEpisodes(episode.programId, options);
  const idx = siblings.findIndex((e) => e.id === episodeId);
  if (idx < 0 || idx >= siblings.length - 1) return null;
  return siblings[idx + 1] ?? null;
}

export async function getPreviousEpisode(
  episodeId: string,
  options?: ApiClientOptions,
): Promise<Episode | null> {
  const episode = await getEpisodeById(episodeId, options);
  if (!episode) return null;
  const siblings = await getProgramEpisodes(episode.programId, options);
  const idx = siblings.findIndex((e) => e.id === episodeId);
  if (idx <= 0) return null;
  return siblings[idx - 1] ?? null;
}

export async function getStreamById(
  id: string,
  options?: ApiClientOptions,
): Promise<Stream | null> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    const stream = mockStreams.find((s) => s.id === id);
    return stream ? enrichStream(stream) : null;
  }

  const { data, error } = await client
    .from("streams")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (options?.useMock === false) return null;
    const stream = mockStreams.find((s) => s.id === id);
    return stream ? enrichStream(stream) : null;
  }

  const stream = streamToDomain(data);
  let channel: Channel | undefined;
  let program: Program | null | undefined;

  const channelRes = await client
    .from("channels")
    .select("*")
    .eq("id", stream.channelId)
    .maybeSingle();
  if (channelRes.data) channel = channelToDomain(channelRes.data);

  if (stream.programId) {
    const programRes = await client
      .from("programs")
      .select("*")
      .eq("id", stream.programId)
      .maybeSingle();
    if (programRes.data) program = programToDomain(programRes.data);
  } else {
    program = null;
  }

  return {
    ...stream,
    channel: channel ?? mockChannels.find((c) => c.id === stream.channelId),
    program:
      program === undefined
        ? mockPrograms.find((p) => p.id === stream.programId) ?? null
        : program,
  };
}

export async function getChatMessages(
  streamId: string,
  options?: ApiClientOptions,
): Promise<ChatMessage[]> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockChat.filter((m) => m.streamId === streamId);
  }

  const { data, error } = await client
    .from("chat_messages")
    .select("*")
    .eq("stream_id", streamId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error || !data) {
    if (options?.useMock === false) return [];
    return mockChat.filter((m) => m.streamId === streamId);
  }
  return data.map(chatMessageToDomain);
}

export async function sendChatMessage(
  input: { streamId: string; userId: string; content: string },
  options?: ApiClientOptions,
): Promise<ChatMessage> {
  const client = resolveClient(options);
  const now = new Date().toISOString();

  if (shouldUseMock(options, client) || !client) {
    return {
      id: crypto.randomUUID(),
      streamId: input.streamId,
      userId: input.userId,
      content: input.content.trim(),
      streamOffsetSeconds: null,
      createdAt: now,
      deletedAt: null,
    };
  }

  const { data, error } = await client
    .from("chat_messages")
    .insert({
      stream_id: input.streamId,
      user_id: input.userId,
      content: input.content.trim(),
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to send chat message");
  }

  return chatMessageToDomain(data);
}

export async function followChannel(
  input: { userId: string; channelId: string },
  options?: ApiClientOptions,
): Promise<Follow> {
  const client = resolveClient(options);
  const now = new Date().toISOString();

  if (shouldUseMock(options, client) || !client) {
    return {
      id: crypto.randomUUID(),
      userId: input.userId,
      channelId: input.channelId,
      createdAt: now,
    };
  }

  const { data, error } = await client
    .from("follows")
    .insert({
      user_id: input.userId,
      channel_id: input.channelId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to follow channel");
  }

  return followToDomain(data);
}

export async function unfollowChannel(
  input: { userId: string; channelId: string },
  options?: ApiClientOptions,
): Promise<void> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) return;

  const { error } = await client
    .from("follows")
    .delete()
    .eq("user_id", input.userId)
    .eq("channel_id", input.channelId);

  if (error) throw new Error(error.message);
}

export async function followProgram(
  input: { userId: string; programId: string },
  options?: ApiClientOptions,
): Promise<ProgramFollow> {
  const client = resolveClient(options);
  const now = new Date().toISOString();

  if (shouldUseMock(options, client) || !client) {
    return {
      id: crypto.randomUUID(),
      userId: input.userId,
      programId: input.programId,
      createdAt: now,
    };
  }

  const { data, error } = await client
    .from("program_follows")
    .insert({
      user_id: input.userId,
      program_id: input.programId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to follow program");
  }

  return programFollowToDomain(data);
}

export async function unfollowProgram(
  input: { userId: string; programId: string },
  options?: ApiClientOptions,
): Promise<void> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) return;

  const { error } = await client
    .from("program_follows")
    .delete()
    .eq("user_id", input.userId)
    .eq("program_id", input.programId);

  if (error) throw new Error(error.message);
}

export async function getWatchProgress(
  userId: string,
  episodeId: string,
  options?: ApiClientOptions,
): Promise<WatchProgress | null> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockWatchProgress(userId, episodeId);
  }

  const { data, error } = await client
    .from("watch_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("episode_id", episodeId)
    .maybeSingle();

  if (error || !data) return null;
  return watchProgressToDomain(data);
}

export async function upsertWatchProgress(
  input: {
    userId: string;
    episodeId: string;
    progressSeconds: number;
    completed?: boolean;
  },
  options?: ApiClientOptions,
): Promise<WatchProgress> {
  const client = resolveClient(options);
  const now = new Date().toISOString();
  const completed = input.completed ?? false;

  if (shouldUseMock(options, client) || !client) {
    return {
      id: crypto.randomUUID(),
      userId: input.userId,
      episodeId: input.episodeId,
      progressSeconds: input.progressSeconds,
      completed,
      updatedAt: now,
    };
  }

  const { data, error } = await client
    .from("watch_progress")
    .upsert(
      {
        user_id: input.userId,
        episode_id: input.episodeId,
        progress_seconds: input.progressSeconds,
        completed,
        updated_at: now,
      },
      { onConflict: "user_id,episode_id" },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to upsert watch progress");
  }

  return watchProgressToDomain(data);
}

export async function getStudioSummary(
  channelId?: string,
  options?: ApiClientOptions,
): Promise<StudioSummary> {
  const client = resolveClient(options);
  if (shouldUseMock(options, client) || !client) {
    return mockStudioSummary(channelId);
  }

  let channelQuery = client.from("channels").select("*").limit(1);
  if (channelId) channelQuery = channelQuery.eq("id", channelId);

  const { data: channelRow } = await channelQuery.maybeSingle();
  if (!channelRow) {
    if (options?.useMock === false) {
      return {
        channel: null,
        nextStream: null,
        liveStream: null,
        programs: [],
        recentStreams: [],
        recentEpisodes: [],
        recordings: [],
        metrics: { followers: 0, liveViewers: 0, hoursStreamed: 0 },
      };
    }
    return mockStudioSummary(channelId);
  }

  const channel = channelToDomain(channelRow);

  const [
    nextRes,
    programsRes,
    recentRes,
    liveRes,
    followsRes,
    episodesRes,
    recordingsRes,
  ] = await Promise.all([
    client
      .from("streams")
      .select("*")
      .eq("channel_id", channel.id)
      .eq("status", "scheduled")
      .order("scheduled_for", { ascending: true })
      .limit(1)
      .maybeSingle(),
    client
      .from("programs")
      .select("*")
      .eq("channel_id", channel.id)
      .order("title", { ascending: true }),
    client
      .from("streams")
      .select("*")
      .eq("channel_id", channel.id)
      .eq("status", "ended")
      .order("ended_at", { ascending: false })
      .limit(10),
    client
      .from("streams")
      .select("*")
      .eq("channel_id", channel.id)
      .eq("status", "live"),
    client
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("channel_id", channel.id),
    client
      .from("episodes")
      .select("*, programs!inner(channel_id)")
      .eq("programs.channel_id", channel.id)
      .order("published_at", { ascending: false })
      .limit(10),
    client
      .from("recordings")
      .select("*, streams!inner(channel_id)")
      .eq("streams.channel_id", channel.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const liveStreams = (liveRes.data ?? []).map((row) =>
    enrichStream(streamToDomain(row)),
  );

  return {
    channel,
    nextStream: nextRes.data
      ? enrichStream(streamToDomain(nextRes.data))
      : null,
    liveStream: liveStreams[0] ?? null,
    programs: (programsRes.data ?? []).map(programToDomain),
    recentStreams: (recentRes.data ?? []).map((row) =>
      enrichStream(streamToDomain(row)),
    ),
    recentEpisodes: (episodesRes.data ?? []).map((row) =>
      enrichEpisode(episodeToDomain(row)),
    ),
    recordings: (recordingsRes.data ?? []).map(recordingToDomain),
    metrics: {
      followers: followsRes.count ?? 0,
      liveViewers: liveStreams.reduce((acc, s) => acc + s.viewerCount, 0),
      hoursStreamed: 0,
    },
  };
}

/**
 * @deprecated Prefer getEpisodeById. Returns Video via episodeToVideo adapter.
 */
export async function getVideoById(
  id: string,
  options?: ApiClientOptions,
): Promise<Video | null> {
  const episode = await getEpisodeById(id, options);
  if (!episode) return null;
  const channelId =
    episode.channel?.id ??
    mockPrograms.find((p) => p.id === episode.programId)?.channelId;
  if (!channelId) return null;
  return episodeToVideo(episode, channelId);
}

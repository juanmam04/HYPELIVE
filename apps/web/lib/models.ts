/**
 * Runtime-normalized models for the web app.
 * Bridges API / @hypelive/types for Channel → Program → Episode.
 */

export type AppChannel = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  followerCount: number;
  isVerified: boolean;
  programCount?: number;
  isLive?: boolean;
  liveProgramTitle?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AppProgram = {
  id: string;
  channelId: string;
  slug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  bannerUrl: string | null;
  scheduleDescription: string | null;
  isActive: boolean;
  isLive?: boolean;
  nextScheduledFor?: string | null;
  channel?: AppChannel;
};

export type AppStream = {
  id: string;
  channelId: string;
  programId: string | null;
  title: string;
  description: string | null;
  status: string;
  thumbnailUrl: string | null;
  playbackUrl?: string | null;
  viewerCount: number;
  startedAt: string | null;
  endedAt: string | null;
  scheduledAt: string | null;
  channel?: AppChannel;
  program?: AppProgram | null;
};

export type AppEpisode = {
  id: string;
  programId: string;
  seasonId: string | null;
  title: string;
  description: string | null;
  episodeNumber: number | null;
  seasonNumber: number | null;
  airedAt: string | null;
  durationSeconds: number;
  thumbnailUrl: string | null;
  playbackUrl?: string | null;
  status: string;
  publishedAt: string | null;
  program?: AppProgram;
  channel?: AppChannel;
};

/** @deprecated Prefer AppEpisode — adapter for legacy ContentCard VOD shape */
export type AppVideo = {
  id: string;
  channelId: string;
  streamId: string | null;
  programId: string | null;
  title: string;
  description: string | null;
  status: string;
  thumbnailUrl: string | null;
  playbackUrl?: string | null;
  durationSeconds: number;
  viewCount: number;
  publishedAt: string | null;
  channel?: AppChannel;
};

export type AppChatMessage = {
  id: string;
  streamId: string;
  profileId: string;
  content: string;
  createdAt: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string | null;
  status?: "sending" | "sent" | "failed";
};

export type AppRecording = {
  id: string;
  streamId: string;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  status: string;
  createdAt: string;
  readyAt: string | null;
  streamTitle?: string | null;
};

export type HomeViewModel = {
  featured: AppStream | null;
  liveNow: AppStream[];
  todaySchedule: AppStream[];
  recentStreams: AppStream[];
  featuredChannels: AppChannel[];
  popularPrograms: AppProgram[];
  /** @deprecated alias of popularPrograms */
  programs: AppProgram[];
  recentEpisodes: AppEpisode[];
  continueWatching: Array<AppEpisode & { progressSeconds?: number }>;
  /** @deprecated */
  featuredVideos: AppVideo[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function nullableStr(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function nullableNum(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function toChannel(raw: unknown): AppChannel {
  const r = asRecord(raw);
  return {
    id: str(r.id),
    name: str(r.name, "Canal"),
    slug: str(r.slug, "canal"),
    description: nullableStr(r.description),
    avatarUrl: nullableStr(r.avatarUrl ?? r.logoUrl),
    bannerUrl: nullableStr(r.bannerUrl),
    followerCount: num(r.followerCount),
    isVerified: Boolean(r.isVerified),
    programCount:
      typeof r.programCount === "number" ? r.programCount : undefined,
    isLive: typeof r.isLive === "boolean" ? r.isLive : undefined,
    liveProgramTitle:
      r.liveProgramTitle === null
        ? null
        : typeof r.liveProgramTitle === "string"
          ? r.liveProgramTitle
          : undefined,
    createdAt: nullableStr(r.createdAt) ?? undefined,
    updatedAt: nullableStr(r.updatedAt) ?? undefined,
  };
}

export function toProgram(
  raw: unknown,
  channels: AppChannel[] = [],
): AppProgram {
  const r = asRecord(raw);
  const channelId = str(r.channelId);
  const channel =
    r.channel != null
      ? toChannel(r.channel)
      : channels.find((c) => c.id === channelId);
  return {
    id: str(r.id),
    channelId,
    slug: str(r.slug, "programa"),
    title: str(r.title, "Programa"),
    description: nullableStr(r.description),
    coverUrl: nullableStr(r.coverUrl ?? r.artworkUrl),
    bannerUrl: nullableStr(r.bannerUrl),
    scheduleDescription: nullableStr(r.scheduleDescription),
    isActive: r.isActive !== false,
    isLive: typeof r.isLive === "boolean" ? r.isLive : undefined,
    nextScheduledFor: nullableStr(r.nextScheduledFor),
    channel,
  };
}

export function toStream(raw: unknown, channels: AppChannel[] = []): AppStream {
  const r = asRecord(raw);
  const channelId = str(r.channelId);
  const channel =
    r.channel != null
      ? toChannel(r.channel)
      : channels.find((c) => c.id === channelId);
  const program =
    r.program === null
      ? null
      : r.program != null
        ? toProgram(r.program, channel ? [channel, ...channels] : channels)
        : undefined;
  return {
    id: str(r.id),
    channelId,
    programId: nullableStr(r.programId),
    title: str(r.title, "Transmisión"),
    description: nullableStr(r.description),
    status: str(r.status, "ended"),
    thumbnailUrl: nullableStr(r.thumbnailUrl),
    playbackUrl: nullableStr(r.playbackUrl),
    viewerCount: num(r.viewerCount),
    startedAt: nullableStr(r.startedAt),
    endedAt: nullableStr(r.endedAt),
    scheduledAt: nullableStr(r.scheduledAt ?? r.scheduledFor),
    channel,
    program,
  };
}

export function toEpisode(
  raw: unknown,
  channels: AppChannel[] = [],
): AppEpisode {
  const r = asRecord(raw);
  const program =
    r.program != null ? toProgram(r.program, channels) : undefined;
  const channel =
    r.channel != null
      ? toChannel(r.channel)
      : program?.channel ??
        (program
          ? channels.find((c) => c.id === program.channelId)
          : undefined);
  const season = asRecord(r.season);
  return {
    id: str(r.id),
    programId: str(r.programId, program?.id ?? ""),
    seasonId: nullableStr(r.seasonId),
    title: str(r.title, "Episodio"),
    description: nullableStr(r.description),
    episodeNumber: nullableNum(r.episodeNumber),
    seasonNumber: nullableNum(season.number ?? r.seasonNumber),
    airedAt: nullableStr(r.airedAt),
    durationSeconds: num(r.durationSeconds),
    thumbnailUrl: nullableStr(r.thumbnailUrl),
    playbackUrl: nullableStr(r.playbackUrl ?? r.playbackId),
    status: str(r.status, "published"),
    publishedAt: nullableStr(r.publishedAt),
    program: program
      ? { ...program, channel: program.channel ?? channel }
      : undefined,
    channel,
  };
}

/** Adapter: Episode → legacy Video shape for ContentCard */
export function toVideo(raw: unknown, channels: AppChannel[] = []): AppVideo {
  const r = asRecord(raw);
  if (r.programId != null || r.episodeNumber != null || r.airedAt != null) {
    const episode = toEpisode(raw, channels);
    const channelId =
      episode.channel?.id ??
      episode.program?.channelId ??
      str(r.channelId);
    return {
      id: episode.id,
      channelId,
      streamId: nullableStr(r.sourceStreamId ?? r.streamId),
      programId: episode.programId,
      title: episode.title,
      description: episode.description,
      status:
        episode.status === "published"
          ? "ready"
          : episode.status === "unavailable"
            ? "archived"
            : episode.status,
      thumbnailUrl: episode.thumbnailUrl,
      playbackUrl: episode.playbackUrl,
      durationSeconds: episode.durationSeconds,
      viewCount: num(r.viewCount),
      publishedAt: episode.publishedAt,
      channel: episode.channel,
    };
  }

  const channelId = str(r.channelId);
  const channel =
    r.channel != null
      ? toChannel(r.channel)
      : channels.find((c) => c.id === channelId);
  return {
    id: str(r.id),
    channelId,
    streamId: nullableStr(r.streamId),
    programId: nullableStr(r.programId),
    title: str(r.title, "Video"),
    description: nullableStr(r.description),
    status: str(r.status, "ready"),
    thumbnailUrl: nullableStr(r.thumbnailUrl),
    playbackUrl: nullableStr(r.playbackUrl),
    durationSeconds: num(r.durationSeconds),
    viewCount: num(r.viewCount),
    publishedAt: nullableStr(r.publishedAt),
    channel,
  };
}

export function toChatMessage(raw: unknown): AppChatMessage {
  const r = asRecord(raw);
  return {
    id: str(r.id),
    streamId: str(r.streamId),
    profileId: str(r.profileId ?? r.userId),
    content: str(r.content),
    createdAt: str(r.createdAt, new Date().toISOString()),
    displayName: typeof r.displayName === "string" ? r.displayName : undefined,
    username: typeof r.username === "string" ? r.username : undefined,
    avatarUrl: nullableStr(r.avatarUrl),
  };
}

export function toRecording(raw: unknown): AppRecording {
  const r = asRecord(raw);
  const stream = asRecord(r.stream);
  return {
    id: str(r.id),
    streamId: str(r.streamId),
    durationSeconds: nullableNum(r.durationSeconds),
    thumbnailUrl: nullableStr(r.thumbnailUrl),
    status: str(r.status, "processing"),
    createdAt: str(r.createdAt, new Date().toISOString()),
    readyAt: nullableStr(r.readyAt),
    streamTitle: nullableStr(stream.title),
  };
}

export function normalizeHomeFeed(raw: unknown): HomeViewModel {
  const data = asRecord(raw);
  const channelList = (
    (data.featuredChannels as unknown[]) ??
    (data.channels as unknown[]) ??
    []
  ).map(toChannel);

  const liveNow = (
    (data.liveNow as unknown[]) ??
    (data.liveStreams as unknown[]) ??
    []
  )
    .map((s) => toStream(s, channelList))
    .filter((s) => s.status === "live");

  const todaySchedule = ((data.todaySchedule as unknown[]) ?? [])
    .map((s) => toStream(s, channelList))
    .filter(
      (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i,
    );

  const recentStreams = ((data.recentStreams as unknown[]) ?? [])
    .map((s) => toStream(s, channelList))
    .filter((s) => s.status === "ended" || s.status === "processing");

  const popularPrograms = (
    (data.popularPrograms as unknown[]) ??
    (data.programs as unknown[]) ??
    []
  )
    .map((p) => toProgram(p, channelList))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

  const recentEpisodes = ((data.recentEpisodes as unknown[]) ?? []).map((e) =>
    toEpisode(e, channelList),
  );

  const featuredVideos = (
    (data.featuredVideos as unknown[]) ??
    recentEpisodes
  ).map((v) => toVideo(v, channelList));

  const continueWatching = ((data.continueWatching as unknown[]) ?? []).map(
    (item) => {
      const episode = toEpisode(item, channelList);
      const r = asRecord(item);
      const progressRaw = r.progress;
      const progressSeconds =
        typeof r.progressSeconds === "number"
          ? r.progressSeconds
          : typeof progressRaw === "object" && progressRaw !== null
            ? num(asRecord(progressRaw).progressSeconds)
            : undefined;
      return {
        ...episode,
        progressSeconds:
          typeof progressSeconds === "number"
            ? progressSeconds
            : episode.durationSeconds > 0
              ? Math.floor(episode.durationSeconds * 0.18)
              : 0,
      };
    },
  );

  const featuredRaw = data.featured ?? liveNow[0] ?? null;

  return {
    featured: featuredRaw ? toStream(featuredRaw, channelList) : liveNow[0] ?? null,
    liveNow,
    todaySchedule,
    recentStreams,
    featuredChannels: channelList,
    popularPrograms,
    programs: popularPrograms,
    recentEpisodes,
    continueWatching,
    featuredVideos,
  };
}

export function normalizeStudioSummary(raw: unknown) {
  const data = asRecord(raw);
  const channel = data.channel ? toChannel(data.channel) : null;
  const channels = channel ? [channel] : [];
  const metrics = asRecord(data.metrics);

  return {
    channel,
    nextStream: data.nextStream
      ? toStream(data.nextStream, channels)
      : null,
    liveStream: data.liveStream
      ? toStream(data.liveStream, channels)
      : null,
    programs: Array.isArray(data.programs)
      ? data.programs.map((p) => toProgram(p, channels))
      : [],
    recentStreams: Array.isArray(data.recentStreams)
      ? data.recentStreams.map((s) => toStream(s, channels))
      : [],
    recentEpisodes: Array.isArray(data.recentEpisodes)
      ? data.recentEpisodes.map((e) => toEpisode(e, channels))
      : Array.isArray(data.recentVideos)
        ? data.recentVideos.map((v) => toEpisode(v, channels))
        : [],
    recordings: Array.isArray(data.recordings)
      ? data.recordings.map(toRecording)
      : [],
    metrics: {
      followers: num(
        metrics.followers ?? data.followerCount,
        channel?.followerCount ?? 0,
      ),
      liveViewers: num(metrics.liveViewers),
      hoursStreamed: num(metrics.hoursStreamed),
      totalViews: num(metrics.totalViews ?? data.totalViews),
    },
  };
}

/** Deterministic dark-blue poster from an id string (no neon / coral). */
export function posterGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const shade = 12 + (Math.abs(hash) % 10);
  const shade2 = 8 + (Math.abs(hash >> 3) % 8);
  return `linear-gradient(145deg, #141a24 0%, hsl(215 28% ${shade}%) 45%, hsl(220 30% ${shade2}%) 100%)`;
}

export function formatScheduleTime(iso: string | null): string {
  if (!iso) return "Por confirmar";
  try {
    return new Intl.DateTimeFormat("es", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "Por confirmar";
  }
}

export function formatScheduleDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("es", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatEpisodeLabel(episode: AppEpisode): string {
  const parts: string[] = [];
  if (episode.seasonNumber != null) parts.push(`T${episode.seasonNumber}`);
  if (episode.episodeNumber != null) parts.push(`E${episode.episodeNumber}`);
  return parts.join(" · ");
}

export function programHref(program: AppProgram, channelSlug?: string): string {
  const slug = channelSlug ?? program.channel?.slug;
  if (!slug) return "/programas";
  return `/channel/${slug}/program/${program.slug}`;
}

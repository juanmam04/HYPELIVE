import type {
  Channel,
  ChannelMember,
  ChatMessage,
  DevicePairing,
  Episode,
  EpisodeStatus,
  Follow,
  Host,
  Profile,
  Program,
  ProgramFollow,
  ProgramHost,
  Recording,
  Season,
  Stream,
  Video,
  VideoStatus,
  WatchProgress,
} from "@hypelive/types";
import type {
  ChannelMemberRow,
  ChannelRow,
  ChatMessageRow,
  DevicePairingRow,
  EpisodeRow,
  FollowRow,
  HostRow,
  ProfileRow,
  ProgramFollowRow,
  ProgramHostRow,
  ProgramRow,
  RecordingRow,
  SeasonRow,
  StreamRow,
  VideoRow,
  WatchProgressRow,
} from "./rows";

export function profileToDomain(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function profileToDatabase(entity: Profile): ProfileRow {
  return {
    id: entity.id,
    username: entity.username,
    display_name: entity.displayName,
    avatar_url: entity.avatarUrl,
    role: entity.role,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function channelToDomain(row: ChannelRow): Channel {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    logoUrl: row.logo_url,
    bannerUrl: row.banner_url,
    isVerified: row.is_verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function channelToDatabase(entity: Channel): ChannelRow {
  return {
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    description: entity.description,
    logo_url: entity.logoUrl,
    banner_url: entity.bannerUrl,
    is_verified: entity.isVerified,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function channelMemberToDomain(row: ChannelMemberRow): ChannelMember {
  return {
    id: row.id,
    channelId: row.channel_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  };
}

export function channelMemberToDatabase(entity: ChannelMember): ChannelMemberRow {
  return {
    id: entity.id,
    channel_id: entity.channelId,
    user_id: entity.userId,
    role: entity.role,
    created_at: entity.createdAt,
  };
}

export function programToDomain(row: ProgramRow): Program {
  return {
    id: row.id,
    channelId: row.channel_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    artworkUrl: row.artwork_url,
    bannerUrl: row.banner_url,
    scheduleDescription: row.schedule_description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function programToDatabase(entity: Program): ProgramRow {
  return {
    id: entity.id,
    channel_id: entity.channelId,
    slug: entity.slug,
    title: entity.title,
    description: entity.description,
    artwork_url: entity.artworkUrl,
    banner_url: entity.bannerUrl,
    schedule_description: entity.scheduleDescription,
    is_active: entity.isActive,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function seasonToDomain(row: SeasonRow): Season {
  return {
    id: row.id,
    programId: row.program_id,
    number: row.number,
    title: row.title,
    year: row.year,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function seasonToDatabase(entity: Season): SeasonRow {
  return {
    id: entity.id,
    program_id: entity.programId,
    number: entity.number,
    title: entity.title,
    year: entity.year,
    starts_at: entity.startsAt,
    ends_at: entity.endsAt,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function hostToDomain(row: HostRow): Host {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function hostToDatabase(entity: Host): HostRow {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    bio: entity.bio,
    avatar_url: entity.avatarUrl,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function programHostToDomain(row: ProgramHostRow): ProgramHost {
  return {
    id: row.id,
    programId: row.program_id,
    hostId: row.host_id,
    role: row.role,
    displayOrder: row.display_order,
    createdAt: row.created_at,
  };
}

export function programHostToDatabase(entity: ProgramHost): ProgramHostRow {
  return {
    id: entity.id,
    program_id: entity.programId,
    host_id: entity.hostId,
    role: entity.role,
    display_order: entity.displayOrder,
    created_at: entity.createdAt,
  };
}

export function streamToDomain(row: StreamRow): Stream {
  return {
    id: row.id,
    channelId: row.channel_id,
    programId: row.program_id,
    title: row.title,
    description: row.description,
    status: row.status,
    scheduledFor: row.scheduled_for,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    viewerCount: row.viewer_count,
    thumbnailUrl: row.thumbnail_url,
    playbackId: row.playback_id,
    provider: row.provider,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function streamToDatabase(entity: Stream): StreamRow {
  return {
    id: entity.id,
    channel_id: entity.channelId,
    program_id: entity.programId,
    title: entity.title,
    description: entity.description,
    status: entity.status,
    scheduled_for: entity.scheduledFor,
    started_at: entity.startedAt,
    ended_at: entity.endedAt,
    viewer_count: entity.viewerCount,
    thumbnail_url: entity.thumbnailUrl,
    playback_id: entity.playbackId,
    provider: entity.provider,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function recordingToDomain(row: RecordingRow): Recording {
  return {
    id: row.id,
    streamId: row.stream_id,
    providerRecordingId: row.provider_recording_id,
    playbackId: row.playback_id,
    durationSeconds: row.duration_seconds,
    thumbnailUrl: row.thumbnail_url,
    status: row.status,
    createdAt: row.created_at,
    readyAt: row.ready_at,
    updatedAt: row.updated_at,
  };
}

export function recordingToDatabase(entity: Recording): RecordingRow {
  return {
    id: entity.id,
    stream_id: entity.streamId,
    provider_recording_id: entity.providerRecordingId,
    playback_id: entity.playbackId,
    duration_seconds: entity.durationSeconds,
    thumbnail_url: entity.thumbnailUrl,
    status: entity.status,
    created_at: entity.createdAt,
    ready_at: entity.readyAt,
    updated_at: entity.updatedAt,
  };
}

export function episodeToDomain(row: EpisodeRow): Episode {
  return {
    id: row.id,
    programId: row.program_id,
    seasonId: row.season_id,
    sourceStreamId: row.source_stream_id,
    sourceRecordingId: row.source_recording_id,
    title: row.title,
    description: row.description,
    episodeNumber: row.episode_number,
    airedAt: row.aired_at,
    durationSeconds: row.duration_seconds,
    thumbnailUrl: row.thumbnail_url,
    playbackId: row.playback_id,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function episodeToDatabase(entity: Episode): EpisodeRow {
  return {
    id: entity.id,
    program_id: entity.programId,
    season_id: entity.seasonId,
    source_stream_id: entity.sourceStreamId,
    source_recording_id: entity.sourceRecordingId,
    title: entity.title,
    description: entity.description,
    episode_number: entity.episodeNumber,
    aired_at: entity.airedAt,
    duration_seconds: entity.durationSeconds,
    thumbnail_url: entity.thumbnailUrl,
    playback_id: entity.playbackId,
    status: entity.status,
    published_at: entity.publishedAt,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

function episodeStatusToVideoStatus(status: EpisodeStatus): VideoStatus {
  switch (status) {
    case "published":
      return "ready";
    case "processing":
      return "processing";
    case "archived":
      return "archived";
    case "draft":
    case "unavailable":
    default:
      return "failed";
  }
}

function videoStatusToEpisodeStatus(status: VideoStatus): EpisodeStatus {
  switch (status) {
    case "ready":
      return "published";
    case "processing":
      return "processing";
    case "archived":
      return "archived";
    case "failed":
    default:
      return "unavailable";
  }
}

/**
 * Legacy adapter: Episode → Video for callers still expecting Video.
 * `channelId` is required because Episode does not store it on the row.
 */
export function episodeToVideo(
  episode: Episode,
  channelId: string,
): Video {
  return {
    id: episode.id,
    channelId,
    streamId: episode.sourceStreamId,
    programId: episode.programId,
    title: episode.title,
    description: episode.description,
    status: episodeStatusToVideoStatus(episode.status),
    durationSeconds: episode.durationSeconds,
    thumbnailUrl: episode.thumbnailUrl,
    playbackId: episode.playbackId,
    publishedAt: episode.publishedAt,
    createdAt: episode.createdAt,
    updatedAt: episode.updatedAt,
    channel: episode.channel,
  };
}

/** Legacy adapter: Video → Episode during migration. */
export function videoToEpisode(video: Video): Episode {
  return {
    id: video.id,
    programId: video.programId ?? "",
    seasonId: null,
    sourceStreamId: video.streamId,
    sourceRecordingId: null,
    title: video.title,
    description: video.description,
    episodeNumber: null,
    airedAt: video.publishedAt,
    durationSeconds: video.durationSeconds,
    thumbnailUrl: video.thumbnailUrl,
    playbackId: video.playbackId,
    status: videoStatusToEpisodeStatus(video.status),
    publishedAt: video.publishedAt,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
    channel: video.channel,
  };
}

/** @deprecated Prefer episodeToDomain */
export function videoToDomain(row: VideoRow): Video {
  return {
    id: row.id,
    channelId: row.channel_id,
    streamId: row.stream_id,
    programId: row.program_id,
    title: row.title,
    description: row.description,
    status: row.status,
    durationSeconds: row.duration_seconds,
    thumbnailUrl: row.thumbnail_url,
    playbackId: row.playback_id,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** @deprecated Prefer episodeToDatabase */
export function videoToDatabase(entity: Video): VideoRow {
  return {
    id: entity.id,
    channel_id: entity.channelId,
    stream_id: entity.streamId,
    program_id: entity.programId,
    title: entity.title,
    description: entity.description,
    status: entity.status,
    duration_seconds: entity.durationSeconds,
    thumbnail_url: entity.thumbnailUrl,
    playback_id: entity.playbackId,
    published_at: entity.publishedAt,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export function chatMessageToDomain(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    streamId: row.stream_id,
    userId: row.user_id,
    content: row.content,
    streamOffsetSeconds: row.stream_offset_seconds,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

export function chatMessageToDatabase(entity: ChatMessage): ChatMessageRow {
  return {
    id: entity.id,
    stream_id: entity.streamId,
    user_id: entity.userId,
    content: entity.content,
    stream_offset_seconds: entity.streamOffsetSeconds,
    created_at: entity.createdAt,
    deleted_at: entity.deletedAt,
  };
}

export function followToDomain(row: FollowRow): Follow {
  return {
    id: row.id,
    userId: row.user_id,
    channelId: row.channel_id,
    createdAt: row.created_at,
  };
}

export function followToDatabase(entity: Follow): FollowRow {
  return {
    id: entity.id,
    user_id: entity.userId,
    channel_id: entity.channelId,
    created_at: entity.createdAt,
  };
}

export function programFollowToDomain(row: ProgramFollowRow): ProgramFollow {
  return {
    id: row.id,
    userId: row.user_id,
    programId: row.program_id,
    createdAt: row.created_at,
  };
}

export function programFollowToDatabase(entity: ProgramFollow): ProgramFollowRow {
  return {
    id: entity.id,
    user_id: entity.userId,
    program_id: entity.programId,
    created_at: entity.createdAt,
  };
}

export function watchProgressToDomain(row: WatchProgressRow): WatchProgress {
  return {
    id: row.id,
    userId: row.user_id,
    episodeId: row.episode_id,
    progressSeconds: row.progress_seconds,
    completed: row.completed,
    updatedAt: row.updated_at,
    videoId: row.video_id ?? undefined,
  };
}

export function watchProgressToDatabase(entity: WatchProgress): WatchProgressRow {
  return {
    id: entity.id,
    user_id: entity.userId,
    episode_id: entity.episodeId,
    progress_seconds: entity.progressSeconds,
    completed: entity.completed,
    updated_at: entity.updatedAt,
    video_id: entity.videoId ?? null,
  };
}

export function devicePairingToDomain(row: DevicePairingRow): DevicePairing {
  return {
    id: row.id,
    pairingCode: row.pairing_code,
    tvDeviceId: row.tv_device_id,
    userId: row.user_id,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    pairedAt: row.paired_at,
  };
}

export function devicePairingToDatabase(entity: DevicePairing): DevicePairingRow {
  return {
    id: entity.id,
    pairing_code: entity.pairingCode,
    tv_device_id: entity.tvDeviceId,
    user_id: entity.userId,
    status: entity.status,
    expires_at: entity.expiresAt,
    created_at: entity.createdAt,
    paired_at: entity.pairedAt,
  };
}

export const mappers = {
  profile: { toDomain: profileToDomain, toDatabase: profileToDatabase },
  channel: { toDomain: channelToDomain, toDatabase: channelToDatabase },
  channelMember: {
    toDomain: channelMemberToDomain,
    toDatabase: channelMemberToDatabase,
  },
  program: { toDomain: programToDomain, toDatabase: programToDatabase },
  season: { toDomain: seasonToDomain, toDatabase: seasonToDatabase },
  host: { toDomain: hostToDomain, toDatabase: hostToDatabase },
  programHost: {
    toDomain: programHostToDomain,
    toDatabase: programHostToDatabase,
  },
  stream: { toDomain: streamToDomain, toDatabase: streamToDatabase },
  recording: { toDomain: recordingToDomain, toDatabase: recordingToDatabase },
  episode: { toDomain: episodeToDomain, toDatabase: episodeToDatabase },
  video: { toDomain: videoToDomain, toDatabase: videoToDatabase },
  chatMessage: {
    toDomain: chatMessageToDomain,
    toDatabase: chatMessageToDatabase,
  },
  follow: { toDomain: followToDomain, toDatabase: followToDatabase },
  programFollow: {
    toDomain: programFollowToDomain,
    toDatabase: programFollowToDatabase,
  },
  watchProgress: {
    toDomain: watchProgressToDomain,
    toDatabase: watchProgressToDatabase,
  },
  devicePairing: {
    toDomain: devicePairingToDomain,
    toDatabase: devicePairingToDatabase,
  },
} as const;

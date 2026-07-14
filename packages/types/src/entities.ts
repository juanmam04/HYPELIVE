/** Platform-wide role for a profile. */
export type UserRole =
  | "viewer"
  | "creator"
  | "producer"
  | "channel_admin"
  | "platform_admin";

export type StreamStatus =
  | "scheduled"
  | "starting"
  | "live"
  | "processing"
  | "ended"
  | "failed";

export type RecordingStatus = "processing" | "ready" | "failed" | "archived";

export type EpisodeStatus =
  | "draft"
  | "processing"
  | "published"
  | "unavailable"
  | "archived";

/** @deprecated Prefer EpisodeStatus — kept for legacy Video adapters */
export type VideoStatus = "processing" | "ready" | "failed" | "archived";

export type ChannelMemberRole =
  | "viewer"
  | "creator"
  | "producer"
  | "channel_admin";

export type DevicePairingStatus = "waiting" | "paired" | "expired" | "cancelled";

export type ISODateString = string;

export interface Profile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Channel {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isVerified: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  /** Denormalized for UI cards */
  programCount?: number;
  followerCount?: number;
  liveProgramTitle?: string | null;
  isLive?: boolean;
}

export interface ChannelMember {
  id: string;
  channelId: string;
  userId: string;
  role: ChannelMemberRole;
  createdAt: ISODateString;
}

export interface Program {
  id: string;
  channelId: string;
  slug: string;
  title: string;
  description: string | null;
  artworkUrl: string | null;
  bannerUrl: string | null;
  scheduleDescription: string | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  channel?: Channel;
  isLive?: boolean;
  nextScheduledFor?: ISODateString | null;
}

export interface Season {
  id: string;
  programId: string;
  number: number | null;
  title: string;
  year: number | null;
  startsAt: ISODateString | null;
  endsAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Host {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ProgramHost {
  id: string;
  programId: string;
  hostId: string;
  role: string | null;
  displayOrder: number;
  createdAt: ISODateString;
  host?: Host;
}

export interface Stream {
  id: string;
  channelId: string;
  /** null = special channel event */
  programId: string | null;
  title: string;
  description: string | null;
  status: StreamStatus;
  scheduledFor: ISODateString | null;
  startedAt: ISODateString | null;
  endedAt: ISODateString | null;
  viewerCount: number;
  thumbnailUrl: string | null;
  playbackId: string | null;
  provider: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  channel?: Channel;
  program?: Program | null;
}

export interface Recording {
  id: string;
  streamId: string;
  providerRecordingId: string | null;
  playbackId: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  status: RecordingStatus;
  createdAt: ISODateString;
  readyAt: ISODateString | null;
  updatedAt: ISODateString;
  stream?: Stream;
}

export interface Episode {
  id: string;
  programId: string;
  seasonId: string | null;
  sourceStreamId: string | null;
  sourceRecordingId: string | null;
  title: string;
  description: string | null;
  episodeNumber: number | null;
  airedAt: ISODateString | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  playbackId: string | null;
  status: EpisodeStatus;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  program?: Program;
  channel?: Channel;
  season?: Season | null;
}

/**
 * @deprecated Legacy VOD shape — prefer Episode.
 * Adapter maps Episode ↔ Video during migration.
 */
export interface Video {
  id: string;
  channelId: string;
  streamId: string | null;
  programId: string | null;
  title: string;
  description: string | null;
  status: VideoStatus;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  playbackId: string | null;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  channel?: Channel;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  content: string;
  streamOffsetSeconds: number | null;
  createdAt: ISODateString;
  deletedAt: ISODateString | null;
  displayName?: string;
  username?: string;
  avatarUrl?: string | null;
}

export interface Follow {
  id: string;
  userId: string;
  channelId: string;
  createdAt: ISODateString;
}

export interface ProgramFollow {
  id: string;
  userId: string;
  programId: string;
  createdAt: ISODateString;
}

export interface WatchProgress {
  id: string;
  userId: string;
  episodeId: string;
  progressSeconds: number;
  completed: boolean;
  updatedAt: ISODateString;
  /** @deprecated */
  videoId?: string;
}

export interface DevicePairing {
  id: string;
  pairingCode: string;
  tvDeviceId: string;
  userId: string | null;
  status: DevicePairingStatus;
  expiresAt: ISODateString;
  createdAt: ISODateString;
  pairedAt: ISODateString | null;
}

export interface HomeFeed {
  featured: Stream | null;
  liveNow: Stream[];
  todaySchedule: Stream[];
  recentStreams: Stream[];
  featuredChannels: Channel[];
  popularPrograms: Program[];
  recentEpisodes: Episode[];
  continueWatching: Array<Episode & { progress?: WatchProgress }>;
  /** @deprecated compat */
  programs?: Program[];
  featuredVideos?: Video[];
  continueWatchingVideos?: Array<Video & { progress?: WatchProgress }>;
}

export interface StudioSummary {
  channel: Channel | null;
  nextStream: Stream | null;
  liveStream: Stream | null;
  programs: Program[];
  recentStreams: Stream[];
  recentEpisodes: Episode[];
  recordings: Recording[];
  metrics: {
    followers: number;
    liveViewers: number;
    hoursStreamed: number;
    totalViews?: number;
  };
}

export interface ChannelDetail {
  channel: Channel;
  liveStream: Stream | null;
  nextStream: Stream | null;
  programs: Program[];
  schedule: Stream[];
  recentEpisodes: Episode[];
  specialEvents: Stream[];
}

export interface ProgramDetail {
  program: Program;
  channel: Channel;
  hosts: ProgramHost[];
  liveStream: Stream | null;
  upcomingStream: Stream | null;
  seasons: Season[];
  episodes: Episode[];
  latestEpisode: Episode | null;
}

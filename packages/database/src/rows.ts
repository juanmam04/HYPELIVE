import type {
  ChannelMemberRole,
  DevicePairingStatus,
  EpisodeStatus,
  RecordingStatus,
  StreamStatus,
  UserRole,
  VideoStatus,
} from "@hypelive/types";

/** Supabase row shapes (snake_case). Use `type` so rows satisfy Record<string, unknown>. */

export type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = {
  id: string;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<Omit<ProfileInsert, "id">>;

export type ChannelRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type ChannelInsert = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ChannelUpdate = Partial<ChannelInsert>;

export type ChannelMemberRow = {
  id: string;
  channel_id: string;
  user_id: string;
  role: ChannelMemberRole;
  created_at: string;
};

export type ChannelMemberInsert = {
  id?: string;
  channel_id: string;
  user_id: string;
  role: ChannelMemberRole;
  created_at?: string;
};

export type ChannelMemberUpdate = Partial<ChannelMemberInsert>;

export type ProgramRow = {
  id: string;
  channel_id: string;
  slug: string;
  title: string;
  description: string | null;
  artwork_url: string | null;
  banner_url: string | null;
  schedule_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProgramInsert = {
  id?: string;
  channel_id: string;
  slug: string;
  title: string;
  description?: string | null;
  artwork_url?: string | null;
  banner_url?: string | null;
  schedule_description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProgramUpdate = Partial<ProgramInsert>;

export type SeasonRow = {
  id: string;
  program_id: string;
  number: number | null;
  title: string;
  year: number | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SeasonInsert = {
  id?: string;
  program_id: string;
  number?: number | null;
  title: string;
  year?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SeasonUpdate = Partial<SeasonInsert>;

export type HostRow = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type HostInsert = {
  id?: string;
  name: string;
  slug: string;
  bio?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type HostUpdate = Partial<HostInsert>;

export type ProgramHostRow = {
  id: string;
  program_id: string;
  host_id: string;
  role: string | null;
  display_order: number;
  created_at: string;
};

export type ProgramHostInsert = {
  id?: string;
  program_id: string;
  host_id: string;
  role?: string | null;
  display_order?: number;
  created_at?: string;
};

export type ProgramHostUpdate = Partial<ProgramHostInsert>;

export type StreamRow = {
  id: string;
  channel_id: string;
  program_id: string | null;
  title: string;
  description: string | null;
  status: StreamStatus;
  scheduled_for: string | null;
  started_at: string | null;
  ended_at: string | null;
  viewer_count: number;
  thumbnail_url: string | null;
  playback_id: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
};

export type StreamInsert = {
  id?: string;
  channel_id: string;
  program_id?: string | null;
  title: string;
  description?: string | null;
  status?: StreamStatus;
  scheduled_for?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  viewer_count?: number;
  thumbnail_url?: string | null;
  playback_id?: string | null;
  provider?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type StreamUpdate = Partial<StreamInsert>;

export type RecordingRow = {
  id: string;
  stream_id: string;
  provider_recording_id: string | null;
  playback_id: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  status: RecordingStatus;
  created_at: string;
  ready_at: string | null;
  updated_at: string;
};

export type RecordingInsert = {
  id?: string;
  stream_id: string;
  provider_recording_id?: string | null;
  playback_id?: string | null;
  duration_seconds?: number | null;
  thumbnail_url?: string | null;
  status?: RecordingStatus;
  created_at?: string;
  ready_at?: string | null;
  updated_at?: string;
};

export type RecordingUpdate = Partial<RecordingInsert>;

export type EpisodeRow = {
  id: string;
  program_id: string;
  season_id: string | null;
  source_stream_id: string | null;
  source_recording_id: string | null;
  title: string;
  description: string | null;
  episode_number: number | null;
  aired_at: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  playback_id: string | null;
  status: EpisodeStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EpisodeInsert = {
  id?: string;
  program_id: string;
  season_id?: string | null;
  source_stream_id?: string | null;
  source_recording_id?: string | null;
  title: string;
  description?: string | null;
  episode_number?: number | null;
  aired_at?: string | null;
  duration_seconds?: number | null;
  thumbnail_url?: string | null;
  playback_id?: string | null;
  status?: EpisodeStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EpisodeUpdate = Partial<EpisodeInsert>;

/** @deprecated Prefer EpisodeRow — kept for legacy adapters */
export type VideoRow = {
  id: string;
  channel_id: string;
  stream_id: string | null;
  program_id: string | null;
  title: string;
  description: string | null;
  status: VideoStatus;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  playback_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoInsert = {
  id?: string;
  channel_id: string;
  stream_id?: string | null;
  program_id?: string | null;
  title: string;
  description?: string | null;
  status?: VideoStatus;
  duration_seconds?: number | null;
  thumbnail_url?: string | null;
  playback_id?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type VideoUpdate = Partial<VideoInsert>;

export type ChatMessageRow = {
  id: string;
  stream_id: string;
  user_id: string;
  content: string;
  stream_offset_seconds: number | null;
  created_at: string;
  deleted_at: string | null;
};

export type ChatMessageInsert = {
  id?: string;
  stream_id: string;
  user_id: string;
  content: string;
  stream_offset_seconds?: number | null;
  created_at?: string;
  deleted_at?: string | null;
};

export type ChatMessageUpdate = Partial<ChatMessageInsert>;

export type FollowRow = {
  id: string;
  user_id: string;
  channel_id: string;
  created_at: string;
};

export type FollowInsert = {
  id?: string;
  user_id: string;
  channel_id: string;
  created_at?: string;
};

export type FollowUpdate = Partial<FollowInsert>;

export type ProgramFollowRow = {
  id: string;
  user_id: string;
  program_id: string;
  created_at: string;
};

export type ProgramFollowInsert = {
  id?: string;
  user_id: string;
  program_id: string;
  created_at?: string;
};

export type ProgramFollowUpdate = Partial<ProgramFollowInsert>;

export type WatchProgressRow = {
  id: string;
  user_id: string;
  episode_id: string;
  progress_seconds: number;
  completed: boolean;
  updated_at: string;
  /** @deprecated Prefer episode_id */
  video_id?: string | null;
};

export type WatchProgressInsert = {
  id?: string;
  user_id: string;
  episode_id: string;
  progress_seconds?: number;
  completed?: boolean;
  updated_at?: string;
  /** @deprecated Prefer episode_id */
  video_id?: string | null;
};

export type WatchProgressUpdate = Partial<WatchProgressInsert>;

export type DevicePairingRow = {
  id: string;
  pairing_code: string;
  tv_device_id: string;
  user_id: string | null;
  status: DevicePairingStatus;
  expires_at: string;
  created_at: string;
  paired_at: string | null;
};

export type DevicePairingInsert = {
  id?: string;
  pairing_code: string;
  tv_device_id: string;
  user_id?: string | null;
  status?: DevicePairingStatus;
  expires_at: string;
  created_at?: string;
  paired_at?: string | null;
};

export type DevicePairingUpdate = Partial<DevicePairingInsert>;

type TableDef<
  Row extends Record<string, unknown>,
  Insert extends Record<string, unknown>,
  Update extends Record<string, unknown>,
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, ProfileInsert, ProfileUpdate>;
      channels: TableDef<ChannelRow, ChannelInsert, ChannelUpdate>;
      channel_members: TableDef<
        ChannelMemberRow,
        ChannelMemberInsert,
        ChannelMemberUpdate
      >;
      programs: TableDef<ProgramRow, ProgramInsert, ProgramUpdate>;
      seasons: TableDef<SeasonRow, SeasonInsert, SeasonUpdate>;
      hosts: TableDef<HostRow, HostInsert, HostUpdate>;
      program_hosts: TableDef<
        ProgramHostRow,
        ProgramHostInsert,
        ProgramHostUpdate
      >;
      streams: TableDef<StreamRow, StreamInsert, StreamUpdate>;
      recordings: TableDef<RecordingRow, RecordingInsert, RecordingUpdate>;
      episodes: TableDef<EpisodeRow, EpisodeInsert, EpisodeUpdate>;
      videos: TableDef<VideoRow, VideoInsert, VideoUpdate>;
      chat_messages: TableDef<
        ChatMessageRow,
        ChatMessageInsert,
        ChatMessageUpdate
      >;
      follows: TableDef<FollowRow, FollowInsert, FollowUpdate>;
      program_follows: TableDef<
        ProgramFollowRow,
        ProgramFollowInsert,
        ProgramFollowUpdate
      >;
      watch_progress: TableDef<
        WatchProgressRow,
        WatchProgressInsert,
        WatchProgressUpdate
      >;
      device_pairings: TableDef<
        DevicePairingRow,
        DevicePairingInsert,
        DevicePairingUpdate
      >;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

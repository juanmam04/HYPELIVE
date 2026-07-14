export const queryKeys = {
  all: ["hypelive"] as const,
  home: () => [...queryKeys.all, "home"] as const,
  featuredStream: () => [...queryKeys.all, "featured-stream"] as const,
  liveStreams: () => [...queryKeys.all, "live"] as const,
  upcomingStreams: () => [...queryKeys.all, "upcoming"] as const,
  featuredChannels: () => [...queryKeys.all, "featured-channels"] as const,
  stream: (id: string) => [...queryKeys.all, "stream", id] as const,
  channel: (slug: string) => [...queryKeys.all, "channel", slug] as const,
  channelDetail: (slug: string) =>
    [...queryKeys.all, "channel-detail", slug] as const,
  program: (channelSlug: string, programSlug: string) =>
    [...queryKeys.all, "program", channelSlug, programSlug] as const,
  programDetail: (channelSlug: string, programSlug: string) =>
    [...queryKeys.all, "program-detail", channelSlug, programSlug] as const,
  programEpisodes: (programId: string) =>
    [...queryKeys.all, "program-episodes", programId] as const,
  episode: (id: string) => [...queryKeys.all, "episode", id] as const,
  relatedEpisodes: (id: string) =>
    [...queryKeys.all, "related-episodes", id] as const,
  /** @deprecated Prefer episode */
  video: (id: string) => [...queryKeys.all, "video", id] as const,
  chat: (streamId: string) => [...queryKeys.all, "chat", streamId] as const,
  watchProgress: (userId: string, episodeId: string) =>
    [...queryKeys.all, "watch-progress", userId, episodeId] as const,
  studio: (channelId?: string) =>
    [...queryKeys.all, "studio", channelId ?? "default"] as const,
} as const;

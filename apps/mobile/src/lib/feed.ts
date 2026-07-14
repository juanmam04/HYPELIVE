/**
 * Runtime shape helpers — API mock / queries may differ slightly from
 * published @hypelive/types until packages converge.
 */

export type FeedStream = {
  id: string;
  channelId: string;
  programId?: string | null;
  title: string;
  description?: string | null;
  status: string;
  thumbnailUrl?: string | null;
  viewerCount?: number;
  startedAt?: string | null;
  scheduledAt?: string | null;
  scheduledFor?: string | null;
  channel?: FeedChannel | null;
  program?: FeedProgram | null;
};

export type FeedEpisode = {
  id: string;
  programId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  episodeNumber?: number | null;
  program?: FeedProgram | null;
  channel?: FeedChannel | null;
};

export type FeedProgram = {
  id: string;
  channelId: string;
  slug: string;
  title: string;
  description?: string | null;
  artworkUrl?: string | null;
  isActive?: boolean;
  isLive?: boolean;
  channel?: FeedChannel | null;
};

export type FeedChannel = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  followerCount?: number;
  isVerified?: boolean;
};

export type HomeFeedView = {
  liveStreams?: FeedStream[];
  liveNow?: FeedStream[];
  featured?: FeedStream | null;
  featuredVideos?: FeedEpisode[];
  channels?: FeedChannel[];
  featuredChannels?: FeedChannel[];
  todaySchedule?: FeedStream[];
  popularPrograms?: FeedProgram[];
  programs?: FeedProgram[];
  recentEpisodes?: FeedEpisode[];
  continueWatching?: FeedEpisode[];
};

export function getLiveStreams(feed: HomeFeedView | null | undefined): FeedStream[] {
  if (!feed) return [];
  return feed.liveStreams ?? feed.liveNow ?? (feed.featured ? [feed.featured] : []);
}

export function getChannels(feed: HomeFeedView | null | undefined): FeedChannel[] {
  if (!feed) return [];
  return feed.channels ?? feed.featuredChannels ?? [];
}

export function getPrograms(feed: HomeFeedView | null | undefined): FeedProgram[] {
  if (!feed) return [];
  return feed.popularPrograms ?? feed.programs ?? [];
}

export function getRecentEpisodes(
  feed: HomeFeedView | null | undefined,
): FeedEpisode[] {
  if (!feed) return [];
  return feed.recentEpisodes ?? feed.featuredVideos ?? [];
}

export function getContinueWatching(
  feed: HomeFeedView | null | undefined,
): FeedEpisode[] {
  if (!feed) return [];
  return feed.continueWatching ?? [];
}

/** @deprecated Prefer getRecentEpisodes */
export function getVideos(feed: HomeFeedView | null | undefined): FeedEpisode[] {
  return getRecentEpisodes(feed);
}

export function getSchedule(feed: HomeFeedView | null | undefined): FeedStream[] {
  if (!feed) return [];
  return feed.todaySchedule ?? [];
}

export function resolveChannelSlug(
  program: FeedProgram,
  channels: FeedChannel[],
): string | undefined {
  return (
    program.channel?.slug ??
    channels.find((c) => c.id === program.channelId)?.slug
  );
}

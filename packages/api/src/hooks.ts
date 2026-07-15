/**
 * Thin TanStack Query wrappers — apps can also call query functions directly.
 * Kept framework-light so RN / Next can share the same keys + fetchers.
 */

import { queryKeys } from "./query-keys";
import {
  getChannelBySlug,
  getChannelDetail,
  getChatMessages,
  getEpisodeById,
  getFeaturedChannels,
  getFeaturedStream,
  getHomeFeed,
  getLiveStreams,
  getProgramBySlug,
  getProgramDetail,
  getProgramEpisodes,
  getRelatedEpisodes,
  getStreamById,
  getStudioSummary,
  getUpcomingStreams,
  getVideoById,
  getWatchProgress,
  type ApiClientOptions,
} from "./queries";
import { searchCatalog } from "./search";

export function homeFeedQueryOptions(options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.home(),
    queryFn: () => getHomeFeed(options),
  };
}

export function featuredStreamQueryOptions(options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.featuredStream(),
    queryFn: () => getFeaturedStream(options),
  };
}

export function liveStreamsQueryOptions(options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.liveStreams(),
    queryFn: () => getLiveStreams(options),
  };
}

export function upcomingStreamsQueryOptions(options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.upcomingStreams(),
    queryFn: () => getUpcomingStreams(options),
  };
}

export function featuredChannelsQueryOptions(options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.featuredChannels(),
    queryFn: () => getFeaturedChannels(options),
  };
}

export function streamQueryOptions(id: string, options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.stream(id),
    queryFn: () => getStreamById(id, options),
  };
}

export function channelQueryOptions(slug: string, options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.channel(slug),
    queryFn: () => getChannelBySlug(slug, options),
  };
}

export function channelDetailQueryOptions(
  slug: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.channelDetail(slug),
    queryFn: () => getChannelDetail(slug, options),
  };
}

export function programQueryOptions(
  channelSlug: string,
  programSlug: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.program(channelSlug, programSlug),
    queryFn: () => getProgramBySlug(channelSlug, programSlug, options),
  };
}

export function programDetailQueryOptions(
  channelSlug: string,
  programSlug: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.programDetail(channelSlug, programSlug),
    queryFn: () => getProgramDetail(channelSlug, programSlug, options),
  };
}

export function programEpisodesQueryOptions(
  programId: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.programEpisodes(programId),
    queryFn: () => getProgramEpisodes(programId, options),
  };
}

export function episodeQueryOptions(id: string, options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.episode(id),
    queryFn: () => getEpisodeById(id, options),
  };
}

export function relatedEpisodesQueryOptions(
  id: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.relatedEpisodes(id),
    queryFn: () => getRelatedEpisodes(id, options),
  };
}

/** @deprecated Prefer episodeQueryOptions */
export function videoQueryOptions(id: string, options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.video(id),
    queryFn: () => getVideoById(id, options),
  };
}

export function chatQueryOptions(streamId: string, options?: ApiClientOptions) {
  return {
    queryKey: queryKeys.chat(streamId),
    queryFn: () => getChatMessages(streamId, options),
  };
}

export function watchProgressQueryOptions(
  userId: string,
  episodeId: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.watchProgress(userId, episodeId),
    queryFn: () => getWatchProgress(userId, episodeId, options),
  };
}

export function studioQueryOptions(
  channelId?: string,
  options?: ApiClientOptions,
) {
  return {
    queryKey: queryKeys.studio(channelId),
    queryFn: () => getStudioSummary(channelId, options),
  };
}

export function searchQueryOptions(query: string, options?: ApiClientOptions) {
  const q = query.trim();
  return {
    queryKey: queryKeys.search(q),
    queryFn: () => searchCatalog(q, options),
    enabled: q.length >= 2,
  };
}

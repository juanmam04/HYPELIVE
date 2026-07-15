import type {
  Channel,
  Episode,
  Program,
  Stream,
} from "@hypelive/types";
import type { ApiClientOptions } from "./queries";
import { getHomeFeed } from "./queries";

export type SearchHitKind = "channel" | "program" | "episode" | "stream";

export type SearchHit = {
  kind: SearchHitKind;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  thumbnailUrl?: string | null;
  live?: boolean;
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

function match(hay: string, needle: string) {
  return normalize(hay).includes(needle);
}

export async function searchCatalog(
  query: string,
  options?: ApiClientOptions,
): Promise<SearchHit[]> {
  const q = normalize(query);
  if (!q) return [];

  const feed = await getHomeFeed(options);
  const hits: SearchHit[] = [];

  const pushChannel = (channel: Channel) => {
    if (
      match(channel.name, q) ||
      match(channel.slug, q) ||
      match(channel.description ?? "", q)
    ) {
      hits.push({
        kind: "channel",
        id: channel.id,
        title: channel.name,
        subtitle: channel.description ?? undefined,
        href: `/channel/${channel.slug}`,
        thumbnailUrl: channel.logoUrl ?? channel.bannerUrl,
      });
    }
  };

  const pushProgram = (program: Program) => {
    if (
      match(program.title, q) ||
      match(program.slug, q) ||
      match(program.description ?? "", q) ||
      match(program.channel?.name ?? "", q)
    ) {
      hits.push({
        kind: "program",
        id: program.id,
        title: program.title,
        subtitle: program.channel?.name,
        href: `/channel/${program.channel?.slug ?? "_"}/program/${program.slug}`,
        thumbnailUrl: program.artworkUrl ?? program.bannerUrl,
      });
    }
  };

  const pushEpisode = (episode: Episode) => {
    if (
      match(episode.title, q) ||
      match(episode.description ?? "", q) ||
      match(episode.program?.title ?? "", q) ||
      match(episode.channel?.name ?? "", q)
    ) {
      hits.push({
        kind: "episode",
        id: episode.id,
        title: episode.title,
        subtitle: episode.program?.title ?? episode.channel?.name,
        href: `/watch/${episode.id}`,
        thumbnailUrl: episode.thumbnailUrl,
      });
    }
  };

  const pushStream = (stream: Stream) => {
    if (
      match(stream.title, q) ||
      match(stream.description ?? "", q) ||
      match(stream.channel?.name ?? "", q) ||
      match(stream.program?.title ?? "", q)
    ) {
      hits.push({
        kind: "stream",
        id: stream.id,
        title: stream.title,
        subtitle: stream.channel?.name,
        href: `/live/${stream.id}`,
        thumbnailUrl: stream.thumbnailUrl,
        live: stream.status === "live",
      });
    }
  };

  for (const c of feed.featuredChannels) pushChannel(c);
  for (const p of feed.popularPrograms) pushProgram(p);
  for (const e of feed.recentEpisodes) pushEpisode(e);
  for (const e of feed.continueWatching) pushEpisode(e);
  for (const s of feed.liveNow) pushStream(s);
  for (const s of feed.todaySchedule) pushStream(s);

  const seen = new Set<string>();
  return hits.filter((h) => {
    const key = `${h.kind}:${h.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

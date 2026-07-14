import { Skeleton } from "@/components/ui/Skeleton";

export function HeroSkeleton() {
  return (
    <div className="relative h-[min(58vh,560px)] min-h-[360px] w-full overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" delayMs={80} />
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-8 lg:p-12">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-2/3 max-w-xl" />
        <Skeleton className="h-4 w-1/2 max-w-md" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
    </div>
  );
}

export function StreamRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[220px] shrink-0 space-y-2">
          <Skeleton className="aspect-video w-full rounded" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      ))}
    </div>
  );
}

export function ChannelRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded border border-border-subtle bg-slate p-3"
        >
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgramRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden sm:grid sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[200px] shrink-0 sm:w-auto">
          <Skeleton className="aspect-video w-full rounded" />
        </div>
      ))}
    </div>
  );
}

export function EpisodeRowSkeleton({ count = 5 }: { count?: number }) {
  return <ProgramRowSkeleton count={count} />;
}

export function ScheduleSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded border border-border-subtle bg-slate">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-border-subtle px-4 py-3 last:border-0"
        >
          <Skeleton className="h-8 w-20 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-xl border border-border bg-charcoal/80">
      <div className="border-b border-border-subtle px-4 py-3 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="flex-1 space-y-3 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border-subtle p-3">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded border border-border-subtle">
      <Skeleton className="absolute inset-0 rounded-none" delayMs={60} />
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
        <Skeleton className="h-1 w-full" />
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
    </div>
  );
}

export function ChannelHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full rounded-none sm:h-52" />
      <div className="flex items-center gap-4 px-4 sm:px-8">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function ProgramHeaderSkeleton() {
  return <ChannelHeaderSkeleton />;
}

export function StudioMetricSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded" />
      ))}
    </div>
  );
}

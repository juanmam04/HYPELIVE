"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "hype.watchlist.v1";

export type WatchlistItem = {
  id: string;
  kind: "episode" | "program" | "channel";
  title: string;
  href: string;
  thumbnailUrl?: string | null;
  subtitle?: string;
  savedAt: string;
};

type Store = {
  items: WatchlistItem[];
};

let memory: Store = { items: [] };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function readStorage(): Store {
  if (typeof window === "undefined") return memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as Store;
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

function writeStorage(next: Store) {
  memory = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Store {
  return memory;
}

function getServerSnapshot(): Store {
  return { items: [] };
}

export function useWatchlist() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    memory = readStorage();
    setHydrated(true);
    emit();
  }, []);

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const ids = useMemo(
    () => new Set(store.items.map((i) => `${i.kind}:${i.id}`)),
    [store.items],
  );

  const has = useCallback(
    (kind: WatchlistItem["kind"], id: string) => ids.has(`${kind}:${id}`),
    [ids],
  );

  const toggle = useCallback((item: Omit<WatchlistItem, "savedAt">) => {
    const key = `${item.kind}:${item.id}`;
    const current = readStorage();
    const exists = current.items.some((i) => `${i.kind}:${i.id}` === key);
    const next = exists
      ? {
          items: current.items.filter((i) => `${i.kind}:${i.id}` !== key),
        }
      : {
          items: [
            { ...item, savedAt: new Date().toISOString() },
            ...current.items,
          ],
        };
    writeStorage(next);
    return !exists;
  }, []);

  const remove = useCallback((kind: WatchlistItem["kind"], id: string) => {
    const current = readStorage();
    writeStorage({
      items: current.items.filter((i) => !(i.kind === kind && i.id === id)),
    });
  }, []);

  return {
    items: store.items,
    hydrated,
    has,
    toggle,
    remove,
  };
}

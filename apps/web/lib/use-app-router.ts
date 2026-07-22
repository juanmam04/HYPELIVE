"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useNavigation } from "@/providers/NavigationProvider";

/** router.push/replace with instant pending feedback. */
export function useAppRouter() {
  const router = useRouter();
  const { start } = useNavigation();

  const push = useCallback(
    (href: string) => {
      start();
      router.push(href);
    },
    [router, start],
  );

  const replace = useCallback(
    (href: string) => {
      start();
      router.replace(href);
    },
    [router, start],
  );

  return { push, replace, prefetch: router.prefetch.bind(router) };
}

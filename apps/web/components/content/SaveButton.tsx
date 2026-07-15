"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useWatchlist } from "@/lib/watchlist";
import { useToast } from "@/components/ui/Toast";

export function SaveButton({
  item,
}: {
  item: {
    id: string;
    kind: "episode" | "program" | "channel";
    title: string;
    href: string;
    thumbnailUrl?: string | null;
    subtitle?: string;
  };
}) {
  const { has, toggle } = useWatchlist();
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const saved = has(item.kind, item.id);

  return (
    <Button
      size="sm"
      variant={saved ? "secondary" : "outline"}
      onClick={() => {
        const nowSaved = toggle(item);
        toast(nowSaved ? "Guardado en Mi lista" : "Quitado de Mi lista", {
          tone: "success",
        });
      }}
    >
      <span className="relative inline-flex size-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={saved ? "on" : "off"}
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.14, ease: [0.2, 0, 0, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {saved ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-1.5">{saved ? "Guardado" : "Guardar"}</span>
    </Button>
  );
}

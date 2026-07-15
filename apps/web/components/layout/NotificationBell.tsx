"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

type Notice = {
  id: string;
  title: string;
  body: string;
  href?: string;
  at: string;
  read: boolean;
};

const DEMO_NOTICES: Notice[] = [
  {
    id: "1",
    title: "En vivo ahora",
    body: "Nocturna · La Noche es Nuestra empezó.",
    href: "/en-vivo",
    at: "hace 2 min",
    read: false,
  },
  {
    id: "2",
    title: "Nuevo episodio",
    body: "Casa Sonora publicó una repetición.",
    href: "/programas",
    at: "hace 1 h",
    read: false,
  },
  {
    id: "3",
    title: "Recordatorio",
    body: "Prisma · Mesa Abierta empieza en 30 min.",
    href: "/en-vivo",
    at: "hoy",
    read: true,
  },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(DEMO_NOTICES);
  const reduce = useReducedMotion();
  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);

  return (
    <div className="relative">
      <IconButton
        label="Notificaciones"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="relative"
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <motion.span
            className="absolute right-1 top-1 size-2 rounded-full bg-live"
            initial={false}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </IconButton>

      <AnimatePresence>
        {open ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[240]"
              aria-label="Cerrar notificaciones"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
              className="absolute right-0 top-11 z-[250] w-80 overflow-hidden rounded border border-border bg-charcoal shadow-deep"
            >
              <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
                <p className="text-sm font-semibold text-text-primary">
                  Notificaciones
                </p>
                <button
                  type="button"
                  className="text-xs font-medium text-accent-soft transition-colors duration-fast hover:text-accent-hover"
                  onClick={() =>
                    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
                  }
                >
                  Marcar leídas
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto" role="list">
                {items.map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={reduce ? false : { opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : i * 0.04, duration: 0.16 }}
                  >
                    <a
                      href={n.href ?? "#"}
                      className={cn(
                        "block border-b border-border-subtle px-3 py-2.5 transition-colors duration-fast hover:bg-elevated",
                        !n.read && "bg-accent-muted/30",
                      )}
                      onClick={() => {
                        setItems((prev) =>
                          prev.map((x) =>
                            x.id === n.id ? { ...x, read: true } : x,
                          ),
                        );
                        setOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium text-text-primary">
                        {n.title}
                      </p>
                      <p className="text-xs text-text-secondary">{n.body}</p>
                      <p className="mt-1 text-[11px] text-text-muted">{n.at}</p>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

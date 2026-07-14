"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Send, RotateCcw, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  chatQueryOptions,
  sendChatMessage,
} from "@hypelive/api";
import { logger } from "@hypelive/analytics";
import { MAX_CHAT_LENGTH, validateChatContent } from "@hypelive/domain";
import { createClient, hasSupabaseBrowser } from "@/lib/supabase/client";
import { toChatMessage, type AppChatMessage } from "@/lib/models";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";

const MOCK_NAMES = ["Nova", "Kai", "Mora", "Sol", "Iris", "Ren"];

export function LiveChat({
  streamId,
  enabled = true,
  className,
}: {
  streamId: string;
  enabled?: boolean;
  className?: string;
}) {
  const { user, profile, enterDemoSession } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<AppChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const configured = hasSupabaseBrowser();

  const query = useQuery({
    ...chatQueryOptions(streamId),
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      setMessages(query.data.map(toChatMessage));
    }
  }, [query.data]);

  // Local mock incoming messages when Supabase is not configured
  useEffect(() => {
    if (configured || !enabled) return;
    const timer = window.setInterval(() => {
      const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)]!;
      const incoming: AppChatMessage = {
        id: crypto.randomUUID(),
        streamId,
        profileId: crypto.randomUUID(),
        content: [
          "Qué buena señal",
          "Esto está brutal",
          "Saludos desde Madrid",
          "Más volumen a la mesa",
          "HYPE LIVE 🔥",
        ][Math.floor(Math.random() * 5)]!,
        createdAt: new Date().toISOString(),
        displayName: name,
        username: name.toLowerCase(),
      };
      setMessages((prev) => [...prev.slice(-80), incoming]);
      if (!stickToBottom.current) setShowNew(true);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [configured, enabled, streamId]);

  // Realtime subscription
  useEffect(() => {
    if (!configured || !enabled) return;
    const client = createClient();
    if (!client) return;

    const channel = client
      .channel(`chat:${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `stream_id=eq.${streamId}`,
        },
        (payload) => {
          const msg = toChatMessage({
            id: (payload.new as { id: string }).id,
            streamId,
            profileId: (payload.new as { profile_id?: string; user_id?: string })
              .profile_id ??
              (payload.new as { user_id?: string }).user_id ??
              "",
            content: (payload.new as { content: string }).content,
            createdAt: (payload.new as { created_at: string }).created_at,
          });
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          if (!stickToBottom.current) setShowNew(true);
        },
      )
      .subscribe((status) => {
        logger.debug("Chat channel status", status);
      });

    return () => {
      void client.removeChannel(channel);
    };
  }, [configured, enabled, streamId]);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    stickToBottom.current = true;
    setShowNew(false);
  }, []);

  useEffect(() => {
    if (stickToBottom.current) scrollToBottom();
  }, [messages, scrollToBottom]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottom.current = distance < 48;
    if (stickToBottom.current) setShowNew(false);
  };

  async function handleSend(e?: FormEvent, retry?: AppChatMessage) {
    e?.preventDefault();
    const content = retry?.content ?? draft;
    const validation = validateChatContent(content);
    if (!validation.ok) {
      toast(
        validation.reason === "too_long"
          ? `Máximo ${MAX_CHAT_LENGTH} caracteres`
          : "Mensaje inválido",
        { tone: "error" },
      );
      return;
    }

    const profileId = profile?.id ?? user?.id ?? "demo-profile";
    if (!user && !profile) {
      enterDemoSession();
    }

    const optimistic: AppChatMessage = retry
      ? { ...retry, status: "sending" }
      : {
          id: `tmp-${crypto.randomUUID()}`,
          streamId,
          profileId,
          content: validation.sanitized!,
          createdAt: new Date().toISOString(),
          displayName: profile?.displayName ?? "Tú",
          username: profile?.username ?? "tu",
          status: "sending",
        };

    setSending(true);
    if (!retry) {
      setDraft("");
      setMessages((prev) => [...prev, optimistic]);
    } else {
      setMessages((prev) =>
        prev.map((m) => (m.id === retry.id ? optimistic : m)),
      );
    }

    try {
      const saved = await sendChatMessage({
        streamId,
        userId: profileId,
        content: validation.sanitized!,
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimistic.id
            ? { ...toChatMessage(saved), status: "sent", displayName: optimistic.displayName }
            : m,
        ),
      );
      stickToBottom.current = true;
      scrollToBottom();
    } catch (error) {
      logger.error("Chat send failed", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimistic.id ? { ...m, status: "failed" } : m,
        ),
      );
      toast("No se pudo enviar", {
        description: "Toca reintentar",
        tone: "error",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-border bg-charcoal/80",
        className,
      )}
    >
      <div className="border-b border-border-subtle px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Chat en vivo</h2>
        <p className="text-xs text-text-muted">
          {configured ? "Tiempo real conectado" : "Simulación local (demo)"}
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          onScroll={onScroll}
          className="h-full space-y-3 overflow-y-auto px-3 py-3"
        >
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              Sé el primero en saludar.
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <Avatar
                  name={msg.displayName ?? msg.username ?? "?"}
                  src={msg.avatarUrl}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-xs font-semibold text-accent-soft">
                      {msg.displayName ?? msg.username ?? "Usuario"}
                    </span>
                    {msg.status === "failed" ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] text-danger"
                        onClick={() => void handleSend(undefined, msg)}
                      >
                        <RotateCcw className="size-3" />
                        Reintentar
                      </button>
                    ) : null}
                    {msg.status === "sending" ? (
                      <span className="text-[11px] text-text-muted">Enviando…</span>
                    ) : null}
                  </div>
                  <p className="break-words text-sm text-text-secondary">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {showNew ? (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-text-primary shadow-soft"
          >
            <ChevronDown className="size-3.5" />
            Nuevos mensajes
          </button>
        ) : null}
      </div>

      <form
        onSubmit={(e) => void handleSend(e)}
        className="flex items-end gap-2 border-t border-border-subtle p-3"
      >
        <label className="sr-only" htmlFor={`chat-${streamId}`}>
          Mensaje
        </label>
        <textarea
          id={`chat-${streamId}`}
          rows={1}
          maxLength={MAX_CHAT_LENGTH}
          value={draft}
          disabled={!enabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder={enabled ? "Escribe un mensaje…" : "Chat no disponible"}
          className="max-h-24 min-h-[40px] flex-1 resize-none rounded-md border border-border bg-slate px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none disabled:opacity-50"
        />
        <IconButton
          label="Enviar"
          variant="accent"
          disabled={!enabled || sending || !draft.trim()}
          loading={sending}
          onClick={() => void handleSend()}
        >
          <Send className="size-4" />
        </IconButton>
      </form>
      <div className="px-3 pb-2 text-right text-[10px] text-text-muted">
        {draft.length}/{MAX_CHAT_LENGTH}
      </div>
    </div>
  );
}

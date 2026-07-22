"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, Search, X, LogOut, Settings } from "lucide-react";
import { searchQueryOptions } from "@hypelive/api";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { SearchHitList } from "@/components/search/SearchHitList";
import { Button } from "@/components/ui/Button";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { PageTransition } from "@/components/layout/PageTransition";
import { apiOptions } from "@/lib/api-options";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useAppRouter } from "@/lib/use-app-router";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";

const NAV = [
  { href: "/home", label: "Inicio" },
  { href: "/en-vivo", label: "En vivo" },
  { href: "/programas", label: "Programas" },
  { href: "/canales", label: "Canales" },
  { href: "/mi-lista", label: "Mi lista" },
] as const;

export function StreamingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { push } = useAppRouter();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, profile, signOutUser } = useAuth();
  const debounced = useDebouncedValue(query, 180);

  const preview = useQuery({
    ...searchQueryOptions(debounced, apiOptions()),
    enabled: searchOpen && debounced.trim().length >= 2,
  });

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    closeSearch();
    if (!q) {
      push("/buscar");
      return;
    }
    push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    closeSearch();
    setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close overlays on navigate
  }, [pathname]);

  const initials = (profile?.displayName ?? user?.email ?? "U")
    .slice(0, 1)
    .toUpperCase();

  const previewHits = (preview.data ?? []).slice(0, 6);
  const showPreview = searchOpen && query.trim().length >= 2;

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[400] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-text-on-accent"
      >
        Saltar al contenido
      </a>
      <OfflineBanner />
      <header className="sticky top-0 z-[200] border-b border-white/[0.06] bg-gradient-to-b from-ink via-ink/90 to-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1920px] items-center gap-4 px-4 sm:h-16 sm:px-8 lg:px-12">
          <button
            type="button"
            className="btn-press rounded p-2 text-text-secondary hover:text-text-primary lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </button>

          <BrandLogo href="/home" size="md" />

          <nav
            className="ml-2 hidden items-center gap-1 lg:flex"
            aria-label="Principal"
          >
            {NAV.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/home" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "nav-link rounded px-3 py-2 text-sm font-medium transition-colors duration-fast",
                    active
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-primary",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="relative ml-auto flex items-center gap-1.5 sm:gap-2">
            <AnimatePresence initial={false}>
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  onSubmit={submitSearch}
                  className="relative flex items-center"
                  initial={reduce ? false : { opacity: 0, width: 40 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, width: 40 }}
                  transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                >
                  <div className="flex items-center gap-1.5 rounded-md border border-border bg-slate/90 pl-2.5 shadow-soft transition-[border-color,box-shadow] duration-fast focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(61,126,234,0.22)]">
                    <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar…"
                      aria-label="Buscar"
                      aria-expanded={showPreview}
                      aria-controls="header-search-preview"
                      className="h-9 w-40 bg-transparent pr-1 text-sm text-text-primary outline-none ring-0 placeholder:text-text-muted focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:w-56"
                    />
                    <button
                      type="button"
                      className="btn-press rounded p-2 text-text-muted outline-none hover:text-text-primary focus-visible:outline-none"
                      onClick={closeSearch}
                      aria-label="Cerrar búsqueda"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showPreview ? (
                      <motion.div
                        id="header-search-preview"
                        role="listbox"
                        initial={reduce ? false : { opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                        className="absolute right-0 top-[calc(100%+0.5rem)] z-[260] w-[min(100vw-2rem,22rem)] overflow-hidden rounded-md border border-border bg-charcoal/98 p-2 shadow-deep backdrop-blur-md"
                      >
                        {preview.isFetching && previewHits.length === 0 ? (
                          <p className="px-2 py-3 text-sm text-text-muted">
                            Buscando…
                          </p>
                        ) : previewHits.length === 0 ? (
                          <p className="px-2 py-3 text-sm text-text-muted">
                            Sin coincidencias
                          </p>
                        ) : (
                          <>
                            <SearchHitList
                              hits={previewHits}
                              dense
                              onSelect={closeSearch}
                            />
                            <Link
                              href={`/buscar?q=${encodeURIComponent(query.trim())}`}
                              onClick={closeSearch}
                              className="mt-1.5 block rounded px-2 py-2 text-center text-sm font-medium text-accent-soft transition-colors duration-fast hover:bg-elevated hover:text-accent-hover"
                            >
                              Ver todos los resultados
                            </Link>
                          </>
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.form>
              ) : (
                <motion.button
                  key="search-btn"
                  type="button"
                  className="btn-press rounded p-2 text-text-secondary hover:text-text-primary"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Buscar"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Search className="size-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <NotificationBell />

            {user ? (
              <>
                <Link
                  href="/studio"
                  className="hidden rounded border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors duration-fast hover:border-ash/40 hover:text-text-primary sm:inline"
                >
                  Studio
                </Link>
                <Link
                  href="/configuracion"
                  className="hidden size-8 items-center justify-center rounded-full bg-elevated text-xs font-bold text-text-primary ring-1 ring-border transition duration-fast hover:ring-accent sm:inline-flex"
                  aria-label="Configuración"
                  title={profile?.displayName ?? "Cuenta"}
                >
                  {initials}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void signOutUser()}
                >
                  <LogOut className="size-4" />
                  <span className="ml-1.5 hidden md:inline">Salir</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2 text-sm font-medium text-text-secondary transition-colors duration-fast hover:text-text-primary sm:px-3"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="btn-press inline-flex h-9 items-center rounded bg-accent px-3 text-sm font-semibold text-text-on-accent hover:bg-accent-hover"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[300] lg:hidden">
          <motion.button
            type="button"
            className="absolute inset-0 bg-ink/80"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-charcoal p-4 shadow-deep"
            initial={reduce ? false : { x: -24, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
          >
            <div className="mb-4 flex items-center justify-between">
              <BrandLogo href={undefined} size="sm" />
              <button
                type="button"
                className="btn-press p-2 text-text-muted"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="btn-press rounded px-3 py-3 text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/buscar"
                onClick={() => setMenuOpen(false)}
                className="btn-press rounded px-3 py-3 text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary"
              >
                Buscar
              </Link>
              {user ? (
                <Link
                  href="/studio"
                  onClick={() => setMenuOpen(false)}
                  className="btn-press rounded px-3 py-3 text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary"
                >
                  Studio
                </Link>
              ) : null}
              <Link
                href="/configuracion"
                onClick={() => setMenuOpen(false)}
                className="btn-press mt-2 flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary"
              >
                <Settings className="size-4" />
                Configuración
              </Link>
            </nav>
          </motion.aside>
        </div>
      ) : null}

      <main id="contenido" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="border-t border-border-subtle bg-ink">
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-text-muted sm:px-8 lg:px-12">
          <BrandLogo href="/home" size="sm" />
          <nav className="flex flex-wrap gap-4">
            <Link href="/home" className="hover:text-text-primary">
              Inicio
            </Link>
            <Link href="/en-vivo" className="hover:text-text-primary">
              En vivo
            </Link>
            <Link href="/buscar" className="hover:text-text-primary">
              Buscar
            </Link>
            <Link href="/configuracion" className="hover:text-text-primary">
              Configuración
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

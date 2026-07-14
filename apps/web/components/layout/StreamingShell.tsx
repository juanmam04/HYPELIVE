"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X, LogOut, Settings } from "lucide-react";
import { BRAND_NAME } from "@hypelive/domain";
import { Button } from "@/components/ui/Button";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { PageTransition } from "@/components/layout/PageTransition";
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, signOutUser } = useAuth();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/en-vivo?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <NavigationProgress />
      <OfflineBanner />
      <header className="sticky top-0 z-[200] border-b border-white/5 bg-ink/95">
        <div className="mx-auto flex h-14 max-w-[1920px] items-center gap-4 px-4 sm:h-16 sm:px-8 lg:px-12">
          <button
            type="button"
            className="btn-press rounded p-2 text-text-secondary hover:text-text-primary lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </button>

          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-text-primary sm:text-xl"
          >
            {BRAND_NAME}
          </Link>

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

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar"
                  aria-label="Buscar"
                  className="h-9 w-36 rounded border border-border bg-slate px-3 text-sm text-text-primary outline-none transition-colors duration-fast focus:border-accent focus:ring-2 focus:ring-accent/30 sm:w-52"
                />
                <button
                  type="button"
                  className="btn-press p-2 text-text-muted hover:text-text-primary"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Cerrar búsqueda"
                >
                  <X className="size-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="btn-press rounded p-2 text-text-secondary hover:text-text-primary"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
              >
                <Search className="size-5" />
              </button>
            )}

            {user ? (
              <>
                <Link
                  href="/studio"
                  className="hidden rounded border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors duration-fast hover:border-ash/40 hover:text-text-primary sm:inline"
                >
                  Studio
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void signOutUser()}
                >
                  <LogOut className="size-4" />
                  <span className="ml-1.5 hidden sm:inline">Salir</span>
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
          <button
            type="button"
            className="absolute inset-0 bg-ink/80 transition-opacity duration-normal"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 translate-x-0 flex-col bg-charcoal p-4 shadow-deep transition-transform duration-normal ease-enter">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">{BRAND_NAME}</span>
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
          </aside>
        </div>
      ) : null}

      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="border-t border-border-subtle bg-ink">
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-text-muted sm:px-8 lg:px-12">
          <span className="font-medium text-text-secondary">{BRAND_NAME}</span>
          <nav className="flex flex-wrap gap-4">
            <Link href="/home" className="hover:text-text-primary">
              Inicio
            </Link>
            <Link href="/en-vivo" className="hover:text-text-primary">
              En vivo
            </Link>
            <Link href="/canales" className="hover:text-text-primary">
              Canales
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

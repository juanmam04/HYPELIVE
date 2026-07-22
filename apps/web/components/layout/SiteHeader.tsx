"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useAuth } from "@/providers/AuthProvider";

/** Compact header for auth pages only. */
export function SiteHeader() {
  const { user, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-[200] border-b border-white/[0.06] bg-gradient-to-b from-ink via-ink/90 to-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <BrandLogo href="/home" size="md" />
        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={() => void signOutUser()}
              className="px-3 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Salir
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded bg-accent px-3 text-sm font-semibold text-text-on-accent hover:bg-accent-hover"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

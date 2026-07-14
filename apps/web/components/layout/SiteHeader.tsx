"use client";

import Link from "next/link";
import { BRAND_NAME } from "@hypelive/domain";
import { useAuth } from "@/providers/AuthProvider";

/** Compact header for auth pages only. */
export function SiteHeader() {
  const { user, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-[200] border-b border-white/5 bg-ink/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/home" className="text-lg font-bold tracking-tight text-text-primary">
          {BRAND_NAME}
        </Link>
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

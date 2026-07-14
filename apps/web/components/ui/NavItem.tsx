"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function NavItem({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors duration-fast",
        active ? "text-text-primary" : "text-text-muted hover:text-text-secondary",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-3 -bottom-px h-px bg-accent" aria-hidden />
      ) : null}
    </Link>
  );
}

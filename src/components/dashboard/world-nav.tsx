"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Film,
  Grid3x3,
  Mic,
  Settings,
  Share2,
  Sparkles,
  BookHeart,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { MemoryWorld } from "@/types/memory";

function worldPath(slug: string, segment: string) {
  return `/worlds/${slug}${segment}`;
}

export function getWorldNavItems(slug: string) {
  return [
    { href: worldPath(slug, ""), label: "World", icon: Home, exact: true },
    { href: worldPath(slug, "/timeline"), label: "Timeline", icon: Sparkles },
    { href: worldPath(slug, "/gallery"), label: "Gallery", icon: Grid3x3 },
    { href: worldPath(slug, "/voice"), label: "Voice", icon: Mic },
    { href: worldPath(slug, "/vault"), label: "Vault", icon: BookHeart },
    { href: worldPath(slug, "/films"), label: "Films", icon: Film },
    { href: worldPath(slug, "/recap"), label: "Recap", icon: Archive },
    { href: worldPath(slug, "/sharing"), label: "Sharing", icon: Share2 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
}

interface WorldNavProps {
  world: MemoryWorld;
  variant?: "sidebar" | "mobile";
}

export function WorldNav({ world, variant = "sidebar" }: WorldNavProps) {
  const pathname = usePathname();
  const items = getWorldNavItems(world.slug);

  if (variant === "mobile") {
    const mobileItems = items.filter((i) =>
      ["Timeline", "Gallery", "Voice", "Vault", "Films"].includes(i.label),
    );
    return (
      <nav
        className="flex justify-around border-t border-verse-border/50 bg-verse-night/95 px-1 py-2 backdrop-blur-xl"
        aria-label="World navigation"
      >
        {mobileItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[9px] tracking-wider uppercase",
                active ? "text-verse-gold" : "text-verse-cream-faint",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.25} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="World navigation">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] tracking-wide transition-all duration-400",
              active
                ? "bg-verse-elevated/90 text-verse-cream"
                : "text-verse-cream-faint hover:bg-verse-surface/50 hover:text-verse-cream-muted",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-60" strokeWidth={1.25} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

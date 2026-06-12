import Link from "next/link";
import { MinimalShell } from "@/components/dashboard/minimal-shell";
import { VERSE_PLANS } from "@/lib/stripe/plans";
import { LinkAlbumPanel } from "@/components/memory/LinkAlbumPanel";
import { isGooglePhotosConfigured, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Settings — Verse",
  description: "Manage your world settings and connected services.",
};

export default async function SettingsPage() {
  // Resolve Google Photos connection state server-side
  let hasGoogleToken = false;
  let linkedAlbumId: string | null = null;
  let linkedAlbumName: string | null = null;
  let worldId: string | null = null;

  if (isGooglePhotosConfigured && isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Token check
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: tokenRow } = await (supabase as any)
          .from("google_photos_tokens")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle() as { data: { id: string } | null };
        hasGoogleToken = Boolean(tokenRow);

        // Get the first world the user owns (simplified — multi-world support later)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: world } = await (supabase as any)
          .from("worlds")
          .select("id, linked_album_id, linked_album_name")
          .eq("owner_id", user.id)
          .limit(1)
          .single() as {
            data: {
              id: string;
              linked_album_id: string | null;
              linked_album_name: string | null;
            } | null;
          };

        if (world) {
          worldId = world.id;
          linkedAlbumId = world.linked_album_id;
          linkedAlbumName = world.linked_album_name;
        }
      }
    }
  }

  return (
    <MinimalShell title="Settings">
      <div className="mx-auto max-w-2xl space-y-16">

        {/* ── Plan ──────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
            Plan
          </p>
          <p className="mt-4 font-display text-3xl text-verse-cream">
            {VERSE_PLANS.free.name}
          </p>
          <p className="mt-2 text-sm text-verse-cream-muted">
            {VERSE_PLANS.free.description}
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block text-[11px] tracking-[0.25em] text-verse-gold uppercase hover:text-verse-cream"
          >
            View plans →
          </Link>
        </section>

        {/* ── Google Photos Album Linking ────────────────────────────── */}
        {isGooglePhotosConfigured && worldId && (
          <section className="border-t border-verse-border/30 pt-16">
            <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
              Google Photos
            </p>
            <p className="mt-4 font-display text-2xl font-light text-verse-cream">
              Link an album
            </p>
            <p className="mt-3 text-sm leading-relaxed text-verse-cream-muted">
              Connect a single Google Photos album to your world. Every photo in
              that album will appear in your gallery — live, as you add to it in
              Google Photos. No bulk sync. You choose the album.
            </p>

            <div className="mt-8">
              <LinkAlbumPanel
                worldId={worldId}
                worldSlug="our-story"
                linkedAlbumId={linkedAlbumId}
                linkedAlbumName={linkedAlbumName}
                isConnected={hasGoogleToken}
              />
            </div>

            {!hasGoogleToken && (
              <p className="mt-4 text-[11px] leading-relaxed text-verse-cream-faint">
                You&apos;ll be asked to sign in with Google once. Your credentials
                stay on this server — never shared.
              </p>
            )}
          </section>
        )}

        {/* ── Account ───────────────────────────────────────────────── */}
        <section className="border-t border-verse-border/30 pt-16">
          <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Account
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex justify-between border-b border-verse-border/20 pb-4 text-verse-cream-muted">
              <span>Email</span>
              <span className="text-verse-cream-faint">you@verse.app</span>
            </li>
            <li className="flex justify-between border-b border-verse-border/20 pb-4 text-verse-cream-muted">
              <span>Export data</span>
              <button
                type="button"
                className="text-[11px] tracking-wider text-verse-gold uppercase"
              >
                Request
              </button>
            </li>
          </ul>
        </section>

        {/* ── Connected services ─────────────────────────────────────── */}
        <section className="border-t border-verse-border/30 pt-16">
          <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Connected
          </p>
          <p className="mt-4 text-sm leading-relaxed text-verse-cream-faint">
            Supabase · Cloudflare Images · OpenAI / Claude · ElevenLabs · Stripe
            · Remotion
            {isGooglePhotosConfigured ? " · Google Photos" : ""}
          </p>
        </section>

        <p>
          <Link
            href="/worlds/our-story"
            className="text-[11px] tracking-[0.25em] text-verse-cream-muted uppercase hover:text-verse-cream"
          >
            ← Back to world
          </Link>
        </p>
      </div>
    </MinimalShell>
  );
}

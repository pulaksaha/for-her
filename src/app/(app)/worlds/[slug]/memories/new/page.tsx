import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GooglePhotosPickerButton } from "@/components/memory/GooglePhotosPickerButton";
import { getWorldBySlug } from "@/lib/world/get-world-data";
import { isGooglePhotosConfigured, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

interface NewMemoryPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: "Add memory — Verse",
  description: "Capture or import a treasured moment into your world.",
};

export default async function NewMemoryPage({ params }: NewMemoryPageProps) {
  const { slug } = await params;
  const world = getWorldBySlug(slug);
  if (!world) notFound();

  // Check whether the current user already has a connected Google token
  let hasGoogleToken = false;
  if (isGooglePhotosConfigured && isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("google_photos_tokens")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle() as { data: { id: string } | null };
        hasGoogleToken = Boolean(data);
      }
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-xl">

        {/* ── Page header ─────────────────────────────────────────── */}
        <p className="text-[10px] tracking-[0.3em] text-verse-gold uppercase">
          New memory
        </p>
        <h1 className="mt-4 font-display text-4xl font-light text-verse-cream">
          Capture this moment
        </h1>
        <p className="mt-4 text-verse-cream-muted">
          Photos, video, voice, caption — one intentional entry at a time.
        </p>

        {/* ── Google Photos Picker ─────────────────────────────────── */}
        {isGooglePhotosConfigured && (
          <div className="mt-10 rounded-2xl border border-verse-border bg-verse-surface/30 p-6">
            <p className="mb-1 text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase">
              Import from your camera roll
            </p>
            <p className="mb-5 text-[13px] text-verse-cream-muted leading-relaxed">
              Hand-pick individual photos from Google Photos. Nothing syncs
              automatically — every import is a deliberate choice.
            </p>
            <GooglePhotosPickerButton
              worldSlug={slug}
              worldId={world.id}
              isConnected={hasGoogleToken}
            />
          </div>
        )}

        {/* ── Divider ─────────────────────────────────────────────── */}
        {isGooglePhotosConfigured && (
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 border-t border-verse-border" />
            <span className="text-[10px] tracking-[0.25em] text-verse-cream-faint uppercase">
              or add manually
            </span>
            <div className="flex-1 border-t border-verse-border" />
          </div>
        )}

        {/* ── Manual entry form ────────────────────────────────────── */}
        {!isGooglePhotosConfigured && <div className="mt-12" />}

        <form className="space-y-8">
          <div>
            <label
              htmlFor="title"
              className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              className="mt-2 w-full rounded-2xl border border-verse-border bg-verse-surface px-5 py-4 text-verse-cream focus:border-verse-gold-soft/40 focus:outline-none"
              placeholder="First light in Lisbon"
            />
          </div>
          <div>
            <label
              htmlFor="caption"
              className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase"
            >
              Caption
            </label>
            <textarea
              id="caption"
              name="caption"
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border border-verse-border bg-verse-surface px-5 py-4 text-verse-cream focus:border-verse-gold-soft/40 focus:outline-none"
              placeholder="What do you want to remember about this?"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase">
              Media
            </label>
            <div className="mt-2 flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-verse-border bg-verse-surface/40 p-8 text-center">
              <p className="text-sm text-verse-cream-muted">
                Drop photos or video — uploads via Cloudflare Images when configured
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" variant="gold">
              Save memory
            </Button>
            <Button variant="ghost" asChild>
              <Link href={`/worlds/${slug}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

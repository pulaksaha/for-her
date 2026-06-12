import { notFound } from "next/navigation";
import { GalleryView } from "./gallery-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = { title: "Gallery — Verse" };

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  // Try to resolve the real DB world ID (needed for album photos API)
  let worldId: string | undefined;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { data: world } = await supabase
        .from("worlds")
        .select("id")
        .eq("slug", slug)
        .single() as { data: { id: string } | null };
      worldId = world?.id;
    }
  }

  return (
    <GalleryView
      memories={data.memories}
      worldSlug={slug}
      worldId={worldId}
    />
  );
}

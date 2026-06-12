import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

/**
 * POST /api/google-photos/link-album
 *
 * Links a specific Google Photos album to a world.
 * Stores the album ID + display name on the world row.
 * Also accepts a raw share URL — extracts the album ID automatically.
 */

const LinkAlbumSchema = z.object({
  worldId: z.string().uuid(),
  albumId: z.string().min(1).optional(),
  albumUrl: z.string().url().optional(),
  albumTitle: z.string().optional(),
}).refine((d) => d.albumId || d.albumUrl, {
  message: "Either albumId or albumUrl is required",
});

/**
 * Extracts a Google Photos album ID from a share URL.
 * Supports:
 *   https://photos.google.com/album/AF1Qip...
 *   https://photos.google.com/share/AF1Qip...
 */
function extractAlbumId(url: string): string | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/(album|share)\/([^/?]+)/);
    return match?.[2] ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof LinkAlbumSchema>;
  try {
    body = LinkAlbumSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { worldId, albumId: rawAlbumId, albumUrl, albumTitle } = body;

  // Resolve album ID
  let albumId = rawAlbumId;
  if (!albumId && albumUrl) {
    albumId = extractAlbumId(albumUrl) ?? undefined;
    if (!albumId) {
      return NextResponse.json(
        { error: "Could not extract album ID from URL. Use a direct album link (not a short link)." },
        { status: 422 },
      );
    }
  }

  // Verify world membership
  const { data: membership } = await supabase
    .from("world_members")
    .select("role")
    .eq("world_id", worldId)
    .eq("user_id", user.id)
    .in("role", ["owner", "member"])
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If we don't have a title, fetch it from the Library API
  let resolvedTitle = albumTitle;
  if (!resolvedTitle) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: tokenRow } = await (supabase as any)
      .from("google_photos_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .single() as { data: { access_token: string } | null };

    if (tokenRow) {
      const albumRes = await fetch(
        `https://photoslibrary.googleapis.com/v1/albums/${albumId!}`,
        { headers: { Authorization: `Bearer ${tokenRow.access_token}` } },
      );
      if (albumRes.ok) {
        const album = (await albumRes.json()) as { title?: string };
        resolvedTitle = album.title;
      }
    }
  }

  // Persist to the world row — cast through any because the new columns
  // are added by migration 003 but not yet in the hand-authored DB types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateErr } = await (supabase as any)
    .from("worlds")
    .update({
      linked_album_id: albumId!,
      linked_album_name: resolvedTitle ?? "Linked album",
      album_last_synced: null,
    })
    .eq("id", worldId);

  if (updateErr) {
    console.error("[link-album] update failed:", updateErr);
    return NextResponse.json({ error: "Failed to link album" }, { status: 500 });
  }

  return NextResponse.json({
    albumId,
    albumTitle: resolvedTitle,
    message: "Album linked successfully",
  });
}

/**
 * DELETE /api/google-photos/link-album?worldId=<uuid>
 * Unlinks the album from a world.
 */
export async function DELETE(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const worldId = searchParams.get("worldId");
  if (!worldId) {
    return NextResponse.json({ error: "worldId required" }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from("world_members")
    .select("role")
    .eq("world_id", worldId)
    .eq("user_id", user.id)
    .in("role", ["owner", "member"])
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("worlds")
    .update({ linked_album_id: null, linked_album_name: null, album_last_synced: null })
    .eq("id", worldId);

  return NextResponse.json({ message: "Album unlinked" });
}

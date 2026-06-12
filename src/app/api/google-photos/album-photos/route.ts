import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/google-photos/album-photos?worldId=<uuid>
 *
 * Returns photos from the world's linked Google Photos album.
 * Fetches fresh from Google on every call (no server-side caching yet).
 * Each photo gets a temporary baseUrl valid for ~60 min.
 *
 * The gallery page calls this client-side to populate the live feed
 * alongside any locally stored memories.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const worldId = searchParams.get("worldId");
  const pageToken = searchParams.get("pageToken") ?? undefined;

  if (!worldId) {
    return NextResponse.json({ error: "worldId required" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify world membership and get linked album ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: world } = await (supabase as any)
    .from("worlds")
    .select("id, linked_album_id, linked_album_name")
    .eq("id", worldId)
    .single() as {
      data: {
        id: string;
        linked_album_id: string | null;
        linked_album_name: string | null;
      } | null;
    };

  if (!world) {
    return NextResponse.json({ error: "World not found" }, { status: 404 });
  }

  if (!world.linked_album_id) {
    return NextResponse.json({ photos: [], albumTitle: null, albumLinked: false });
  }

  // Get access token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenRow } = await (supabase as any)
    .from("google_photos_tokens")
    .select("access_token")
    .eq("user_id", user.id)
    .single() as { data: { access_token: string } | null };

  if (!tokenRow) {
    return NextResponse.json({ error: "not_connected" }, { status: 403 });
  }

  // Search media items in the linked album
  const body: Record<string, unknown> = {
    albumId: world.linked_album_id,
    pageSize: 50,
  };
  if (pageToken) body.pageToken = pageToken;

  const photosRes = await fetch(
    "https://photoslibrary.googleapis.com/v1/mediaItems:search",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenRow.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!photosRes.ok) {
    const text = await photosRes.text();
    console.error("[album-photos] Library API error:", photosRes.status, text);

    if (photosRes.status === 401 || photosRes.status === 403) {
      return NextResponse.json({ error: "token_expired" }, { status: 403 });
    }
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }

  const data = (await photosRes.json()) as {
    mediaItems?: AlbumPhoto[];
    nextPageToken?: string;
  };

  // Shape photos for the gallery — baseUrl is a temporary Google-signed URL
  // Append =w1200-h900 for display size (Google's image serving API)
  const photos: GalleryPhoto[] = (data.mediaItems ?? []).map((item) => ({
    id: item.id,
    url: `${item.baseUrl}=w1200-h900`,
    thumbnailUrl: `${item.baseUrl}=w400-h400-c`,  // square crop thumbnail
    filename: item.filename,
    mimeType: item.mimeType,
    takenAt: item.mediaMetadata?.creationTime ?? null,
    width: item.mediaMetadata?.width ? Number(item.mediaMetadata.width) : null,
    height: item.mediaMetadata?.height ? Number(item.mediaMetadata.height) : null,
    isVideo: item.mimeType.startsWith("video/"),
    cameraMake: item.mediaMetadata?.photo?.cameraMake ?? null,
  }));

  return NextResponse.json({
    photos,
    nextPageToken: data.nextPageToken ?? null,
    albumTitle: world.linked_album_name,
    albumLinked: true,
  });
}

interface AlbumPhoto {
  id: string;
  baseUrl: string;
  filename: string;
  mimeType: string;
  productUrl: string;
  mediaMetadata?: {
    creationTime?: string;
    width?: string;
    height?: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
    };
    video?: {
      fps?: number;
      status?: string;
    };
  };
}

export interface GalleryPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  mimeType: string;
  takenAt: string | null;
  width: number | null;
  height: number | null;
  isVideo: boolean;
  cameraMake: string | null;
}

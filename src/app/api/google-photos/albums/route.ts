import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/google-photos/albums
 *
 * Lists the authenticated user's Google Photos albums so they can
 * choose which one to link to their world. Returns album id, title,
 * cover photo, and item count.
 */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get stored access token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenRow } = await (supabase as any)
    .from("google_photos_tokens")
    .select("access_token")
    .eq("user_id", user.id)
    .single() as { data: { access_token: string } | null };

  if (!tokenRow) {
    return NextResponse.json({ error: "not_connected" }, { status: 403 });
  }

  // Fetch all albums from Google Photos Library API
  const albums: GoogleAlbum[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL("https://photoslibrary.googleapis.com/v1/albums");
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${tokenRow.access_token}` },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[albums] Library API error:", res.status, body);

      if (res.status === 401 || res.status === 403) {
        return NextResponse.json({ error: "token_expired" }, { status: 403 });
      }
      return NextResponse.json({ error: "albums_failed" }, { status: 502 });
    }

    const page = (await res.json()) as {
      albums?: GoogleAlbum[];
      nextPageToken?: string;
    };

    if (page.albums) albums.push(...page.albums);
    pageToken = page.nextPageToken;
  } while (pageToken);

  return NextResponse.json({ albums });
}

interface GoogleAlbum {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
  coverPhotoMediaItemId?: string;
}

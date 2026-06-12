import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/cloudflare/images";
import { z } from "zod";

/**
 * POST /api/google-photos/import
 *
 * Pipeline:
 *   1. Fetch picked media items from the Photos Picker session
 *   2. For each item, check duplicate fingerprint
 *   3. Download via temporary baseUrl (valid ~60 min)
 *   4. Upload to Cloudflare Images
 *   5. Create a memory record in Supabase
 *   6. Store fingerprint to prevent re-import
 */

const ImportBodySchema = z.object({
  worldId: z.string().uuid(),
  sessionId: z.string().min(1),
});

// Shape of a media item returned by the Picker API
interface PickerMediaItem {
  id: string;
  baseUrl: string;              // temporary Google-signed URL, ~60 min TTL
  mimeType: string;
  filename?: string;
  mediaFile?: {
    filename?: string;
    photoMetadata?: {
      takenTime?: string;       // RFC3339
      cameraMake?: string;
      cameraModel?: string;
    };
    videoMetadata?: {
      fps?: number;
      videoDimensions?: { width?: number; height?: number };
    };
  };
}

type ImportStatus =
  | "imported"
  | "duplicate"
  | "download_failed"
  | "upload_failed"
  | "memory_failed";

interface ImportResult {
  id: string;
  status: ImportStatus;
  memoryId?: string;
  filename?: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate body
  let body: z.infer<typeof ImportBodySchema>;
  try {
    body = ImportBodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { worldId, sessionId } = body;

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

  // Get user's access token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenRow } = await (supabase as any)
    .from("google_photos_tokens")
    .select("access_token")
    .eq("user_id", user.id)
    .single() as { data: { access_token: string } | null };

  if (!tokenRow) {
    return NextResponse.json({ error: "not_connected" }, { status: 403 });
  }

  // ── Fetch picked items from the Picker session ──────────────────────
  const itemsRes = await fetch(
    `https://photospicker.googleapis.com/v1/mediaItems?sessionId=${encodeURIComponent(sessionId)}&pageSize=100`,
    {
      headers: { Authorization: `Bearer ${tokenRow.access_token}` },
    },
  );

  if (!itemsRes.ok) {
    console.error("[import] Picker mediaItems failed:", itemsRes.status);
    return NextResponse.json(
      { error: "picker_items_failed" },
      { status: 502 },
    );
  }

  const { mediaItems = [] } = (await itemsRes.json()) as {
    mediaItems: PickerMediaItem[];
    nextPageToken?: string;
  };

  if (mediaItems.length === 0) {
    return NextResponse.json({ results: [], message: "No items selected" });
  }

  const results: ImportResult[] = [];

  for (const item of mediaItems) {
    const filename =
      item.filename ??
      item.mediaFile?.filename ??
      `memory-${item.id}`;

    // ── 1. Duplicate check ──────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from("media_fingerprints")
      .select("id, memory_id")
      .eq("world_id", worldId)
      .eq("google_media_item_id", item.id)
      .maybeSingle() as { data: { id: string; memory_id: string | null } | null };

    if (existing) {
      results.push({
        id: item.id,
        status: "duplicate",
        memoryId: existing.memory_id ?? undefined,
        filename,
      });
      continue;
    }

    // ── 2. Download via temporary URL ───────────────────────────────
    // Append =d to get the full-resolution download URL
    let blob: Blob;
    try {
      const fileRes = await fetch(`${item.baseUrl}=d`);
      if (!fileRes.ok) throw new Error(`HTTP ${fileRes.status}`);
      blob = await fileRes.blob();
    } catch (err) {
      console.error("[import] download failed for", item.id, err);
      results.push({ id: item.id, status: "download_failed", filename });
      continue;
    }

    // ── 3. Upload to Cloudflare Images ──────────────────────────────
    let cfImageId: string;
    try {
      const cfResult = await uploadImage(blob, {
        source: "google-photos-picker",
        googleMediaItemId: item.id,
        filename,
      });

      if (!cfResult) {
        // Cloudflare not configured — store a placeholder in demo mode
        cfImageId = `demo-${item.id}`;
      } else {
        cfImageId = cfResult.id;
      }
    } catch (err) {
      console.error("[import] Cloudflare upload failed for", item.id, err);
      results.push({ id: item.id, status: "upload_failed", filename });
      continue;
    }

    // ── 4. Extract metadata ─────────────────────────────────────────
    const photoMeta = item.mediaFile?.photoMetadata;
    const takenAt = photoMeta?.takenTime
      ? new Date(photoMeta.takenTime)
      : new Date();

    const mediaType = item.mimeType.startsWith("video/") ? "video" : "photo";

    // ── 5. Create memory record ─────────────────────────────────────
    const titleBase = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

    const mediaPayload = [
      {
        id: cfImageId,
        type: mediaType,
        source: "google-photos",
        mimeType: item.mimeType,
        ...(photoMeta?.cameraMake ? { cameraMake: photoMeta.cameraMake } : {}),
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: memory, error: memErr } = await (supabase as any)
      .from("memories")
      .insert({
        world_id: worldId,
        title: titleBase || "Untitled memory",
        occurred_at: takenAt.toISOString(),
        mood: "tender",
        media: mediaPayload,
      })
      .select("id")
      .single() as {
        data: { id: string } | null;
        error: { message: string } | null;
      };

    if (memErr || !memory) {
      console.error("[import] memory insert failed for", item.id, memErr);
      results.push({ id: item.id, status: "memory_failed", filename });
      continue;
    }

    // ── 6. Record fingerprint ───────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("media_fingerprints").insert({
      world_id: worldId,
      user_id: user.id,
      google_media_item_id: item.id,
      memory_id: memory.id,
    });

    results.push({
      id: item.id,
      status: "imported",
      memoryId: memory.id,
      filename,
    });
  }

  const importedCount = results.filter((r) => r.status === "imported").length;
  const duplicateCount = results.filter((r) => r.status === "duplicate").length;

  return NextResponse.json({
    results,
    summary: {
      total: mediaItems.length,
      imported: importedCount,
      duplicates: duplicateCount,
      failed: mediaItems.length - importedCount - duplicateCount,
    },
  });
}

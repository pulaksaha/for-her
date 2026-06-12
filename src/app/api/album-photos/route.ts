import { NextRequest, NextResponse } from "next/server";

// All media items share the pw/AP1Gcz... pattern for their thumbnail/base URL
const MEDIA_URL_RE =
  /https:\/\/lh3\.googleusercontent\.com\/pw\/AP1Gcz[A-Za-z0-9_\-]+/g;

// Videos in Google Photos albums expose a video-downloads URL nearby their thumbnail.
// We extract the token from that URL to identify which lh3 items are videos.
// Pattern: video-downloads.googleusercontent.com/ADGPM...
const VIDEO_TOKEN_RE =
  /video-downloads\.googleusercontent\.com\/([A-Za-z0-9_\-]{20,})/g;

// When a video item appears in the album HTML, its thumbnail (lh3 pw/AP1Gcz URL)
// appears close to the video-downloads URL. We pair them by scanning the raw HTML
// for blocks that contain both.
const VIDEO_BLOCK_RE =
  /https:\/\/lh3\.googleusercontent\.com\/pw\/AP1Gcz[A-Za-z0-9_\-]+(?:[^<]{0,600}?video-downloads\.googleusercontent\.com|video-downloads\.googleusercontent\.com[^<]{0,600}?https:\/\/lh3\.googleusercontent\.com\/pw\/AP1Gcz[A-Za-z0-9_\-]+)/g;

async function resolveRedirect(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return res.url || url;
  } catch {
    return url;
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  const resolvedUrl = await resolveRedirect(raw);

  let html: string;
  try {
    const res = await fetch(resolvedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 3600 },
    });
    html = await res.text();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch album", detail: String(err) },
      { status: 502 }
    );
  }

  // ── Step 1: collect all unique lh3 base URLs ──────────────────────────────
  const allMatches = html.match(MEDIA_URL_RE) ?? [];
  const allUnique = [
    ...new Set(allMatches.map((u) => u.split("=")[0])),
  ].filter((u) => u.includes("/pw/AP1Gcz"));

  if (allUnique.length === 0) {
    return NextResponse.json(
      { error: "No media found. Make sure the album is public.", photos: [], videos: [] },
      { status: 200 }
    );
  }

  // ── Step 2: identify video thumbnails ─────────────────────────────────────
  // Strategy: scan the raw HTML in 1200-char windows. If a lh3 URL appears
  // within 1200 chars of a video-downloads URL, it's a video thumbnail.
  const videoThumbnailUrls = new Set<string>();

  // Find every video-downloads token position
  let vtMatch: RegExpExecArray | null;
  const VIDEO_DOWNLOADS_RE =
    /video-downloads\.googleusercontent\.com\/[A-Za-z0-9_\-]{10,}/g;

  while ((vtMatch = VIDEO_DOWNLOADS_RE.exec(html)) !== null) {
    const pos = vtMatch.index;
    // Look ±1500 chars around this video token for an lh3 pw URL
    const window = html.slice(Math.max(0, pos - 1500), pos + 1500);
    const nearby = window.match(MEDIA_URL_RE) ?? [];
    for (const u of nearby) {
      const base = u.split("=")[0];
      if (base.includes("/pw/AP1Gcz")) {
        videoThumbnailUrls.add(base);
      }
    }
  }

  // ── Step 3: separate photos and videos ───────────────────────────────────
  const photos: string[] = [];
  const videos: Array<{ thumbnail: string; src: string }> = [];

  for (const url of allUnique) {
    if (videoThumbnailUrls.has(url)) {
      // Videos: thumbnail for poster, =m22 suffix for MP4 stream
      videos.push({
        thumbnail: `${url}=w800-no`,
        src: `${url}=m22`,          // Google Photos MP4 stream suffix
      });
    } else {
      photos.push(url);
    }
  }

  return NextResponse.json({
    photos,
    videos,
    total: allUnique.length,
    photoCount: photos.length,
    videoCount: videos.length,
  });
}

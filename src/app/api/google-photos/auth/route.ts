import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * GET /api/google-photos/auth?world=<slug>
 *
 * Initiates the Google OAuth 2.0 PKCE-less flow for the
 * Photos Picker API. We request only the picker scope —
 * no full library access, ever.
 */
export async function GET(request: Request) {
  if (!env.GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "Google Photos not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const worldSlug = searchParams.get("world") ?? "";

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/google-photos/callback`,
    response_type: "code",
    scope: [
      "openid",
      "email",
      // Picker-only scope for manual selection
      "https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
      // Library API scope for album listing + linking
      "https://www.googleapis.com/auth/photoslibrary.readonly",
    ].join(" "),
    access_type: "offline",   // request refresh_token
    prompt: "consent",        // always show consent to ensure refresh_token is returned
    state: worldSlug,         // round-trip the world slug through OAuth
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}

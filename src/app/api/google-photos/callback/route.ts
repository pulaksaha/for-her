import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

/**
 * GET /api/google-photos/callback
 *
 * Google redirects here after user grants (or denies) consent.
 * We exchange the authorisation code for tokens and persist them
 * in the google_photos_tokens table, then redirect back to the world.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const worldSlug = searchParams.get("state") ?? "";

  const redirectBase = `${env.NEXT_PUBLIC_APP_URL}/worlds/${worldSlug}`;

  // User cancelled the consent screen
  if (error || !code) {
    return NextResponse.redirect(
      `${redirectBase}?error=google_auth_cancelled`,
    );
  }

  // Exchange authorisation code → access + refresh tokens
  let tokens: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
  };

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/google-photos/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error("[google-photos/callback] token exchange failed:", body);
      return NextResponse.redirect(`${redirectBase}?error=google_token_failed`);
    }

    tokens = (await tokenRes.json()) as typeof tokens;
  } catch (err) {
    console.error("[google-photos/callback] network error:", err);
    return NextResponse.redirect(`${redirectBase}?error=google_token_failed`);
  }

  // Verify Supabase session
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/login?next=/worlds/${worldSlug}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/login?next=/worlds/${worldSlug}`,
    );
  }

  // Upsert token row — one row per user, refreshed on re-auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dbError } = await (supabase as any)
    .from("google_photos_tokens")
    .upsert(
      {
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        expires_at: new Date(
          Date.now() + tokens.expires_in * 1000,
        ).toISOString(),
        scope: tokens.scope,
      },
      { onConflict: "user_id" },
    );

  if (dbError) {
    console.error("[google-photos/callback] db upsert failed:", dbError);
    return NextResponse.redirect(`${redirectBase}?error=google_save_failed`);
  }

  // Redirect back with a flag so the UI can auto-open the picker
  return NextResponse.redirect(`${redirectBase}?google_photos_ready=1`);
}

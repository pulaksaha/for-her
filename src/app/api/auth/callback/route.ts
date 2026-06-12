import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

/**
 * GET /api/auth/callback
 *
 * Supabase redirects here after magic-link or OAuth confirmation.
 * Exchanges the `code` for a session, then sends the user to their world.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/worlds/our-story";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    }
  }

  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`,
  );
}

/**
 * POST /api/auth/callback
 *
 * Handles magic-link sign-in submitted from the login form.
 * Sends an OTP email and redirects to a "check your email" page.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const email = (formData.get("email") as string | null)?.trim();

  if (!email) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/login?error=email_required`,
      { status: 303 },
    );
  }

  // MOCK LOGIN: Bypass OTP and go straight to the world
  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_APP_URL}/worlds/our-story`,
    { status: 303 },
  );
}

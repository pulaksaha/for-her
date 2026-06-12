import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/google-photos/picker-session
 *
 * Creates a Photos Picker session and returns the pickerUri.
 * The client opens this URI in a popup; when the popup closes,
 * the client hits /api/google-photos/import with the session ID.
 *
 * Sessions expire after the user finishes picking or after ~60 min.
 */
export async function POST() {
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

  // Fetch the user's stored access token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenRow, error: tokenErr } = await (supabase as any)
    .from("google_photos_tokens")
    .select("access_token, expires_at")
    .eq("user_id", user.id)
    .single() as { data: { access_token: string; expires_at: string } | null; error: unknown };

  if (tokenErr || !tokenRow) {
    // No token stored yet — client should redirect to /api/google-photos/auth
    return NextResponse.json({ error: "not_connected" }, { status: 403 });
  }

  // Warn if the token is close to expiry (refresh flow is a future enhancement)
  const expiresAt = new Date(tokenRow.expires_at).getTime();
  if (Date.now() > expiresAt - 5 * 60 * 1000) {
    console.warn("[picker-session] access token may be expired, user should re-auth");
  }

  // Create a Photos Picker session via the Picker API
  const sessionRes = await fetch(
    "https://photospicker.googleapis.com/v1/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenRow.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  if (!sessionRes.ok) {
    const body = await sessionRes.text();
    console.error("[picker-session] Google API error:", sessionRes.status, body);

    // 401/403 typically means the token expired; tell client to re-auth
    if (sessionRes.status === 401 || sessionRes.status === 403) {
      return NextResponse.json({ error: "token_expired" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "picker_session_failed" },
      { status: 502 },
    );
  }

  const session = (await sessionRes.json()) as {
    id: string;
    pickerUri: string;
    pollingConfig?: { pollInterval?: string; timeoutIn?: string };
  };

  // Return session ID + picker URI to the client
  return NextResponse.json({
    sessionId: session.id,
    pickerUri: session.pickerUri,
  });
}

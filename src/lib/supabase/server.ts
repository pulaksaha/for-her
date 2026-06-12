import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { env, isSupabaseConfigured } from "@/lib/env";

export async function createClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const cookieStore = await cookies();

  const client = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    },
  );

  // MOCK LOGIN: Override getUser to always return our seeded dummy user
  client.auth.getUser = async () => ({
    data: {
      user: {
        id: "11111111-1111-1111-1111-111111111111",
        email: "test@example.com",
        // Need minimal fields required by your usage, but type expects User
        app_metadata: {},
        user_metadata: { full_name: "Test User" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as any,
    },
    error: null,
  });

  return client;
}

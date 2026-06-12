"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function signUpAction(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const worldType = (formData.get("worldType") as string | null) ?? "couple";

  if (!email || !name) {
    redirect("/signup?error=missing_fields");
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect("/signup?error=not_configured");
  }

  // MOCK: Bypass login and go straight to the world
  redirect("/worlds/our-story");


}

export async function signOutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}

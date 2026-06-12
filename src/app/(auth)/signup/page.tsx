import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { signUpAction } from "../actions";

export const metadata = {
  title: "Begin your world — Verse",
  description: "Create your private memory world on Verse.",
};

interface SignupPageProps {
  searchParams: Promise<{ sent?: string; email?: string; error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { sent, email, error } = await searchParams;

  // ── Confirmation state ─────────────────────────────────────────────
  if (sent === "1") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-24">
        <Container size="sm">
          <div className="text-center">
            <Link
              href="/"
              className="font-display text-3xl tracking-[0.15em] text-verse-cream"
            >
              Verse
            </Link>
            <div className="mt-16 space-y-4">
              <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
                Check your inbox
              </p>
              <h1 className="font-display text-4xl font-light text-verse-cream">
                Magic link sent
              </h1>
              <p className="mt-4 text-verse-cream-muted">
                We sent a sign-in link to{" "}
                <span className="text-verse-cream">{email}</span>.
                <br />
                Click it to enter your world.
              </p>
              <p className="pt-6 text-xs text-verse-cream-faint">
                No email? Check spam, or{" "}
                <Link href="/signup" className="text-verse-gold hover:text-verse-cream">
                  try again
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // ── Signup form ────────────────────────────────────────────────────
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <Container size="sm">
        <div className="text-center">
          <Link
            href="/"
            className="font-display text-3xl tracking-[0.15em] text-verse-cream"
          >
            Verse
          </Link>
          <h1 className="mt-12 font-display text-4xl font-light text-verse-cream">
            Begin your world
          </h1>
          <p className="mt-4 text-verse-cream-muted">
            A private place for the moments that matter
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-center text-sm text-rose-300">
            {error === "missing_fields" && "Please fill in your name and email."}
            {error === "send_failed" && "Could not send the link. Please try again."}
            {error === "not_configured" && "Auth is not configured yet."}
            {!["missing_fields", "send_failed", "not_configured"].includes(error) && "Something went wrong. Please try again."}
          </p>
        )}

        <form action={signUpAction} className="mt-12 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase"
            >
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="mt-2 w-full rounded-2xl border border-verse-border bg-verse-surface px-5 py-4 text-verse-cream placeholder:text-verse-cream-faint/50 focus:border-verse-gold-soft/40 focus:outline-none"
              placeholder="Pulak"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-2xl border border-verse-border bg-verse-surface px-5 py-4 text-verse-cream placeholder:text-verse-cream-faint/50 focus:border-verse-gold-soft/40 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="world-type"
              className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase"
            >
              This world is for
            </label>
            <select
              id="world-type"
              name="worldType"
              className="mt-2 w-full rounded-2xl border border-verse-border bg-verse-surface px-5 py-4 text-verse-cream focus:border-verse-gold-soft/40 focus:outline-none"
            >
              <option value="couple">Two of us</option>
              <option value="family">Our family</option>
              <option value="individual">Just me</option>
            </select>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send magic link
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-verse-cream-faint">
          Already have a world?{" "}
          <Link href="/login" className="text-verse-gold hover:text-verse-cream">
            Sign in
          </Link>
        </p>
      </Container>
    </main>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sign in — Verse",
  description: "Sign in to your Verse memory world.",
};

interface LoginPageProps {
  searchParams: Promise<{ sent?: string; email?: string; error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { sent, email, error, next } = await searchParams;

  // ── Confirmation state ──────────────────────────────────────────────
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
                <Link href="/login" className="text-verse-gold hover:text-verse-cream">
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

  // ── Login form ──────────────────────────────────────────────────────
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
            Welcome back
          </h1>
          <p className="mt-4 text-verse-cream-muted">
            Sign in to your memory world
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-center text-sm text-rose-300">
            {error === "email_required" && "Please enter your email address."}
            {error === "send_failed" && "Could not send the link. Please try again."}
            {error === "auth_failed" && "Sign-in link expired or invalid. Please request a new one."}
            {error === "not_configured" && "Auth is not configured yet."}
            {!["email_required", "send_failed", "auth_failed", "not_configured"].includes(error) && "Something went wrong. Please try again."}
          </p>
        )}

        {/* POST to the callback route — sends OTP magic link */}
        <form
          action="/api/auth/callback"
          method="post"
          className="mt-12 space-y-6"
        >
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
          {next && <input type="hidden" name="next" value={next} />}
          <Button type="submit" className="w-full" size="lg">
            Continue with email
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-verse-cream-faint">
          No account?{" "}
          <Link href="/signup" className="text-verse-gold hover:text-verse-cream">
            Begin your world
          </Link>
        </p>

        <p className="mt-16 text-center">
          <Link
            href="/worlds/our-story"
            className="text-sm text-verse-cream-muted hover:text-verse-cream"
          >
            Or explore the demo →
          </Link>
        </p>
      </Container>
    </main>
  );
}

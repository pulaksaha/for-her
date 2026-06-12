import Link from "next/link";

export function MinimalShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-verse-void">
      <header className="border-b border-verse-border/30 px-6 py-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.3em] text-verse-cream/80 uppercase"
        >
          Verse
        </Link>
        {title && (
          <h1 className="mt-6 font-display text-3xl font-light text-verse-cream sm:text-4xl">
            {title}
          </h1>
        )}
      </header>
      <main className="px-6 py-10 sm:px-10 lg:px-16">{children}</main>
    </div>
  );
}

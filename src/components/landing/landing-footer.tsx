export function LandingFooter() {
  return (
    <footer className="border-t border-verse-border/30 bg-verse-void py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-12 lg:px-20">
        <p className="font-display text-lg tracking-[0.2em] text-verse-cream">
          Verse
        </p>
        <p className="text-[11px] tracking-widest text-verse-cream-faint">
          © {new Date().getFullYear()} · Held with care
        </p>
      </div>
    </footer>
  );
}

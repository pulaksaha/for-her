interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <header className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-[10px] tracking-[0.4em] text-verse-gold uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-light leading-tight text-verse-cream sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-sm leading-relaxed text-verse-cream-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

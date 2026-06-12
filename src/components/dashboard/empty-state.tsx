import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-sm border border-dashed border-verse-border/60 px-8 py-20 text-center",
        className,
      )}
    >
      <p className="font-display text-2xl font-light text-verse-cream sm:text-3xl">
        {title}
      </p>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-verse-cream-faint">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

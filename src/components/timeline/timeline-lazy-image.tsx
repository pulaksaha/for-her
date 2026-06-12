"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useInView } from "@/hooks/use-in-view";

interface TimelineLazyImageProps {
  src: string;
  alt: string;
  blurSrc?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  containerClassName?: string;
  onLoad?: () => void;
}

export function TimelineLazyImage({
  src,
  alt,
  blurSrc,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 640px",
  containerClassName = "absolute inset-0",
  onLoad,
}: TimelineLazyImageProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "280px 0px",
    triggerOnce: true,
  });
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-verse-surface",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        {blurSrc ? (
          <Image
            src={blurSrc}
            alt=""
            fill
            className="scale-110 object-cover blur-xl"
            sizes="64px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-verse-elevated/80" />
        )}
      </div>

      {(inView || priority) && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn(
            "object-cover transition-all duration-[1.2s] ease-out",
            loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md",
            className,
          )}
          sizes={sizes}
          onLoad={() => {
            setLoaded(true);
            onLoad?.();
          }}
        />
      )}
    </div>
  );
}

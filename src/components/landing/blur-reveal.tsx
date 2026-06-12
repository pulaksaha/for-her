"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  start?: string;
}

export function BlurReveal({
  children,
  className,
  start = "top 82%",
}: BlurRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, filter: "blur(12px)", y: 28 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [start]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

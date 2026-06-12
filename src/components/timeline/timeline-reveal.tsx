"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils/cn";

interface TimelineRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function TimelineReveal({
  children,
  className,
  delay = 0,
}: TimelineRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "80px 0px",
    threshold: 0.08,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 28, filter: "blur(10px)" }
      }
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

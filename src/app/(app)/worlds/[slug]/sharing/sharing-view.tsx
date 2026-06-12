"use client";

import { SectionHeader } from "@/components/dashboard/section-header";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import type { DemoSharingMember } from "@/lib/data/demo";
import { cn } from "@/lib/utils/cn";

interface SharingViewProps {
  members: DemoSharingMember[];
  worldName: string;
}

export function SharingView({ members, worldName }: SharingViewProps) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Sharing"
          title="Only who you choose"
          description={`${worldName} is private. Invite the people who were there — no links, no public URLs, no audience.`}
        />

        <DashboardScrollReveal>
          <div className="rounded-sm border border-verse-border/40 bg-verse-surface/20 p-6 sm:p-8">
            <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
              Visibility
            </p>
            <p className="mt-4 font-display text-2xl text-verse-cream">
              Private world
            </p>
            <p className="mt-2 text-sm text-verse-cream-muted">
              Not indexed. Not shareable on social. Accessible only to members below.
            </p>
          </div>
        </DashboardScrollReveal>

        <DashboardScrollReveal className="mt-10">
          <p className="mb-6 text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Members
          </p>
          <ul className="space-y-3">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-4 rounded-sm border border-verse-border/30 bg-verse-surface/15 px-5 py-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-verse-elevated font-display text-lg text-verse-gold">
                  {member.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-verse-cream">
                    {member.name}
                  </p>
                  <p className="truncate text-sm text-verse-cream-faint">
                    {member.email}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-[0.2em] uppercase",
                    member.role === "owner"
                      ? "text-verse-gold"
                      : "text-verse-cream-faint",
                  )}
                >
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </DashboardScrollReveal>

        <DashboardScrollReveal className="mt-10">
          <button
            type="button"
            className="w-full rounded-sm border border-dashed border-verse-border/60 py-5 text-[11px] tracking-[0.3em] text-verse-cream-muted uppercase transition-colors hover:border-verse-gold/30 hover:text-verse-cream"
          >
            Invite someone →
          </button>
        </DashboardScrollReveal>

        <DashboardScrollReveal className="mt-12">
          <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Controls
          </p>
          <ul className="mt-4 space-y-4 text-sm text-verse-cream-muted">
            <li className="flex justify-between border-b border-verse-border/20 pb-4">
              <span>Download archive</span>
              <span className="text-verse-cream-faint">Legacy plan</span>
            </li>
            <li className="flex justify-between border-b border-verse-border/20 pb-4">
              <span>Viewer-only access</span>
              <span className="text-verse-gold">On</span>
            </li>
            <li className="flex justify-between pb-4">
              <span>Require approval for new members</span>
              <span className="text-verse-gold">On</span>
            </li>
          </ul>
        </DashboardScrollReveal>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { WorldShell } from "@/components/dashboard/world-shell";
import { getWorldBySlug } from "@/lib/world/get-world-data";

interface WorldLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function WorldLayout({
  children,
  params,
}: WorldLayoutProps) {
  const { slug } = await params;
  const world = getWorldBySlug(slug);

  if (!world) {
    notFound();
  }

  return <WorldShell world={world}>{children}</WorldShell>;
}

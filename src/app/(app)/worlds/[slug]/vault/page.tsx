import { notFound } from "next/navigation";
import { VaultView } from "./vault-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

export const metadata = { title: "Memory vault" };

export default async function VaultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  return <VaultView memories={data.memories} worldSlug={slug} />;
}

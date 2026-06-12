import { notFound } from "next/navigation";
import { RecapView } from "./recap-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

export const metadata = { title: "AI recap" };

export default async function RecapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  return (
    <RecapView
      recap={data.recap}
      memories={data.memories}
      worldSlug={slug}
    />
  );
}

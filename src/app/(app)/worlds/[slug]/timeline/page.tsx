import { notFound } from "next/navigation";
import { TimelineView } from "./timeline-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

export const metadata = { title: "Timeline" };

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  return (
    <TimelineView
      chapters={data.chapters}
      memories={data.memories}
      worldSlug={slug}
    />
  );
}

import { notFound } from "next/navigation";
import { WorldHub } from "@/components/dashboard/world-hub";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

interface WorldPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WorldPageProps) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  return { title: data?.world.name ?? "World" };
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);

  if (!data) notFound();

  return <WorldHub data={data} />;
}

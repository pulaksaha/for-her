import { notFound } from "next/navigation";
import { FilmsView } from "./films-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

export const metadata = { title: "Anniversary films" };

export default async function FilmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  return <FilmsView films={data.films} worldSlug={slug} />;
}

import { notFound } from "next/navigation";
import { RecapStudio } from "@/components/recap/recap-studio";
import { getWorldBySlug } from "@/lib/world/get-world-data";

export const metadata = { title: "Recap studio" };

export default async function RecapStudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getWorldBySlug(slug)) notFound();

  return <RecapStudio worldSlug={slug} />;
}

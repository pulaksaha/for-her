import { notFound } from "next/navigation";
import { SharingView } from "./sharing-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

export const metadata = { title: "Sharing" };

export default async function SharingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  return (
    <SharingView members={data.sharing} worldName={data.world.name} />
  );
}

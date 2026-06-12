import { notFound } from "next/navigation";
import { VoiceView } from "./voice-view";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

export const metadata = { title: "Voice notes" };

export default async function VoicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  return <VoiceView voiceNotes={data.voiceNotes} />;
}

import { AudioPlayerProvider } from "@/contexts/audio-player-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AudioPlayerProvider>{children}</AudioPlayerProvider>;
}

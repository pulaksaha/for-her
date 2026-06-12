"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface AudioTrack {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  durationSeconds?: number;
}

interface AudioPlayerContextValue {
  track: AudioTrack | null;
  isPlaying: boolean;
  play: (track: AudioTrack) => void;
  pause: () => void;
  toggle: () => void;
  clear: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((next: AudioTrack) => {
    setTrack(next);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => setIsPlaying((p) => !p), []);

  const clear = useCallback(() => {
    setTrack(null);
    setIsPlaying(false);
  }, []);

  const value = useMemo(
    () => ({ track, isPlaying, play, pause, toggle, clear }),
    [track, isPlaying, play, pause, toggle, clear],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return ctx;
}

/**
 * Remotion composition for Verse anniversary films.
 *
 * Install in remotion workspace:
 *   npm install remotion @remotion/cli @remotion/player
 *
 * Render:
 *   npx remotion render remotion/index.ts AnniversaryFilm out/film.mp4
 */
import React from "react";

export interface AnniversaryFilmProps {
  worldName: string;
  title: string;
  memories: Array<{
    imageUrl: string;
    title: string;
    date: string;
    caption?: string;
  }>;
  musicUrl?: string;
}

export const AnniversaryFilmComposition: React.FC<AnniversaryFilmProps> = ({
  worldName,
  title,
  memories,
}) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#080706",
        color: "#f5ebe0",
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <p style={{ fontSize: 18, letterSpacing: "0.3em", opacity: 0.6 }}>
        {worldName}
      </p>
      <h1 style={{ fontSize: 64, fontWeight: 400, marginTop: 24 }}>{title}</h1>
      <p style={{ marginTop: 48, opacity: 0.5 }}>
        {memories.length} moments · Verse
      </p>
    </div>
  );
};

export const anniversaryFilmConfig = {
  id: "AnniversaryFilm",
  durationInFrames: 30 * 60, // 60s at 30fps — configure per render
  fps: 30,
  width: 1920,
  height: 1080,
};

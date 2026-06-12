import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { RecapScene } from "../src/lib/recap/types";

export interface AnniversaryRecapProps {
  worldName: string;
  title: string;
  subtitle?: string;
  fps: number;
  width: number;
  height: number;
  totalDurationFrames: number;
  openingNarration: string;
  closingNarration: string;
  scenes: RecapScene[];
  narrationAudioUrl?: string;
  soundtrackUrl?: string;
  soundtrackVolume?: number;
}

const COLORS = {
  void: "#080706",
  cream: "#f5ebe0",
  creamMuted: "#c9bfb3",
  gold: "#c4a574",
};

const SceneSlide: React.FC<{
  scene: RecapScene;
  isVertical: boolean;
}> = ({ scene, isVertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame;
  const duration = scene.durationFrames;

  const opacity = interpolate(
    localFrame,
    [0, 18, duration - 24, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale =
    scene.transition === "slow-zoom"
      ? interpolate(localFrame, [0, duration], [1.08, 1], {
          extrapolateRight: "clamp",
        })
      : 1;

  const blur = interpolate(localFrame, [0, 20], [8, 0], {
    extrapolateRight: "clamp",
  });

  const captionY = spring({
    frame: localFrame - 12,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: COLORS.void }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
        }}
      >
        <Img
          src={scene.imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.35) 45%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: isVertical ? 48 : 80,
          paddingBottom: isVertical ? 120 : 100,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: isVertical ? 14 : 16,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: COLORS.gold,
            margin: 0,
            opacity: 0.9,
          }}
        >
          {scene.dateLabel} · {scene.mood}
        </p>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 400,
            fontSize: isVertical ? 36 : 52,
            color: COLORS.cream,
            margin: "16px 0 0",
            lineHeight: 1.1,
            transform: `translateY(${(1 - captionY) * 24}px)`,
          }}
        >
          {scene.title}
        </h2>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: isVertical ? 20 : 26,
            color: COLORS.creamMuted,
            marginTop: 20,
            maxWidth: isVertical ? "100%" : "70%",
            lineHeight: 1.45,
            transform: `translateY(${(1 - captionY) * 16}px)`,
          }}
        >
          {scene.poeticCaption}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{
  worldName: string;
  title: string;
  subtitle?: string;
  line: string;
  isVertical: boolean;
}> = ({ worldName, title, subtitle, line, isVertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const textBlur = interpolate(frame, [0, 25], [12, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.void,
        justifyContent: "center",
        alignItems: "center",
        padding: isVertical ? 48 : 100,
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: enter,
          filter: `blur(${textBlur}px)`,
          transform: `scale(${interpolate(enter, [0, 1], [0.98, 1])})`,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontSize: isVertical ? 12 : 14,
            color: COLORS.gold,
            margin: 0,
          }}
        >
          {worldName}
        </p>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 300,
            fontSize: isVertical ? 48 : 72,
            color: COLORS.cream,
            margin: "24px 0 0",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: isVertical ? 18 : 22,
              color: COLORS.creamMuted,
              marginTop: 16,
              fontStyle: "italic",
            }}
          >
            {subtitle}
          </p>
        )}
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: isVertical ? 16 : 18,
            color: COLORS.creamMuted,
            marginTop: 48,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          {line}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const AnniversaryRecap: React.FC<AnniversaryRecapProps> = ({
  worldName,
  title,
  subtitle,
  openingNarration,
  closingNarration,
  scenes,
  narrationAudioUrl,
  soundtrackUrl,
  soundtrackVolume = 0.35,
  width,
  height,
}) => {
  const isVertical = height > width;
  const OPENING = 150;
  const CLOSING = 120;
  let offset = OPENING;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.void }}>
      {soundtrackUrl ? (
        <Audio src={soundtrackUrl} volume={soundtrackVolume} />
      ) : null}
      {narrationAudioUrl ? (
        <Audio src={narrationAudioUrl} volume={1} />
      ) : null}

      <Sequence from={0} durationInFrames={OPENING}>
        <TitleCard
          worldName={worldName}
          title={title}
          subtitle={subtitle}
          line={openingNarration}
          isVertical={isVertical}
        />
      </Sequence>

      {scenes.map((scene) => {
        const from = offset;
        offset += scene.durationFrames;
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={scene.durationFrames}
          >
            <SceneSlide scene={scene} isVertical={isVertical} />
          </Sequence>
        );
      })}

      <Sequence from={offset} durationInFrames={CLOSING}>
        <TitleCard
          worldName={worldName}
          title={title}
          line={closingNarration}
          isVertical={isVertical}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

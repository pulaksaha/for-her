"use client";

import type { ComponentType } from "react";
import { Player } from "@remotion/player";
import { AnniversaryRecap } from "../../../remotion/RecapComposition";
import type { AnniversaryRecapProps } from "../../../remotion/RecapComposition";

const RecapComponent = AnniversaryRecap as unknown as ComponentType<
  Record<string, unknown>
>;

export default function RecapPreviewPlayer(props: AnniversaryRecapProps) {
  return (
    <Player
      component={RecapComponent}
      inputProps={props}
      durationInFrames={props.totalDurationFrames}
      fps={props.fps}
      compositionWidth={props.width}
      compositionHeight={props.height}
      style={{
        width: "100%",
        aspectRatio: `${props.width} / ${props.height}`,
      }}
      controls
      loop
    />
  );
}

import { Composition } from "remotion";
import { AnniversaryRecap, type AnniversaryRecapProps } from "./RecapComposition";

export const RemotionRoot: React.FC = () => {
  const defaultProps: AnniversaryRecapProps = {
    worldName: "Our Story",
    title: "A Love Letter in Time",
    subtitle: "Anniversary recap",
    fps: 30,
    width: 1920,
    height: 1080,
    totalDurationFrames: 900,
    openingNarration:
      "Some years change the shape of everything — quietly, and all at once.",
    closingNarration: "Still unfolding. Still yours.",
    scenes: [],
    soundtrackVolume: 0.35,
  };

  return (
    <>
      <Composition
        id="AnniversaryRecap"
        component={AnniversaryRecap}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.totalDurationFrames ?? 900,
          width: props.width ?? 1920,
          height: props.height ?? 1080,
        })}
      />
      <Composition
        id="AnniversaryRecapVertical"
        component={AnniversaryRecap}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultProps,
          width: 1080,
          height: 1920,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.totalDurationFrames ?? 900,
          width: 1080,
          height: 1920,
        })}
      />
    </>
  );
};

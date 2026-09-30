import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/photos";
import { PhotoOrIllustration, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

/** 开场：插画逐层出现 —— 先是颜色和影子，再是一个个人物 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <SceneShell id="hook">
      <PhotoOrIllustration
        photo={PHOTOS.hook}
        style={{
          scale: interpolate(frame, [0, durationInFrames], [1.08, 1], {
            ...clamp,
            output: "perceptual-scale",
          }),
        }}
        layers={{
          bg: { opacity: interpolate(frame, [0, 1 * fps], [0, 1], { ...clamp, easing: ease }) },
          shadow: {
            opacity: interpolate(frame, [1 * fps, 2.5 * fps], [0, 1], { ...clamp, easing: ease }),
          },
          fg: {
            opacity: interpolate(frame, [7.5 * fps, 8.3 * fps], [0, 1], { ...clamp, easing: ease }),
            translate: interpolate(frame, [7.5 * fps, 8.3 * fps], ["-80px 0px", "0px 0px"], {
              ...clamp,
              easing: ease,
            }),
          },
          mid: {
            opacity: interpolate(frame, [9 * fps, 10 * fps], [0, 1], { ...clamp, easing: ease }),
          },
        }}
      />
      {/* 开场暗角 */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </SceneShell>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/photos";
import { BgLayer, FgLayer, MidLayer, ShadowLayer } from "../components/WebbIllustration";
import { ACCENT, FONT_SANS, INK, KeywordTag, OriginalInset, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

const PlaneLabel: React.FC<{ text: string; left: number; top: number; opacity: number }> = ({
  text,
  left,
  top,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      opacity,
      fontFamily: FONT_SANS,
      fontWeight: 700,
      fontSize: 64,
      color: PAPER_TEXT,
      background: ACCENT,
      padding: "6px 26px",
      borderRadius: 8,
    }}
  >
    {text}
  </div>
);

const PAPER_TEXT = "#1a1410";

/** 关键词二：层次 —— 插画拆成三张纸片在 3D 空间里分开，再合回去 */
export const LayersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0 = 合在一起，1 = 完全分开
  const split = interpolate(
    frame,
    [3 * fps, 6 * fps, 19 * fps, 22 * fps],
    [0, 1, 1, 0],
    { ...clamp, easing: ease },
  );
  const labels = interpolate(frame, [6 * fps, 7 * fps, 18.5 * fps, 19 * fps], [0, 1, 1, 0], clamp);
  const plane = (z: number): React.CSSProperties => ({
    transform: `translateZ(${z * split}px)`,
    outline: split > 0.02 ? `4px solid rgba(243,237,225,${0.7 * split})` : undefined,
  });

  return (
    <SceneShell id="layers">
      <AbsoluteFill style={{ perspective: 2200, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${1 - 0.3 * split}) rotateY(${-38 * split}deg) rotateX(${8 * split}deg)`,
          }}
        >
          <AbsoluteFill style={{ transformStyle: "preserve-3d", ...plane(-700) }}>
            <BgLayer />
            <ShadowLayer />
            <PlaneLabel text="背景" left={820} top={140} opacity={labels} />
          </AbsoluteFill>
          <AbsoluteFill style={{ transformStyle: "preserve-3d", ...plane(0) }}>
            <MidLayer />
            <PlaneLabel text="中景" left={1260} top={330} opacity={labels} />
          </AbsoluteFill>
          <AbsoluteFill style={{ transformStyle: "preserve-3d", ...plane(600) }}>
            <FgLayer />
            <PlaneLabel text="前景" left={330} top={380} opacity={labels} />
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      <KeywordTag index="关键词二" word="层次" en="LAYERS" />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 220,
          fontFamily: FONT_SANS,
          fontSize: 40,
          color: INK,
          opacity: interpolate(frame, [7 * fps, 8 * fps], [0, 1], { ...clamp, easing: ease }),
        }}
      >
        三件事，同时发生
      </div>
      <OriginalInset photo={PHOTOS.layers} fromSec={22} />
    </SceneShell>
  );
};

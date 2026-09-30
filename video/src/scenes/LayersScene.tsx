import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { StreetBg, StreetFg, StreetMid, StreetShadow } from "../components/Street";
import { ACCENT, FONT_SANS, clamp, ease } from "../components/ui";
import { PHOTOS } from "../data/photos";
import { KeywordFrame } from "./KeywordFrame";

const Tag: React.FC<{ text: string; left: number; top: number; opacity: number }> = ({ text, left, top, opacity }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      opacity,
      fontFamily: FONT_SANS,
      fontWeight: 700,
      fontSize: 64,
      color: "#1a1410",
      background: ACCENT,
      padding: "6px 28px",
      borderRadius: 10,
    }}
  >
    {text}
  </div>
);

/**
 * ② 层次：画面拆成三张纸片，在 3D 空间里转开、拉开距离，标出 背景 / 中景 / 前景，再合拢。
 */
export const LayersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const split = interpolate(frame, [0.6 * fps, 2.2 * fps, 4.4 * fps, 5.4 * fps], [0, 1, 1, 0], { ...clamp, easing: ease });
  const tags = interpolate(frame, [2 * fps, 2.4 * fps, 4.2 * fps, 4.5 * fps], [0, 1, 1, 0], clamp);
  const plane = (z: number): React.CSSProperties => ({
    transformStyle: "preserve-3d",
    transform: `translateZ(${z * split}px)`,
    outline: split > 0.02 ? `5px solid rgba(244,238,226,${0.8 * split})` : undefined,
  });

  return (
    <KeywordFrame id="layers" photo={PHOTOS.layers}>
      <AbsoluteFill style={{ perspective: 2400, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `translateX(${420 * split}px) translateY(${40 * split}px) scale(${1 - 0.42 * split}) rotateY(${-30 * split}deg) rotateX(${5 * split}deg)`,
          }}
        >
          <AbsoluteFill style={plane(-800)}>
            <StreetBg />
            <StreetShadow />
            <Tag text="背景" left={140} top={150} opacity={tags} />
          </AbsoluteFill>
          <AbsoluteFill style={plane(0)}>
            <StreetMid />
            <Tag text="中景" left={1180} top={560} opacity={tags} />
          </AbsoluteFill>
          <AbsoluteFill style={plane(700)}>
            <StreetFg />
            <Tag text="前景" left={330} top={700} opacity={tags} />
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    </KeywordFrame>
  );
};

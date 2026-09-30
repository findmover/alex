import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/photos";
import { PALETTE } from "../components/WebbIllustration";
import { FONT_SANS, INK, KeywordTag, PhotoOrIllustration, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

const SWATCHES = [
  { color: PALETTE.red, name: "红" },
  { color: PALETTE.yellow, name: "黄" },
  { color: PALETTE.blue, name: "蓝" },
  { color: PALETTE.black, name: "黑" },
];

/** 关键词一：热光 —— 从柔光低饱和过渡到硬光高饱和 */
export const LightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hard = interpolate(frame, [7 * fps, 11 * fps], [0, 1], { ...clamp, easing: ease });

  return (
    <SceneShell id="light">
      <PhotoOrIllustration
        photo={PHOTOS.light}
        // 只对示意插画调色；真实原作保持原貌，不做任何色彩改动
        style={PHOTOS.light.src ? undefined : {
          filter: `saturate(${0.35 + hard * 1.0}) contrast(${0.8 + hard * 0.35}) brightness(${0.95 + hard * 0.1})`,
        }}
        layers={{ shadow: { opacity: 0.18 + hard * 0.82 } }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 35%)" }}
      />
      <KeywordTag index="关键词一" word="热光" en="HOT LIGHT" />
      {/* 柔光 / 硬光 指示 */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 110,
          display: "flex",
          gap: 16,
          fontFamily: FONT_SANS,
          fontSize: 34,
          fontWeight: 700,
          color: INK,
        }}
      >
        <span style={{ opacity: 1 - hard * 0.6 }}>柔光</span>
        <span style={{ opacity: 0.6 }}>→</span>
        <span style={{ opacity: 0.4 + hard * 0.6 }}>硬光</span>
      </div>
      {/* 色板 */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 200,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {SWATCHES.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: interpolate(frame, [(13 + i * 0.6) * fps, (13.5 + i * 0.6) * fps], [0, 1], clamp),
              translate: interpolate(
                frame,
                [(13 + i * 0.6) * fps, (13.5 + i * 0.6) * fps],
                ["40px 0px", "0px 0px"],
                { ...clamp, easing: ease },
              ),
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                backgroundColor: s.color,
                border: `3px solid ${INK}`,
                borderRadius: 6,
              }}
            />
            <span style={{ fontFamily: FONT_SANS, fontSize: 36, fontWeight: 700, color: INK }}>{s.name}</span>
          </div>
        ))}
      </div>
    </SceneShell>
  );
};

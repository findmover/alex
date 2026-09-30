import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Street } from "../components/Street";
import { Beats, clamp, ease } from "../components/ui";

// 散落在桌上的黑白照片：位置、角度、落下时间
const PRINTS = [
  { x: -560, y: -170, r: -8, at: 0.1, crop: "translate(-6%, 2%) scale(1.3)" },
  { x: 420, y: -210, r: 6, at: 0.5, crop: "translate(8%, -4%) scale(1.5)" },
  { x: -120, y: 60, r: -3, at: 0.9, crop: "translate(0%, 0%) scale(1.1)" },
  { x: 560, y: 190, r: 10, at: 1.3, crop: "translate(-12%, 6%) scale(1.6)" },
  { x: -600, y: 250, r: 4, at: 1.7, crop: "translate(10%, -2%) scale(1.4)" },
];

/**
 * 第二幕 · 困境（8s，黑白）
 * 3D：一张张黑白照片从空中落到桌面上（俯视透视），随后整体暗下去 —— “不够打动人”。
 */
export const SouthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dull = interpolate(frame, [4 * fps, 7 * fps], [1, 0.45], clamp);
  const camera = interpolate(frame, [0, 8 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1a18", perspective: 1800, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${38 - camera * 8}deg) scale(${1.05 + camera * 0.08})`,
          filter: `grayscale(1) brightness(${dull})`,
        }}
      >
        {/* 桌面纹理 */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #3a3834 0%, #1b1a18 70%)" }} />
        {PRINTS.map((p, i) => {
          const t = interpolate(frame, [p.at * fps, p.at * fps + 14], [0, 1], { ...clamp, easing: ease });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 - 280 + p.x,
                top: 540 - 180 + p.y,
                width: 560,
                height: 360,
                padding: 18,
                background: "#e9e5dc",
                boxShadow: `0 ${30 * (1 - t) + 10}px ${60 * (1 - t) + 20}px rgba(0,0,0,0.6)`,
                opacity: t,
                transform: `translateZ(${(1 - t) * 700}px) rotate(${p.r + (1 - t) * 20}deg)`,
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: 1920, height: 1080, scale: 524 / 1920, transformOrigin: "0 0" }}>
                  <Street style={{ transform: p.crop, filter: "contrast(0.8)" }} />
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Beats id="south" />
    </AbsoluteFill>
  );
};

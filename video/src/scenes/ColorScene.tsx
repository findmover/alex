import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Street } from "../components/Street";
import { Beats, Photo, clamp, ease } from "../components/ui";
import { PHOTOS } from "../data/photos";

// 颜色最先渗出来的地方：阳光最硬的墙面和门框
const SEEDS = [
  { x: 42, y: 28 },
  { x: 40, y: 62 },
  { x: 76, y: 45 },
];

/**
 * 第四幕 · 发现颜色（10s）—— 全片视觉转折点
 * 0–4s：黑白画面里，颜色从高光处一点点渗出来
 * 4s：一下变成满屏彩色（闪白 + 轻微推镜）
 * 7s 起：原作完整出现（没有原作则停在彩色插画上慢推）
 */
export const ColorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seep = interpolate(frame, [0.5 * fps, 3.9 * fps], [0, 22], clamp);
  const snap = frame >= 4 * fps;
  const flash = interpolate(frame, [4 * fps, 4 * fps + 10], [0.55, 0], clamp);
  const punch = interpolate(frame, [4 * fps, 4 * fps + 18], [1.06, 1], { ...clamp, easing: ease });
  const photoIn = interpolate(frame, [7 * fps, 7.4 * fps], [0, 1], clamp);
  const drift = interpolate(frame, [0, 10 * fps], [1.12, 1.0], clamp);

  const mask = SEEDS.map((s) => `radial-gradient(circle at ${s.x}% ${s.y}%, black ${seep}%, transparent ${seep + 8}%)`).join(", ");

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: snap ? punch : drift }}>
        <Street style={{ filter: "grayscale(1)" }} />
        <AbsoluteFill style={snap ? undefined : { WebkitMaskImage: mask, maskImage: mask }}>
          <Street />
        </AbsoluteFill>
      </AbsoluteFill>
      {PHOTOS.reveal.src ? (
        <AbsoluteFill style={{ opacity: photoIn }}>
          <Photo photo={PHOTOS.reveal} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
      <Beats id="color" />
    </AbsoluteFill>
  );
};

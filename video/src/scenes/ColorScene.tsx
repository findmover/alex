import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Beats, Caption, WorkView, clamp, ease } from "../components/ui";
import { WORKS } from "../data/photos";

// 颜色最先“渗”出来的地方：红墙与门（作品坐标 %）
const SEEDS = [
  { x: 30, y: 38 },
  { x: 86, y: 40 },
];

/**
 * 第四幕 · 发现颜色（10s）—— 全片视觉转折点，也是唯一一次改变原作外观：
 * Port-au-Prince, Haiti, 1979 先以黑白出现，颜色从红墙处渗出，4 秒时整张回到原色（闪白 + 推镜），
 * 之后原作完整停留、不加大字。
 */
export const ColorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seep = interpolate(frame, [0.6 * fps, 3.8 * fps], [0, 26], clamp);
  const snap = frame >= 3.8 * fps;
  const flash = interpolate(frame, [3.8 * fps, 3.8 * fps + 10], [0.6, 0], clamp);
  const punch = interpolate(frame, [3.8 * fps, 3.8 * fps + 20], [1.07, 1], { ...clamp, easing: ease });
  const drift = interpolate(frame, [0, 3.8 * fps], [1.1, 1.07], clamp);
  const mask = SEEDS.map((s) => `radial-gradient(circle at ${s.x}% ${s.y}%, black ${seep}%, transparent ${seep + 10}%)`).join(", ");
  const work = WORKS.haitiRedWall;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: snap ? punch : drift }}>
        <WorkView work={work} push={[1, 1]} caption={false} imgStyle={snap ? undefined : { filter: "grayscale(1)" }}>
          {snap ? null : (
            <Img
              src={staticFile(work.file)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", WebkitMaskImage: mask, maskImage: mask }}
            />
          )}
        </WorkView>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
      <Beats id="color" />
      {snap ? (
        <AbsoluteFill style={{ opacity: interpolate(frame, [6.8 * fps, 7.3 * fps], [0, 1], clamp) }}>
          <Caption work={work} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

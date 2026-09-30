import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Atmosphere, Caption, Dust, PhotoPlane, Stage, Verses, beat, clamp, easeCam, fitWidth } from "../components/ui";
import { WORKS } from "../data/photos";

// 颜色最先“烧”出来的地方：红墙与右侧红门（作品坐标 %）
const SEEDS = [
  { x: 30, y: 40, delay: 0 },
  { x: 86, y: 42, delay: 0.25 },
];

/**
 * 光 · Port-au-Prince, Haiti, 1979（12 拍）—— 全片唯一的“惊艳时刻”，也是唯一改变原作外观的地方。
 * 原作悬在黑暗里，先是黑白，贴得很近；镜头缓缓后拉，颜色从红墙里烧出来，蔓延到整张；
 * 峰值处一层暖光溢出，随即退去，原作以原貌停留。
 */
export const Light: React.FC = () => {
  const frame = useCurrentFrame();
  const work = WORKS.haitiRedWall;
  const fw = fitWidth(work);
  const pull = interpolate(frame, [0, beat(8)], [0, 1], { ...clamp, easing: easeCam });
  const burn = interpolate(frame, [beat(2), beat(6.2)], [0, 1], clamp);
  const bloom = interpolate(frame, [beat(5), beat(6), beat(7.4)], [0, 0.55, 0], clamp);
  const done = frame >= beat(6.4);
  const mask = SEEDS.map((s) => {
    const r = Math.max(0, burn - s.delay) * 150;
    return `radial-gradient(circle at ${s.x}% ${s.y}%, black ${r}%, transparent ${r + 14}%)`;
  }).join(", ");

  return (
    <AbsoluteFill style={{ backgroundColor: "#070605" }}>
      <Stage perspective={1800} camera={`translateZ(${420 * (1 - pull)}px) rotateY(${7 * (1 - pull)}deg) translateX(${-120 * (1 - pull)}px)`}>
        <PhotoPlane work={work} w={fw} imgStyle={done ? undefined : { filter: "grayscale(1)" }}>
          {done ? null : (
            <Img
              src={staticFile(work.file)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", WebkitMaskImage: mask, maskImage: mask }}
            />
          )}
        </PhotoPlane>
      </Stage>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 60% 60% at 35% 42%, rgba(255,120,60,1), rgba(255,80,30,0) 70%)",
          mixBlendMode: "screen",
          opacity: bloom,
        }}
      />
      <AbsoluteFill style={{ opacity: interpolate(frame, [beat(8), beat(8.6)], [0, 1], clamp) }}>
        <Caption work={work} />
      </AbsoluteFill>
      <Dust seed="light" count={60} opacity={interpolate(frame, [beat(3), beat(6)], [0.4, 1], clamp)} />
      <Atmosphere />
      <Verses id="light" />
    </AbsoluteFill>
  );
};

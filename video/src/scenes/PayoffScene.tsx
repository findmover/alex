import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ContactSheet } from "../components/ContactSheet";
import { Beats, PhotoCard, clamp, ease } from "../components/ui";
import { WORKS } from "../data/photos";

// 三个关键词的三张作品，从三个方向飞来，在 3D 空间里叠成一摞
const CARDS = [
  { work: WORKS.leonBox, from: [-1100, -380, -900], rot: [-30, 18, -14] },
  { work: WORKS.tehuantepec, from: [1100, -300, -700], rot: [24, -14, 10] },
  { work: WORKS.istanbulShip, from: [0, 700, -500], rot: [-8, 30, -4] },
];

/**
 * 第六幕 · 回扣 99%（11s）
 * 0–3.4s：热光、层次、边缘三张作品在 3D 里飞到一起 —— “同一瞬间刚好对上”
 * 3.4–7s：回到开场的印样（自绘示意），格子一格格变灰 —— “99% 都是失败”
 * 7–11s：红笔圈出唯一一格，推进到满屏
 */
export const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merge = interpolate(frame, [0.1 * fps, 2.2 * fps], [0, 1], { ...clamp, easing: ease });
  const toSheet = interpolate(frame, [3.2 * fps, 3.6 * fps], [0, 1], clamp);
  const fail = interpolate(frame, [3.6 * fps, 6.8 * fps], [0, 1], clamp);
  const circle = interpolate(frame, [7.2 * fps, 8.1 * fps], [0, 1], { ...clamp, easing: ease });
  const zoom = interpolate(frame, [9 * fps, 10.6 * fps], [0, 1], { ...clamp, easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <AbsoluteFill style={{ perspective: 2000, justifyContent: "center", alignItems: "center", opacity: 1 - toSheet }}>
        <div style={{ position: "relative", width: 0, height: 0, transformStyle: "preserve-3d", transform: "translateY(-70px)" }}>
          {CARDS.map((c, i) => {
            const k = 1 - merge;
            return (
              <PhotoCard
                key={c.work.id}
                work={c.work}
                w={720}
                style={{
                  left: -374,
                  top: -255,
                  transform: `translate3d(${c.from[0] * k + (i - 1) * 26}px, ${c.from[1] * k + (i - 1) * 18}px, ${c.from[2] * k + i * 4}px) rotateY(${c.rot[0] * k}deg) rotateX(${c.rot[1] * k}deg) rotateZ(${c.rot[2] * k + (i - 1) * 3}deg)`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toSheet }}>
        <ContactSheet fail={fail} circle={circle} zoom={zoom} />
      </AbsoluteFill>
      <Beats id="payoff" />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ContactSheet } from "../components/ContactSheet";
import { Street } from "../components/Street";
import { Beats, Photo, clamp, ease } from "../components/ui";
import { PHOTOS } from "../data/photos";

// 三张小卡代表三个关键词，从三个方向飞来，在 3D 空间里叠成一张
const CARDS = [
  { from: [-900, -300, -600], rot: -24, layers: { mid: { opacity: 0 }, fg: { opacity: 0 } } },
  { from: [900, -260, -500], rot: 20, layers: { bg: { opacity: 0.25 }, shadow: { opacity: 0.25 } } },
  { from: [0, 520, -700], rot: -8, layers: {} },
];

/**
 * 第六幕 · 回扣 99%（14s）
 * 0–4s：三张关键词小卡在 3D 空间里飞到一起、叠成一张 —— “同一瞬间刚好对上”
 * 4–8s：回到印样，这次是彩色的，格子一格格变灰 —— “99% 都是失败”
 * 8–14s：红笔圈出唯一的一格，推进到满屏 —— “等那 1%”
 */
export const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merge = interpolate(frame, [0.2 * fps, 2.6 * fps], [0, 1], { ...clamp, easing: ease });
  const toSheet = interpolate(frame, [3.8 * fps, 4.2 * fps], [0, 1], clamp);
  const fail = interpolate(frame, [4.3 * fps, 7.6 * fps], [0, 1], clamp);
  const circle = interpolate(frame, [8.4 * fps, 9.4 * fps], [0, 1], { ...clamp, easing: ease });
  const zoom = interpolate(frame, [10.4 * fps, 12 * fps], [0, 1], { ...clamp, easing: ease });
  const photoIn = interpolate(frame, [11.8 * fps, 12.2 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <AbsoluteFill style={{ perspective: 2200, justifyContent: "center", alignItems: "center", opacity: 1 - toSheet }}>
        {CARDS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 960,
              height: 540,
              overflow: "hidden",
              border: "6px solid #f4eee2",
              boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
              transform: `translate3d(${c.from[0] * (1 - merge)}px, ${c.from[1] * (1 - merge) - 60}px, ${c.from[2] * (1 - merge)}px) rotateY(${c.rot * (1 - merge)}deg) rotateZ(${c.rot * 0.3 * (1 - merge)}deg)`,
            }}
          >
            <div style={{ width: 1920, height: 1080, scale: 0.5, transformOrigin: "0 0" }}>
              <Street layers={c.layers} />
            </div>
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toSheet }}>
        <ContactSheet fail={fail} circle={circle} zoom={zoom} />
      </AbsoluteFill>
      {PHOTOS.reveal.src ? (
        <AbsoluteFill style={{ opacity: photoIn }}>
          <Photo photo={PHOTOS.reveal} />
        </AbsoluteFill>
      ) : null}
      <Beats id="payoff" />
    </AbsoluteFill>
  );
};

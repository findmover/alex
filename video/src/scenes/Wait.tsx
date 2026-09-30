import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DarkRoom, Lightbox, chosenOffset, lerp } from "../components/Lightbox";
import { Atmosphere, Chapter, Dust, Stage, Verses, beat, clamp, easeCam } from "../components/ui";
import { WORKS } from "../data/photos";

/**
 * 等 · 99%（12 拍）—— 回到序幕的灯箱（首尾呼应）。
 * 镜头以低角度沿灯箱平移，底片一格格熄灭；红色油性笔圈出唯一一格；镜头缓缓推近。
 */
export const Wait: React.FC = () => {
  const frame = useCurrentFrame();
  const off = chosenOffset();
  const pan = interpolate(frame, [0, beat(8)], [0, 1], { ...clamp, easing: easeCam });
  const push = interpolate(frame, [beat(8), beat(12)], [0, 1], { ...clamp, easing: easeCam });
  const fail = interpolate(frame, [beat(0.6), beat(6)], [0, 1], clamp);
  const circle = interpolate(frame, [beat(6.4), beat(7.6)], [0, 1], { ...clamp, easing: easeCam });
  const s = lerp(0.8, 1.9, push);
  const a = lerp(62, 40, push);
  const rz = lerp(-10, -2, pan);
  const tx = lerp(lerp(700, -off.x + 120, pan), -off.x, push);
  const ty = lerp(lerp(-200, -off.y, pan), -off.y, push);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <DarkRoom />
      <Stage perspective={1300} camera={`scale(${s}) rotateX(${a}deg) rotateZ(${rz}deg) translate(${tx}px, ${ty}px)`}>
        <Lightbox fail={fail} circle={circle} chosen={WORKS.maderoPool} glow={interpolate(frame, [beat(5), beat(7)], [0, 1], clamp)} />
      </Stage>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)" }} />
      <Chapter glyph="等" en="WAITING" />
      <Dust seed="wait" count={50} />
      <Atmosphere />
      <Verses id="wait" />
    </AbsoluteFill>
  );
};

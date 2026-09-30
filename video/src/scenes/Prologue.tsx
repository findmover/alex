import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CELL_H, DarkRoom, Lightbox, chosenOffset, lerp } from "../components/Lightbox";
import { Atmosphere, Caption, Dust, PhotoPlane, Stage, Verses, beat, clamp, fitWidth, useBeatT } from "../components/ui";
import { WORKS } from "../data/photos";

/**
 * 序 · 99%（8 拍）
 * 第 0 帧：暗房灯箱上的印样（失败的底片）+ 引语大字。底片一格格熄灭，只剩一格亮着；
 * 镜头俯冲进这一格 —— 匹配剪辑 —— 满屏原作 Ciudad Madero, 1983。
 */
export const Prologue: React.FC = () => {
  const frame = useCurrentFrame();
  const work = WORKS.maderoPool;
  const fw = fitWidth(work);
  const glide = interpolate(frame, [0, beat(4.8)], [0, 1], clamp);
  const fail = interpolate(frame, [beat(0.4), beat(4.4)], [0, 1], clamp);
  const dive = useBeatT(4.8, 6);
  const off = chosenOffset();
  const endScale = 1080 / CELL_H; // 让选中格的高度正好等于画面高度，与全屏原作重合
  const s = lerp(0.72, endScale, dive * dive);
  const a = lerp(54, 0, dive);
  const tx = lerp(lerp(240, -60, glide), -off.x, dive);
  const ty = lerp(lerp(120, 40, glide), -off.y, dive);
  const cut = frame >= beat(6);
  const dim = interpolate(frame, [beat(4.4), beat(5)], [0.42, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      {!cut ? (
        <>
          <DarkRoom />
          <Stage perspective={1400} camera={`scale(${s}) rotateX(${a}deg) translate(${tx}px, ${ty}px)`}>
            <Lightbox fail={fail} circle={0} chosen={work} glow={interpolate(frame, [beat(3), beat(4.5)], [0, 1], clamp)} />
          </Stage>
          <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})` }} />
        </>
      ) : (
        <Stage perspective={2000} camera={`scale(${interpolate(frame, [beat(6), beat(8)], [1, 1.035], clamp)})`}>
          <PhotoPlane work={work} w={fw} />
        </Stage>
      )}
      {cut ? <Caption work={work} /> : null}
      <Dust seed="pro" count={50} opacity={0.7} />
      <Atmosphere />
      <Verses id="prologue" />
    </AbsoluteFill>
  );
};

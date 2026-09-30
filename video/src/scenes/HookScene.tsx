import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ContactSheet } from "../components/ContactSheet";
import { Beats, WorkView, clamp, ease } from "../components/ui";
import { WORKS } from "../data/photos";

/**
 * 第一幕 · 钩子（8s）
 * 第 0 帧：满屏彩色印样（自绘示意）+ 大字引语；格子一格格变灰，只剩一格；
 * 推进这一格 → 真正的“1%”：Ciudad Madero, Mexico, 1983（跃在半空的女孩）。
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fail = interpolate(frame, [0.3 * fps, 4 * fps], [0, 1], clamp);
  const zoom = interpolate(frame, [4.3 * fps, 5.2 * fps], [0, 1], { ...clamp, easing: ease });
  const dim = interpolate(frame, [4.2 * fps, 4.8 * fps], [0.32, 0], clamp);
  const photoIn = interpolate(frame, [5.05 * fps, 5.35 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <ContactSheet fail={fail} circle={0} zoom={zoom} />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})` }} />
      <AbsoluteFill style={{ opacity: photoIn }}>
        <WorkView work={WORKS.maderoPool} push={[1.06, 1]} />
      </AbsoluteFill>
      <Beats id="hook" instantFirst />
    </AbsoluteFill>
  );
};

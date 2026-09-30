import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ContactSheet } from "../components/ContactSheet";
import { Beats, Photo, clamp, ease } from "../components/ui";
import { PHOTOS } from "../data/photos";

/**
 * 第一幕 · 钩子（8s）
 * 第 0 帧就是满屏彩色印样 + 大字引语；格子一格格变灰；
 * 只剩一格亮着 → 推进占满全屏 → 剩下的 1%。
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fail = interpolate(frame, [0.3 * fps, 4.2 * fps], [0, 1], clamp);
  const zoom = interpolate(frame, [4.5 * fps, 5.4 * fps], [0, 1], { ...clamp, easing: ease });
  const dim = interpolate(frame, [4.4 * fps, 5 * fps], [0.32, 0], clamp);
  const photoIn = interpolate(frame, [5.3 * fps, 5.6 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <ContactSheet fail={fail} circle={0} zoom={zoom} />
      {PHOTOS.reveal.src ? (
        <AbsoluteFill style={{ opacity: photoIn }}>
          <Photo photo={PHOTOS.reveal} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})` }} />
      <Beats id="hook" instantFirst />
    </AbsoluteFill>
  );
};

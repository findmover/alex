import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PhotoSlot } from "../data/photos";
import { SceneId } from "../data/script";
import { Beats, Photo, clamp } from "../components/ui";

/**
 * 关键词幕的通用骨架：前 5.5 秒用自绘示意动画讲原理（带字），
 * 之后如果有原作，切到原作完整停留、不加字，让观众自己看。
 */
export const KeywordFrame: React.FC<{
  id: SceneId;
  photo: PhotoSlot;
  accent?: string;
  children: React.ReactNode;
}> = ({ id, photo, accent, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photoIn = interpolate(frame, [5.5 * fps, 5.8 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      {children}
      {photo.src ? (
        <AbsoluteFill style={{ opacity: photoIn }}>
          <Photo photo={photo} />
        </AbsoluteFill>
      ) : null}
      <Beats id={id} accent={accent} position="left" />
    </AbsoluteFill>
  );
};

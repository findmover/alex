import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneId, getScene } from "../data/script";
import { PAPER, Subtitles, Voiceover } from "../components/ui";

/** 每一幕的外壳：统一背景、字幕与配音 */
export const SceneShell: React.FC<{ id: SceneId; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const scene = getScene(id);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      {children}
      <Subtitles scene={scene} />
      <Voiceover scene={scene} />
    </AbsoluteFill>
  );
};

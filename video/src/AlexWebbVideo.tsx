import React from "react";
import { Series, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { sceneFrames } from "./data/script";
import { AIGC } from "./data/aigc";
import { Prologue } from "./scenes/Prologue";
import { Grey } from "./scenes/Grey";
import { Light } from "./scenes/Light";
import { Shadow } from "./scenes/Shadow";
import { Layers } from "./scenes/Layers";
import { Edge } from "./scenes/Edge";
import { Wait } from "./scenes/Wait";
import { Corridor } from "./scenes/Corridor";
import { Finale } from "./scenes/Finale";

/**
 * 《等光》v5 —— 抖音 16:9，约 82 秒。72 BPM，所有切点落在拍上（1 拍 = 25 帧）。
 * 全部硬切；唯一的匹配剪辑在序幕（亮着的一格 → 原作）。
 */
export const AlexWebbVideo: React.FC = () => (
  <>
    <Series>
      <Series.Sequence name="序 · 99%" durationInFrames={sceneFrames("prologue")}>
        <Prologue />
      </Series.Sequence>
      <Series.Sequence name="灰 · 1975" durationInFrames={sceneFrames("grey")}>
        <Grey />
      </Series.Sequence>
      <Series.Sequence name="光 · 海地 1979" durationInFrames={sceneFrames("light")}>
        <Light />
      </Series.Sequence>
      <Series.Sequence name="影 · León 1987" durationInFrames={sceneFrames("shadow")}>
        <Shadow />
      </Series.Sequence>
      <Series.Sequence name="层 · Tehuantepec 1985" durationInFrames={sceneFrames("layers")}>
        <Layers />
      </Series.Sequence>
      <Series.Sequence name="边 · Istanbul 2004" durationInFrames={sceneFrames("edge")}>
        <Edge />
      </Series.Sequence>
      <Series.Sequence name="等 · 99%" durationInFrames={sceneFrames("wait")}>
        <Wait />
      </Series.Sequence>
      <Series.Sequence name="廊 · 1%" durationInFrames={sceneFrames("corridor")}>
        <Corridor />
      </Series.Sequence>
      <Series.Sequence name="终 · 等光" durationInFrames={sceneFrames("finale")}>
        <Finale />
      </Series.Sequence>
    </Series>
    {AIGC.music.src ? <Audio src={staticFile(AIGC.music.src)} /> : null}
  </>
);

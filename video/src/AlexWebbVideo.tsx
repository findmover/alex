import React from "react";
import { Series } from "remotion";
import { sceneFrames } from "./data/script";
import { HookScene } from "./scenes/HookScene";
import { SouthScene } from "./scenes/SouthScene";
import { HaitiScene } from "./scenes/HaitiScene";
import { ColorScene } from "./scenes/ColorScene";
import { LightScene } from "./scenes/LightScene";
import { LayersScene } from "./scenes/LayersScene";
import { EdgesScene } from "./scenes/EdgesScene";
import { PayoffScene } from "./scenes/PayoffScene";
import { GalleryScene } from "./scenes/GalleryScene";
import { OutroScene } from "./scenes/OutroScene";

/**
 * 成片：抖音 16:9，约 80 秒，全部硬切（短视频节奏，不用淡入淡出）。
 * 每幕时长来自 src/data/script.ts。
 */
export const AlexWebbVideo: React.FC = () => (
  <Series>
    <Series.Sequence name="1 钩子 99%" durationInFrames={sceneFrames("hook")}>
      <HookScene />
    </Series.Sequence>
    <Series.Sequence name="2 困境 黑白" durationInFrames={sceneFrames("south")}>
      <SouthScene />
    </Series.Sequence>
    <Series.Sequence name="3 转折 海地" durationInFrames={sceneFrames("haiti")}>
      <HaitiScene />
    </Series.Sequence>
    <Series.Sequence name="4 发现颜色" durationInFrames={sceneFrames("color")}>
      <ColorScene />
    </Series.Sequence>
    <Series.Sequence name="5a 热光" durationInFrames={sceneFrames("light")}>
      <LightScene />
    </Series.Sequence>
    <Series.Sequence name="5b 层次" durationInFrames={sceneFrames("layers")}>
      <LayersScene />
    </Series.Sequence>
    <Series.Sequence name="5c 边缘" durationInFrames={sceneFrames("edges")}>
      <EdgesScene />
    </Series.Sequence>
    <Series.Sequence name="6 回扣 99%" durationInFrames={sceneFrames("payoff")}>
      <PayoffScene />
    </Series.Sequence>
    <Series.Sequence name="7 他等到的 1%" durationInFrames={sceneFrames("gallery")}>
      <GalleryScene />
    </Series.Sequence>
    <Series.Sequence name="8 结尾" durationInFrames={sceneFrames("outro")}>
      <OutroScene />
    </Series.Sequence>
  </Series>
);

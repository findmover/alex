import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TRANSITION_FRAMES, getScene, sceneFrames } from "./data/script";
import { HookScene } from "./scenes/HookScene";
import { TitleScene } from "./scenes/TitleScene";
import { WhoScene } from "./scenes/WhoScene";
import { LightScene } from "./scenes/LightScene";
import { LayersScene } from "./scenes/LayersScene";
import { GridScene } from "./scenes/GridScene";
import { EdgesScene } from "./scenes/EdgesScene";
import { MethodScene } from "./scenes/MethodScene";
import { HowToScene } from "./scenes/HowToScene";
import { OutroScene } from "./scenes/OutroScene";

const Fade = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/**
 * 完整成片。每幕时长来自 src/data/script.ts —— 改时长请改那里，
 * 这样字幕切分、总时长、审查文档会一起更新。
 */
export const AlexWebbVideo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="01 开场" durationInFrames={sceneFrames(getScene("hook"))}>
      <HookScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="02 片名" durationInFrames={sceneFrames(getScene("title"))}>
      <TitleScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="03 他是谁" durationInFrames={sceneFrames(getScene("who"))}>
      <WhoScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="04 热光" durationInFrames={sceneFrames(getScene("light"))}>
      <LightScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="05 层次" durationInFrames={sceneFrames(getScene("layers"))}>
      <LayersScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="06 分割" durationInFrames={sceneFrames(getScene("grid"))}>
      <GridScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="07 边缘" durationInFrames={sceneFrames(getScene("edges"))}>
      <EdgesScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="08 行走与等待" durationInFrames={sceneFrames(getScene("method"))}>
      <MethodScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="09 三步看图" durationInFrames={sceneFrames(getScene("howto"))}>
      <HowToScene />
    </TransitionSeries.Sequence>
    <Fade />
    <TransitionSeries.Sequence name="10 结尾" durationInFrames={sceneFrames(getScene("outro"))}>
      <OutroScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

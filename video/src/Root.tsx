import "./index.css";
import { Composition, Folder } from "remotion";
import { AlexWebbVideo } from "./AlexWebbVideo";
import { FPS, HEIGHT, WIDTH, sceneFrames, totalFrames } from "./data/script";
import { HookScene } from "./scenes/HookScene";
import { SouthScene } from "./scenes/SouthScene";
import { HaitiScene } from "./scenes/HaitiScene";
import { ColorScene } from "./scenes/ColorScene";
import { LightScene } from "./scenes/LightScene";
import { LayersScene } from "./scenes/LayersScene";
import { EdgesScene } from "./scenes/EdgesScene";
import { PayoffScene } from "./scenes/PayoffScene";
import { OutroScene } from "./scenes/OutroScene";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AlexWebb" component={AlexWebbVideo} durationInFrames={totalFrames()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="Scenes">
      <Composition id="S1-Hook" component={HookScene} durationInFrames={sceneFrames("hook")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S2-South" component={SouthScene} durationInFrames={sceneFrames("south")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S3-Haiti" component={HaitiScene} durationInFrames={sceneFrames("haiti")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S4-Color" component={ColorScene} durationInFrames={sceneFrames("color")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S5a-Light" component={LightScene} durationInFrames={sceneFrames("light")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S5b-Layers" component={LayersScene} durationInFrames={sceneFrames("layers")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S5c-Edges" component={EdgesScene} durationInFrames={sceneFrames("edges")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S6-Payoff" component={PayoffScene} durationInFrames={sceneFrames("payoff")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S7-Outro" component={OutroScene} durationInFrames={sceneFrames("outro")} fps={FPS} width={WIDTH} height={HEIGHT} />
    </Folder>
  </>
);

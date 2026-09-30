import "./index.css";
import { Composition, Folder } from "remotion";
import { AlexWebbVideo } from "./AlexWebbVideo";
import { FPS, getScene, sceneFrames, totalFrames } from "./data/script";
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AlexWebb"
        component={AlexWebbVideo}
        durationInFrames={totalFrames()}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition id="S01-Hook" component={HookScene} durationInFrames={sceneFrames(getScene("hook"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S02-Title" component={TitleScene} durationInFrames={sceneFrames(getScene("title"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S03-Who" component={WhoScene} durationInFrames={sceneFrames(getScene("who"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S04-Light" component={LightScene} durationInFrames={sceneFrames(getScene("light"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S05-Layers" component={LayersScene} durationInFrames={sceneFrames(getScene("layers"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S06-Grid" component={GridScene} durationInFrames={sceneFrames(getScene("grid"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S07-Edges" component={EdgesScene} durationInFrames={sceneFrames(getScene("edges"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S08-Method" component={MethodScene} durationInFrames={sceneFrames(getScene("method"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S09-HowTo" component={HowToScene} durationInFrames={sceneFrames(getScene("howto"))} fps={FPS} width={1920} height={1080} />
        <Composition id="S10-Outro" component={OutroScene} durationInFrames={sceneFrames(getScene("outro"))} fps={FPS} width={1920} height={1080} />
      </Folder>
    </>
  );
};

import "./index.css";
import { Composition, Folder, Still } from "remotion";
import { AlexWebbVideo } from "./AlexWebbVideo";
import { FPS, HEIGHT, WIDTH, sceneFrames, totalFrames } from "./data/script";
import { Prologue } from "./scenes/Prologue";
import { Grey } from "./scenes/Grey";
import { Light } from "./scenes/Light";
import { Shadow } from "./scenes/Shadow";
import { Layers } from "./scenes/Layers";
import { Edge } from "./scenes/Edge";
import { Wait } from "./scenes/Wait";
import { Corridor } from "./scenes/Corridor";
import { Finale } from "./scenes/Finale";
import { Cover } from "./scenes/Cover";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AlexWebb" component={AlexWebbVideo} durationInFrames={totalFrames()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="Scenes">
      <Composition id="S1-Prologue" component={Prologue} durationInFrames={sceneFrames("prologue")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S2-Grey" component={Grey} durationInFrames={sceneFrames("grey")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S3-Light" component={Light} durationInFrames={sceneFrames("light")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S4-Shadow" component={Shadow} durationInFrames={sceneFrames("shadow")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S5-Layers" component={Layers} durationInFrames={sceneFrames("layers")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S6-Edge" component={Edge} durationInFrames={sceneFrames("edge")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S7-Wait" component={Wait} durationInFrames={sceneFrames("wait")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S8-Corridor" component={Corridor} durationInFrames={sceneFrames("corridor")} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="S9-Finale" component={Finale} durationInFrames={sceneFrames("finale")} fps={FPS} width={WIDTH} height={HEIGHT} />
    </Folder>
    <Folder name="Covers">
      <Still id="Cover-Portrait" component={Cover} width={1080} height={1440} defaultProps={{ layout: "portrait" as const }} />
      <Still id="Cover-Landscape" component={Cover} width={1920} height={1080} defaultProps={{ layout: "landscape" as const }} />
    </Folder>
  </>
);

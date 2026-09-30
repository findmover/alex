/**
 * 《等光》v5 —— 屏幕文字与节奏的唯一数据源（对应 docs/04-创意方案-等光.md）。
 * 横屏 1920×1080 · 30fps · 72 BPM：1 拍 = 25 帧。每幕时长用“拍”表示。
 * 文字里 [[ ]] 包住的部分用强调色。
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const BEAT = 25; // 72 BPM @ 30fps

export type Verse = {
  /** 相对本幕开始的拍数 */
  from: number;
  to: number;
  lines: string[];
  /** 文字锚点（画面百分比） */
  x: number;
  y: number;
  align?: "left" | "center" | "right";
  size?: "xl" | "l" | "m" | "s" | "caps";
};

export type SceneId =
  | "prologue"
  | "grey"
  | "light"
  | "shadow"
  | "layers"
  | "edge"
  | "wait"
  | "corridor"
  | "finale";

export type SceneScript = { id: SceneId; title: string; beats: number; verses: Verse[] };

export const SCRIPT: SceneScript[] = [
  {
    id: "prologue",
    title: "序 · 99%",
    beats: 8,
    verses: [
      { from: 0, to: 4.6, lines: ["“这种摄影，", "[[99%]] 都是失败。”"], x: 50, y: 44, align: "center", size: "xl" },
      { from: 1.8, to: 4.6, lines: ["ALEX WEBB"], x: 50, y: 66, align: "center", size: "caps" },
      { from: 5.6, to: 8, lines: ["剩下的 1%，是[[光]]。"], x: 8, y: 80, align: "left", size: "l" },
    ],
  },
  {
    id: "grey",
    title: "灰 · 1975",
    beats: 16,
    verses: [
      { from: 0.4, to: 3.8, lines: ["1975，美国南方。"], x: 10, y: 70, align: "left", size: "l" },
      { from: 4, to: 7.6, lines: ["他拍黑白，", "世界是灰的。"], x: 10, y: 66, align: "left", size: "l" },
      { from: 8, to: 12, lines: ["一本写海地的小说，", "让他害怕，又着迷。"], x: 90, y: 66, align: "right", size: "l" },
      { from: 12.4, to: 16, lines: ["他往南走。"], x: 50, y: 50, align: "center", size: "l" },
    ],
  },
  {
    id: "light",
    title: "光 · Port-au-Prince 1979",
    beats: 12,
    verses: [
      { from: 0.6, to: 4.4, lines: ["那里的光，是[[有温度的]]。"], x: 8, y: 82, align: "left", size: "l" },
      { from: 6, to: 9.6, lines: ["黑白，装不下它。"], x: 8, y: 82, align: "left", size: "l" },
    ],
  },
  {
    id: "shadow",
    title: "影 · León 1987",
    beats: 10,
    verses: [{ from: 1.2, to: 7.2, lines: ["影子不是暗处，", "是[[形状]]。"], x: 8, y: 76, align: "left", size: "l" }],
  },
  {
    id: "layers",
    title: "层 · Tehuantepec 1985",
    beats: 12,
    verses: [{ from: 1.2, to: 8.8, lines: ["一个画面里，", "三个故事同时发生。"], x: 8, y: 20, align: "left", size: "l" }],
  },
  {
    id: "edge",
    title: "边 · Istanbul 2004",
    beats: 10,
    verses: [{ from: 1, to: 8.4, lines: ["画框之外，", "世界还在继续。"], x: 8, y: 13, align: "left", size: "l" }],
  },
  {
    id: "wait",
    title: "等 · 99%",
    beats: 12,
    verses: [
      { from: 0.6, to: 5, lines: ["他走。", "他等。"], x: 10, y: 70, align: "left", size: "l" },
      { from: 5.6, to: 11.6, lines: ["复杂与混乱之间，", "只隔[[一瞬]]。"], x: 10, y: 70, align: "left", size: "l" },
    ],
  },
  {
    id: "corridor",
    title: "廊 · 1%",
    beats: 10,
    verses: [{ from: 0.6, to: 5, lines: ["这 1%，", "是他四十多年的街头。"], x: 50, y: 50, align: "center", size: "l" }],
  },
  {
    id: "finale",
    title: "终 · 等光",
    beats: 8,
    verses: [
      { from: 3.4, to: 8, lines: ["WAITING FOR LIGHT  ·  ALEX WEBB, b.1952"], x: 50, y: 62, align: "center", size: "caps" },
      {
        from: 4.6,
        to: 8,
        lines: ["延伸阅读《The Suffering of Light》 · 摄影作品 © Alex Webb / Magnum Photos · 部分空镜为 AI 生成"],
        x: 50,
        y: 92,
        align: "center",
        size: "s",
      },
    ],
  },
];

export const getScene = (id: SceneId): SceneScript => {
  const s = SCRIPT.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

export const sceneFrames = (id: SceneId) => getScene(id).beats * BEAT;
export const totalFrames = () => SCRIPT.reduce((sum, s) => sum + s.beats * BEAT, 0);

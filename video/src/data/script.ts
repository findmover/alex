/**
 * 抖音版脚本（v3）—— 屏幕文字的唯一数据源。
 * 横屏 16:9 · 1920×1080 · 30fps · 约 80 秒（v2：原作为主） · 无配音。
 * 文字里用 [[ ]] 包住的部分会用高亮色显示。
 * 与 docs/02-脚本.md 的分镜表一一对应；改文案请两边一起改。
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type Beat = {
  /** 相对本幕开始的秒数 */
  from: number;
  to: number;
  lines: string[];
  /** 小字 / 署名样式 */
  small?: boolean;
  /** 覆盖本幕默认的文字位置 */
  position?: "center" | "bottom" | "left" | "top";
};

export type SceneId =
  | "hook"
  | "south"
  | "haiti"
  | "color"
  | "light"
  | "layers"
  | "edges"
  | "payoff"
  | "gallery"
  | "outro";

export type SceneScript = {
  id: SceneId;
  title: string;
  seconds: number;
  beats: Beat[];
};

export const SCRIPT: SceneScript[] = [
  {
    id: "hook",
    title: "第一幕 · 钩子",
    seconds: 8,
    beats: [
      { from: 0, to: 4.6, lines: ["“这种摄影，", "[[99%]] 都是失败。”"], position: "center" },
      { from: 2.4, to: 4.6, lines: ["—— Alex Webb，[[玛格南]]摄影师"], small: true, position: "center" },
      { from: 6, to: 8, lines: ["可剩下的 1%，让他成了[[美国彩色摄影]]的先驱"], small: true },
    ],
  },
  {
    id: "south",
    title: "第二幕 · 困境（黑白）",
    seconds: 6,
    beats: [
      { from: 0, to: 2.4, lines: ["故事从 [[1975]] 年说起"] },
      { from: 2.4, to: 6, lines: ["他在美国南方拍黑白照片，", "自己都觉得[[不够打动人]]"] },
    ],
  },
  {
    id: "haiti",
    title: "第三幕 · 转折（黑白）",
    seconds: 7,
    beats: [
      { from: 0, to: 3.6, lines: ["他读到一本写[[海地]]的小说", "害怕，又着迷"] },
      { from: 3.6, to: 7, lines: ["于是，他去了海地"] },
    ],
  },
  {
    id: "color",
    title: "第四幕 · 发现颜色（黑白 → 彩色）",
    seconds: 10,
    beats: [
      { from: 0, to: 3.6, lines: ["那里的阳光很硬", "[[颜色烫眼]]"] },
      { from: 3.8, to: 6.6, lines: ["他终于明白：", "[[黑白装不下这些]]"] },
      { from: 8, to: 10, lines: ["从此，他只拍彩色"], small: true },
    ],
  },
  {
    id: "light",
    title: "第五幕 · ① 热光",
    seconds: 8,
    beats: [{ from: 1.2, to: 6, lines: ["① [[热光]]", "饱和的颜色 + 纯黑的影子"], position: "top" }],
  },
  {
    id: "layers",
    title: "第五幕 · ② 层次",
    seconds: 9,
    beats: [{ from: 0.6, to: 6.4, lines: ["② [[层次]]", "前景、中景、背景，同时有事发生"], position: "top" }],
  },
  {
    id: "edges",
    title: "第五幕 · ③ 边缘",
    seconds: 8,
    beats: [{ from: 0.6, to: 7.6, lines: ["③ [[边缘]]", "人被切掉一半，画外还有画"], position: "top" }],
  },
  {
    id: "payoff",
    title: "第六幕 · 回扣 99%",
    seconds: 11,
    beats: [
      { from: 0, to: 3.4, lines: ["这么多东西，", "要在[[同一瞬间]]刚好对上"] },
      { from: 3.4, to: 7, lines: ["所以，[[99%]] 都是失败"] },
      { from: 7, to: 11, lines: ["他就一直走，一直等", "等那 [[1%]]"] },
    ],
  },
  {
    id: "gallery",
    title: "第七幕 · 他等到的 1%",
    seconds: 8,
    beats: [{ from: 0.4, to: 3.6, lines: ["这些，就是他等到的 [[1%]]"], position: "center" }],
  },
  {
    id: "outro",
    title: "第八幕 · 结尾",
    seconds: 6,
    beats: [
      { from: 0, to: 6, lines: ["下次看照片，试试："], position: "top" },
      { from: 3.4, to: 6, lines: ["推荐：《The Suffering of Light》"], small: true, position: "bottom" },
    ],
  },
];

export const getScene = (id: SceneId): SceneScript => {
  const s = SCRIPT.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

export const sceneFrames = (id: SceneId) => Math.round(getScene(id).seconds * FPS);

export const totalFrames = () => SCRIPT.reduce((sum, s) => sum + Math.round(s.seconds * FPS), 0);

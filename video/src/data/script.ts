/**
 * 视频脚本 —— 唯一数据源（single source of truth）。
 * 旁白、字幕、每幕时长都从这里读取；改完运行 `npm run script:export`
 * 会同步生成 ../docs/02-脚本/脚本-自动导出.md 供审查。
 */

export type SceneId =
  | "hook"
  | "title"
  | "who"
  | "light"
  | "layers"
  | "grid"
  | "edges"
  | "method"
  | "howto"
  | "outro";

export type SceneScript = {
  id: SceneId;
  /** 分镜标题（审查用） */
  title: string;
  /** 本幕时长（秒）。约按 4.2 字/秒 + 1~2 秒留白估算 */
  seconds: number;
  /** 旁白，每个元素一句，会被切成字幕逐句显示 */
  narration: string[];
  /** 画面说明（审查用，不进视频） */
  visual: string;
  /** 可选：配音文件，放在 public/ 下，例如 "audio/hook.mp3" */
  voiceover: string | null;
};

export const FPS = 30;
/** 相邻两幕之间的淡入淡出帧数 */
export const TRANSITION_FRAMES = 15;

export const SCRIPT: SceneScript[] = [
  {
    id: "hook",
    title: "开场：一张照片里的好几个故事",
    seconds: 16,
    narration: [
      "先看一张照片。",
      "第一眼，你看到的是颜色：橙红的墙，浓黑的影子。",
      "再看一眼，墙边有个孩子，远处有人走过，门口还站着一个人。",
      "一张照片里，同时藏着好几个故事。",
    ],
    visual:
      "韦伯风格示意插画逐层出现：先铺色块和阴影，再依次出现孩子、路人、门口的人。可替换为授权原作。",
    voiceover: null,
  },
  {
    id: "title",
    title: "片名",
    seconds: 6,
    narration: ["这是美国摄影师亚历克斯·韦伯，Alex Webb。"],
    visual: "大标题：亚历克斯·韦伯｜把混乱拍成秩序。副标题：色彩 · 层次 · 瞬间",
    voiceover: null,
  },
  {
    id: "who",
    title: "他是谁：从黑白到彩色",
    seconds: 26,
    narration: [
      "韦伯1952年生于旧金山，在哈佛读历史与文学。",
      "上世纪七十年代，他加入玛格南图片社，最早拍的是美国南方小镇的黑白照片。",
      "后来他去了海地和墨西哥，那里强烈的阳光和浓烈的颜色，让他意识到：黑白装不下这些东西。",
      "从那以后，他几乎只拍彩色。",
    ],
    visual:
      "时间轴：1952 旧金山 → 1974 进入玛格南（1979 正式成员）→ 美国南方·黑白 → 海地/墨西哥·转向彩色 → 出版 15+ 本摄影书。画面从灰度逐渐染上颜色。",
    voiceover: null,
  },
  {
    id: "light",
    title: "关键词一：热光",
    seconds: 24,
    narration: [
      "第一个关键词：热光。",
      "热带正午的阳光很硬，亮处极亮，暗处几乎全黑。",
      "很多摄影师会躲开这种光，韦伯却迎着它拍。",
      "饱和的红、黄、蓝被阳光推到最满，阴影被压成纯黑的形状。",
      "颜色和阴影，不是装饰，而是画面的骨架。",
    ],
    visual:
      "同一幅示意图从“柔光、低饱和”过渡到“硬光、高饱和”，阴影变成纯黑块面；右侧出现色板：红 / 黄 / 蓝 / 黑。",
    voiceover: null,
  },
  {
    id: "layers",
    title: "关键词二：层次",
    seconds: 26,
    narration: [
      "第二个关键词：层次。",
      "韦伯的照片常常有三层甚至更多：前景一个人，中景一个动作，背景又是另一件事。",
      "它们同时发生，彼此无关，却被同一个画框装在一起。",
      "于是你的眼睛会在画面里来回游走，每看一次，都有新发现。",
    ],
    visual: "示意图拆成三层纸片，在 3D 空间中分开并标注“前景 / 中景 / 背景”，再合拢回一张照片。",
    voiceover: null,
  },
  {
    id: "grid",
    title: "关键词三：分割",
    seconds: 20,
    narration: [
      "第三个关键词：分割。",
      "墙、门框、柱子和阴影，把画面切成一个个小格子。",
      "每个格子里放一个人、一个动作，就像一个舞台同时上演好几出戏。",
    ],
    visual: "在示意图上逐条画出分割线，每个格子依次高亮，格子里的人物轻微跳动。",
    voiceover: null,
  },
  {
    id: "edges",
    title: "关键词四：边缘",
    seconds: 18,
    narration: [
      "第四个关键词：边缘。",
      "韦伯常让人物只露出半张脸、一只手，被画框切掉。",
      "这些“不完整”让照片更像真实的街头，也让你去想象画框之外的世界。",
    ],
    visual: "取景框在画面上移动并裁切，被切掉一半的人物用描边强调；画框外的部分变暗但仍可见。",
    voiceover: null,
  },
  {
    id: "method",
    title: "方法：行走与等待",
    seconds: 24,
    narration: [
      "这些照片是怎么来的？答案很朴素：走路，和等待。",
      "他会在同一个地方反复地走，在同一个街角等很久，按下大量快门。",
      "其中绝大多数，都是失败的。",
      "复杂和混乱之间只隔着一条线，那条线，就是他等来的那一瞬间。",
    ],
    visual: "一张“印样”（contact sheet）上排满小格，绝大多数变灰，最后只有一格被红色记号笔圈出。",
    voiceover: null,
  },
  {
    id: "howto",
    title: "怎么看一张韦伯的照片",
    seconds: 22,
    narration: [
      "下次看到韦伯的照片，可以试试三步。",
      "第一，先看颜色和阴影，找出画面的大块结构。",
      "第二，数一数有几层，每一层在发生什么。",
      "第三，看看边缘，想想画框外还有什么。",
    ],
    visual: "三张卡片依次出现：① 色块与阴影 ② 数层次 ③ 看边缘。每张卡片配一个示意小图。",
    voiceover: null,
  },
  {
    id: "outro",
    title: "结尾与延伸阅读",
    seconds: 18,
    narration: [
      "世界本来就是混乱的。",
      "而韦伯的工作，是在混乱里找到一瞬间的秩序。",
      "想继续看，可以从这几本书开始。",
    ],
    visual:
      "书单：《The Suffering of Light》（2011）、《La Calle》（2016）、《On Street Photography and the Poetic Image》（2014，与 Rebecca Norris Webb 合著）。末尾署名与版权说明。",
    voiceover: null,
  },
];

export const sceneFrames = (s: SceneScript) => Math.round(s.seconds * FPS);

export const totalFrames = () =>
  SCRIPT.reduce((sum, s) => sum + sceneFrames(s), 0) -
  TRANSITION_FRAMES * (SCRIPT.length - 1);

export const getScene = (id: SceneId): SceneScript => {
  const s = SCRIPT.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * 自绘的「韦伯风格」示意插画（原创，非任何原作的复制）。
 * 用来讲清楚构图原理：饱和色墙面 + 硬光阴影 + 多层人物 + 被画框切掉的边缘。
 *
 * 画面坐标系固定为 1920 × 1080，分为四层，父组件可以单独控制每一层：
 *   bg     —— 天空、墙面、门框、地面
 *   shadow —— 硬光投下的黑色阴影
 *   mid    —— 中景：门口的人、远处的路人、狗
 *   fg     —— 前景：被左边缘切掉的孩子、右边缘伸进来的手
 */

export type LayerKey = "bg" | "shadow" | "mid" | "fg";

export const PALETTE = {
  sky: "#8ec3de",
  red: "#d6451b",
  redDeep: "#a8300f",
  blue: "#1d5aa6",
  yellow: "#f2b705",
  ochre: "#c98a3a",
  doorDark: "#23140e",
  skin: "#7a4a2c",
  skinLight: "#a8683f",
  white: "#f3ede1",
  green: "#2f8f5b",
  black: "#0b0a09",
};

/** 分割构图时使用的结构线（与插画中的墙、门框对齐） */
export const GRID = {
  vertical: [760, 980, 1180],
  horizontal: [300, 900],
};

/** 每个“格子”及其中的人物，供「分割」一幕高亮 */
export const CELLS: { x: number; y: number; w: number; h: number; label: string }[] = [
  { x: 0, y: 300, w: 760, h: 600, label: "孩子" },
  { x: 760, y: 300, w: 220, h: 600, label: "门里的人" },
  { x: 980, y: 300, w: 200, h: 600, label: "门口的人" },
  { x: 1180, y: 300, w: 740, h: 600, label: "路人与狗" },
];

type Person = {
  x: number;
  y: number; // 脚底位置
  scale: number;
  shirt: string;
  skin?: string;
  walking?: boolean;
  flip?: boolean;
};

const Figure: React.FC<Person> = ({ x, y, scale, shirt, skin = PALETTE.skin, walking, flip }) => {
  // 以脚底为原点、身高约 520 的人形
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* 腿 */}
      <rect x={-38} y={-240} width={30} height={240} rx={12} fill={PALETTE.black} transform={walking ? "rotate(10 -23 -240)" : undefined} />
      <rect x={8} y={-240} width={30} height={240} rx={12} fill={PALETTE.black} transform={walking ? "rotate(-12 23 -240)" : undefined} />
      {/* 身体 */}
      <rect x={-62} y={-450} width={124} height={230} rx={40} fill={shirt} />
      {/* 手臂 */}
      <rect x={-86} y={-440} width={28} height={190} rx={14} fill={skin} transform={walking ? "rotate(14 -72 -440)" : undefined} />
      <rect x={58} y={-440} width={28} height={190} rx={14} fill={skin} transform={walking ? "rotate(-16 72 -440)" : undefined} />
      {/* 头 */}
      <circle cx={0} cy={-500} r={52} fill={skin} />
    </g>
  );
};

const Dog: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-80} y={-90} width={150} height={52} rx={24} fill={PALETTE.black} />
    <rect x={-72} y={-44} width={16} height={44} rx={6} fill={PALETTE.black} />
    <rect x={44} y={-44} width={16} height={44} rx={6} fill={PALETTE.black} />
    <circle cx={78} cy={-104} r={28} fill={PALETTE.black} />
    <rect x={-104} y={-104} width={34} height={10} rx={5} fill={PALETTE.black} transform="rotate(-30 -80 -100)" />
  </g>
);

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={style}>
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ overflow: "visible" }}
    >
      {children}
    </svg>
  </AbsoluteFill>
);

export const BgLayer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    <rect x={0} y={0} width={1920} height={300} fill={PALETTE.sky} />
    {/* 左侧红墙 */}
    <rect x={0} y={120} width={1180} height={800} fill={PALETTE.red} />
    <rect x={0} y={120} width={1180} height={40} fill={PALETTE.redDeep} />
    {/* 右侧蓝墙 */}
    <rect x={1180} y={200} width={740} height={720} fill={PALETTE.blue} />
    {/* 黄色门框与门洞 */}
    <rect x={740} y={280} width={260} height={640} fill={PALETTE.yellow} />
    <rect x={770} y={310} width={200} height={610} fill={PALETTE.doorDark} />
    {/* 蓝墙上的窗 */}
    <rect x={1520} y={330} width={180} height={220} fill={PALETTE.white} />
    <rect x={1540} y={350} width={140} height={180} fill={PALETTE.doorDark} />
    {/* 地面 */}
    <rect x={0} y={900} width={1920} height={180} fill={PALETTE.ochre} />
    {/* 门里远处的小人（背景里的另一个故事） */}
    <Figure x={870} y={880} scale={0.62} shirt={PALETTE.green} />
  </Svg>
);

export const ShadowLayer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    {/* 红墙上的大斜影 */}
    <polygon points="0,420 520,160 740,160 740,920 0,920" fill={PALETTE.black} />
    {/* 蓝墙右上角的屋檐影 */}
    <polygon points="1180,200 1920,200 1920,470 1500,300 1180,300" fill={PALETTE.black} />
    {/* 地面上的投影 */}
    <polygon points="0,900 900,900 620,1080 0,1080" fill={PALETTE.black} />
  </Svg>
);

export const MidLayer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    {/* 门口的人：站在光里 */}
    <Figure x={1085} y={960} scale={1.05} shirt={PALETTE.yellow} skin={PALETTE.skinLight} />
    {/* 蓝墙前走过的路人 */}
    <Figure x={1440} y={930} scale={0.78} shirt={PALETTE.white} walking />
    {/* 狗 */}
    <Dog x={1720} y={990} scale={1} />
  </Svg>
);

export const FgLayer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    {/* 被左边缘切掉的孩子（前景特写） */}
    <Figure x={40} y={1480} scale={2.3} shirt={PALETTE.red} skin={PALETTE.skin} flip />
    {/* 从右边缘伸进来的一只手 */}
    <g>
      <rect x={1790} y={640} width={220} height={70} rx={35} fill={PALETTE.skinLight} />
      <circle cx={1790} cy={675} r={44} fill={PALETTE.skinLight} />
    </g>
  </Svg>
);

export type LayerStyles = Partial<Record<LayerKey, React.CSSProperties>>;

/** 完整插画，可给每层单独传 style（透明度、位移、3D 变换等） */
export const WebbIllustration: React.FC<{
  layers?: LayerStyles;
  style?: React.CSSProperties;
}> = ({ layers = {}, style }) => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.black, overflow: "hidden", ...style }}>
    <BgLayer style={layers.bg} />
    <ShadowLayer style={layers.shadow} />
    <MidLayer style={layers.mid} />
    <FgLayer style={layers.fg} />
  </AbsoluteFill>
);

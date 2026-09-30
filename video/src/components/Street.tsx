import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * 原创横屏示意插画：一个加勒比街角（非任何原作的复制）。
 * 用韦伯作品的视觉语法来画：饱和的墙面色块、硬光投下的纯黑阴影、
 * 前中后景同时有人、边缘被切掉的人物。
 *
 * 坐标系 1920 × 1080，分四层，父组件可单独控制每层（3D 拆分、显隐）：
 *   bg     天空、墙、门、窗、地面、门里远处的小人
 *   shadow 硬光阴影（大斜影、屋檐影、棕榈叶影、人物投影）
 *   mid    中景：门口的人、路人、狗
 *   fg     前景：被左边缘切掉的孩子、右边缘伸进来的手
 */

export const PALETTE = {
  sky: "#7fc2e0",
  red: "#d9431a",
  redDeep: "#9e2a0c",
  blue: "#1b55a8",
  blueDeep: "#123c7a",
  yellow: "#f4b400",
  green: "#1f9a63",
  pink: "#e8577f",
  ochre: "#cf8a36",
  doorDark: "#1e120c",
  skin: "#6e4027",
  skinLight: "#9c6038",
  white: "#f4eee2",
  black: "#0a0908",
};

export const W = 1920;
export const H = 1080;

type FigureProps = {
  x: number;
  y: number; // 脚底
  scale: number;
  shirt: string;
  pants?: string;
  skin?: string;
  walking?: boolean;
  flip?: boolean;
  hat?: string;
};

/** 简化人形，以脚底为原点，身高约 560 */
export const Figure: React.FC<FigureProps> = ({
  x,
  y,
  scale,
  shirt,
  pants = PALETTE.black,
  skin = PALETTE.skin,
  walking,
  flip,
  hat,
}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <rect x={-38} y={-250} width={32} height={250} rx={14} fill={pants} transform={walking ? "rotate(12 -22 -250)" : undefined} />
    <rect x={6} y={-250} width={32} height={250} rx={14} fill={pants} transform={walking ? "rotate(-14 22 -250)" : undefined} />
    <rect x={-66} y={-470} width={132} height={240} rx={44} fill={shirt} />
    <rect x={-92} y={-458} width={30} height={200} rx={15} fill={skin} transform={walking ? "rotate(16 -77 -458)" : undefined} />
    <rect x={62} y={-458} width={30} height={200} rx={15} fill={skin} transform={walking ? "rotate(-18 77 -458)" : undefined} />
    <rect x={-14} y={-500} width={28} height={40} fill={skin} />
    <circle cx={0} cy={-530} r={54} fill={skin} />
    {hat ? (
      <>
        <ellipse cx={0} cy={-566} rx={92} ry={16} fill={hat} />
        <rect x={-46} y={-610} width={92} height={48} rx={18} fill={hat} />
      </>
    ) : null}
  </g>
);

export const Dog: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-84} y={-96} width={156} height={54} rx={26} fill={PALETTE.black} />
    <rect x={-74} y={-48} width={16} height={48} rx={6} fill={PALETTE.black} />
    <rect x={46} y={-48} width={16} height={48} rx={6} fill={PALETTE.black} />
    <circle cx={82} cy={-110} r={30} fill={PALETTE.black} />
    <polygon points="92,-138 104,-160 110,-132" fill={PALETTE.black} />
    <rect x={-112} y={-110} width={38} height={10} rx={5} fill={PALETTE.black} transform="rotate(-32 -84 -104)" />
  </g>
);

/** 棕榈叶的影子：一根叶轴 + 两排狭长叶片 */
const FrondShadow: React.FC<{ x: number; y: number; rot: number; len: number }> = ({ x, y, rot, len }) => {
  const leaves = [];
  for (let i = 1; i <= 9; i++) {
    const t = (i / 10) * len;
    const l = 150 * (1 - i / 12);
    leaves.push(
      <ellipse key={`a${i}`} cx={t} cy={-l / 2} rx={16} ry={l / 2} transform={`rotate(-38 ${t} 0)`} />,
      <ellipse key={`b${i}`} cx={t} cy={l / 2} rx={16} ry={l / 2} transform={`rotate(38 ${t} 0)`} />,
    );
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} fill={PALETTE.black}>
      <rect x={0} y={-5} width={len} height={10} rx={5} />
      {leaves}
    </g>
  );
};

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={style}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

export const StreetBg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    <rect x={0} y={0} width={W} height={H} fill={PALETTE.sky} />
    {/* 远处的山 */}
    <path d="M0 190 Q300 110 620 170 T1260 150 T1920 170 V260 H0Z" fill="#5a9cbc" />
    {/* 左：红墙（两层楼） */}
    <rect x={0} y={120} width={1100} height={780} fill={PALETTE.red} />
    <rect x={0} y={120} width={1100} height={28} fill={PALETTE.redDeep} />
    <rect x={0} y={430} width={1100} height={18} fill={PALETTE.redDeep} />
    {/* 二楼窗与粉色百叶 */}
    <rect x={160} y={190} width={170} height={200} fill={PALETTE.doorDark} />
    <rect x={160} y={190} width={82} height={200} fill={PALETTE.pink} />
    <rect x={460} y={190} width={170} height={200} fill={PALETTE.doorDark} />
    <rect x={760} y={190} width={170} height={200} fill={PALETTE.doorDark} />
    <rect x={848} y={190} width={82} height={200} fill={PALETTE.green} />
    {/* 黄色门框 + 门洞 */}
    <rect x={640} y={470} width={250} height={430} fill={PALETTE.yellow} />
    <rect x={672} y={500} width={186} height={400} fill={PALETTE.doorDark} />
    {/* 右：钴蓝墙 */}
    <rect x={1100} y={200} width={820} height={700} fill={PALETTE.blue} />
    <rect x={1100} y={200} width={820} height={26} fill={PALETTE.blueDeep} />
    <rect x={1500} y={300} width={180} height={220} fill={PALETTE.white} />
    <rect x={1520} y={320} width={140} height={180} fill={PALETTE.doorDark} />
    <rect x={1100} y={650} width={820} height={14} fill={PALETTE.green} />
    {/* 地面 */}
    <rect x={0} y={900} width={W} height={180} fill={PALETTE.ochre} />
    {/* 门里远处的小人：背景里的另一个故事 */}
    <Figure x={765} y={890} scale={0.55} shirt={PALETTE.green} />
  </Svg>
);

export const StreetShadow: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    {/* 红墙下半部的大斜影 */}
    <polygon points="0,580 640,400 640,900 0,900" fill={PALETTE.black} />
    {/* 屋檐影 */}
    <polygon points="1100,226 1920,226 1920,430 1620,296 1100,296" fill={PALETTE.black} />
    {/* 棕榈叶影落在蓝墙上 */}
    <FrondShadow x={1920} y={560} rot={196} len={460} />
    <FrondShadow x={1920} y={680} rot={166} len={360} />
    {/* 地面上的斜影和人物投影 */}
    <polygon points="0,900 980,900 700,1080 0,1080" fill={PALETTE.black} />
    <ellipse cx={1680} cy={960} rx={140} ry={18} fill={PALETTE.black} transform="skewX(-40)" />
    <ellipse cx={2170} cy={935} rx={100} ry={14} fill={PALETTE.black} transform="skewX(-40)" />
  </Svg>
);

export const StreetMid: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    {/* 门口的人，站在光里，戴草帽 */}
    <Figure x={960} y={960} scale={0.95} shirt={PALETTE.yellow} skin={PALETTE.skinLight} hat="#e9d9a6" />
    {/* 蓝墙前走过的路人 */}
    <Figure x={1390} y={935} scale={0.75} shirt={PALETTE.white} pants={PALETTE.blueDeep} walking />
    {/* 狗 */}
    <Dog x={1730} y={1010} scale={1} />
  </Svg>
);

export const StreetFg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Svg style={style}>
    {/* 被左边缘切掉的孩子（前景特写） */}
    <Figure x={20} y={1560} scale={2.0} shirt={PALETTE.red} skin={PALETTE.skin} flip />
    {/* 从右边缘伸进来的一只手 */}
    <rect x={1790} y={610} width={200} height={66} rx={33} fill={PALETTE.skinLight} />
    <circle cx={1795} cy={643} r={42} fill={PALETTE.skinLight} />
  </Svg>
);

export type StreetLayers = Partial<Record<"bg" | "shadow" | "mid" | "fg", React.CSSProperties>>;

export const Street: React.FC<{ layers?: StreetLayers; style?: React.CSSProperties }> = ({ layers = {}, style }) => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.black, overflow: "hidden", ...style }}>
    <StreetBg style={layers.bg} />
    <StreetShadow style={layers.shadow} />
    <StreetMid style={layers.mid} />
    <StreetFg style={layers.fg} />
  </AbsoluteFill>
);

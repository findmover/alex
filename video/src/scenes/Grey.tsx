import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { Atmosphere, Dust, FONT_SANS, FONT_SERIF, INK, Stage, Verses, beat, clamp, easeCam } from "../components/ui";
import { AIGC } from "../data/aigc";

/** 备用画面 A：灰墙上，一扇窗投下的光斑缓缓走过 —— 时间在流逝 */
const WindowLight: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, beat(8)], [-260, 420], clamp);
  const skew = interpolate(frame, [0, beat(8)], [-18, 12], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #4a4946 0%, #3a3937 60%, #242322 100%)" }}>
      <div
        style={{
          position: "absolute",
          left: 760 + x,
          top: 170,
          width: 520,
          height: 640,
          transform: `skewX(${skew}deg)`,
          background: "#d8d6d0",
          filter: "blur(18px)",
          opacity: 0.55,
          boxShadow: "0 0 120px rgba(220,218,210,0.4)",
        }}
      >
        {/* 窗棂的影子 */}
        <div style={{ position: "absolute", left: "48%", top: 0, width: 26, height: "100%", background: "#3b3a38" }} />
        <div style={{ position: "absolute", top: "46%", left: 0, height: 26, width: "100%", background: "#3b3a38" }} />
      </div>
    </AbsoluteFill>
  );
};

/** 备用画面 B：一本 3D 平装书在窗光里慢慢转动（格雷厄姆·格林《喜剧演员》，1966） */
const Novel: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [0, beat(4.4)], [-58, -18], { ...clamp, easing: easeCam });
  const W = 380;
  const H = 580;
  const D = 60;
  const face = (w: number): React.CSSProperties => ({
    position: "absolute",
    width: w,
    height: H,
    left: -w / 2,
    top: -H / 2,
    backfaceVisibility: "hidden",
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, #4d4c49 0%, #1d1c1b 70%)" }}>
      <Stage perspective={1800} camera={`translate(-120px, -40px) rotateX(8deg) rotateY(${rot}deg)`}>
        {/* 封面 */}
        <div
          style={{
            ...face(W),
            transform: `translateZ(${D / 2}px)`,
            background: "#2f2d2a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
            color: INK,
            boxShadow: "inset 0 0 80px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontFamily: FONT_SERIF, fontSize: 44, fontWeight: 700, letterSpacing: "0.12em" }}>THE COMEDIANS</div>
          <div style={{ width: 80, height: 1, background: INK, opacity: 0.6 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 20, letterSpacing: "0.4em", opacity: 0.8 }}>GRAHAM GREENE</div>
        </div>
        {/* 书脊 */}
        <div
          style={{
            ...face(D),
            transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
            background: "#1f1e1c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ transform: "rotate(90deg)", whiteSpace: "nowrap", fontFamily: FONT_SANS, fontSize: 16, letterSpacing: "0.3em", color: INK, opacity: 0.8 }}>
            THE COMEDIANS · 1966
          </div>
        </div>
        {/* 书口 */}
        <div
          style={{
            ...face(D),
            transform: `rotateY(90deg) translateZ(${W / 2}px)`,
            backgroundImage: "repeating-linear-gradient(90deg, #e7e2d6 0 3px, #cfc9bc 3px 4px)",
          }}
        />
      </Stage>
    </AbsoluteFill>
  );
};

/** 备用画面 C：一条细线从北纬 35° 划到北纬 18°，底部开始透出暖色 */
const Southward: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [beat(0.2), beat(3)], [0, 1], { ...clamp, easing: easeCam });
  const warm = interpolate(frame, [beat(2), beat(3.6)], [0, 1], clamp);
  const y0 = 170;
  const y1 = 910;
  const y = y0 + (y1 - y0) * t;
  return (
    <AbsoluteFill style={{ background: "#141312" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(238,106,58,0.55), rgba(238,106,58,0) 70%)", opacity: warm }} />
      <svg width="100%" height="100%">
        {[35, 30, 25, 20].map((lat) => {
          const ly = y0 + ((35 - lat) / 17) * (y1 - y0);
          return (
            <g key={lat} opacity={0.35}>
              <line x1={1100} x2={1180} y1={ly} y2={ly} stroke={INK} strokeWidth={1} />
              <text x={1196} y={ly + 6} fill={INK} style={{ fontFamily: FONT_SANS, fontSize: 16, letterSpacing: "0.2em" }}>
                {lat}°N
              </text>
            </g>
          );
        })}
        <line x1={1140} x2={1140} y1={y0} y2={y} stroke={INK} strokeWidth={1.5} />
        <circle cx={1140} cy={y0} r={5} fill={INK} />
        <circle cx={1140} cy={y} r={7} fill={t > 0.98 ? "#ee6a3a" : INK} />
        <text x={1164} y={y1 + 50} fill={INK} opacity={t > 0.98 ? 0.8 : 0} style={{ fontFamily: FONT_SANS, fontSize: 18, letterSpacing: "0.3em" }}>
          HAITI · 18°N
        </text>
      </svg>
    </AbsoluteFill>
  );
};

const mono: React.CSSProperties = { filter: "grayscale(1) contrast(1.05)" };
const Footage: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <AbsoluteFill style={style}>
    <Video src={staticFile(src)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
  </AbsoluteFill>
);

/**
 * 灰 · 1975（16 拍）
 * 0–8 拍：美国南方（AIGC V1，否则窗光走过墙面）
 * 8–12.4 拍：那本写海地的小说（AIGC V2，否则 3D 平装书）
 * 12.4–16 拍：往南（AIGC V4 棕榈影作为颜色的预兆，否则一条向南的细线）
 */
export const Grey: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#141312" }}>
      <Sequence name="美国南方" durationInFrames={beat(8)} layout="absolute-fill">
        {AIGC.v1South.src ? <Footage src={AIGC.v1South.src} style={mono} /> : <WindowLight />}
      </Sequence>
      <Sequence name="小说" from={beat(8)} durationInFrames={beat(4.4)} layout="absolute-fill">
        {AIGC.v2Novel.src ? <Footage src={AIGC.v2Novel.src} style={mono} /> : <Novel />}
      </Sequence>
      <Sequence name="往南" from={beat(12.4)} layout="absolute-fill">
        {AIGC.v4Palm.src ? (
          <Footage src={AIGC.v4Palm.src} style={{ filter: `grayscale(${interpolate(frame, [beat(13.5), beat(16)], [1, 0.2], clamp)})` }} />
        ) : (
          <Southward />
        )}
      </Sequence>
      <Dust seed="grey" warm={false} count={45} opacity={0.6} />
      <Atmosphere grain={0.12} />
      <Verses id="grey" />
    </AbsoluteFill>
  );
};

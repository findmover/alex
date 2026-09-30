import React from "react";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, SceneId, Verse, getScene } from "../data/script";
import { CREDIT, Work } from "../data/photos";

// 字体已按需子集化存在 public/fonts/（npm run fonts 重新生成），渲染时不联网
for (const [family, weight, file] of [
  ["WebbSerif", "500", "NotoSerifSC-500.woff2"],
  ["WebbSerif", "700", "NotoSerifSC-700.woff2"],
  ["WebbSans", "400", "NotoSansSC-400.woff2"],
  ["WebbSans", "700", "NotoSansSC-700.woff2"],
] as const) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}

export const FONT_SERIF = `WebbSerif, "Songti SC", serif`;
export const FONT_SANS = `WebbSans, "PingFang SC", "WenQuanYi Zen Hei", sans-serif`;

/** 深黑（接近他照片里的阴影）、纸色、唯一强调色（取自海地 1979 红墙并提亮） */
export const NIGHT = "#0b0a09";
export const INK = "#efe9dd";
export const ACCENT = "#ee6a3a";

/** 全片只用两条曲线（motion-art-direction：Premium） */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeCam = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 以“拍”为单位的插值（1 拍 = 25 帧） */
export const beat = (b: number) => b * BEAT;

const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text
      .split(/(\[\[.*?\]\])/g)
      .filter(Boolean)
      .map((p, i) =>
        p.startsWith("[[") ? (
          <span key={i} style={{ color: ACCENT }}>
            {p.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
  </>
);

const SIZE = {
  xl: { font: FONT_SERIF, size: 104, weight: 500, spacing: "0.04em", lh: 1.28 },
  l: { font: FONT_SERIF, size: 66, weight: 500, spacing: "0.06em", lh: 1.42 },
  m: { font: FONT_SERIF, size: 48, weight: 500, spacing: "0.06em", lh: 1.4 },
  s: { font: FONT_SANS, size: 20, weight: 400, spacing: "0.08em", lh: 1.4 },
  caps: { font: FONT_SANS, size: 22, weight: 400, spacing: "0.32em", lh: 1.4 },
};

/**
 * 一段诗句：逐行遮罩升起 + 模糊转清晰（kinetic-typography：行揭示），
 * 行间隔 3 帧；退场时模糊淡出。第 0 帧开始的句子直接完整显示（抖音钩子）。
 */
export const VerseText: React.FC<{ v: Verse }> = ({ v }) => {
  const frame = useCurrentFrame();
  const start = beat(v.from);
  const end = beat(v.to);
  if (frame < start || frame >= end) return null;
  const s = SIZE[v.size ?? "l"];
  const out = interpolate(frame, [end - 12, end], [0, 1], clamp);
  const instant = v.from === 0;
  const translate = v.align === "center" ? "-50%" : v.align === "right" ? "-100%" : "0%";

  return (
    <div
      style={{
        position: "absolute",
        left: `${v.x}%`,
        top: `${v.y}%`,
        translate: `${translate} -50%`,
        display: "flex",
        flexDirection: "column",
        alignItems: v.align === "center" ? "center" : v.align === "right" ? "flex-end" : "flex-start",
        opacity: 1 - out,
        filter: out > 0 ? `blur(${out * 10}px)` : undefined,
      }}
    >
      {v.lines.map((line, i) => {
        const t = instant ? 1 : interpolate(frame, [start + i * 3, start + i * 3 + 24], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div key={i} style={{ overflow: "hidden", padding: "0 4px 8px" }}>
            <div
              style={{
                translate: `0px ${(1 - t) * 60}%`,
                filter: t < 1 ? `blur(${(1 - t) * 8}px)` : undefined,
                opacity: 0.2 + t * 0.8,
                fontFamily: s.font,
                fontWeight: s.weight,
                fontSize: s.size,
                lineHeight: s.lh,
                letterSpacing: s.spacing,
                color: INK,
                whiteSpace: "nowrap",
                textShadow: "0 2px 24px rgba(0,0,0,0.55)",
              }}
            >
              <Rich text={line} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** 本幕全部诗句 */
export const Verses: React.FC<{ id: SceneId }> = ({ id }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {getScene(id).verses.map((v, i) => (
      <VerseText key={i} v={v} />
    ))}
  </AbsoluteFill>
);

/** 章节字（影 / 层 / 边 / 等）：巨大、低透明度，像展览的章节墙 */
export const Chapter: React.FC<{ glyph: string; en: string; x?: string; y?: string }> = ({ glyph, en, x = "79%", y = "8%" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: t, filter: `blur(${(1 - t) * 12}px)`, pointerEvents: "none" }}>
      <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 300, lineHeight: 1, color: INK, opacity: 0.14 }}>{glyph}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 18, letterSpacing: "0.4em", color: INK, opacity: 0.5, marginTop: 12, marginLeft: 8 }}>{en}</div>
    </div>
  );
};

/** 胶片颗粒：每帧换一次噪声种子 */
export const Grain: React.FC<{ strength?: number }> = ({ strength = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: strength }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/**
 * 漂浮的尘埃（环境层）：确定性随机，有景深 —— 近大、远小、离焦越远越模糊。
 * 放在一个带 perspective 的层里，缓慢上浮、左右摇摆。
 */
export const Dust: React.FC<{ count?: number; seed?: string; warm?: boolean; opacity?: number }> = ({
  count = 70,
  seed = "dust",
  warm = true,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const color = warm ? "255,226,190" : "235,235,235";
  return (
    <AbsoluteFill style={{ perspective: 900, pointerEvents: "none", opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const z = -600 + r("z") * 1100; // -600（远）→ 500（近）
        const x = r("x") * 2400 - 240;
        const y0 = r("y") * 1300 - 110;
        const speed = 0.25 + r("s") * 0.6;
        const y = ((y0 - frame * speed + 1300) % 1300) - 110;
        const sway = Math.sin(frame / (40 + r("w") * 50) + r("p") * 6.28) * 18;
        const size = 2 + r("r") * 5;
        const defocus = Math.abs(z - 150) / 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${color},0.9), rgba(${color},0))`,
              transform: `translateZ(${z}px)`,
              filter: `blur(${defocus}px)`,
              opacity: 0.25 + r("o") * 0.55,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 全片统一的“空气”：颗粒 + 暗角 */
export const Atmosphere: React.FC<{ grain?: number; vignette?: number }> = ({ grain, vignette }) => (
  <>
    <Vignette strength={vignette} />
    <Grain strength={grain} />
  </>
);

/** 原作标注（右下角展签） */
export const Caption: React.FC<{ work: Work; opacity?: number }> = ({ work, opacity = 0.75 }) => (
  <div
    style={{
      position: "absolute",
      right: 40,
      bottom: 28,
      fontFamily: FONT_SANS,
      fontSize: 18,
      letterSpacing: "0.18em",
      color: INK,
      opacity,
      textTransform: "uppercase",
      textShadow: "0 1px 8px rgba(0,0,0,0.8)",
    }}
  >
    {work.caption}{"\u3000·\u3000"}{CREDIT}
  </div>
);

/** 原作按原比例放在一个宽度为 w 的平面里（可放进 3D 空间） */
export const PhotoPlane: React.FC<{
  work: Work;
  w: number;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ work, w, style, imgStyle, children }) => (
  <div style={{ position: "absolute", width: w, height: w / work.ratio, left: -w / 2, top: -w / work.ratio / 2, ...style }}>
    <Img src={staticFile(work.file)} style={{ width: "100%", height: "100%", display: "block", ...imgStyle }} />
    {children}
  </div>
);

/** 一个以画面中心为原点的 3D 舞台；camera 为作用在“世界”上的变换 */
export const Stage: React.FC<{ perspective?: number; camera: string; children: React.ReactNode; origin?: string }> = ({
  perspective = 1600,
  camera,
  children,
  origin = "50% 50%",
}) => (
  <AbsoluteFill style={{ perspective, perspectiveOrigin: origin, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d", transform: camera }}>{children}</div>
  </AbsoluteFill>
);

/** 常用：一个原作在全屏中能放下的最大宽度 */
export const fitWidth = (work: Work, W = 1920, H = 1080) => Math.min(W, H * work.ratio);

/** 帧内缓动推进，便于在各幕里写镜头 */
export const useBeatT = (fromBeat: number, toBeat: number, ease = easeCam) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [beat(fromBeat), beat(toBeat)], [0, 1], { ...clamp, easing: ease });
};

export const useFps = () => useVideoConfig().fps;

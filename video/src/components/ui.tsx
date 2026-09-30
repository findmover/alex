import React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Beat, SceneId, getScene } from "../data/script";
import { CREDIT, Work } from "../data/photos";
import { PALETTE } from "./Street";

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

export const INK = "#f4eee2";
/** 接近韦伯照片里阴影的深黑，用作底色 */
export const NIGHT = "#0b0a09";
/** 默认高亮色：他照片里常见的明黄 */
export const ACCENT = PALETTE.yellow;

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 解析 "[[高亮]]" 标记 */
const Rich: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const parts = text.split(/(\[\[.*?\]\])/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[[") ? (
          <span key={i} style={{ color: accent }}>
            {p.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};

/**
 * 一条屏幕文字：逐行从遮罩下方升起（kinetic typography 的“行揭示”），
 * 到点后淡出。instant=true 时第 0 帧就完整可见（抖音钩子要求）。
 */
const BeatText: React.FC<{ beat: Beat; accent: string; instant?: boolean; align: "center" | "left" }> = ({
  beat,
  accent,
  instant,
  align,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = beat.from * fps;
  const end = beat.to * fps;
  if (frame < start || frame >= end) return null;
  const out = interpolate(frame, [end - 8, end], [1, 0], clamp);

  return (
    <div style={{ opacity: out, display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: beat.small ? 6 : 10 }}>
      {beat.lines.map((line, i) => {
        const t = instant
          ? 1
          : interpolate(frame, [start + i * 5, start + i * 5 + 16], [0, 1], { ...clamp, easing: ease });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 6 }}>
            <div
              style={{
                translate: `0px ${(1 - t) * 110}%`,
                fontFamily: beat.small ? FONT_SANS : FONT_SERIF,
                fontWeight: beat.small ? 400 : 700,
                fontSize: beat.small ? 44 : 88,
                lineHeight: 1.22,
                letterSpacing: beat.small ? 2 : 1,
                color: INK,
                textShadow: "0 4px 30px rgba(0,0,0,0.65)",
                whiteSpace: "nowrap",
              }}
            >
              <Rich text={line} accent={accent} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * 本幕的全部屏幕文字。
 * position：center = 画面正中；bottom = 下三分之一（压在画面上，带暗角托底）；left = 左侧竖排区域
 */
export const Beats: React.FC<{
  id: SceneId;
  position?: "center" | "bottom" | "left" | "top";
  accent?: string;
  instantFirst?: boolean;
  scrim?: boolean;
}> = ({ id, position = "bottom", accent = ACCENT, instantFirst, scrim = true }) => {
  const scene = getScene(id);
  const groups: Record<"center" | "bottom" | "left" | "top", Beat[]> = { center: [], bottom: [], left: [], top: [] };
  for (const b of scene.beats) groups[b.position ?? position].push(b);
  const firstBeat = scene.beats[0];

  const boxFor = (pos: "center" | "bottom" | "left" | "top"): React.CSSProperties =>
    pos === "top"
      ? { justifyContent: "flex-start", alignItems: "center", paddingTop: 100 }
      : pos === "center"
      ? { justifyContent: "center", alignItems: "center" }
      : pos === "left"
        ? { justifyContent: "center", alignItems: "flex-start", paddingLeft: 130 }
        : { justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 };

  return (
    <>
      {(["center", "bottom", "left", "top"] as const).map((pos) => {
        const beats = groups[pos];
        if (beats.length === 0) return null;
        const main = beats.filter((b) => !b.small);
        const small = beats.filter((b) => b.small);
        const align = pos === "left" ? "left" : "center";
        return (
          <React.Fragment key={pos}>
            {scrim && pos === "bottom" ? (
              <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 42%)" }} />
            ) : null}
            {scrim && pos === "top" ? (
              <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 34%)" }} />
            ) : null}
            {scrim && pos === "left" ? (
              <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%)" }} />
            ) : null}
            <AbsoluteFill style={{ ...boxFor(pos), flexDirection: "column", gap: 26 }}>
              {main.map((b, i) => (
                <BeatText key={i} beat={b} accent={accent} align={align} instant={instantFirst && b === firstBeat} />
              ))}
              {small.map((b, i) => (
                <BeatText key={`s${i}`} beat={b} accent={accent} align={align} />
              ))}
            </AbsoluteFill>
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * 原作全屏展示：按原比例完整显示（不裁切），两侧留深黑；只做缓慢推近；右下角标注地点年份与版权。
 */
export const WorkView: React.FC<{
  work: Work;
  push?: [number, number];
  caption?: boolean;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ work, push = [1, 1.04], caption = true, style, imgStyle, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const w = Math.min(width, height * work.ratio);
  const h = w / work.ratio;
  return (
    <AbsoluteFill style={{ backgroundColor: NIGHT, justifyContent: "center", alignItems: "center", ...style }}>
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          scale: interpolate(frame, [0, durationInFrames], push, clamp),
        }}
      >
        <Img src={staticFile(work.file)} style={{ width: "100%", height: "100%", display: "block", ...imgStyle }} />
        {children}
      </div>
      {caption ? <Caption work={work} /> : null}
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{ work: Work; opacity?: number }> = ({ work, opacity = 0.8 }) => (
  <div
    style={{
      position: "absolute",
      right: 32,
      bottom: 20,
      fontFamily: FONT_SANS,
      fontSize: 22,
      color: INK,
      opacity,
      textShadow: "0 1px 6px rgba(0,0,0,0.8)",
    }}
  >
    {work.caption} · {CREDIT}
  </div>
);

/** 3D 空间里的一张相片（白边卡纸 + 投影），宽度 w，按原比例 */
export const PhotoCard: React.FC<{ work: Work; w: number; style?: React.CSSProperties; label?: boolean }> = ({
  work,
  w,
  style,
  label,
}) => (
  <div
    style={{
      position: "absolute",
      width: w + 28,
      padding: 14,
      background: "#f2eee6",
      boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
      ...style,
    }}
  >
    <Img src={staticFile(work.file)} style={{ width: w, height: w / work.ratio, display: "block" }} />
    {label ? (
      <div style={{ fontFamily: FONT_SANS, fontSize: 18, color: "#3a342c", marginTop: 10, letterSpacing: 1 }}>{work.caption}</div>
    ) : null}
  </div>
);

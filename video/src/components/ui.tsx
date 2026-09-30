import React from "react";
import { loadFont as loadSerif } from "@remotion/google-fonts/NotoSerifSC";
import { loadFont as loadSans } from "@remotion/google-fonts/NotoSansSC";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { SceneScript } from "../data/script";
import { PhotoSlot } from "../data/photos";
import { LayerStyles, WebbIllustration } from "./WebbIllustration";

const serif = loadSerif("normal", { weights: ["700", "900"] });
const sans = loadSans("normal", { weights: ["400", "700"] });

export const FONT_SERIF = `${serif.fontFamily}, "Songti SC", serif`;
export const FONT_SANS = `${sans.fontFamily}, "PingFang SC", "WenQuanYi Zen Hei", sans-serif`;

export const INK = "#f3ede1";
export const PAPER = "#0f0d0b";
export const ACCENT = "#f2b705";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 旁白字幕：按字数比例把本幕时长分给每一句 */
export const Subtitles: React.FC<{ scene: SceneScript }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const lead = 12; // 开头留白
  const tail = 18; // 结尾留白
  const usable = durationInFrames - lead - tail;
  const weights = scene.narration.map((s) => s.length + 4);
  const total = weights.reduce((a, b) => a + b, 0);

  let cursor = lead;
  const spans = scene.narration.map((text, i) => {
    const len = (weights[i] / total) * usable;
    const span = { text, from: cursor, to: cursor + len };
    cursor += len;
    return span;
  });

  const current = spans.find((s) => frame >= s.from && frame < s.to);
  if (!current) return null;

  const opacity = interpolate(
    frame,
    [current.from, current.from + 6, current.to - 6, current.to],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}
    >
      <div
        style={{
          opacity,
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.35,
          color: INK,
          background: "rgba(10, 9, 8, 0.72)",
          padding: "14px 34px",
          borderRadius: 10,
          maxWidth: 1560,
          textAlign: "center",
        }}
      >
        {current.text}
      </div>
    </AbsoluteFill>
  );
};

/** 本幕配音（script.ts 中 voiceover 不为 null 时播放） */
export const Voiceover: React.FC<{ scene: SceneScript }> = ({ scene }) =>
  scene.voiceover ? <Audio src={staticFile(scene.voiceover)} /> : null;

/** 左上角的关键词标签，如「关键词一 · 热光」 */
export const KeywordTag: React.FC<{ index: string; word: string; en: string }> = ({
  index,
  word,
  en,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 90,
        opacity: interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: ease }),
        translate: interpolate(frame, [0, 18], ["-40px 0px", "0px 0px"], {
          ...clamp,
          easing: ease,
        }),
        display: "flex",
        alignItems: "baseline",
        gap: 24,
        color: INK,
        textShadow: "0 2px 18px rgba(0,0,0,0.6)",
      }}
    >
      <span style={{ fontFamily: FONT_SANS, fontSize: 34, color: ACCENT, fontWeight: 700 }}>
        {index}
      </span>
      <span style={{ fontFamily: FONT_SERIF, fontSize: 96, fontWeight: 900 }}>{word}</span>
      <span style={{ fontFamily: FONT_SANS, fontSize: 32, opacity: 0.75, letterSpacing: 4 }}>
        {en}
      </span>
    </div>
  );
};

/**
 * 图位：有授权原作时显示原作（缓慢推近 + credit），
 * 否则显示自绘示意插画。
 */
export const PhotoOrIllustration: React.FC<{
  photo: PhotoSlot;
  layers?: LayerStyles;
  style?: React.CSSProperties;
}> = ({ photo, layers, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!photo.src) {
    return <WebbIllustration layers={layers} style={style} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, ...style }}>
      <Img
        src={staticFile(photo.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          scale: interpolate(frame, [0, durationInFrames], [1, 1.06], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 20,
          fontFamily: FONT_SANS,
          fontSize: 22,
          color: INK,
          opacity: 0.8,
        }}
      >
        {[photo.caption, photo.credit].filter(Boolean).join("  ·  ")}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 原作小窗：示意图讲完原理后，如果有授权原作，就在右上角把原作放出来对照。
 * 没有原作时不渲染。
 */
export const OriginalInset: React.FC<{ photo: PhotoSlot; fromSec: number }> = ({ photo, fromSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!photo.src) return null;
  const t = interpolate(frame, [fromSec * fps, fromSec * fps + 18], [0, 1], { ...clamp, easing: ease });
  return (
    <div
      style={{
        position: "absolute",
        right: 90,
        top: 90,
        width: 640,
        opacity: t,
        translate: `0px ${(1 - t) * 30}px`,
        background: PAPER,
        padding: 14,
        borderRadius: 8,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
      }}
    >
      <Img src={staticFile(photo.src)} style={{ width: "100%", display: "block" }} />
      <div style={{ fontFamily: FONT_SANS, fontSize: 22, color: INK, marginTop: 10, opacity: 0.85 }}>
        原作 · {[photo.caption, photo.credit].filter(Boolean).join("  ·  ")}
      </div>
    </div>
  );
};

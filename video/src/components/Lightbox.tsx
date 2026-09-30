import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { FONT_SANS, clamp } from "./ui";
import { Work } from "../data/photos";

/**
 * 暗房灯箱上的一张 35mm 印样（contact sheet）。
 * 除了一格之外，全是“失败的底片”：曝光不足、漏光、模糊的人影、时机不对 —— 全部程序生成，不使用任何原作。
 * 唯一亮着的那一格放的是真正的作品，用于“匹配剪辑”到全屏原作。
 */

export const STRIPS = 5;
export const PER = 6;
export const CHOSEN = { strip: 2, frame: 3 };
export const CELL_W = 360;
export const CELL_H = 240;
const GAP = 12;
const STRIP_PAD = 34;
const STRIP_GAP = 26;
export const SHEET_W = PER * CELL_W + (PER + 1) * GAP;
const STRIP_H = CELL_H + STRIP_PAD * 2;
export const SHEET_H = STRIPS * STRIP_H + (STRIPS - 1) * STRIP_GAP;

/** 选中格中心相对印样中心的偏移 */
export const chosenOffset = () => ({
  x: GAP + CHOSEN.frame * (CELL_W + GAP) + CELL_W / 2 - SHEET_W / 2,
  y: CHOSEN.strip * (STRIP_H + STRIP_GAP) + STRIP_PAD + CELL_H / 2 - SHEET_H / 2,
});

const FailedFrame: React.FC<{ id: string }> = ({ id }) => {
  const r = (k: string) => random(`${id}-${k}`);
  const kind = Math.floor(r("kind") * 4); // 0 欠曝 1 漏光 2 模糊人影 3 过曝
  const hue = [18, 28, 205, 190, 350][Math.floor(r("hue") * 5)];
  const leakX = Math.round(r("lx") * 100);
  const leakY = Math.round(r("ly") * 100);
  const base =
    kind === 3
      ? `radial-gradient(ellipse at ${leakX}% ${leakY}%, hsl(${hue} 40% 88%), hsl(${hue} 25% 62%))`
      : `linear-gradient(${Math.round(r("a") * 360)}deg, hsl(${hue} 30% ${8 + r("l") * 14}%), hsl(${(hue + 30) % 360} 25% ${4 + r("l2") * 10}%))`;
  return (
    <div style={{ position: "absolute", inset: 0, background: base, overflow: "hidden" }}>
      {kind === 1 || kind === 3 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${leakX}% ${leakY}%, rgba(255,120,40,0.75), rgba(255,60,20,0) 55%)`,
            mixBlendMode: "screen",
          }}
        />
      ) : null}
      {kind !== 3
        ? Array.from({ length: 1 + Math.floor(r("n") * 3) }).map((_, j) => (
            <div
              key={j}
              style={{
                position: "absolute",
                left: `${r(`px${j}`) * 90}%`,
                top: `${20 + r(`py${j}`) * 30}%`,
                width: 26 + r(`pw${j}`) * 40,
                height: 110 + r(`ph${j}`) * 90,
                borderRadius: "40% 40% 20% 20%",
                background: "rgba(0,0,0,0.75)",
                filter: `blur(${3 + r(`pb${j}`) * 7}px)`,
                transform: `skewX(${(r(`sk${j}`) - 0.5) * 30}deg)`,
              }}
            />
          ))
        : null}
    </div>
  );
};

export const Lightbox: React.FC<{
  /** 0→1：失败的格子依次熄灭 */
  fail: number;
  /** 0→1：红色油性笔圈出唯一一格 */
  circle: number;
  chosen: Work;
  /** 选中格的亮度提升 */
  glow?: number;
}> = ({ fail, circle, chosen, glow = 1 }) => {
  const off = chosenOffset();
  // 手绘感的圈：带轻微抖动的闭合曲线
  const pts = Array.from({ length: 40 }).map((_, i) => {
    const a = (i / 39) * Math.PI * 2.15 - 0.4;
    const j = 1 + (random(`ring-${i}`) - 0.5) * 0.06;
    return [Math.cos(a) * (CELL_W * 0.68) * j, Math.sin(a) * (CELL_H * 0.78) * j];
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(p[0] + SHEET_W / 2 + off.x).toFixed(1)} ${(p[1] + SHEET_H / 2 + off.y).toFixed(1)}`).join(" ");

  return (
    <div
      style={{
        position: "absolute",
        width: SHEET_W,
        height: SHEET_H,
        left: -SHEET_W / 2,
        top: -SHEET_H / 2,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 灯箱发光面 */}
      <div
        style={{
          position: "absolute",
          inset: -160,
          background: "radial-gradient(ellipse at 50% 50%, #fff7ea 0%, #e9dcc6 45%, #6d6457 80%, rgba(0,0,0,0) 100%)",
          filter: "blur(2px)",
        }}
      />
      {Array.from({ length: STRIPS }).map((_, s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            left: 0,
            top: s * (STRIP_H + STRIP_GAP),
            width: SHEET_W,
            height: STRIP_H,
            background: "#1a120b",
            boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
          }}
        >
          {/* 齿孔 */}
          {[8, STRIP_H - 22].map((top) =>
            Array.from({ length: 34 }).map((__, h) => (
              <div
                key={`${top}-${h}`}
                style={{ position: "absolute", top, left: 14 + h * 64, width: 26, height: 14, borderRadius: 3, background: "#f3e7d2", opacity: 0.85 }}
              />
            )),
          )}
          {Array.from({ length: PER }).map((__, f) => {
            const i = s * PER + f;
            const isChosen = s === CHOSEN.strip && f === CHOSEN.frame;
            const order = random(`order-${i}`);
            const k = isChosen ? 0 : Math.min(1, Math.max(0, (fail - order * 0.75) / 0.25));
            return (
              <div
                key={f}
                style={{
                  position: "absolute",
                  left: GAP + f * (CELL_W + GAP),
                  top: STRIP_PAD,
                  width: CELL_W,
                  height: CELL_H,
                  overflow: "hidden",
                  filter: isChosen ? `brightness(${1 + 0.15 * glow})` : `brightness(${1 - k * 0.8})`,
                  boxShadow: isChosen ? `0 0 ${40 * glow}px rgba(255,190,120,${0.6 * glow})` : undefined,
                }}
              >
                {isChosen ? (
                  <Img src={staticFile(chosen.file)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <FailedFrame id={`f-${i}`} />
                )}
              </div>
            );
          })}
          {/* 片边编号 */}
          {Array.from({ length: PER }).map((__, f) => (
            <div
              key={`n${f}`}
              style={{ position: "absolute", left: GAP + f * (CELL_W + GAP) + 8, top: STRIP_H - 34, fontFamily: FONT_SANS, fontSize: 12, color: "#e38b3c", opacity: 0.9, letterSpacing: "0.1em" }}
            >
              {s * PER + f + 1}A
            </div>
          ))}
        </div>
      ))}
      <svg width={SHEET_W} height={SHEET_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path
          d={d}
          fill="none"
          stroke="#d2261a"
          strokeWidth={11}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - circle}
          opacity={circle > 0 ? 0.92 : 0}
        />
      </svg>
    </div>
  );
};

/** 灯箱所在的暗房背景 */
export const DarkRoom: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1b1611 0%, #0b0a09 65%)" }} />
);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clampT = (x: number) => interpolate(x, [0, 1], [0, 1], clamp);

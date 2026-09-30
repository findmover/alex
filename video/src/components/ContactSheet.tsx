import React from "react";
import { AbsoluteFill } from "remotion";
import { Street } from "./Street";

/**
 * 一张“印样”（contact sheet）：同一个街角连拍的 24 格。
 * 每格取景略有不同，有的少了人、有的时机不对 —— 用来讲“99% 都是失败”。
 */

export const COLS = 6;
export const ROWS = 4;
export const CHOSEN = 15; // 那唯一成功的 1 格
const GAP = 20;
const CELL_W = (1920 - 2 * 90 - (COLS - 1) * GAP) / COLS;
const CELL_H = (CELL_W * 9) / 16;
const SHEET_W = COLS * CELL_W + (COLS - 1) * GAP;
const SHEET_H = ROWS * CELL_H + (ROWS - 1) * GAP;

const variant = (i: number) => {
  if (i === CHOSEN) return { transform: "none", mid: 1, fg: 1 };
  const dx = ((i * 137) % 9) - 4;
  const dy = ((i * 71) % 7) - 3;
  const s = 1.3 + ((i * 53) % 5) * 0.07;
  return {
    transform: `translate(${dx * 3}%, ${dy * 2}%) scale(${s})`,
    mid: i % 3 === 0 ? 1 : 0,
    fg: i % 4 === 1 ? 1 : 0,
  };
};

/** 每格变灰的先后顺序（伪随机） */
export const failOrder = (i: number) => ((i * 7) % (COLS * ROWS)) / (COLS * ROWS);

export const ContactSheet: React.FC<{
  /** 0→1：失败的格子依次变灰变暗 */
  fail: number;
  /** 0→1：红笔圈出成功的一格 */
  circle: number;
  /** 0→1：镜头推进到成功的一格，直到占满全屏 */
  zoom: number;
  /** 整张黑白（故事段用） */
  mono?: boolean;
}> = ({ fail, circle, zoom, mono }) => {
  const col = CHOSEN % COLS;
  const row = Math.floor(CHOSEN / COLS);
  const cx = col * (CELL_W + GAP) + CELL_W / 2 - SHEET_W / 2;
  const cy = row * (CELL_H + GAP) + CELL_H / 2 - SHEET_H / 2;
  const zoomScale = 1 + zoom * (1920 / CELL_W - 1);

  const rx = CELL_W * 0.64;
  const ry = CELL_H * 0.74;
  const circ = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));

  return (
    <AbsoluteFill style={{ backgroundColor: "#15110e", filter: mono ? "grayscale(1)" : undefined }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${zoomScale}) translate(${-cx * zoom}px, ${-cy * zoom}px)`,
        }}
      >
        <div style={{ position: "relative", width: SHEET_W, height: SHEET_H }}>
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const v = variant(i);
            const k = i === CHOSEN ? 0 : Math.min(1, Math.max(0, (fail - failOrder(i) * 0.7) / 0.3));
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: (i % COLS) * (CELL_W + GAP),
                  top: Math.floor(i / COLS) * (CELL_H + GAP),
                  width: CELL_W,
                  height: CELL_H,
                  overflow: "hidden",
                  filter: k > 0 ? `grayscale(${k}) brightness(${1 - k * 0.6})` : undefined,
                }}
              >
                <div style={{ position: "absolute", width: 1920, height: 1080, scale: CELL_W / 1920, transformOrigin: "0 0" }}>
                  <Street style={{ transform: v.transform }} layers={{ mid: { opacity: v.mid }, fg: { opacity: v.fg } }} />
                </div>
              </div>
            );
          })}
          <svg width={SHEET_W} height={SHEET_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <ellipse
              cx={col * (CELL_W + GAP) + CELL_W / 2}
              cy={row * (CELL_H + GAP) + CELL_H / 2}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="#e3301c"
              strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - circle)}
              opacity={circle > 0 ? 1 - zoom : 0}
              transform={`rotate(-6 ${col * (CELL_W + GAP) + CELL_W / 2} ${row * (CELL_H + GAP) + CELL_H / 2})`}
            />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

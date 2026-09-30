import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { WebbIllustration } from "../components/WebbIllustration";
import { FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

const COLS = 6;
const ROWS = 4;
const CHOSEN = 15; // 被红笔圈中的那一格
const CELL_W = 250;
const CELL_H = 141;
const GAP = 18;

// 每格用不同的取景（位移 + 缩放）模拟连续按下的快门；
// 少了哪一层、差一点时机，照片就“不成立”
const variant = (i: number) => {
  const dx = ((i * 137) % 9) - 4;
  const dy = ((i * 71) % 7) - 3;
  const s = 1 + ((i * 53) % 5) * 0.06;
  return {
    transform: `translate(${dx * 3}%, ${dy * 2}%) scale(${s})`,
    showMid: i === CHOSEN || i % 3 === 0,
    showFg: i === CHOSEN || i % 4 === 1,
  };
};

/** 方法：行走与等待 —— 一张印样，大多数变灰，只有一格被圈出 */
export const MethodScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sheetW = COLS * CELL_W + (COLS - 1) * GAP;
  const sheetH = ROWS * CELL_H + (ROWS - 1) * GAP;

  const fail = interpolate(frame, [11 * fps, 13 * fps], [0, 1], clamp);
  const circle = interpolate(frame, [15 * fps, 16.5 * fps], [0, 1], { ...clamp, easing: ease });
  const zoom = interpolate(frame, [19 * fps, 21.5 * fps], [0, 1], { ...clamp, easing: ease });

  const chosenCol = CHOSEN % COLS;
  const chosenRow = Math.floor(CHOSEN / COLS);
  const cx = chosenCol * (CELL_W + GAP) + CELL_W / 2 - sheetW / 2;
  const cy = chosenRow * (CELL_H + GAP) + CELL_H / 2 - sheetH / 2;
  const zoomScale = 1 + zoom * (1920 / CELL_W - 1);

  return (
    <SceneShell id="method">
      <AbsoluteFill style={{ backgroundColor: "#16120f" }} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${zoomScale}) translate(${-cx * zoom}px, ${-cy * zoom}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: sheetW,
            height: sheetH,
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const v = variant(i);
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const appear = interpolate(frame, [i * 3, i * 3 + 10], [0, 1], clamp);
            const isChosen = i === CHOSEN;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: col * (CELL_W + GAP),
                  top: row * (CELL_H + GAP),
                  width: CELL_W,
                  height: CELL_H,
                  overflow: "hidden",
                  opacity: appear * (isChosen ? 1 : 1 - fail * 0.7),
                  filter: isChosen ? undefined : `grayscale(${fail})`,
                }}
              >
                <div style={{ position: "absolute", width: 1920, height: 1080, scale: CELL_W / 1920, transformOrigin: "0 0" }}>
                  <WebbIllustration
                    style={{ transform: v.transform }}
                    layers={{ mid: { opacity: v.showMid ? 1 : 0 }, fg: { opacity: v.showFg ? 1 : 0 } }}
                  />
                </div>
              </div>
            );
          })}
          <svg
            width={sheetW}
            height={sheetH}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          >
            {(() => {
              const x = chosenCol * (CELL_W + GAP) + CELL_W / 2;
              const y = chosenRow * (CELL_H + GAP) + CELL_H / 2;
              const rx = CELL_W * 0.62;
              const ry = CELL_H * 0.72;
              const c = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
              return (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke="#e0301e"
                  strokeWidth={8 * (1 - zoom) + 1}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - circle)}
                  opacity={1 - zoom}
                  transform={`rotate(-6 ${x} ${y})`}
                />
              );
            })()}
          </svg>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 80,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          color: INK,
          opacity: interpolate(frame, [0, 18], [0, 1], clamp) * (1 - zoom),
        }}
      >
        <span style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 84 }}>行走与等待</span>
        <span style={{ fontFamily: FONT_SANS, fontSize: 36, opacity: 0.75 }}>
          {fail > 0.5 ? "大多数都是失败的" : "同一个街角，按下很多次快门"}
        </span>
      </div>
    </SceneShell>
  );
};

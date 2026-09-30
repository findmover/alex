import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/photos";
import { CELLS, GRID, WebbIllustration } from "../components/WebbIllustration";
import { ACCENT, FONT_SANS, KeywordTag, OriginalInset, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

/** 关键词三：分割 —— 画出结构线，格子依次高亮 */
export const GridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    ...GRID.vertical.map((x) => ({ x1: x, y1: 0, x2: x, y2: 1080 })),
    ...GRID.horizontal.map((y) => ({ x1: 0, y1: y, x2: 1920, y2: y })),
  ];

  const cellStart = 9 * fps;
  const cellLen = 2 * fps;
  const active = Math.floor((frame - cellStart) / cellLen);
  const cell = frame >= cellStart && active < CELLS.length ? CELLS[active] : null;
  const cellLocal = frame - cellStart - active * cellLen;
  const dim = cell
    ? interpolate(cellLocal, [0, 8, cellLen - 8, cellLen], [0, 0.62, 0.62, 0], clamp)
    : 0;

  return (
    <SceneShell id="grid">
      <WebbIllustration />
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          {cell ? (
            <path
              fillRule="evenodd"
              fill={`rgba(0,0,0,${dim})`}
              d={`M0 0H1920V1080H0Z M${cell.x} ${cell.y}h${cell.w}v${cell.h}h-${cell.w}Z`}
            />
          ) : null}
          {lines.map((l, i) => {
            const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
            const start = (3 + i * 0.7) * fps;
            const drawn = interpolate(frame, [start, start + 0.8 * fps], [0, 1], { ...clamp, easing: ease });
            return (
              <line
                key={i}
                {...l}
                stroke={ACCENT}
                strokeWidth={8}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - drawn)}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
      {cell ? (
        <div
          style={{
            position: "absolute",
            left: (cell.x + cell.w / 2),
            top: cell.y + 24,
            translate: "-50% 0px",
            opacity: dim / 0.62,
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: 44,
            color: "#1a1410",
            background: ACCENT,
            padding: "4px 20px",
            borderRadius: 8,
            whiteSpace: "nowrap",
          }}
        >
          {cell.label}
        </div>
      ) : null}
      <KeywordTag index="关键词三" word="分割" en="FRAMES WITHIN FRAMES" />
      <OriginalInset photo={PHOTOS.grid} fromSec={17} />
    </SceneShell>
  );
};

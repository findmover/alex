import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/photos";
import { WebbIllustration } from "../components/WebbIllustration";
import { ACCENT, FONT_SANS, INK, KeywordTag, OriginalInset, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

// 取景框的起止位置（插画坐标）：最终把孩子的脸、狗和那只手切在边缘
const FROM = { x: 300, y: 260, w: 1320, h: 560 };
const TO = { x: 110, y: 170, w: 1670, h: 800 };

const MARKS = [
  { cx: 110, cy: 330, r: 140, label: "半张脸", lx: 150, ly: 470 },
  { cx: 1780, cy: 900, r: 120, label: "半条狗", lx: 1500, ly: 740 },
  { cx: 1780, cy: 675, r: 80, label: "一只手", lx: 1520, ly: 560 },
];

/** 关键词四：边缘 —— 取景框移动、裁切，被切掉的部分高亮 */
export const EdgesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [2 * fps, 5 * fps], [0, 1], { ...clamp, easing: ease });
  const box = {
    x: FROM.x + (TO.x - FROM.x) * t,
    y: FROM.y + (TO.y - FROM.y) * t,
    w: FROM.w + (TO.w - FROM.w) * t,
    h: FROM.h + (TO.h - FROM.h) * t,
  };

  return (
    <SceneShell id="edges">
      <WebbIllustration />
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          {/* 画框外变暗 */}
          <path
            fillRule="evenodd"
            fill="rgba(0,0,0,0.62)"
            d={`M0 0H1920V1080H0Z M${box.x} ${box.y}h${box.w}v${box.h}h-${box.w}Z`}
          />
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={INK} strokeWidth={6} />
          {MARKS.map((m, i) => {
            const start = (7 + i * 1.6) * fps;
            const p = interpolate(frame, [start, start + 0.7 * fps], [0, 1], { ...clamp, easing: ease });
            const c = 2 * Math.PI * m.r;
            return (
              <g key={m.label} opacity={p > 0 ? 1 : 0}>
                <circle
                  cx={m.cx}
                  cy={m.cy}
                  r={m.r}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={8}
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - p)}
                />
                <text
                  x={m.lx}
                  y={m.ly}
                  fill={ACCENT}
                  opacity={p}
                  style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 48 }}
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <KeywordTag index="关键词四" word="边缘" en="EDGES" />
      <OriginalInset photo={PHOTOS.edges} fromSec={13} />
    </SceneShell>
  );
};

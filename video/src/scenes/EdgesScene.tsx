import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Street } from "../components/Street";
import { ACCENT, FONT_SANS, INK, clamp, ease } from "../components/ui";
import { PHOTOS } from "../data/photos";
import { KeywordFrame } from "./KeywordFrame";

// 取景框从“规矩的居中构图”移动到“把人切在边缘”的构图（插画坐标）
const FROM = { x: 460, y: 260, w: 1000, h: 562 };
const TO = { x: 130, y: 150, w: 1640, h: 860 };

const MARKS = [
  { cx: 130, cy: 450, r: 150, label: "半张脸", lx: 180, ly: 660 },
  { cx: 1770, cy: 643, r: 90, label: "一只手", lx: 1500, ly: 560 },
  { cx: 1770, cy: 960, r: 110, label: "半条狗", lx: 1470, ly: 860 },
];

/** ③ 边缘：取景框移动、裁切，画框外变暗但仍看得见；被切掉的部分依次圈出 */
export const EdgesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0.5 * fps, 2 * fps], [0, 1], { ...clamp, easing: ease });
  const box = {
    x: FROM.x + (TO.x - FROM.x) * t,
    y: FROM.y + (TO.y - FROM.y) * t,
    w: FROM.w + (TO.w - FROM.w) * t,
    h: FROM.h + (TO.h - FROM.h) * t,
  };

  return (
    <KeywordFrame id="edges" photo={PHOTOS.edges}>
      <Street />
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <path fillRule="evenodd" fill="rgba(0,0,0,0.6)" d={`M0 0H1920V1080H0Z M${box.x} ${box.y}h${box.w}v${box.h}h-${box.w}Z`} />
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={INK} strokeWidth={6} />
          {MARKS.map((m, i) => {
            const start = (2.4 + i * 0.8) * fps;
            const p = interpolate(frame, [start, start + 14], [0, 1], { ...clamp, easing: ease });
            return (
              <g key={m.label} opacity={p > 0 ? 1 : 0}>
                <circle cx={m.cx} cy={m.cy} r={m.r} fill="none" stroke={ACCENT} strokeWidth={9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                <text x={m.lx} y={m.ly} fill={ACCENT} opacity={p} style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 52 }}>
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </KeywordFrame>
  );
};

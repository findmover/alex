import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, Beats, FONT_SANS, PhotoCard, WorkView, clamp, ease } from "../components/ui";
import { WORKS } from "../data/photos";

// Istanbul, Turkey, 2004 上被画框切掉的部分（作品坐标 %）
const MARKS = [
  { x: 22, y: 56, rx: 21, ry: 40, label: "半张脸", lx: 3, ly: 16 },
  { x: 94, y: 62, rx: 8, ry: 28, label: "船被切在画外", lx: 70, ly: 30 },
  { x: 5, y: 93, rx: 6, ry: 9, label: "画外的人", lx: 9, ly: 84 },
];

/**
 * ③ 边缘 —— 先在 Istanbul 2004 上描出画框、依次圈出被切掉的部分；
 * 然后镜头后退进 3D 空间：另外两张（Altınşehir 2004、Kinshasa 1982）作为相片飞来，三张并排缓缓转动。
 */
export const EdgesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameGlow = interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], clamp);
  const toSpace = interpolate(frame, [4.6 * fps, 5.6 * fps], [0, 1], { ...clamp, easing: ease });
  const orbit = interpolate(frame, [4.6 * fps, 8 * fps], [0, 1], clamp);

  const side = (dir: -1 | 1, delay: number) => {
    const t = interpolate(frame, [(4.9 + delay) * fps, (5.9 + delay) * fps], [0, 1], { ...clamp, easing: ease });
    return {
      opacity: t,
      transform: `translate3d(${dir * (560 + (1 - t) * 700)}px, ${(1 - t) * 80}px, ${-220 - (1 - t) * 800}px) rotateY(${dir * -(22 + (1 - t) * 40)}deg)`,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <AbsoluteFill style={{ opacity: 1 - toSpace }}>
        <WorkView work={WORKS.istanbulShip} push={[1, 1.03]}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
            <rect x={0} y={0} width={100} height={100} fill="none" stroke={ACCENT} strokeWidth={6} vectorEffect="non-scaling-stroke" opacity={frameGlow} />
            {MARKS.map((m, i) => {
              const s = (1.3 + i * 0.9) * fps;
              const p = interpolate(frame, [s, s + 14], [0, 1], { ...clamp, easing: ease });
              return (
                <ellipse
                  key={m.label}
                  cx={m.x}
                  cy={m.y}
                  rx={m.rx}
                  ry={m.ry}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={7}
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  opacity={p > 0 ? 1 : 0}
                />
              );
            })}
          </svg>
          {MARKS.map((m, i) => {
            const s = (1.5 + i * 0.9) * fps;
            const p = interpolate(frame, [s, s + 10], [0, 1], clamp);
            return (
              <div
                key={m.label}
                style={{
                  position: "absolute",
                  left: `${m.lx}%`,
                  top: `${m.ly}%`,
                  opacity: p,
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: 40,
                  color: "#1a1410",
                  background: ACCENT,
                  padding: "2px 16px",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {m.label}
              </div>
            );
          })}
        </WorkView>
      </AbsoluteFill>
      {/* 3D 空间：三张“溢出画框”的作品并排 */}
      <AbsoluteFill style={{ perspective: 1800, opacity: toSpace, justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateY(60px) rotateY(${-6 + orbit * 12}deg)` }}>
          <PhotoCard work={WORKS.upsideDown} w={560} label style={{ left: -294, top: -200, ...side(-1, 0) }} />
          <PhotoCard work={WORKS.istanbulShip} w={620} label style={{ left: -324, top: -225, transform: `translateZ(${60 * toSpace}px)` }} />
          <PhotoCard work={WORKS.kinshasa} w={560} label style={{ left: -294, top: -200, ...side(1, 0.25) }} />
        </div>
      </AbsoluteFill>
      <Beats id="edges" />
    </AbsoluteFill>
  );
};

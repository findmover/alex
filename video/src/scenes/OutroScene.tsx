import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, Beats, FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";
import { CREDIT, WORKS } from "../data/photos";

const STEPS = [
  { n: "①", text: "看色块与影子", work: WORKS.leonBox, at: 0.6 },
  { n: "②", text: "数一数层次", work: WORKS.tehuantepec, at: 1.2 },
  { n: "③", text: "看画框边缘", work: WORKS.istanbulShip, at: 1.8 },
];

/** 第八幕 · 结尾（6s）：三个看图方法（配三张作品）+ 推荐书 + 版权说明 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 56, paddingTop: 40, perspective: 1600 }}>
        {STEPS.map((s) => {
          const t = interpolate(frame, [s.at * fps, s.at * fps + 16], [0, 1], { ...clamp, easing: ease });
          return (
            <div
              key={s.n}
              style={{
                opacity: t,
                transform: `translateY(${(1 - t) * 60}px) rotateX(${(1 - t) * 50}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div style={{ padding: 10, background: "#efebe3" }}>
                <Img src={staticFile(s.work.file)} style={{ width: 480, height: 480 / s.work.ratio, display: "block" }} />
              </div>
              <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 56, color: INK }}>
                <span style={{ color: ACCENT, marginRight: 12 }}>{s.n}</span>
                {s.text}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Beats id="outro" scrim={false} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 30,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontSize: 22,
          color: INK,
          opacity: interpolate(frame, [3 * fps, 3.6 * fps], [0, 0.6], clamp),
        }}
      >
        摄影作品 {CREDIT} · 片中插画为原创示意图
      </div>
    </AbsoluteFill>
  );
};

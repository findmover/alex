import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Street } from "../components/Street";
import { ACCENT, Beats, FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";

const STEPS = [
  { n: "①", text: "看色块", layers: { mid: { opacity: 0 }, fg: { opacity: 0 } }, at: 1.0 },
  { n: "②", text: "数层次", layers: { bg: { opacity: 0.25 }, shadow: { opacity: 0.25 } }, at: 1.9 },
  { n: "③", text: "看边缘", layers: {}, at: 2.8, crop: true },
];

/** 第七幕 · 结尾（8s）：三个看图方法 + 推荐书 + 版权说明 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 60, paddingTop: 60 }}>
        {STEPS.map((s) => {
          const t = interpolate(frame, [s.at * fps, s.at * fps + 14], [0, 1], { ...clamp, easing: ease });
          return (
            <div key={s.n} style={{ opacity: t, translate: `0px ${(1 - t) * 60}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <div style={{ position: "relative", width: 480, height: 270, overflow: "hidden", borderRadius: 8 }}>
                <div style={{ width: 1920, height: 1080, scale: 0.25, transformOrigin: "0 0" }}>
                  <Street layers={s.layers} />
                </div>
                {s.crop ? (
                  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
                    <path fillRule="evenodd" fill="rgba(0,0,0,0.6)" d="M0 0H1920V1080H0Z M130 150h1640v860h-1640Z" />
                    <rect x={130} y={150} width={1640} height={860} fill="none" stroke={ACCENT} strokeWidth={18} />
                  </svg>
                ) : null}
              </div>
              <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 64, color: INK }}>
                <span style={{ color: ACCENT, marginRight: 14 }}>{s.n}</span>
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
          opacity: interpolate(frame, [5 * fps, 5.6 * fps], [0, 0.6], clamp),
        }}
      >
        片中插画为原创示意图 · 摄影作品版权归 Alex Webb / Magnum Photos 所有
      </div>
    </AbsoluteFill>
  );
};

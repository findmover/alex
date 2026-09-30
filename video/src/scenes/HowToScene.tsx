import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { WebbIllustration } from "../components/WebbIllustration";
import { ACCENT, FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

const Thumb: React.FC<{ kind: "blocks" | "layers" | "edges" }> = ({ kind }) => (
  <div style={{ position: "relative", width: 440, height: 248, overflow: "hidden", borderRadius: 6 }}>
    <div style={{ position: "absolute", width: 1920, height: 1080, scale: 440 / 1920, transformOrigin: "0 0" }}>
      <WebbIllustration
        layers={
          kind === "blocks"
            ? { mid: { opacity: 0 }, fg: { opacity: 0 } }
            : kind === "layers"
              ? { bg: { opacity: 0.25 }, shadow: { opacity: 0.25 } }
              : {}
        }
      />
      {kind === "edges" ? (
        <AbsoluteFill>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%">
            <path fillRule="evenodd" fill="rgba(0,0,0,0.6)" d="M0 0H1920V1080H0Z M110 170h1670v800h-1670Z" />
            <rect x={110} y={170} width={1670} height={800} fill="none" stroke={ACCENT} strokeWidth={16} />
          </svg>
        </AbsoluteFill>
      ) : null}
    </div>
  </div>
);

const STEPS = [
  { n: "①", title: "看色块与阴影", desc: "找出画面的大块结构", kind: "blocks" as const, at: 4.5 },
  { n: "②", title: "数一数层次", desc: "每一层在发生什么", kind: "layers" as const, at: 10 },
  { n: "③", title: "看边缘", desc: "画框外还有什么", kind: "edges" as const, at: 15.5 },
];

/** 怎么看一张韦伯的照片：三张卡片依次出现 */
export const HowToScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell id="howto">
      <AbsoluteFill style={{ padding: "100px 110px 200px", gap: 60 }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: 84,
            color: INK,
            opacity: interpolate(frame, [0, 18], [0, 1], clamp),
          }}
        >
          看懂一张韦伯，只要三步
        </div>
        <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                opacity: interpolate(frame, [s.at * fps, s.at * fps + 15], [0, 1], clamp),
                translate: interpolate(frame, [s.at * fps, s.at * fps + 15], ["0px 50px", "0px 0px"], {
                  ...clamp,
                  easing: ease,
                }),
              }}
            >
              <Thumb kind={s.kind} />
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 50, color: INK }}>
                <span style={{ color: ACCENT, marginRight: 12 }}>{s.n}</span>
                {s.title}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 36, color: INK, opacity: 0.75 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

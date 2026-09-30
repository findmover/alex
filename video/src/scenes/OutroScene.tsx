import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE } from "../components/WebbIllustration";
import { ACCENT, FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

const BOOKS = [
  { title: "The Suffering of Light", note: "2011 · 三十年作品回顾", color: PALETTE.red },
  { title: "La Calle", note: "2016 · 墨西哥街头", color: PALETTE.yellow },
  { title: "On Street Photography and the Poetic Image", note: "2014 · 与 Rebecca Norris Webb 合著，讲方法", color: PALETTE.blue },
];

/** 结尾：金句 + 书单 + 版权说明 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const listIn = 7 * fps;

  return (
    <SceneShell id="outro">
      <AbsoluteFill style={{ padding: "110px 110px 200px", gap: 40 }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: 84,
            color: INK,
            opacity: interpolate(frame, [0, 20], [0, 1], clamp),
          }}
        >
          在混乱里，找到一瞬间的秩序
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 20 }}>
          {BOOKS.map((b, i) => {
            const at = listIn + i * 12;
            return (
              <div
                key={b.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  opacity: interpolate(frame, [at, at + 15], [0, 1], clamp),
                  translate: interpolate(frame, [at, at + 15], ["-40px 0px", "0px 0px"], { ...clamp, easing: ease }),
                }}
              >
                <div style={{ width: 22, height: 96, backgroundColor: b.color, borderRadius: 3 }} />
                <div>
                  <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 50, color: INK, fontStyle: "italic" }}>
                    {b.title}
                  </div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 32, color: INK, opacity: 0.7 }}>{b.note}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          bottom: 40,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontSize: 22,
          color: INK,
          opacity: interpolate(frame, [12 * fps, 13 * fps], [0, 0.6], clamp),
        }}
      >
        片中插画为原创示意图，仅用于讲解构图原理 · 摄影作品版权归 <span style={{ color: ACCENT }}>Alex Webb / Magnum Photos</span> 所有
      </div>
    </SceneShell>
  );
};

import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../components/WebbIllustration";
import { ACCENT, FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

/** 片名：三条色带划过，大标题出现 */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell id="title">
      <AbsoluteFill style={{ flexDirection: "row" }}>
        <div
          style={{
            flex: 1,
            backgroundColor: PALETTE.red,
            translate: interpolate(frame, [0, 20], ["0px -1080px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundColor: PALETTE.yellow,
            translate: interpolate(frame, [4, 24], ["0px 1080px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundColor: PALETTE.blue,
            translate: interpolate(frame, [8, 28], ["0px -1080px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(11,10,9,0.86)",
          opacity: interpolate(frame, [26, 40], [0, 1], clamp),
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
        <Interactive.Div
          name="英文名"
          style={{
            fontFamily: FONT_SANS,
            fontSize: 40,
            letterSpacing: 18,
            color: ACCENT,
            fontWeight: 700,
            opacity: interpolate(frame, [34, 50], [0, 1], clamp),
          }}
        >
          ALEX WEBB
        </Interactive.Div>
        <Interactive.Div
          name="主标题"
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: 150,
            color: INK,
            opacity: interpolate(frame, [38, 58], [0, 1], { ...clamp, easing: ease }),
            translate: interpolate(frame, [38, 58], ["0px 40px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        >
          把混乱拍成秩序
        </Interactive.Div>
        <Interactive.Div
          name="副标题"
          style={{
            fontFamily: FONT_SANS,
            fontSize: 44,
            color: INK,
            opacity: interpolate(frame, [56, 72], [0, 0.85], clamp),
            letterSpacing: 10,
          }}
        >
          亚历克斯·韦伯的色彩 · 层次 · 瞬间
        </Interactive.Div>
      </AbsoluteFill>
    </SceneShell>
  );
};

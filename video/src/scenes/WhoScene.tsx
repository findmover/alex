import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/photos";
import { ACCENT, FONT_SANS, FONT_SERIF, INK, PhotoOrIllustration, clamp, ease } from "../components/ui";
import { SceneShell } from "./SceneShell";

const MILESTONES = [
  { year: "1952", text: "生于美国旧金山", at: 1 },
  { year: "1970s", text: "哈佛读历史与文学", at: 3 },
  { year: "1974", text: "加入玛格南图片社（1979 年成为正式成员）", at: 6 },
  { year: "70 年代中", text: "拍美国南方小镇 · 黑白", at: 8.5 },
  { year: "70 年代后", text: "海地、墨西哥 · 转向彩色", at: 13 },
  { year: "至今", text: "出版 15 本以上摄影集", at: 20 },
];

/** 他是谁：左侧时间轴，右侧画面由黑白慢慢染上颜色 */
export const WhoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell id="who">
      <AbsoluteFill style={{ padding: "110px 110px 200px 110px", flexDirection: "row", gap: 80 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 84, color: INK }}>他是谁</div>
          {MILESTONES.map((m) => (
            <div
              key={m.year}
              style={{
                display: "flex",
                gap: 28,
                alignItems: "baseline",
                opacity: interpolate(frame, [m.at * fps, m.at * fps + 15], [0, 1], clamp),
                translate: interpolate(frame, [m.at * fps, m.at * fps + 15], ["0px 24px", "0px 0px"], {
                  ...clamp,
                  easing: ease,
                }),
              }}
            >
              <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 38, color: ACCENT, width: 190 }}>
                {m.year}
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 40, color: INK }}>{m.text}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            width: 800,
            height: 450,
            alignSelf: "center",
            position: "relative",
            overflow: "hidden",
            borderRadius: 6,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <PhotoOrIllustration
            photo={PHOTOS.who}
            // 只对示意插画做黑白→彩色；真实原作保持原貌
            style={
              PHOTOS.who.src
                ? undefined
                : { filter: `grayscale(${interpolate(frame, [12 * fps, 16 * fps], [1, 0], clamp)})` }
            }
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

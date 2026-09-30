import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, Street } from "../components/Street";
import { FONT_SANS, INK, clamp, ease } from "../components/ui";
import { PHOTOS } from "../data/photos";
import { KeywordFrame } from "./KeywordFrame";

// 从画面里“吸”出来的颜色：吸管位置（插画坐标，%）→ 右侧色卡
const PICKS = [
  { x: 30, y: 30, color: PALETTE.red, name: "橙红" },
  { x: 43, y: 62, color: PALETTE.yellow, name: "明黄" },
  { x: 66, y: 40, color: PALETTE.blue, name: "钴蓝" },
  { x: 16, y: 72, color: PALETTE.black, name: "纯黑" },
];

/**
 * ① 热光：柔光 → 硬光。影子从淡灰变成纯黑的形状并“落”到位，颜色饱和度同步拉满；
 * 然后吸管从画面里取出四个颜色。
 */
export const LightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hard = interpolate(frame, [0.6 * fps, 2.6 * fps], [0, 1], { ...clamp, easing: ease });

  return (
    <KeywordFrame id="light" photo={PHOTOS.light}>
      <Street
        style={{ filter: `saturate(${0.45 + hard * 0.75}) contrast(${0.85 + hard * 0.25})`, scale: 1.04 - hard * 0.04 }}
        layers={{
          shadow: {
            opacity: 0.2 + hard * 0.8,
            translate: `${(1 - hard) * 60}px ${(1 - hard) * -30}px`,
            filter: `blur(${(1 - hard) * 14}px)`,
          },
        }}
      />
      {PICKS.map((p, i) => {
        const at = (3 + i * 0.45) * fps;
        const t = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: ease });
        return (
          <React.Fragment key={p.name}>
            <div
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 70,
                height: 70,
                marginLeft: -35,
                marginTop: -35,
                borderRadius: 35,
                border: `5px solid ${INK}`,
                background: p.color,
                opacity: t,
                scale: 0.4 + t * 0.6,
                boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 110,
                top: 250 + i * 150,
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: t,
                translate: `${(1 - t) * 60}px 0px`,
              }}
            >
              <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 36, color: INK, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
                {p.name}
              </span>
              <div style={{ width: 110, height: 110, background: p.color, border: `4px solid ${INK}`, borderRadius: 8 }} />
            </div>
          </React.Fragment>
        );
      })}
    </KeywordFrame>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, Beats, FONT_SANS, INK, WorkView, clamp, ease } from "../components/ui";
import { SAMPLED, WORKS } from "../data/photos";

// 取色点（作品坐标 %），与 SAMPLED.leon 一一对应
const PICK_AT = [
  { x: 55, y: 30 },
  { x: 4, y: 15 },
  { x: 52, y: 78 },
  { x: 80, y: 82 },
];

/**
 * ① 热光 —— León, Mexico, 1987
 * 1.5s：从照片里提取出的“纯黑影子”被染成高亮色、再描出轮廓：影子本身就是画面的形状；
 * 4.4s：影子退回原样，吸管从原作里取出四个颜色，色卡在 3D 里翻转落位；
 * 最后 2 秒原作干净停留。
 */
export const LightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const work = WORKS.leonBox;
  const w = height * work.ratio;
  const fillOn = interpolate(frame, [1.5 * fps, 2.2 * fps, 3.9 * fps, 4.5 * fps], [0, 0.72, 0.72, 0], { ...clamp, easing: ease });
  const lineOn = interpolate(frame, [2 * fps, 2.6 * fps, 4.2 * fps, 4.6 * fps], [0, 1, 1, 0], clamp);
  const hidden = interpolate(frame, [3 * fps, 3.4 * fps, 4.3 * fps, 4.6 * fps], [0, 1, 1, 0], clamp);
  const chipsOut = interpolate(frame, [6.4 * fps, 6.8 * fps], [1, 0], clamp);
  const maskUrl = `url(${staticFile("photos/fx/16-shadow-mask.png")})`;
  const lineUrl = `url(${staticFile("photos/fx/16-shadow-outline.png")})`;
  const maskStyle = (url: string): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  });

  return (
    <AbsoluteFill>
      <WorkView work={work} push={[1, 1.05]}>
        <div style={{ ...maskStyle(maskUrl), background: ACCENT, opacity: fillOn, mixBlendMode: "screen" }} />
        <div style={{ ...maskStyle(lineUrl), background: INK, opacity: lineOn }} />
        {/* 影子里藏着的人 */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <ellipse cx={46.5} cy={65.5} rx={5.2} ry={7.6} fill="none" stroke={INK} strokeWidth={6} opacity={hidden} vectorEffect="non-scaling-stroke" />
        </svg>
        <div style={{ position: "absolute", left: "52%", top: "70%", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 38, color: INK, opacity: hidden, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          箱子里还藏着一个人
        </div>
        {/* 吸管取色点 */}
        {SAMPLED.leon.map((c, i) => {
          const at = (4.7 + i * 0.3) * fps;
          const t = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: ease });
          return (
            <div
              key={c.name}
              style={{
                position: "absolute",
                left: `${PICK_AT[i].x}%`,
                top: `${PICK_AT[i].y}%`,
                width: 56,
                height: 56,
                marginLeft: -28,
                marginTop: -28,
                borderRadius: 28,
                border: `5px solid ${INK}`,
                background: c.color,
                opacity: t * chipsOut,
                scale: 0.3 + t * 0.7,
                boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
              }}
            />
          );
        })}
      </WorkView>
      {/* 右侧色卡：在 3D 里翻转落位 */}
      <AbsoluteFill style={{ perspective: 1200, pointerEvents: "none" }}>
        {SAMPLED.leon.map((c, i) => {
          const at = (4.9 + i * 0.3) * fps;
          const t = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: ease });
          return (
            <div
              key={c.name}
              style={{
                position: "absolute",
                left: (1920 - w) / 2 + w - 250,
                top: 300 + i * 150,
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: t * chipsOut,
                transform: `rotateY(${(1 - t) * 90}deg)`,
                transformOrigin: "right center",
              }}
            >
              <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: INK, textShadow: "0 2px 10px rgba(0,0,0,0.9)", width: 120, textAlign: "right" }}>
                {c.name}
              </span>
              <div style={{ width: 100, height: 100, background: c.color, border: `4px solid ${INK}`, borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Beats id="light" />
    </AbsoluteFill>
  );
};

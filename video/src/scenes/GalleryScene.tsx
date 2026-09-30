import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Beats, FONT_SANS, clamp } from "../components/ui";
import { CREDIT, GALLERY } from "../data/photos";

const SPACING = 760; // 相邻两幅作品在纵深方向的间距
const WALL_X = 760; // 左右墙离中轴的距离
const FRAME_W = 620;

/**
 * 第七幕 · 他等到的 1%（8s）
 * 3D 画廊：他的作品挂在左右两面墙上，镜头沿走廊匀速向前穿行。
 */
export const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cam = interpolate(frame, [0, durationInFrames], [-300, GALLERY.length * (SPACING / 2) - 400], clamp);
  const fadeIn = interpolate(frame, [0, 0.4 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a2622 0%, #0b0a09 70%)", opacity: fadeIn }}>
      <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 45%", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transformStyle: "preserve-3d",
            transform: `translateZ(${cam}px)`,
          }}
        >
          {/* 地面反光带 */}
          <div
            style={{
              position: "absolute",
              left: -WALL_X,
              top: 330,
              width: WALL_X * 2,
              height: GALLERY.length * SPACING,
              transformOrigin: "0 0",
              transform: "rotateX(90deg)",
              background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
            }}
          />
          {GALLERY.map((work, i) => {
            const left = i % 2 === 0;
            const z = -Math.floor(i / 2) * SPACING - (left ? 0 : SPACING / 2);
            const h = FRAME_W / work.ratio;
            return (
              <div
                key={work.id}
                style={{
                  position: "absolute",
                  left: -FRAME_W / 2,
                  top: -h / 2 - 20,
                  width: FRAME_W,
                  transform: `translate3d(${left ? -WALL_X : WALL_X}px, 0px, ${z}px) rotateY(${left ? 62 : -62}deg)`,
                }}
              >
                <div style={{ padding: 12, background: "#efebe3", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
                  <Img src={staticFile(work.file)} style={{ width: FRAME_W - 24, height: (FRAME_W - 24) / work.ratio, display: "block" }} />
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 20, color: "#d8d2c6", marginTop: 12, opacity: 0.85 }}>{work.caption}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 32, bottom: 20, fontFamily: FONT_SANS, fontSize: 22, color: "#f4eee2", opacity: 0.8 }}>
        摄影作品 {CREDIT}
      </div>
      {/* 标题出现时，中间压一层暗色，保证字可读 */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 55% 30% at 50% 50%, rgba(8,7,6,0.85) 0%, rgba(8,7,6,0.6) 50%, rgba(8,7,6,0) 100%)",
          opacity: interpolate(frame, [0.2 * fps, 0.6 * fps, 3.4 * fps, 3.8 * fps], [0, 1, 1, 0], clamp),
        }}
      />
      <Beats id="gallery" scrim={false} />
    </AbsoluteFill>
  );
};

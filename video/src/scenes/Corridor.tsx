import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere, Dust, FONT_SANS, INK, Verses, beat, clamp, easeCam } from "../components/ui";
import { CREDIT, GALLERY } from "../data/photos";

const SPACING = 820;
const WALL_X = 820;
const FRAME_W = 640;

/**
 * 廊 · 1%（10 拍）—— 3D 画廊。每幅作品上方一束射灯，地面有淡淡的倒影，远处有雾。
 * 镜头沿走廊穿行（全片唯一的“快”段落）。
 */
export const Corridor: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: easeCam });
  const cam = -200 + t * (GALLERY.length / 2) * SPACING * 0.92;
  const plate = interpolate(frame, [beat(0.3), beat(0.8), beat(4.6), beat(5.2)], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#0a0908" }}>
      <AbsoluteFill style={{ perspective: 1000, perspectiveOrigin: "50% 46%", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d", transform: `translateZ(${cam}px)` }}>
          {/* 地面 */}
          <div
            style={{
              position: "absolute",
              left: -WALL_X,
              top: 360,
              width: WALL_X * 2,
              height: GALLERY.length * SPACING,
              transformOrigin: "0 0",
              transform: "rotateX(90deg)",
              background: "linear-gradient(90deg, #120f0c, #1d1915 50%, #120f0c)",
            }}
          />
          {GALLERY.map((work, i) => {
            const left = i % 2 === 0;
            const z = -Math.floor(i / 2) * SPACING - (left ? 0 : SPACING / 2);
            const h = FRAME_W / work.ratio;
            const fog = interpolate(z + cam, [-5200, -1200], [0.08, 1], clamp);
            return (
              <div
                key={work.id}
                style={{
                  position: "absolute",
                  left: -FRAME_W / 2,
                  top: -h / 2 - 30,
                  width: FRAME_W,
                  transform: `translate3d(${left ? -WALL_X : WALL_X}px, 0px, ${z}px) rotateY(${left ? 66 : -66}deg)`,
                  opacity: fog,
                }}
              >
                {/* 射灯光池 */}
                <div
                  style={{
                    position: "absolute",
                    left: -160,
                    right: -160,
                    top: -220,
                    height: h + 360,
                    background: "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,226,180,0.22), rgba(255,226,180,0) 70%)",
                  }}
                />
                <div style={{ position: "relative", padding: 12, background: "#efe9dd", boxShadow: "0 30px 70px rgba(0,0,0,0.7)" }}>
                  <Img src={staticFile(work.file)} style={{ width: FRAME_W - 24, height: (FRAME_W - 24) / work.ratio, display: "block" }} />
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", color: INK, marginTop: 14, opacity: 0.7 }}>
                  {work.caption}
                </div>
                {/* 地面倒影 */}
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: h + 90,
                    width: FRAME_W - 24,
                    height: (FRAME_W - 24) / work.ratio,
                    transform: "scaleY(-1)",
                    opacity: 0.16,
                    WebkitMaskImage: "linear-gradient(0deg, black, transparent 60%)",
                    maskImage: "linear-gradient(0deg, black, transparent 60%)",
                  }}
                >
                  <Img src={staticFile(work.file)} style={{ width: "100%", height: "100%", display: "block", filter: "blur(2px)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 42% 26% at 50% 50%, rgba(8,7,6,0.88) 0%, rgba(8,7,6,0.55) 55%, rgba(8,7,6,0) 100%)",
          opacity: plate,
        }}
      />
      <div style={{ position: "absolute", right: 40, bottom: 28, fontFamily: FONT_SANS, fontSize: 18, letterSpacing: "0.18em", color: INK, opacity: 0.7 }}>
        PHOTOGRAPHS {CREDIT}
      </div>
      <Dust seed="corridor" count={60} />
      <Atmosphere />
      <Verses id="corridor" />
    </AbsoluteFill>
  );
};

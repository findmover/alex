import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Atmosphere, Caption, Chapter, Dust, PhotoPlane, Stage, Verses, beat, clamp, easeCam, fitWidth } from "../components/ui";
import { WORKS } from "../data/photos";

/**
 * 影 · León, Mexico, 1987（10 拍）
 * 从原作中提取出的“纯黑影子”（scripts/prepare-photos.py）作为一层黑色剪纸，
 * 从照片上脱离、浮向镜头；镜头随之环绕，影子悬在空中成为“形状”；随后落回原位，原作干净停留。
 */
export const Shadow: React.FC = () => {
  const frame = useCurrentFrame();
  const work = WORKS.leonBox;
  const fw = fitWidth(work) * 0.9;
  const lift = interpolate(frame, [beat(1.4), beat(4), beat(6.4), beat(8)], [0, 1, 1, 0], { ...clamp, easing: easeCam });
  const orbit = interpolate(frame, [beat(1.4), beat(8)], [0, 1], { ...clamp, easing: easeCam });
  const rotY = Math.sin(orbit * Math.PI) * -22;
  const url = `url(${staticFile("photos/fx/16-shadow-mask.png")})`;
  const edgeUrl = `url(${staticFile("photos/fx/16-shadow-outline.png")})`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <Stage perspective={1700} camera={`rotateX(${4 * lift}deg) rotateY(${rotY}deg) scale(${1 - 0.1 * lift})`}>
        <PhotoPlane work={work} w={fw} style={{ boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }} />
        {/* 影子层：同尺寸、同位置，沿 Z 轴浮起 */}
        <div
          style={{
            position: "absolute",
            width: fw,
            height: fw / work.ratio,
            left: -fw / 2,
            top: -fw / work.ratio / 2,
            transform: `translateZ(${440 * lift}px)`,
            background: "#050404",
            WebkitMaskImage: url,
            maskImage: url,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            opacity: lift > 0.01 ? 1 : 0,
            filter: `drop-shadow(0 ${30 * lift}px ${40 * lift}px rgba(0,0,0,0.8))`,
          }}
        />
        {/* 剪纸的受光边：让浮起的影子读作一张有厚度的纸 */}
        <div
          style={{
            position: "absolute",
            width: fw,
            height: fw / work.ratio,
            left: -fw / 2,
            top: -fw / work.ratio / 2,
            transform: `translateZ(${440 * lift + 1}px)`,
            background: "#ffd9b0",
            WebkitMaskImage: edgeUrl,
            maskImage: edgeUrl,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            opacity: 0.55 * lift,
          }}
        />
      </Stage>
      <AbsoluteFill style={{ opacity: 1 - lift }}>
        <Caption work={work} />
      </AbsoluteFill>
      <Chapter glyph="影" en="SHADOW" />
      <Dust seed="shadow" count={50} />
      <Atmosphere />
      <Verses id="shadow" />
    </AbsoluteFill>
  );
};

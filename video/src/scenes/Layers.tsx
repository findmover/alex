import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Atmosphere, Caption, Chapter, Dust, INK, Stage, Verses, beat, clamp, easeCam, fitWidth } from "../components/ui";
import { WORKS } from "../data/photos";

/*
 * Tehuantepec, Mexico, 1985 按画面内容手工切成三层（多边形，作品坐标 %）：
 *   前景：转球的男孩（含球和手臂）+ 左下角被切掉的男孩
 *   中景：纪念碑与站在上面的男孩
 *   背景：其余（教堂、远处的孩子和行人）
 */
const FG = [
  "17,52 20,46 26,44 31,46 33,52 34,60 33,68 37,75 44,73 47,69 47,62 45,55 46,45 50,40 56,38 61,41 63,48 62,56 58,62 57,70 55,76 50,84 44,92 41,100 17,100 18,84 20,74 18,64",
  "0,70 4,67 10,68 13,74 12,82 9,90 8,100 0,100",
];
const MID = "28,0 51,0 51,22 55,26 56,33 56,62 58,66 59,72 59,100 10,100 10,72 14,70 17,34 19,31 26,24 28,22";

const Plane: React.FC<{ id: string; show: string[]; hide: string[]; line: number; style: React.CSSProperties; w: number; h: number }> = ({
  id,
  show,
  hide,
  line,
  style,
  w,
  h,
}) => {
  const work = WORKS.tehuantepec;
  return (
    <div style={{ position: "absolute", width: w, height: h, left: -w / 2, top: -h / 2, ...style }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <mask id={`lm-${id}`}>
            {show.length ? show.map((p, i) => <polygon key={i} points={p} fill="white" />) : <rect width={100} height={100} fill="white" />}
            {hide.map((p, i) => (
              <polygon key={`h${i}`} points={p} fill="black" />
            ))}
          </mask>
        </defs>
        <image href={staticFile(work.file)} x={0} y={0} width={100} height={100} preserveAspectRatio="none" mask={`url(#lm-${id})`} />
        {(show.length ? show : ["0,0 100,0 100,100 0,100"]).map((p, i) => (
          <polygon key={`o${i}`} points={p} fill="none" stroke={INK} strokeWidth={1.5} vectorEffect="non-scaling-stroke" opacity={line * 0.7} />
        ))}
      </svg>
    </div>
  );
};

/**
 * 层 · Tehuantepec, Mexico, 1985（12 拍）
 * 镜头从正面缓缓环绕到侧面，三层拉开景深（远处加雾），停留，再合拢回原作。
 */
export const Layers: React.FC = () => {
  const frame = useCurrentFrame();
  const work = WORKS.tehuantepec;
  const w = fitWidth(work) * 0.92;
  const h = w / work.ratio;
  const split = interpolate(frame, [beat(1), beat(4.2), beat(7.4), beat(9.6)], [0, 1, 1, 0], { ...clamp, easing: easeCam });
  const drift = interpolate(frame, [beat(4.2), beat(7.4)], [0, 1], clamp);
  const cam = `translateX(${170 * split}px) scale(${1 - 0.3 * split}) rotateX(${5 * split}deg) rotateY(${(-40 - 6 * drift) * split}deg)`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <Stage perspective={2400} camera={cam}>
        <Plane id="bg" show={[]} hide={[MID, ...FG]} line={split} w={w} h={h} style={{ transform: `translateZ(${-950 * split}px)`, filter: `brightness(${1 - 0.35 * split})` }} />
        <Plane id="mid" show={[MID]} hide={FG} line={split} w={w} h={h} style={{ transform: `translateZ(${-200 * split}px)`, filter: `brightness(${1 - 0.15 * split})` }} />
        <Plane id="fg" show={FG} hide={[]} line={split} w={w} h={h} style={{ transform: `translateZ(${620 * split}px)` }} />
      </Stage>
      <AbsoluteFill style={{ opacity: 1 - split }}>
        <Caption work={work} />
      </AbsoluteFill>
      <Chapter glyph="层" en="LAYERS" />
      <Dust seed="layers" count={55} />
      <Atmosphere />
      <Verses id="layers" />
      <Img src={staticFile(work.file)} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
    </AbsoluteFill>
  );
};

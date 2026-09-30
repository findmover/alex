import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, Beats, Caption, FONT_SANS, INK, clamp, ease } from "../components/ui";
import { WORKS } from "../data/photos";

/*
 * 把 Tehuantepec, Mexico, 1985 按画面内容手工切成三层（多边形，作品坐标 %）：
 *   前景：转球的男孩（含球和手臂）+ 左下角被切掉的男孩
 *   中景：纪念碑与站在上面的男孩
 *   背景：其余（教堂、远处的孩子和行人）
 */
const FG = [
  "17,52 20,46 26,44 31,46 33,52 34,60 33,68 37,75 44,73 47,69 47,62 45,55 46,45 50,40 56,38 61,41 63,48 62,56 58,62 57,70 55,76 50,84 44,92 41,100 17,100 18,84 20,74 18,64",
  "0,70 4,67 10,68 13,74 12,82 9,90 8,100 0,100",
];
const MID = "28,0 51,0 51,22 55,26 56,33 56,62 58,66 59,72 59,100 10,100 10,72 14,70 17,34 19,31 26,24 28,22";

const Plane: React.FC<{
  id: string;
  show: string[];
  hide: string[];
  outline: number;
  children?: React.ReactNode;
  style: React.CSSProperties;
}> = ({ id, show, hide, outline, children, style }) => {
  const work = WORKS.tehuantepec;
  return (
    <AbsoluteFill style={style}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <mask id={`m-${id}`}>
            {show.length ? show.map((p, i) => <polygon key={i} points={p} fill="white" />) : <rect width={100} height={100} fill="white" />}
            {hide.map((p, i) => (
              <polygon key={`h${i}`} points={p} fill="black" />
            ))}
          </mask>
        </defs>
        <image href={staticFile(work.file)} x={0} y={0} width={100} height={100} preserveAspectRatio="none" mask={`url(#m-${id})`} />
        {(show.length ? show : ["0,0 100,0 100,100 0,100"]).map((p, i) => (
          <polygon key={`o${i}`} points={p} fill="none" stroke={INK} strokeWidth={4} vectorEffect="non-scaling-stroke" opacity={outline} />
        ))}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ text: string; left: string; top: string; opacity: number }> = ({ text, left, top, opacity }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      opacity,
      fontFamily: FONT_SANS,
      fontWeight: 700,
      fontSize: 56,
      color: "#1a1410",
      background: ACCENT,
      padding: "4px 24px",
      borderRadius: 10,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/**
 * ② 层次 —— 原作被切成三张“纸片”，在 3D 空间里转开、拉开景深，标出 前景 / 中景 / 背景，再合拢；
 * 合拢后原作干净停留。
 */
export const LayersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const work = WORKS.tehuantepec;
  const w = height * work.ratio;
  const split = interpolate(frame, [1 * fps, 2.8 * fps, 5.2 * fps, 6.4 * fps], [0, 1, 1, 0], { ...clamp, easing: ease });
  const tags = interpolate(frame, [2.6 * fps, 3 * fps, 5 * fps, 5.3 * fps], [0, 1, 1, 0], clamp);
  const plane = (z: number): React.CSSProperties => ({ transformStyle: "preserve-3d", transform: `translateZ(${z * split}px)` });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <AbsoluteFill style={{ perspective: 2600, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        <div
          style={{
            position: "relative",
            width: w,
            height,
            transformStyle: "preserve-3d",
            transform: `translateX(${200 * split}px) translateY(${60 * split}px) scale(${1 - 0.36 * split}) rotateY(${-34 * split}deg) rotateX(${6 * split}deg)`,
          }}
        >
          <Plane id="bg" show={[]} hide={[MID, ...FG]} outline={split} style={plane(-900)}>
            <Tag text="背景" left="70%" top="6%" opacity={tags} />
          </Plane>
          <Plane id="mid" show={[MID]} hide={FG} outline={split} style={plane(-150)}>
            <Tag text="中景" left="36%" top="10%" opacity={tags} />
          </Plane>
          <Plane id="fg" show={FG} hide={[]} outline={split} style={plane(650)}>
            <Tag text="前景" left="20%" top="40%" opacity={tags} />
          </Plane>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - split }}>
        <Caption work={work} />
      </AbsoluteFill>
      <Beats id="layers" />
      {/* 预加载，避免 SVG image 首帧空白 */}
      <Img src={staticFile(work.file)} style={{ width: 1, height: 1, opacity: 0 }} />
    </AbsoluteFill>
  );
};

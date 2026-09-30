import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Atmosphere, Caption, Chapter, Dust, INK, PhotoPlane, Stage, Verses, beat, clamp, easeCam, fitWidth } from "../components/ui";
import { WORKS } from "../data/photos";

/**
 * 边 · Istanbul, Turkey, 2004（10 拍）
 * 原作先满屏；镜头后拉，照片成了黑暗里一扇发光的“窗”，四周露出细光框；
 * 然后两侧的作品（Altınşehir 2004、Kinshasa 1982）像屏风一样从背后折开。
 */
export const Edge: React.FC = () => {
  const frame = useCurrentFrame();
  const main = WORKS.istanbulShip;
  const fw = fitWidth(main);
  const back = interpolate(frame, [beat(1), beat(4)], [0, 1], { ...clamp, easing: easeCam });
  const unfold = interpolate(frame, [beat(4.2), beat(6.6)], [0, 1], { ...clamp, easing: easeCam });
  const orbit = interpolate(frame, [beat(4.2), beat(10)], [0, 1], clamp);
  const scale = 1 - 0.5 * back;
  const pw = fw; // 三扇屏同宽（未缩放尺寸），由相机统一缩小
  const ph = pw / main.ratio;

  const Panel: React.FC<{ side: -1 | 1 }> = ({ side }) => {
    const work = side < 0 ? WORKS.upsideDown : WORKS.kinshasa;
    const h = ph;
    const w = h * work.ratio;
    const angle = side * (180 - 150 * unfold); // 180 = 折在背后，30 = 打开
    return (
      <div
        style={{
          position: "absolute",
          left: side < 0 ? -pw / 2 - w : pw / 2,
          top: -h / 2,
          width: w,
          height: h,
          transformOrigin: side < 0 ? "right center" : "left center",
          transform: `rotateY(${angle}deg)`,
          opacity: unfold > 0.02 ? 1 : 0,
        }}
      >
        <PhotoPlane work={work} w={w} style={{ left: 0, top: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.5 * (1 - unfold)})` }} />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0a09" }}>
      <Stage perspective={2200} camera={`scale(${scale}) rotateY(${(-8 + 16 * orbit) * unfold}deg)`}>
        <PhotoPlane work={main} w={pw} style={{ outline: `${2 / scale}px solid rgba(239,233,221,${0.8 * back})`, outlineOffset: 18 / scale }} />
        <Panel side={-1} />
        <Panel side={1} />
      </Stage>
      <AbsoluteFill style={{ opacity: 1 - back }}>
        <Caption work={main} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 64,
          textAlign: "center",
          fontFamily: "WebbSans",
          fontSize: 16,
          letterSpacing: "0.3em",
          color: INK,
          opacity: 0.55 * unfold,
        }}
      >
        {"ALTINŞEHIR, ISTANBUL, 2004 \u00b7 ISTANBUL, 2004 \u00b7 KINSHASA, ZAIRE, 1982"}
      </div>
      <Chapter glyph="边" en="EDGES" />
      <Dust seed="edge" count={50} />
      <Atmosphere />
      <Verses id="edge" />
    </AbsoluteFill>
  );
};

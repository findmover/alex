import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ACCENT, FONT_SANS, FONT_SERIF, Grain, INK, NIGHT, Vignette } from "../components/ui";
import { CREDIT, WORKS } from "../data/photos";

/**
 * 抖音封面（canvas-design：Chromatic Patience，见 docs/05-封面设计理念.md）
 * 九成的暗，承托一成的光；红只落在“光”字上。
 */
export const Cover: React.FC<{ layout: "portrait" | "landscape" }> = ({ layout }) => {
  const work = WORKS.haitiRedWall;
  const portrait = layout === "portrait";
  const pw = portrait ? 860 : 1120;
  const ph = pw / work.ratio;
  const mat = 12;

  const photo = (
    <div style={{ padding: mat, background: INK, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
      <Img src={staticFile(work.file)} style={{ width: pw, height: ph, display: "block" }} />
    </div>
  );
  const title = (
    <div style={{ display: "flex", flexDirection: portrait ? "row" : "column", gap: portrait ? 36 : 10, alignItems: "center" }}>
      <span style={{ fontFamily: FONT_SERIF, fontWeight: 500, fontSize: 210, lineHeight: 1, color: INK }}>等</span>
      <span style={{ fontFamily: FONT_SERIF, fontWeight: 500, fontSize: 210, lineHeight: 1, color: ACCENT }}>光</span>
    </div>
  );
  const caps = (
    <div style={{ fontFamily: FONT_SANS, fontSize: 20, letterSpacing: "0.42em", color: INK, opacity: 0.8, whiteSpace: "nowrap" }}>WAITING FOR LIGHT</div>
  );
  const quote = (
    <div style={{ fontFamily: FONT_SERIF, fontSize: 30, letterSpacing: "0.08em", color: INK, opacity: 0.85, whiteSpace: "nowrap" }}>
      “这种摄影，99% 都是失败。”
    </div>
  );
  const credit = (
    <div style={{ fontFamily: FONT_SANS, fontSize: 14, letterSpacing: "0.22em", color: INK, opacity: 0.5, whiteSpace: "nowrap" }}>
      {`${work.caption.toUpperCase()} · ${CREDIT.toUpperCase()}`}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: NIGHT }}>
      {portrait ? (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
          {photo}
          <div style={{ height: 14 }} />
          {credit}
          <div style={{ height: 90 }} />
          {title}
          <div style={{ height: 40 }} />
          {caps}
          <div style={{ height: 36 }} />
          {quote}
          <div style={{ height: 24 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 18, letterSpacing: "0.32em", color: INK, opacity: 0.6 }}>ALEX WEBB</div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", paddingLeft: 136, gap: 120 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {photo}
            {credit}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            {title}
            {caps}
            <div style={{ fontFamily: FONT_SANS, fontSize: 18, letterSpacing: "0.32em", color: INK, opacity: 0.6 }}>ALEX WEBB</div>
          </div>
        </AbsoluteFill>
      )}
      <Vignette strength={0.5} />
      <Grain strength={0.07} />
    </AbsoluteFill>
  );
};

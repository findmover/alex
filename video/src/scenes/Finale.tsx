import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ACCENT, Atmosphere, Dust, FONT_SERIF, INK, Verses, beat, clamp, easeOut } from "../components/ui";

/** 终 · 等光（8 拍）：黑场，尘埃慢慢飘；片名逐字从模糊中显现，一道暖光从字后掠过。 */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = ["等", "光"];
  const sweep = interpolate(frame, [beat(1.6), beat(4)], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#070605" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 30% 40% at ${sweep}% 45%, rgba(238,106,58,0.22), rgba(238,106,58,0) 70%)`,
        }}
      />
      <Dust seed="finale" count={80} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 60, paddingBottom: 120 }}>
        {chars.map((c, i) => {
          const t = interpolate(frame, [beat(0.4 + i * 0.8), beat(0.4 + i * 0.8) + 40], [0, 1], { ...clamp, easing: easeOut });
          return (
            <div
              key={c}
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 500,
                fontSize: 220,
                color: i === 1 ? ACCENT : INK,
                opacity: t,
                filter: `blur(${(1 - t) * 18}px)`,
                translate: `0px ${(1 - t) * 30}px`,
              }}
            >
              {c}
            </div>
          );
        })}
      </AbsoluteFill>
      <Atmosphere />
      <Verses id="finale" />
    </AbsoluteFill>
  );
};

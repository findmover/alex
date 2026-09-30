import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Beats, FONT_SANS, FONT_SERIF, INK, clamp, ease } from "../components/ui";

/** 3D 书：封面翻开，几页纸随后翻过 */
const Book: React.FC<{ open: number; flip: number }> = ({ open, flip }) => {
  const W = 420;
  const H = 600;
  const page = (k: number) => Math.min(1, Math.max(0, flip * 3 - k));
  return (
    <div style={{ position: "relative", width: W * 2, height: H, transformStyle: "preserve-3d" }}>
      {/* 右页（书芯） */}
      <div style={{ position: "absolute", left: W, width: W, height: H, background: "#e8e1d0", boxShadow: "inset 20px 0 40px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: 50, fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 2.1, color: "#2f2b26" }}>
          {"Haiti ".repeat(3)}
          <br />
          —— —— —— —— ——
          <br />
          —— —— —— ——
          <br />
          —— —— —— —— ——
        </div>
      </div>
      {/* 翻过的内页 */}
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: W,
            width: W,
            height: H,
            background: k % 2 ? "#efe9da" : "#e4dcc9",
            transformOrigin: "0 50%",
            transform: `rotateY(${-178 * page(k)}deg)`,
            backfaceVisibility: "visible",
            boxShadow: "inset 10px 0 30px rgba(0,0,0,0.15)",
          }}
        />
      ))}
      {/* 封面：正面是书名，翻过去后露出素色的封里（避免文字镜像） */}
      <div
        style={{
          position: "absolute",
          left: W,
          width: W,
          height: H,
          transformOrigin: "0 50%",
          transform: `rotateY(${-180 * open}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "#3b2f2a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
            color: INK,
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontFamily: FONT_SERIF, fontSize: 52, fontWeight: 700, letterSpacing: 4 }}>THE COMEDIANS</div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 26, opacity: 0.8, letterSpacing: 6 }}>GRAHAM GREENE</div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#5a4a40" }} />
      </div>
    </div>
  );
};

/** 示意地图：美国南方 → 海地（轮廓为手绘简化，仅示意） */
const RouteMap: React.FC<{ draw: number }> = ({ draw }) => {
  const path = "M 520 330 C 760 260, 1080 420, 1290 700";
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <rect width={1920} height={1080} fill="#1e2226" />
      {/* 美国东南部 + 佛罗里达半岛 */}
      <path d="M0 0 H1100 L1060 180 L900 250 L820 300 L800 420 L760 560 L720 580 L690 470 L640 330 L520 300 L300 330 L0 360 Z" fill="#4a4b4a" />
      {/* 古巴 */}
      <path d="M560 640 C700 610, 900 640, 1100 700 C1150 715, 1160 740, 1100 740 C 900 720, 720 690, 560 670 Z" fill="#4a4b4a" />
      {/* 伊斯帕尼奥拉岛（西部为海地） */}
      <path d="M1210 690 C1260 660, 1400 670, 1520 690 C1560 700, 1560 740, 1500 760 C1400 780, 1300 770, 1240 760 C1200 750, 1190 720, 1210 690 Z" fill="#5c5d5b" />
      <path d="M1210 690 C1250 670, 1310 668, 1335 672 L1330 765 C1290 766, 1240 760, 1210 740 Z" fill="#8a8a86" />
      {/* 航线：遮罩逐段露出虚线 */}
      <mask id="route">
        <path d={path} fill="none" stroke="white" strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      </mask>
      <path d={path} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="18 16" mask="url(#route)" />
      <circle cx={520} cy={330} r={14} fill={INK} />
      <circle cx={1290} cy={700} r={14 + draw * 6} fill={INK} opacity={draw} />
      <text x={400} y={290} fill={INK} style={{ fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700 }}>美国南方</text>
      <text x={1250} y={640} fill={INK} opacity={draw} style={{ fontFamily: FONT_SANS, fontSize: 48, fontWeight: 700 }}>海地</text>
    </svg>
  );
};

/**
 * 第三幕 · 转折（8s，黑白）
 * 0–4s：3D 书翻开（格雷厄姆·格林《喜剧演员》，以海地为背景）
 * 4–8s：示意地图，一条虚线从美国南方画到海地
 */
export const HaitiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = interpolate(frame, [0.4 * fps, 1.8 * fps], [0, 1], { ...clamp, easing: ease });
  const flip = interpolate(frame, [1.8 * fps, 3.6 * fps], [0, 1], clamp);
  const toMap = interpolate(frame, [3.8 * fps, 4.3 * fps], [0, 1], clamp);
  const draw = interpolate(frame, [4.4 * fps, 6.6 * fps], [0, 1], { ...clamp, easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1a18", filter: "grayscale(1)" }}>
      <AbsoluteFill style={{ perspective: 2000, justifyContent: "center", alignItems: "center", opacity: 1 - toMap }}>
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translateX(${-210 * (1 - open)}px) translateY(-60px) rotateX(24deg) rotateZ(-4deg) scale(${1 + open * 0.05})`,
          }}
        >
          <Book open={open} flip={flip} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toMap }}>
        <RouteMap draw={draw} />
      </AbsoluteFill>
      <Beats id="haiti" />
    </AbsoluteFill>
  );
};

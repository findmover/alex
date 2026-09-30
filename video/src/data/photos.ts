/**
 * 真实作品图位（photo slots）。
 *
 * Alex Webb 的作品版权归 Alex Webb / Magnum Photos 所有，仓库里不附带任何原作。
 * 默认每个图位都显示自绘的「韦伯风格示意插画」。
 * 取得授权（或确认符合合理使用）后：
 *   1. 把图片放到 video/public/photos/ 下（该目录已被 .gitignore 忽略，不会提交）
 *   2. 把下面对应的 src 从 null 改成 "photos/文件名.jpg"
 * 视频就会在这一幕改用原作，并在右下角显示 credit。
 */

export type PhotoSlot = {
  src: string | null;
  /** 图片说明，例如 "Tehuantepec, Mexico, 1985" */
  caption: string;
  credit: string;
};

export const PHOTOS: Record<
  "hook" | "who" | "light" | "layers" | "grid" | "edges",
  PhotoSlot
> = {
  hook: { src: null, caption: "", credit: "© Alex Webb / Magnum Photos" },
  who: { src: null, caption: "", credit: "© Alex Webb / Magnum Photos" },
  light: { src: null, caption: "", credit: "© Alex Webb / Magnum Photos" },
  layers: { src: null, caption: "", credit: "© Alex Webb / Magnum Photos" },
  grid: { src: null, caption: "", credit: "© Alex Webb / Magnum Photos" },
  edges: { src: null, caption: "", credit: "© Alex Webb / Magnum Photos" },
};

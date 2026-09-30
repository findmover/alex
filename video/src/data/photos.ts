/**
 * 原作图位。图片放在 video/public/photos/，把 src 从 null 改成 "photos/文件名.jpg"。
 * 规则：原作不调色、不加滤镜，只做缓慢推近与标注；没有原作时显示自绘示意图。
 */

export type PhotoSlot = {
  src: string | null;
  /** 作品名与年份，例如 "Grenada, 1979" */
  caption: string;
  credit: string;
};

const CREDIT = "© Alex Webb / Magnum Photos";

export const PHOTOS = {
  /** 开场 1% 揭晓 + 第四幕变彩色后完整出现 */
  reveal: { src: null, caption: "", credit: CREDIT } as PhotoSlot,
  light: { src: null, caption: "", credit: CREDIT } as PhotoSlot,
  layers: { src: null, caption: "", credit: CREDIT } as PhotoSlot,
  edges: { src: null, caption: "", credit: CREDIT } as PhotoSlot,
};

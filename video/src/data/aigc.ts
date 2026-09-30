/**
 * AIGC 空镜位（见 docs/04-创意方案-等光.md 第 5 节）。
 * 素材放到 video/public/aigc/，把 src 从 null 改成 "aigc/文件名"。
 * 每个位置都有程序生成的备用画面，缺素材也能照常出片。
 * 原则：AI 只生成环境空镜，不生成“像韦伯作品”的照片。
 */
export type AigcSlot = { src: string | null; note: string };

export const AIGC = {
  v1South: { src: null, note: "1970s 美国南方小镇主街，黑白 16mm" } as AigcSlot,
  v2Novel: { src: null, note: "黑白微距，旧平装小说翻页" } as AigcSlot,
  v4Palm: { src: null, note: "硬光下棕榈叶影摇在红墙上" } as AigcSlot,
  v5Lightbox: { src: null, note: "暗房看片灯箱俯拍平移" } as AigcSlot,
  music: { src: null, note: "72 BPM 钢琴/大提琴氛围乐，82s" } as AigcSlot,
};

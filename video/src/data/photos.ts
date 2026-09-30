/**
 * 原作目录。来源与核对见 docs/03-图片命名与来源.md。
 * 视频使用 public/photos/web/ 下的长边 1920 副本（scripts/prepare-photos.py 生成），原图不动。
 * 规则：原作不调色、不加滤镜、不裁切，只做推拉与标注；
 * 唯一例外：第四幕“发现颜色”里 14 号作品由黑白过渡到原色。
 * 未使用：05（Rebecca Norris Webb 作品）；25、26、32（作者待核实）。
 */

export type Work = {
  id: string;
  file: string;
  /** 画面上的标注：地点, 年份 */
  caption: string;
  /** 原图宽高比 */
  ratio: number;
};

export const CREDIT = "© Alex Webb / Magnum Photos";

const w = (id: string, stem: string, caption: string, ratio = 1.5): Work => ({
  id,
  file: `photos/web/${stem}.jpg`,
  caption,
  ratio,
});

export const WORKS = {
  istanbulShip: w("01", "01-alex-webb-istanbul-turkey-2004-grounded-ship", "Istanbul, Turkey, 2004", 5229 / 3500),
  maderoPool: w("02", "02-alex-webb-ciudad-madero-mexico-1983-pool", "Ciudad Madero, Mexico, 1983", 5236 / 3500),
  stanfordBand: w("08", "08-alex-webb-stanford-california-2015-university-band", "Stanford, California, 2015", 5243 / 3500),
  brooklynBubbles: w("09", "09-alex-webb-park-slope-brooklyn-2018-bubbles", "Park Slope, Brooklyn, 2018", 5240 / 3500),
  tehuantepec: w("10", "10-alex-webb-tehuantepec-mexico-1985-children", "Tehuantepec, Mexico, 1985", 1440 / 964),
  nuevoLaredo: w("11", "11-alex-webb-nuevo-laredo-mexico-1996-registry-office", "Nuevo Laredo, Mexico, 1996", 1440 / 964),
  grenadaBar: w("12", "12-alex-webb-gouyave-grenada-1979-bar", "Gouyave, Grenada, 1979", 1439 / 948),
  tijuana: w("13", "13-alex-webb-tijuana-mexico-1991-shoeshine-mirror", "Tijuana, Mexico, 1991", 1433 / 956),
  haitiRedWall: w("14", "14-alex-webb-port-au-prince-haiti-1979-red-wall", "Port-au-Prince, Haiti, 1979", 1440 / 960),
  danceHall: w("15", "15-alex-webb-rochester-new-york-2013-dance-hall", "Rochester, New York, 2013", 1439 / 958),
  leonBox: w("16", "16-alex-webb-leon-mexico-1987-cardboard-box", "León, Mexico, 1987", 1440 / 959),
  bombay: w("19", "19-alex-webb-bombay-india-1981-eyes-banner", "Bombay, India, 1981", 1440 / 964),
  santoDomingo: w("20", "20-alex-webb-santo-domingo-dominican-republic-1980-boys", "Santo Domingo, Dominican Republic, 1980", 1440 / 960),
  barbados: w("21", "21-alex-webb-bridgetown-barbados-1983-seaside", "Bridgetown, Barbados, 1983", 1439 / 957),
  iquitos: w("22", "22-alex-webb-iquitos-peru-1993-fish-costume", "Iquitos, Peru, 1993", 1440 / 964),
  havanaPlayground: w("23", "23-alex-webb-havana-cuba-2000-playground", "Havana, Cuba, 2000", 1439 / 953),
  reglaMirror: w("24", "24-alex-webb-regla-havana-cuba-2007-mirror", "Regla, Havana, Cuba, 2007", 1438 / 952),
  upsideDown: w("27", "27-alex-webb-altinsehir-istanbul-turkey-2004-upside-down-child", "Altınşehir, Istanbul, 2004", 1080 / 704),
  cottonCandy: w("28", "28-alex-webb-mexico-city-2003-cotton-candy", "Mexico City, 2003", 1060 / 704),
  kinshasa: w("30", "30-alex-webb-kinshasa-zaire-1982-red-bus", "Kinshasa, Zaire, 1982", 944 / 630),
  gonave: w("31", "31-alex-webb-etroits-la-gonave-haiti-1986-seaside", "Étroits, La Gonâve, Haiti, 1986", 1438 / 964),
  havanaColumns: w("33", "33-alex-webb-havana-cuba-1993-blue-columns", "Havana, Cuba, 1993", 1438 / 952),
  haitiColorWall: w("34", "34-alex-webb-port-au-prince-haiti-1987-color-wall", "Port-au-Prince, Haiti, 1987", 1439 / 958),
  palmapampa: w("35", "35-alex-webb-palmapampa-peru-1993-mirror-vendor", "Palmapampa, Peru, 1993", 944 / 629),
};

/** 终幕 3D 画廊里挂出的作品（按出现顺序） */
export const GALLERY: Work[] = [
  WORKS.grenadaBar,
  WORKS.haitiColorWall,
  WORKS.santoDomingo,
  WORKS.bombay,
  WORKS.kinshasa,
  WORKS.tijuana,
  WORKS.iquitos,
  WORKS.gonave,
  WORKS.havanaColumns,
  WORKS.nuevoLaredo,
  WORKS.barbados,
  WORKS.havanaPlayground,
  WORKS.cottonCandy,
  WORKS.reglaMirror,
  WORKS.palmapampa,
  WORKS.danceHall,
  WORKS.stanfordBand,
  WORKS.brooklynBubbles,
];

/** 从原作里取到的颜色（scripts/prepare-photos.py 采样） */
export const SAMPLED = {
  leon: [
    { color: "#6b9e90", name: "青绿墙" },
    { color: "#e1bfbd", name: "粉布" },
    { color: "#d7b8a2", name: "纸箱" },
    { color: "#131311", name: "纯黑影子" },
  ],
  haiti: { red: "#942e0d", deepRed: "#891206", cream: "#eaddd9", black: "#21120e" },
};

// 把视频用到的汉字从 Google Fonts 按需子集化下载到 public/fonts/，渲染时不再联网取字体。
// 改了文案后重新运行：npm run fonts
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|md)$/.test(f) ? [p] : [];
  });

const chars = new Set();
for (let c = 32; c < 127; c++) chars.add(String.fromCharCode(c));
for (const f of walk("src")) for (const ch of readFileSync(f, "utf8")) if (ch.charCodeAt(0) > 127) chars.add(ch);
chars.add("“").add("”").add("《").add("》").add("·").add("—");
const text = [...chars].join("");

const FONTS = [
  { family: "Noto Serif SC", weight: 700, file: "NotoSerifSC-700.woff2" },
  { family: "Noto Serif SC", weight: 500, file: "NotoSerifSC-500.woff2" },
  { family: "Noto Sans SC", weight: 700, file: "NotoSansSC-700.woff2" },
  { family: "Noto Sans SC", weight: 400, file: "NotoSansSC-400.woff2" },
];

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
for (const f of FONTS) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family)}:wght@${f.weight}&text=${encodeURIComponent(text)}`;
  const css = execFileSync("curl", ["-sSfL", "-A", UA, url]).toString();
  const src = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!src) throw new Error(`No font url for ${f.family} ${f.weight}`);
  const buf = execFileSync("curl", ["-sSfL", src], { maxBuffer: 50 * 1024 * 1024 });
  writeFileSync(join("public/fonts", f.file), buf);
  console.log(`${f.file}  ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log(`${chars.size} 个字符`);

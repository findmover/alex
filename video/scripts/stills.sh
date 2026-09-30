#!/usr/bin/env bash
# 渲染审查用关键帧截图到 out/stills/。用法：bash scripts/stills.sh
# 云端环境用预装的 Chromium；本地 Mac 直接去掉 --browser-executable 即可
set -e
B=${REMOTION_BROWSER:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/ 2>/dev/null | head -1)headless_shell}
ARGS=()
[ -x "$B" ] && ARGS=(--browser-executable="$B")
mkdir -p out/stills
for spec in "$@"; do
  id=${spec%%:*}; f=${spec##*:}
  npx remotion still "$id" "out/stills/$id-$f.jpg" --frame="$f" --jpeg-quality=85 --log=error "${ARGS[@]}"
done

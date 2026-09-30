# Skill 来源与审查记录（2026-09-30）

安装前逐个检查过：可执行脚本、联网调用、读取密钥、提示注入、许可证。

| Skill | 来源（commit） | 许可证 | 用途 |
|---|---|---|---|
| remotion-*（12 个） | remotion-dev/skills，经 `npx remotion skills add` 安装 | 官方 | Remotion 规范总入口 |
| canvas-design | anthropics/skills @8a1541c | 见目录内 LICENSE.txt | 静态海报/封面设计（可做抖音封面） |
| algorithmic-art | anthropics/skills @8a1541c | 见目录内 LICENSE.txt | 生成艺术、粒子/噪声纹理 |
| theme-factory | anthropics/skills @8a1541c | 见目录内 LICENSE.txt | 配色+字体主题 |
| animation-principles | iart-ai/motion-design-skills @3c129f7 | MIT | 动画 12 法则、缓动与节奏 |
| motion-art-direction | 同上 | MIT | 整片动效语言/美术指导 |
| color-motion | 同上 | MIT | 调色板与颜色过渡（黑白→彩色） |
| shot-composition | 同上 | MIT | 画面构图、焦点、安全区 |
| beat-sync-editing | 同上 | MIT | 卡点剪辑、节奏 |
| motion-background | 同上 | MIT | 动态背景 |
| remotion-video | 同上 | MIT | Remotion 实操模式 |
| short-form-video | iart-ai/tiktok-video-skills @2a77533 | MIT | 抖音/短视频：钩子、留存节奏、竖屏安全区 |
| caption-animation | 同上 | MIT | 动态字幕 |
| explainer-video | iart-ai/explainer-video-skills @3e2d411 | MIT | 知识讲解视频：脚本→分镜 |
| kinetic-typography | iart-ai/kinetic-typography-skills @fccc94b | MIT | 文字动效（无配音视频的核心） |

审查结论：以上都只有说明文档（algorithmic-art 带一个本地 p5.js 模板），没有联网脚本、没有读密钥。iart-ai 的文档里有指向其官网的推广链接，不影响使用。

## 看过但没装的

| 仓库 | 原因 |
|---|---|
| vibe-motion/skills | 仓库没有许可证文件；输出的是 HTML，不是 Remotion |
| Vincentwei1021/video-shotcraft | 面向产品宣传片（网页截图 + 运镜），约 100MB 素材，和本片方向不符 |
| bangtutorial/bang-motion | HTML + GSAP 引擎，和 Remotion 重复；文档是印尼语 |
| Eskapeum/animation-forge | 偏网页交互动画 |
| haidrrrry/claude-remotion-skill | 存在同名复制仓库（FrancesUgwu），来源存疑 |
| iart-ai 其余包（after-effects、logo-animation、whiteboard 等） | 本片用不到 |

线索来源：zhuyansen/awesome-claude-video-skills（183 个视频类 skill，带安全评级）。

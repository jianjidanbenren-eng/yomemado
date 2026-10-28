# 游目窗 · 浮世来信机

一台可以自己部署的世界来信机：地图选点 → 出票 → 翻面读信 → 下载双面邮票 → 亲手入藏。

**[试玩机器](https://jianjidanbenren-eng.github.io/yomemado/template/)** · [看原片与项目手记](https://jianjidanbenren-eng.github.io/yomemado/) · [部署和使用](template/USAGE.md)

## 从这里开始

| 你想做什么 | 只需打开 |
| --- | --- |
| 部署、换图片／外壳／字体／音乐，了解收信规则 | [使用说明](template/USAGE.md) |
| 制作自己的邮票 | [制票 Skill](skills/yomemado-stamp-maker/SKILL.md) · [完整提示词](skills/yomemado-stamp-maker/references/prompts.md) |
| 给小机接自动投递或跨设备读信 | [接入说明](docs/自动投递与跨设备接入.md)（进阶、按需） |
| 遇到问题 | [二十项踩坑指南](docs/踩坑复盘.md) |
| 找灵感来源、参考作者与素材许可 | [灵感与致谢](docs/灵感与致谢.md) |

## 部署自己的机器

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjianjidanbenren-eng%2Fyomemado&root-directory=template&project-name=my-yomemado&repository-name=my-yomemado)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jianjidanbenren-eng/yomemado)

Vercel 根目录选 `template`；Netlify 使用仓库配置。模板是静态网页，不需要后台或密钥。先改 `template/config.js`（名称、字体、音乐），再改 `template/letters.js`（来信和图片）。详细步骤统一放在使用说明。

## 项目只有四个主要目录

| 目录 | 用途 |
| --- | --- |
| `template/` | 可直接部署的机器、配置、示例和唯一使用说明 |
| `skills/` | 给照片或地点直接生成完整双面邮票的 Skill，含六份提示词、母版、脚本、样例及许可 |
| `docs/` | 来源、踩坑、进阶接入三篇说明；原片和封面在 `docs/assets/` |
| `tests/` | 自动检查；维护项目时使用 |

公开样例为布达拉宫、普莫雍错、苏州留园，当前三个地图点对应两枚已读旧信，最新一枚亲手入藏。阅读与收藏默认保存在本浏览器；后端接入另见进阶说明。

灵感感谢[池又雨 / Yinglianchun](https://github.com/Yinglianchun)；制票方法学习并改写自 **cakeni、Yan Liu、FANTASY／梵想美学**的公开 Skill。原项目、改写与许可见上方致谢入口，Skill 内也保留来源与许可原文。项目页使用用户的 45 秒有声原片。

## 开发检查

```bash
python -m pip install -r skills/yomemado-stamp-maker/requirements.txt
python -m unittest discover -s tests -v
node --test tests/*.test.cjs
```

原创建作采用 [MIT](LICENSE)；第三方素材的范围统一见[来源说明](docs/灵感与致谢.md)。

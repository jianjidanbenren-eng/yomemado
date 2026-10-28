# 游目窗 · 浮世来信机

一台可以自己部署的世界来信机：地图选点 → 出票 → 翻面读信 → 下载双面邮票 → 亲手入藏。

**[试玩机器](https://jianjidanbenren-eng.github.io/yomemado/template/)** · [看原片](https://jianjidanbenren-eng.github.io/yomemado/#showcase)

公开包提供静态机器、三封网页样例，以及含六套原图与双面成品的制票 Skill。**网页版不内置定时采风、自动投递、邮箱提醒或账户同步**；需要时按接入说明另外配置。

## 只选一个入口

| 现在要做什么 | 打开这里 |
| --- | --- |
| 部署网页，换外形、音效、字体、配乐或来信 | [部署与使用](template/USAGE.md) |
| 制作完整双面邮票，或另定形式、排版和大小 | [制票 Skill](skills/yomemado-stamp-maker/SKILL.md) |
| 让小机接手，配置 Site、插件、定时任务与邮箱提醒 | [快速接入](docs/自动投递与跨设备接入.md#快速交给小机) |
| 出了问题再查 | [踩坑指南](docs/踩坑复盘.md) |
| 看灵感、迭代、参考作者与素材范围 | [灵感与致谢](docs/灵感与致谢.md) |

## 部署自己的机器

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjianjidanbenren-eng%2Fyomemado&root-directory=template&project-name=my-yomemado&repository-name=my-yomemado)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jianjidanbenren-eng/yomemado)

Vercel 根目录选 `template`；Netlify 使用仓库配置。其余设置、换图示例和收信规则只在使用说明维护。

`template/` 放机器，`skills/` 放制票方法，`docs/` 放来源、踩坑和接入三篇说明，`tests/` 放开发检查。当前外形、声音和邮票版式是默认示例，可按自己的喜好修改。

原创代码与文档采用 [MIT](LICENSE)；参考项目与第三方素材范围统一见[灵感与致谢](docs/灵感与致谢.md)。

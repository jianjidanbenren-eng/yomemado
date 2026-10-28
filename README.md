# 游目窗 · 浮世来信机

一台把世界各地的发现，做成邮票与短笺的复古来信机。

**[试玩机器](https://jianjidanbenren-eng.github.io/yomemado/template/)** · [项目说明](https://jianjidanbenren-eng.github.io/yomemado/)

游目窗从“出去看看，再带着有意思的东西回来一起聊”的念头长出来。文学、建筑、城市、风景或一个日常细节，都可以成为一封信的起点；聊到想留下的那一次，再把它做成一枚有画、有字、可以翻阅与收藏的邮票。

## 项目演示

https://github.com/user-attachments/assets/f760c3f3-47d6-4983-9f9e-7234352e87c5

45 秒原版演示，保留原画面与音轨。视频记录 W41 的制作过程；当前公开机器与历史视频的样例、计数可能不同，现行规则见使用说明。

## 怎样收一封信

地图上有来信的地方会亮起红点。选择地点，按下 **RELEASE**，邮票从槽口滑出；轻触翻到背面，看两段短笺逐字写完，再决定把它存成双面 PNG，或亲手放进藏信册。

我们想留下的是发现与分享的过程。聊天可以自然延伸，邮票是其中一次相遇的纪念品。

## 几个藏在里面的小巧思

- **一面看景，一面读信：** 插画与短笺留在同一枚邮票上，取信、翻面和入藏各有自己的动作。
- **照片与风格分工：** 源照片保留主体和空间，木版风格提供刻线、油墨与纸感；不同地方仍保留自己的颜色。
- **画画与排版分工：** 图像工具制作无字插画，程序完成准确的文字、编号和外沿；同系列稳定复用母版。

## 带走什么，从哪里开始

| 内容 | 包里已有 | 操作入口 |
| --- | --- | --- |
| 静态来信机 | 地图、出票、翻面写字、声音、下载与藏信，附三封网页样例 | [部署与使用](template/USAGE.md) |
| 完整制票 Skill | 照片转绘／自主采风，六套原图与双面成品、完整提示词、母版和脚本 | [制票 Skill](skills/yomemado-stamp-maker/SKILL.md) |
| 连接与定时提醒 | 一段接手提示词，Site、插件、自动投递和邮箱提醒的设置步骤 | [快速接入](docs/自动投递与跨设备接入.md#快速交给小机) |
| 来源与经验 | 灵感来路、参考作者、素材记录及踩坑定位 | [灵感与致谢](docs/灵感与致谢.md) · [踩坑指南](docs/踩坑复盘.md) |

**网页版默认不带自动采风、自动投递、邮件通知或账户同步后端。** 上表的连接部分是接入说明，需要在使用者自己的环境实现与配置。

机器外形、音效、字体、配乐，以及邮票的形式、排版和大小，都可以按自己的想法修改。随包样式是我们这一版喜欢的选择，修改入口统一放在使用说明与 Skill 中。

## 部署自己的机器

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjianjidanbenren-eng%2Fyomemado&root-directory=template&project-name=my-yomemado&repository-name=my-yomemado)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jianjidanbenren-eng/yomemado)

Vercel 根目录选 `template`；Netlify 使用仓库配置。希望自己的小机接手时，把本仓库地址和快速接入页的提示词交给它，再选择手动部署、只提醒或自动投递。

最初灵感来自池又雨／Yinglianchun 的 SameWindow；制票方法参考 cakeni、Yan Liu、FANTASY／梵想美学。具体借鉴、改写与许可统一见灵感与致谢。原创代码与文档采用 [MIT](LICENSE)，视频、音乐和第三方素材按各自范围处理。

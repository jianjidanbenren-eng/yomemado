# 部署和使用游目窗

这份说明是公开机器的使用入口。部署后即可使用三枚独立历史样例；Skill 的六套原图与成品对照独立保存在 `skills/yomemado-stamp-maker/examples/`，不会自动变成机器新信；制作新邮票、接后端或排错时，再打开相应专题。

[部署与预览](#部署与预览) · [替换内容](#替换内容) · [收信与阅读](#收信与阅读) · [制作邮票](#制作邮票) · [音效与外观](#音效与外观) · [进阶与排错](#进阶与排错)

## 部署与预览

| 平台 | 设置 |
| --- | --- |
| Vercel | Root Directory 选 `template`；Framework Preset 选 `Other`，Build Command 留空，Output Directory 用 `.`；无需环境变量 |
| Netlify | 仓库根目录 `netlify.toml` 已配置 `base = "template"`、`publish = "."` |
| GitHub Pages | 项目手记在根目录，公开机器位于 `/template/` |
| 本地 | 在本目录运行 `python -m http.server 8000`，打开 http://localhost:8000 |

机器是纯静态 HTML/CSS/JS，无后端、API 密钥或 npm 依赖。访客无需登录，也无需第二个 ChatGPT 账号；部署者使用自己的 GitHub 与托管平台账户即可。用本地服务器检查图片下载，直接双击 HTML 时浏览器可能禁止读取 PNG 来打 ZIP。部署后实际走一次地图、出票、取信、翻面、下载、入藏和刷新。

## 替换内容

| 想改什么 | 修改哪里 | 注意 |
| --- | --- | --- |
| 名称、收信人 | `config.js` 的 `siteTitle`、`receiverName` | 改网页称呼不重绘既有 PNG |
| 字体 | `config.js` 的 `fontFamily` | 默认系统宋体／宋体类字体，可换；包内不含系统字体文件 |
| 背景音乐 | `musicUrl`、`musicCredit`、`musicLink` | 可设为 `assets/music/your-track.mp3` 或留空；选择有相应使用权的音乐 |
| 独立作品的本地记录 | `storageKey` | 不同作品使用不同值，不清空现有使用者记录 |
| 来信和地点 | `letters.js` | 三位数字 `id` 不重复；填写 `date`、`title`、`place`、`region`、两段 `paragraphs`、`signature`、`mapX/mapY`、正反图片路径 |
| 邮票图片 | `assets/stamps/` | 默认正反面均 736×1040 RGBA，`frontImage/backImage` 指向实际文件；新比例另按下方改版说明适配 |
| 外壳与颜色 | `custom.css` | 可换纹理、配色和尺寸；保留交互元素 ID，修改后重新检查窄屏 |

地图坐标 `mapX/mapY` 范围为 0–100；经纬度未核实就填 `null`，不编造。已有示例为地区示意，具体摄影位置、留园房间及精确坐标未独立核实。

背面逐字正文来自 `letters.js`，PNG 仍是完整纸面和下载成品。替换文字或字体后需要重新制票，让网页与下载内容一致。覆盖同编号图片时更新资源路径或版本参数，避免继承旧内容的手动收藏标记。

## 第一次换成自己的信

先在自己的部署副本里，用随包阿尔法玛 005 练习一次；下面的文字、日期与图片属于同一套示例。

1. 从 `skills/yomemado-stamp-maker/examples/` 取出 `005-front.png` 和 `005-back.png`，复制到 `template/assets/stamps/`。网页部署根目录里必须实际有这两个文件。
2. 在 `template/config.js` 改 `siteTitle`、`receiverName`，并为自己的机器设置一个新的 `storageKey`；例如 `my-yomemado-v1`。
3. 打开 `template/letters.js`，保留 `window.YOMEMADO_LETTERS = [...]` 的外层结构；将原来的 003 对象整段替换成下面的 005 对象，保留 001 和 002。对象之间用逗号分隔。

```js
{
  "id": "005",
  "date": "2026-10-28",
  "title": "阿尔法玛｜窗与海",
  "place": "Alfama, Lisbon",
  "region": "Lisbon, Portugal",
  "paragraphs": [
    "屋里很暗，右边那扇窗却被光染成了金色。窗外的蓝铺得很远，细浪把安静一点点送进来。",
    "这是按用户提供照片转绘的阿尔法玛窗景示例。地点沿用用户标签；具体房间与窗外水域未独立核实，保留画面里的开阔与明暗。"
  ],
  "signature": "—— 游目窗 · 公开示例",
  "latitude": null,
  "longitude": null,
  "coordinatesVerified": false,
  "mapX": 48.5,
  "mapY": 32.5,
  "frontImage": "assets/stamps/005-front.png",
  "backImage": "assets/stamps/005-back.png",
  "sample": true
}
```

4. 重新部署或刷新本地页面。应看到三个地图点，显示屏能选到 `LETTER 005 / ALFAMA, LISBON`；藏信先只有 001、002 两枚已读旧信。取出 005、翻面阅读后仍是两枚；亲手入藏后变三枚，刷新后保留。
5. 换成自己的照片时，先让 Skill 交付一套完整正反面 PNG，再用对应 JSON 更新来信字段与两个图片路径。编号、日期、正文、落款和下载 PNG 要一致；照片原图与画芯不直接充当邮票正反面。

以后新增来信时，在数组末尾追加一封使用新编号的对象，并保留旧信。三封变四封时，地图四点、三枚旧信已读，最新一枚等手动入藏；不要直接用缺少地图和图片路径的制票 JSON 覆盖整个 `letters.js`。

部署字段可对照 [Vercel 静态构建设置](https://vercel.com/docs/builds/configure-a-build) 与 [Netlify 基础目录设置](https://docs.netlify.com/build/configure-builds/overview/)。

## 收信与阅读

| 场景／动作 | 机器行为 |
| --- | --- |
| 三封正式样例 | 地图三点、RECEIVED 03；藏信先有 001、002 两枚，均 READ / 已读 |
| 只读最新 003 | 可记为读过，藏信仍只有两枚；阅读与收藏分开 |
| 点击入藏 003 | 藏信变三枚，均已读；本浏览器刷新后保留 |
| 004 抵达 | 旧 001–003 自动入藏且已读；最新 004 继续等待手动入藏 |
| 七封，最新未手动入藏 | 地图七点，藏信六枚旧信已读 |
| 顺序、测试与撤回 | 藏信编号倒序；`testOnly: true` 不参与正式计数；撤回后按有效列表重算 |
| 同编号换内容 | 收藏标记绑定编号、日期、地点、标题及图片路径；旧 `collected: true` 不替新内容入藏 |
| 翻至背面 | 等待 770ms，第一段逐字写 2180ms，间隔 430ms，第二段 2060ms，最后出现落款 |
| 静音／中断 | 静音仍写字；翻回、合上、换信取消当前书写和旧回调 |
| 存图 | ZIP 始终下载同一对完整 PNG，正在写到哪里都不会保存半成品 |

已手动收藏最新信的浏览器显示三枚是正常后续状态，不强制退回两枚。个人阅读和收藏记录保存在本浏览器，跨设备不自动同步；藏信 READ 是约定的展示规则，不是服务器记录的真实阅读证明。

## 制作邮票

给照片或地点后，Skill 默认一次执行到完整的正反面 PNG；以下四步由小机连续完成，不需要你另发套版指令。读[制票 Skill](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/SKILL.md)，按以下顺序制作：

1. **素材与事实：**照片模式实际读取源照片；自主模式核实地点、资料 URL 和主题。完整地名、来源、核查日期、未知项与艺术演绎分别记录，用户提供不等于用户摄影。
2. **无字画芯：**用[完整提示词](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/references/prompts.md)生成 624:723 插画，保留主体与构图；不让模型画文字、编号、邮戳、边框和齿孔。
3. **固定套版：**用 Skill 的母版、字段示例和脚本输出双面 736×1040 RGBA；底部准确短名固定两行，地图和藏信保留全名。测试用 TEST，不占正式编号。CJK 字体按 `--font` 指向自己的本地文件。
4. **成品验收：**运行 Skill 内唯一的 `scripts/check_stamp.py`，再在白、黑、棋盘格底看边缘、字形、正文和落款；核对实际下载。保存画芯、JSON、正反面、来源和结果。

程序检查不代替事实与视觉检查；旧画芯跑通套版不代表本轮新生图成功。具体命令、规则和六份完整提示词统一放在 Skill，不在这里维护第二套。

### 换成自己喜欢的邮票形式

当前竖版、尺寸、标题位置和齿孔是作者这一版喜欢的样式。你可以另做方形、横版或其他排版与大小。先在自己的项目中确定新母版，再按 Skill 的[定制方法](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/references/rules.md#用户想换形式排版或大小时)同步适配画芯、渲染和检查；随包脚本仍专用于默认 736×1040 规格。

只生成新样式邮票时不必接入机器。若还要替换机器里的邮票比例或背面排版，另行调整 `custom.css` 的阅读卡片、出票缩略图与翻面尺寸，以及 `.reader-writing-surface`、`.reader-letter`、`.reader-sign` 书写区域，使文字层与新 PNG 对齐；核对最终 CSS 覆盖规则。默认模板的这些位置已按现有双面 PNG 校准，直接换图可能拉伸或错位。接入后实际检查窄屏、翻面、写字、下载和入藏。

## 音效与外观

机音沿用 W32：八个采样、V3 出票、翻纸、两段钢笔声、入藏和藏信开合。机音开关控制交互声，黄色旋钮控制另配的背景音乐，两者独立。音乐由访客主动点击播放，五档音量可关闭。

更换机音可替换 `assets/sfx/` 的对应文件，或设置 `config.js` 的 `sfxBasePath`；原采样哈希与参数见 `assets/sfx/sources.json`。短声提前加载解码，首次手势唤醒音频通道；翻纸保留 1.38 倍速与音高保持，钢笔仍按原时序等待。浏览器/窄屏检查不代替手机实际听感验收。

现有主机以 W38/W41 为布局基准。介绍页直接沿用机器的朱红 `#B9473A`、深朱红 `#82352F`、奶油纸色 `#E9DFCB`、地图蓝 `#9AB7C1`、墨蓝框 `#243A49`、黄铜 `#BEA37B` 和显示屏深绿 `#092C31`；可作自定义参考，修改外观后检查阅读与操作区。

## 进阶与排错

- 自动投递、在线读桥及可选个人状态同步：[接入说明](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/自动投递与跨设备接入.md)。默认模板没有后端，不连接作者的私人信箱或任务。
- 图像、字体、透明、声音、写字、下载或同步问题：[二十项踩坑指南](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/踩坑复盘.md)。
- 灵感作者、Skill 参考、图片、音乐、字体与视频使用范围：[灵感与致谢](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/灵感与致谢.md)。

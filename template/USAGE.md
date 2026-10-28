# 部署和使用游目窗

这里维护部署、修改入口和机器行为。定时任务、Site 插件和邮箱提醒统一看[快速接入](../docs/自动投递与跨设备接入.md)；邮票生产规则统一看 [Skill](../skills/yomemado-stamp-maker/SKILL.md)。

## 部署与预览

| 平台 | 设置 |
| --- | --- |
| Vercel | Root Directory 为 `template`；Framework Preset 为 `Other`；Build Command 留空；Output Directory 为 `.` |
| Netlify | 根目录 `netlify.toml` 已设置 `base = "template"`、`publish = "."` |
| GitHub Pages | 根目录为项目介绍，机器入口为 `/template/` |
| 本地 | 在 `template/` 运行 `python -m http.server 8000`，打开 http://localhost:8000 |

静态机器无需后端、API 密钥或 npm，访客无需登录，也不需要第二个 ChatGPT 账号。部署后实际走一遍地图、出票、翻面、下载、入藏与刷新；本地下载用 HTTP 服务，直接双击 HTML 可能受浏览器限制。

## 替换内容

**机器外形、配色、音效、字体、配乐与邮票都可以修改。** 当前朱红机身、W32 声音和竖版邮票是这套模板的默认选择；在自己的副本中按喜好调整。

| 想改什么 | 改哪里 | 需要一起处理 |
| --- | --- | --- |
| 名称、收信人 | `config.js` 的 `siteTitle`、`receiverName` | 网页称呼与已有 PNG 分别修改 |
| 机器外形、颜色、纹理与布局 | `custom.css`；需要替换机身图片时用 `assets/skin/` | 保留交互 ID，核对窄屏、出票位置和阅读操作区 |
| 交互音效 | `assets/sfx/` 或 `config.js` 的 `sfxBasePath` | 采样沿用对应文件名；程序合成出票声、音量、速率和节奏在 `audio.js` 修改 |
| 网页字体 | `config.js` 的 `fontFamily` | 默认系统宋体；PNG 文字通过 Skill 的 `--font` / `--print-font` 重绘，视频字体另行编辑 |
| 背景音乐 | `config.js` 的 `musicUrl`、`musicCredit`、`musicLink` | 默认未附独立歌曲；可用自己的音乐文件或留空，更新署名与来源 |
| 来信、地点、正文与落款 | `letters.js` | 唯一三位 ID、实际日期、地图点位、正反面路径和 PNG 内容保持一致 |
| 邮票画面、形式、排版与大小 | `assets/stamps/`；制票参数见 Skill | 默认 736×1040；换比例或背面排版按下方改版方法适配 |
| 独立作品的浏览器记录 | `config.js` 的 `storageKey` | 自己的作品用新值，保留已有使用者的记录 |
| 项目演示视频 | 根目录 `index.html` 的播放器与 `docs/assets/` | 同步封面、说明和媒体来源 |

机音开关与背景音乐旋钮相互独立，音乐由访客主动播放。改了声音长度或写字节奏，还需核对 `audio.js` 与 `writer.js` 的阶段回调；换字体或正文后重新导出 PNG。素材使用范围在[来源说明](../docs/灵感与致谢.md)维护。

地图 `mapX/mapY` 为 0–100；未知经纬度填 `null`。覆盖同编号内容时更新图片路径或版本，避免继承旧内容的手动收藏标记。默认声音的校验记录在 `assets/sfx/sources.json`；改用自己的声音后按新样式验收，不以原样哈希作为通过标准。

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

4. 重新部署或刷新，显示屏应能选到 `LETTER 005 / ALFAMA, LISBON`；按下方「收信与阅读」表完成取信、翻面、入藏与刷新检查。
5. 换成自己的照片时，先让 Skill 交付一套完整正反面 PNG，再用对应 JSON 更新来信字段与两个图片路径。编号、日期、正文、落款和下载 PNG 要一致；照片原图与画芯不直接充当邮票正反面。

以后新增来信，在数组末尾追加使用新编号的对象并保留旧信；不要用缺少地图和图片路径的制票 JSON 覆盖整个 `letters.js`。

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

给照片或地点后，[制票 Skill](../skills/yomemado-stamp-maker/SKILL.md) 连续完成资料、插画、套版与验收，直接交付完整正反面 PNG；六份完整提示词、命令、母版规则和六套原图对照均在 Skill 内维护。制票不自动把新信发行到网页。

### 换成自己喜欢的邮票形式

形式、排版和大小可以另定，按 [Skill 定制方法](../skills/yomemado-stamp-maker/references/rules.md#用户想换形式排版或大小时)适配母版与程序。只生成邮票时不必接机器；若要接入，另在 `custom.css` 适配阅读卡片、出票缩略图与翻面尺寸，以及 `.reader-writing-surface`、`.reader-letter`、`.reader-sign`，让书写层与新 PNG 对齐，再检查实际下载和窄屏。当前程序专用于默认规格，直接替换不同比例图片可能拉伸或错位。

## 进阶与排错

- Site、插件、定时任务与邮箱提醒：[快速接入](../docs/自动投递与跨设备接入.md)。
- 故障定位与历史经验：[踩坑指南](../docs/踩坑复盘.md)。
- 灵感、参考作者与素材来源：[灵感与致谢](../docs/灵感与致谢.md)。

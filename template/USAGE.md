# 换成自己的游目窗

1. 部署后编辑 config.js，修改 siteTitle、receiverName、fontFamily、storageKey。多个作品使用不同 storageKey。
2. 编辑 letters.js。每封信需要三位数字 id、日期、完整地点与地区、title、paragraphs、mapX/mapY 和正反面 PNG 路径。编号不可重复。mapX/mapY 范围 0–100；默认样例是地区示意，latitude/longitude 未核实所以为 null。
3. 把新的 736×1040 RGBA 正反面放入 assets/stamps/，将 frontImage/backImage 指向实际文件。背面纸面使用同一 PNG，正文与落款由 letters.js 驱动逐字显示；修改来信时应同步重新制票，让网页文字与下载成品一致。
4. 修改外壳时编辑 custom.css，可换颜色、纹理、尺寸；保留 index.html 的交互元素 ID。图片、机壳和文字可以按自己的喜好替换。
5. 默认字体是本机宋体/宋体类衬线字体。修改 fontFamily 即可更换；模板不提供字体二进制。示例背面 PNG 已用思源宋体类字型绘制，改网页字体不会自动重绘既有 PNG；需要用制票脚本重新导出。
6. 背景音乐可在 musicUrl 填入同站 assets/music/your-track.mp3，并填写 musicCredit、musicLink。选择自己有相应使用权的音乐，或保持为空。音乐由访客主动点击黄铜旋钮播放，可切音量与关闭。原曲署名参考：AKMU（乐童音乐家）《Farewell》，专辑 SAILING。
7. 新增更高编号的来信后，之前的有效旧信自动入藏并显示已读；最新一封由访客手动入藏。收藏只保存在当前浏览器。删除/撤回记录后，其自动归档状态随当前列表重算。

## 本地预览

在 template 目录运行 `python -m http.server 8000`，打开 http://localhost:8000。用本地服务器检查图片下载；直接双击 HTML 时，浏览器可能禁止读取 PNG 来打 ZIP。

## 制票入口

在仓库根目录阅读 [制票 Skill](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/SKILL.md)、[规则](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/references/rules.md) 和[完整提示词（含原三份画芯及三份工作流）](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/references/prompts.md)。先生成无字画芯，再由 Python/Pillow 固定套版；并非给网页配置音乐才能制票。

## 自动投递与跨设备接入

请将[接入说明](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/自动投递与跨设备接入.md)交给接手的小机。按配置单接部署者自己的存储、受保护写入、在线读桥和云定时任务；先手动投递一封并验收，再设日程。静态模板没有只需填地址就生效的在线读信开关。

各设备读到同一批来信，与最新信的个人阅读/收藏跨设备同步不同。前者复用在线发布索引，后者另需登录与状态数据库；不接后者时继续按浏览器保存，不影响旧信自动入藏及已读规则。文档给出了权限边界、重复投递与回滚、桌面和手机验收，以及可直接复制的接手提示词。


### 原版交互音效

模板沿用原机 W32 音效：V3 黄铜按键、电报码、齿轮、纸张及到达铃，配合原版地图、翻纸、藏信、盖章、开关采样。翻至背面后，正文与原钢笔采样按 770 毫秒延迟、2180 / 2060 毫秒两段和 430 毫秒间隔一起推进，写完再出现落款；翻回、合上或换信会取消本次书写。关闭机音只停止声音，文字仍会写完。

机音开关控制整套交互声；黄色旋钮控制另行配置的背景音乐。音效可替换 `template/assets/sfx/` 中的对应文件（仅部署模板时路径为 `assets/sfx/`），也可在 `config.js` 设置 `sfxBasePath`。原版采样校验与来源记录见该目录的 `sources.json`；背景歌曲不随模板提供。

交互采样在页面打开后提前准备：短点击声使用已解码缓存，翻纸保留原播放器的 1.38 倍速与音高保持设置。首次触摸会唤醒音频通道；钢笔声的 770 毫秒等待与两段时序保持原版。

## 三个地图点为什么先有两枚藏信

这是与原机一致的默认规则：001、002 是旧信，自动入藏且均为 READ / 已读；003 是最新一封，先留在地图等待亲手取信、阅读和入藏。只翻阅 003 不会增加藏信数量；点击「入藏」后才变成三枚。加入 004 后，旧三封自动入藏并已读，004 再等待手动入藏。已经收藏过 003 的浏览器刷新后仍会保留三枚，不会为了展示初始状态而清空记录。

`testOnly: true` 的测试信不参与正式地图、计数及最新信判断。详细对照见[行为说明](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/行为对照.md)。

## 来源与排错

制票方法参考的作者、原项目及我们的修改见[灵感与致谢](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/灵感与致谢.md)。遇到图像、字形、透明、音效、书写、下载或同步问题，请按[踩坑指南](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/踩坑复盘.md)定位对应环节，保留已确认的布局和声音。

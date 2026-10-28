# 换成自己的游目窗

1. 部署后编辑 config.js，修改 siteTitle、receiverName、fontFamily、storageKey。多个作品使用不同 storageKey。
2. 编辑 letters.js。每封信需要三位数字 id、日期、完整地点与地区、title、paragraphs、mapX/mapY 和正反面 PNG 路径。编号不可重复。mapX/mapY 范围 0–100；默认样例是地区示意，latitude/longitude 未核实所以为 null。
3. 把新的 736×1040 RGBA 正反面放入 assets/stamps/，将 frontImage/backImage 指向实际文件。网页展示和下载使用这些同一文件。
4. 修改外壳时编辑 custom.css，可换颜色、纹理、尺寸；保留 index.html 的交互元素 ID。图片、机壳和文字可以按自己的喜好替换。
5. 默认字体是本机宋体/宋体类衬线字体。修改 fontFamily 即可更换；模板不提供字体二进制。示例背面 PNG 已用思源宋体类字型绘制，改网页字体不会自动重绘既有 PNG；需要用制票脚本重新导出。
6. 背景音乐可在 musicUrl 填入同站 assets/music/your-track.mp3，并填写 musicCredit、musicLink。选择自己有相应使用权的音乐，或保持为空。音乐由访客主动点击黄铜旋钮播放，可切音量与关闭。原曲署名参考：AKMU（乐童音乐家）《Farewell》，专辑 SAILING。
7. 新增更高编号的来信后，之前的有效旧信自动入藏并显示已读；最新一封由访客手动入藏。收藏只保存在当前浏览器。删除/撤回记录后，其自动归档状态随当前列表重算。

## 本地预览

在 template 目录运行 `python -m http.server 8000`，打开 http://localhost:8000。用本地服务器检查图片下载；直接双击 HTML 时，浏览器可能禁止读取 PNG 来打 ZIP。

## 制票入口

在仓库根目录阅读 [制票 Skill](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/SKILL.md)、[规则](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/references/rules.md) 和[三份完整提示词](https://github.com/jianjidanbenren-eng/yomemado/blob/main/skills/yomemado-stamp-maker/references/prompts.md)。先生成无字画芯，再由 Python/Pillow 固定套版；并非给网页配置音乐才能制票。

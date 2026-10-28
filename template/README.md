# 游目窗｜可部署的公开机器

沿用原项目机器外壳与完整交互，内置布达拉宫、普莫雍错、苏州留园三枚历史 Skill 测试样例。点地图 → RELEASE 出票 → 点击出口取信 → 翻面 → 下载正反面 ZIP → 手动入藏。

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjianjidanbenren-eng%2Fyomemado&root-directory=template&project-name=my-yomemado&repository-name=my-yomemado) · [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/jianjidanbenren-eng/yomemado)

Vercel 根目录设为 template；Netlify 读取仓库根目录 netlify.toml 的 base=template。网页纯静态，无需后端、密钥或 npm 安装。

- 改标题、收信人、宋体或音乐：config.js。
- 改来信与正反 PNG：letters.js。
- 改机器外壳/颜色：custom.css，保留 machine.js 所需的元素 ID。
- 制作新邮票：仓库 skills/yomemado-stamp-maker 的 Skill、规则、完整提示词和脚本。
- 图片来源与未核实项：skills/yomemado-stamp-maker/examples/provenance.json。

默认调用系统宋体/宋体类衬线字体。原视频使用白河的星光小熊猫体幼儿风 Beta 2.1；模板未包含该字体。原项目配乐参考 AKMU《Farewell》；播放器可换音乐，公开包未附原录音。

阅读/收藏记录保存在本浏览器，跨设备不自动同步。新来信使之前的旧信自动入藏并显示已读；最新一枚等待你点击入藏。修改同一编号的图片会改变内容标记，旧手动收藏不会冒充对新图的收藏。

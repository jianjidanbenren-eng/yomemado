# 游目窗｜可部署的公开机器

沿用原项目机器外壳与完整交互，内置布达拉宫、普莫雍错、苏州留园三枚历史 Skill 测试样例。点地图 → RELEASE 出票 → 点击出口取信 → 翻面 → 下载正反面 ZIP → 手动入藏。

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjianjidanbenren-eng%2Fyomemado&root-directory=template&project-name=my-yomemado&repository-name=my-yomemado) · [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/jianjidanbenren-eng/yomemado)

Vercel 根目录设为 template；Netlify 读取仓库根目录 netlify.toml 的 base=template。网页纯静态，无需后端、密钥或 npm 安装。

- 改标题、收信人、宋体或音乐：config.js。
- 改来信与正反 PNG：letters.js。
- 改机器外壳/颜色：custom.css，保留 machine.js 所需的元素 ID。
- 制作新邮票：仓库 skills/yomemado-stamp-maker 的 Skill、规则、完整提示词和脚本，含原三份画芯提示词及新增三份工作流提示词。
- 图片来源与未核实项：skills/yomemado-stamp-maker/examples/provenance.json。

默认调用系统宋体/宋体类衬线字体。原视频使用白河的星光小熊猫体幼儿风 Beta 2.1；模板未包含该字体。原项目配乐参考 AKMU《Farewell》；播放器可换音乐，模板不单独附整首歌曲文件；项目页的演示视频按用户要求使用有声原片。

阅读/收藏记录保存在本浏览器，跨设备不自动同步。新来信使之前的旧信自动入藏并显示已读；最新一枚等待你点击入藏。更换同一编号的图片路径会改变内容标记，旧手动收藏不会冒充对新图的收藏；覆盖同名文件时，应同时更新资源路径或版本参数。

需要定时寄信、各设备读取同一批新信，或另加个人状态同步时，按[自动投递与跨设备接入说明](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/自动投递与跨设备接入.md)操作。文档含配置、接口、权限、失败恢复、验收和给小机的提示词；这些后端能力需要部署者自行接入。

当前三个地图点对应三封信，藏信先有两枚旧信且均已读；最新一枚即使读过，也要点「入藏」后才加入。新增第四封时，旧三封自动入藏并已读。翻面后正文按 W32 分两段逐字写出，最后出现落款，静音也会继续书写。详见[与原机的行为对照](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/行为对照.md)。


原版 W32 交互音效已保留，包括 V3 出票、翻纸、两段钢笔声和藏信开合；机音与背景音乐分别控制。音效更换与来源见 [使用说明](USAGE.md)。

灵感与参考作者见[灵感与致谢](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/灵感与致谢.md)，Skill 包内同时保留来源与许可；常见问题见[二十项踩坑指南](https://github.com/jianjidanbenren-eng/yomemado/blob/main/docs/踩坑复盘.md)。

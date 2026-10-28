# 第三方说明与素材来源

| 内容 | 来源与处理 |
|---|---|
| 公开机器外壳 | 由原游目窗机身与布局代码提取；数据、字体、音乐与交互拆开配置 |
| 三张历史画芯 | W45 照片题材测试候选，W47 固定母版验证：布达拉宫、普莫雍错、苏州留园；用户指定作为公开样例 |
| 原始参考照片 | 用户提供的历史测试参考；本仓库未分发原始照片 |
| 共享母版 | 从原项目框纸/Alpha 清除私人画芯及动态字段，保留公开的系列固定字样 |
| 新的示例正反面 | 从历史画芯和共享母版重新套版，统一公开编号和通用短笺；不代表新模型生图测试 |
| 示例 PNG 字形 | 页面优先使用本机宋体；已导出的示例背面用 Noto Serif CJK SC 渲染：[上游](https://github.com/notofonts/noto-cjk)，字体不随包分发 |
| 视频手写字体 | 白河「星光小熊猫体幼儿风 Beta 2.1」：[作者](https://github.com/cyberinkflow/StarPandaKidsFonts)、[条款](https://github.com/cyberinkflow/StarPandaKidsFonts/blob/main/LICENSE)；保留视频展示和署名，不包含字体二进制 |
| 原项目配乐参考 | AKMU《Farewell》，专辑 SAILING；[官方收听](https://music.apple.com/us/song/farewell/1480802556)。模板不单独附整首歌曲文件；用户提供的演示原片保留现有音轨，包含原项目配乐与机音。视频及音轨不随代码 MIT 许可开放重用；此署名不表示已取得歌曲公开使用授权 |
| 项目演示原片 | 用户提供的「游目窗_浮世绘杂志风演示视频.mp4」，45 秒、1920×1080、H.264/AAC；原样复制，文件字节校验见 `assets/showcase-source.json` |
| 原版交互声 | 保留原项目 W32 音效：原版 V3 出票合成程序及原机八个短采样（开关、地图、盖章、翻纸、钢笔、入藏、藏信开合）；采样逐字节提取，校验见 `template/assets/sfx/sources.json`。不含 AKMU 背景音乐；此记录说明迁移来源，不额外推定采样上游许可 |

## 灵感与 Skill 的借鉴关系

灵感来源为[池又雨 / Yinglianchun](https://github.com/Yinglianchun)分享的世界之窗与外部唤醒思路；相关项目为 [SameWindow](https://github.com/Yinglianchun/SameWindow) 与 [ChatGPT Context Bridge](https://github.com/Yinglianchun/chatgpt-context-bridge)。最初分享帖的原链接尚未找回，相关仓库不冒充原帖。它们是方向和方法参考，不是本项目已打包的代码；SameWindow 当前自定义许可不随本仓库改成 MIT。

| Skill 参考 | 具体借鉴与改写 | 随包许可 |
| --- | --- | --- |
| [cakeni · Ukiyoe Picture Skill](https://github.com/cakeni/ukiyoe-picture-skill) | 木版刻线、配色、纸纹、参考照片转译；游目窗改成只生无字画芯，印刷层由程序固定 | [MIT · © 2026 cakeni](skills/yomemado-stamp-maker/licenses/ukiyoe-picture-skill-MIT.txt) |
| [Yan Liu · Mono Color Skill](https://github.com/yanliudesign/mono-color-skill) | 油墨、套印、纸面与层级的补充参考；不继承单色/双色硬约束或示例布局 | [MIT · © 2026 Yan Liu](skills/yomemado-stamp-maker/licenses/mono-color-skill-MIT.txt) |
| [FANTASY／梵想美学 · Photo Revival](https://github.com/dacnay816y62-hub/photo-revival) | 照片主体提取与手作插画转译；不继承其小图加大面积空白的构图 | [MIT · © 2026 FANTASY](skills/yomemado-stamp-maker/licenses/photo-revival-MIT.txt) |

完整关系、游目窗新增规则和核对快照见 [灵感与致谢](docs/灵感与致谢.md) 和 [Skill 来源](skills/yomemado-stamp-maker/references/sources.md)。缺少早期逐句改写记录的地方不虚构直接 fork 或代码复用关系。三份 MIT 原文保持不变；再次分发 Skill 时保留这些作者和通知。

上游示例图、研究图等按各自条款；尤其 Mono Color 的 [ASSET-LICENSE](https://github.com/yanliudesign/mono-color-skill/blob/main/ASSET-LICENSE.md) 与 [REFERENCES](https://github.com/yanliudesign/mono-color-skill/blob/main/REFERENCES.md) 单列视觉资产和第三方来源。本仓库未搬运其研究图或示例图，不能将上游文字/代码的 MIT 推及那些图片。

地点沿用历史测试标签；默认地图点位是地区示意，精确坐标、摄影位置和留园具体房间未独立核实。来源状态见 Skill examples/provenance.json。代码/文档的 MIT 许可不替第三方素材重新授权。

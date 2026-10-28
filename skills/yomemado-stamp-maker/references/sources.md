# Skill 来源、借鉴与改写

游目窗制票 Skill 是在其他创作者公开的方法基础上学习、改写并逐步形成的，不应表述为所有想法和提示词均从零独创。使用或再次分发本包时，请保留本页、相关作者与原仓库链接，以及 `licenses/` 中的许可原文。

## 参考了谁，以及怎样使用

| 创作者与原项目 | 参考的方向 | 游目窗的改写与取舍 |
| --- | --- | --- |
| **cakeni** · [Ukiyoe Picture Skill](https://github.com/cakeni/ukiyoe-picture-skill) · [原 Skill v1.2](https://github.com/cakeni/ukiyoe-picture-skill/blob/main/Ukiyoe_Picture_Skill_v1.2.md) | 浮世绘／木版印刷的线条、克制色块、纸纤维，以及参考照片主体身份与构图的保持 | 改为只生成无字画芯；不采用上游允许的图中文字、题签和框景装饰；文字、编号、框纸、齿孔交给固定套版程序 |
| **Yan Liu / yanliudesign** · [Mono Color Skill](https://github.com/yanliudesign/mono-color-skill) · [原 Skill](https://github.com/yanliudesign/mono-color-skill/blob/main/SKILL.md) | 油墨、套印、纸面、留白和版式层级的受控表达 | 作为印刷质感与视觉组织的补充参考；不强制游目窗只用单墨／双色，也不套用其海报构图和留白比例 |
| **FANTASY／梵想美学** · [Photo Revival](https://github.com/dacnay816y62-hub/photo-revival) · [原 Skill](https://github.com/dacnay816y62-hub/photo-revival/blob/main/SKILL.md) | 从日常照片提取可辨认主体，再转译为有纸感、手作感的插画 | 保留照片与画风职责分离；不采用其“小幅插画＋大面积空白纸”布局，游目窗画芯需要完整适配 624:723 槽位 |

前述项目承担的方法角色不同。历史文件已经列出这三项参考，本次又核对了各上游的公开说明和许可；尚未取得早期每一次改写的逐句记录，因此不虚构逐句对应关系，也不将三个仓库都称为整个程序的直接 fork。

## 游目窗后来增加的约束

- 照片转绘、自主采风两种入口共用同一套生产链，事实与艺术演绎分开记录。
- 画芯只出无字插画；624×723 画芯、736×1040 双面 RGBA、固定母版程序负责文字和透明齿孔。
- 固定字样与动态字段分层；底部地名恰好两行，长名先核实准确简称，不悄悄缩字或改框。
- 地点全称用于资料、地图和藏信，印刷简称不覆盖事实主档；未知坐标不编造。
- 正反面继承同一 Alpha；同时验收实际 PNG、屏幕显示和下载结果。
- 脚本套版、原生无字生图、网页发布分别报告，不用旧候选证明新模型环节成功。

这些是游目窗迭代后形成的执行规则；它们与上游风格方法并存，不能以“修改很多”为由删掉原作者署名。

## 提示词从哪里来

[prompts.md](prompts.md) 保留 W48 的三份完整画芯提示词，公开版将私人 001 风格依赖替换为本包 `assets/style-reference.png`，并将对应指代改为公开参考。照片中文、英文、自主采风中文三个核心正文保留。

本次另补总执行入口、事实与短笺、成品复核三份可复制工作流提示词，并标为公开版补充，避免把它们冒称为上游原文。具体字段和脚本能力以 [rules.md](rules.md)、`SKILL.md` 与实际程序为准。

## 许可随包保留

| 项目 | 本次核对的许可与著作权声明 | 随包原文 |
| --- | --- | --- |
| Ukiyoe Picture Skill | MIT · Copyright (c) 2026 cakeni | [MIT 原文](../licenses/ukiyoe-picture-skill-MIT.txt) |
| Mono Color Skill | MIT · Copyright (c) 2026 Yan Liu | [MIT 原文](../licenses/mono-color-skill-MIT.txt) |
| Photo Revival | MIT · Copyright (c) 2026 FANTASY | [MIT 原文](../licenses/photo-revival-MIT.txt) |

上述许可针对各仓库声明覆盖的指令、代码或文档，并不自动覆盖其全部示例图和第三方研究图。特别是 Mono Color 将视觉资产另列于 [ASSET-LICENSE.md](https://github.com/yanliudesign/mono-color-skill/blob/main/ASSET-LICENSE.md)，第三方研究图的来源状态另见 [REFERENCES.md](https://github.com/yanliudesign/mono-color-skill/blob/main/REFERENCES.md)。本包未搬运这些上游图片；随包画芯的历史来源与未核实项在 `examples/provenance.json`。

2026-10-28 核对的上游文件 Git blob：Ukiyoe v1.2 `68adfc13210bf43e2734b412c97ebbda8bbb187c`；Mono Color SKILL `cda828401533d914bb43cf569b92f63003968dde`；Photo Revival SKILL `8e758cb080f99bb2cae505492c8d86d2a36fac97`。这是本次核对快照，不是已证明的早期学习版本；上游今后可能继续变化。

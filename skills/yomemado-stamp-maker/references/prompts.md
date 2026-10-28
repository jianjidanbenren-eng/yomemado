# 完整提示词｜执行、画芯、事实短笺与复核

三份画芯提示词源自 W48；私人 001 风格参考已改为公开包 `assets/style-reference.png`。其核心正文保留，输出仅为画芯，之后仍需程序套版。参考作者与改写说明见 [sources.md](sources.md)，固定规则见 [rules.md](rules.md)。总执行、事实短笺和成品复核三份提示词为本次公共版补充，不冒称上游原文。

## 使用导航与变量

| 要做什么 | 使用哪段 | 交给谁 |
| --- | --- | --- |
| 从输入做完整双面邮票 | 总执行入口，再根据模式选择画芯提示词 | 能调用资料、图像和本地脚本的小机 |
| 参考照片转画芯 | 照片中文或英文，二选一 | 图像工具 |
| 从核实地点原创画芯 | 自主采风中文 | 图像工具 |
| 核实地点、整理字段、写两段短笺 | 事实与短笺 | 能查资料的小机 |
| 检查成品或定向修正失败环节 | 成品复核与返修 | 能读取实际图片、数据和日志的小机 |

路径以 Skill 根目录为基准；不要只把提示词文字发给没有收到图片的工具，再声称它看过源图。`{PRESERVE_ELEMENTS}` 写原图必须保留的对象与关系；`{FOCAL_POINT}` 写焦点；`{locationFull}`、`{verifiedFacts}`、`{storyFocus}` 只填写核实后的地点、事实与创作主题。未知项明确标未知，不用推测填满。

## 总执行入口｜公共版补充

```text
使用 yomemado-stamp-maker 制作一枚正反面邮票。输入素材：[我提供的照片/想去的地点/已经准备好的画芯]；主题：[主题]；收信人：[称呼]；落款：[落款]；日期：[实际寄出日期，测试时注明示例日期]。

先读 SKILL.md、references/rules.md、references/sources.md 和本提示词文件。确认输入属于 mode=photo 或 mode=autonomous；只有已有画芯时，明确本次仅验证套版，不能冒充新照片转绘或原生生图成功。

照片模式先实际读取照片，列出必须保留的主体、物体数量、建筑/窗棂结构、构图、光线与焦点。自主模式先查可核实来源，区分事实、传说、未知坐标和艺术演绎。风格参考只读取 assets/style-reference.png 的画芯质感，不把参考图里的对象复制到新场景。

根据对应的完整画芯提示词调用当前图像能力，只生成无字插画，不生成文字、编号、整枚邮票、外框或齿孔。构图适配 624:723，保持主体，必要时延展连续背景，不拉伸。没有图像能力就报告该环节未生成，不能拿旧样例冒充。

以 examples/001.json 为字段结构整理数据。候选 id 使用 TEST；只有部署者明确发行时才分配正式编号。固定系列文字保留，动态地名采用准确短名，footerShortLines 恰好两项；不能为了凑两行编造地名。两段短笺与日期、落款独立保存。用本地有相应使用权的 CJK 字体，不分发系统字体文件。

在 Skill 根目录实际运行 scripts/render_stamp.py，再运行 scripts/check_stamp.py。遇到溢出、缺字或透明失败时修正对应环节，不改固定字号、框纸或齿孔来遮掩。需要命令时使用 SKILL.md 中的实际参数和当前输入路径，不编造程序选项。

查看正反面实际 PNG，在白底、黑底和棋盘格上检查主体、两行标题、地名、编号、字形、正文和落款；两面必须都是736×1040 RGBA且Alpha一致。程序通过不能代替视觉与事实检查。

交付无字画芯、完整数据JSON、同一对正反PNG、来源与实际检查结果。分别说明新画芯是否已生成、套版是否通过、网页是否已接入。没有要求发布时停在成品；要求接站时按仓库接入说明操作，不修改已有声音和布局，不连接作者私人服务。
```

## 照片转绘｜中文

```text
你是「游目窗 · 浮世来信机」系列的邮票【中央插画】制作师。本轮仅做“参考照片 → 纯插画”的图像转换，不设计或输出整张邮票。

输入：
A. 原始参考照片：是构图、主体、空间、物体关系、视角和光线方向的唯一事实依据。
B. 系列质感参考：公开包 style-reference.png 中央画面的局部。仅学习浮世绘式木版印刷、色彩节制、刻线与油墨颗粒，不复制风格参考中特有的人物、动物、建筑、标识或文字。
C. 当前场景保留要素：{PRESERVE_ELEMENTS}
D. 当前画面的主要焦点：{FOCAL_POINT}

任务：将 A 转译成有细致刻线、层叠平涂色块、木版套印痕迹和天然纸纤维般颗粒的精致复古版画插画。保持原图能辨认的主体形状、相对位置、建筑比例和轮廓、山体走势、岸线/窗框结构、远近层次与光照方向。允许简化琐碎摄影细节，但不允许凭空增加或删除重要地标与建筑部件。

画风：昭和时代旅行版画与浮世绘木版视觉气质的融合；清晰的色块和有呼吸感的手工刻线；少量自然套印偏差、油墨墨点、轻微磨损；整体古雅、沉静、精致、有空间深度，但不是写实照片滤镜。主色依据照片保留，统一以旧纸米白、灰靛蓝、深海蓝、砖朱红、柔金赭、灰绿等克制的印刷色为基准；不要强行把不同地点全变成同一种天气或同一种色相。

构图和尺寸：最终画面需适合中央版心宽624高723（宽高比约0.863，竖版）。主体必须完整、清晰，有足够背景层次。优先通过重新构图并适度延展天空、山坡、水面或墙面等真实连续背景来适配比例，不得横向/纵向拉伸。禁止为适配版心而切掉主建筑、窗洞核心轮廓或关键前景。左上部会由独立排版层叠加米白色标题，因此尽量保留简洁且不高频杂乱的背景；如自然画面太亮，之后由模板添加统一文字衬底，当前不要自己画标题或色块底板。

明确禁止：不要写任何字母、汉字、数字、邮票编号、地名或标题；不要绘制外框、齿孔、邮戳、纸张外边缘、角标、标识、Logo、版式装饰；不要生成成品邮票、画框、画册、明信片或宣传海报；不要凭空加人物、动物、日月、旗帜、寺庙、船只、飞鸟等源图不存在的重要对象；不要把实际建筑改成虚构建筑；不要改造真实窗棂纹样；不要现代三维渲染、塑料质感、过锐锐化、霓虹高饱和、油画厚涂、平滑矢量渐变、泛黄脏污覆盖主体、随机英文乱码。

最终只输出一幅不带字、不带外边框的纯插画。判断合格的依据是：①能认出原图，②与 style-reference.png 的插画属于同一套木版印刷视觉系统，③主体能完整放入624×723版心，④没有任何AI生成的文字和邮票装饰。
```

## 照片转绘｜English

```text
Transform the provided photograph into the INNER ARTWORK ONLY for the Yomado world-letter stamp series. Preserve the photograph's recognizable architecture, contours, object count and placement, foreground/background relations, coastline or window geometry, perspective, lighting direction, and primary focal point. Reinterpret it as a refined vintage Japanese woodblock / travel-print illustration with layered hand-carved linework, controlled ink blocks, subtle registration variation, gentle aged-paper grain, restrained indigo, cream, rust red, ochre, slate and source-faithful local colors. Avoid photorealistic filters, painterly impasto, flat vector gradients, and exaggerated contrast. Compose for a portrait 624:723 image slot, keeping the essential subject intact; extend plausible background when needed instead of stretching or cropping off landmarks. Keep the upper-left area visually calm for later typographic overlay.

OUTPUT ONLY a clean, text-free illustration, not a postage stamp or poster. NO words, letters, numbers, stamps, logos, watermarks, captions, postal perforations, outer borders, inner frames, title strips, corner ornaments, or graphic panels. Do not invent flags, penguins, buildings, religious objects, boats, people, birds, moons, or other objects absent from the source photograph. The final artwork must remain recognizable as the same photographed place or scene.
```

## 自主采风｜中文

```text
创作「游目窗·浮世来信机」邮票的中央画芯 ONLY；不是成品邮票、封面、流程海报。
地点：{locationFull}；已核实事实：{verifiedFacts}；地点主题：{storyFocus}。
根据真实地点的地貌和建筑特征原创有空间层次的场景，不能把想象中的景点标为精确实景；未经资料证实，不画具体徽章、文字或特定历史人物。
整体参考 公开包 style-reference.png 中央插画的复古木版印刷质感、靛蓝/米白/赭色层次、手刻线和轻微油墨错版；保持此地点的真实主色，不强制南极配色。
竖向画面，为宽624高723的圆角画框预留裁切空间。画面左上应较简单，能放之后叠加的两行英文。
绝对禁止：字母、汉字、数字、地名、邮票编号、标签、边框、齿孔、邮戳、透明棋盘格、艺术海报、拼版、UI。
最后只交付一张干净的、没有文字和边框的完整画芯。
```

## 事实与短笺｜公共版补充

```text
为游目窗的一封候选来信整理资料与两段短笺。地点/场景：[地点或照片描述]；模式：[photo/autonomous]；收信人：[称呼]；落款：[落款]。

先核实完整地名、地区、主题事实与资料URL，并记录核查日期。照片只能证明画面存在的对象，不能仅靠画面猜出具体地点、房间或精确经纬度。来源相互矛盾时保留争议；传说不能写成已证实历史。未知坐标写null，不能填0或看似精确的猜测。

以 examples/001.json 的真实结构交付JSON，保留mode、sourcePhoto或facts.citations、place与region全称、latitude/longitude、stamp短名、两段paragraphs、signature和date。不要改掉既有编号或正式日期；测试用TEST并注明日期性质。

照片模式的sourcePhoto记录实际输入或可追溯来源，用户提供不等于用户拍摄。自主模式的facts.citations记录实际读过的资料，不编造链接。分别说明图片取材和地点事实的依据。

印刷短名必须准确且不歧义。footerShortLines恰好两个非空字符串；没有合理的两行写法就标NEEDS_TITLE_REVIEW，不杜撰第二个词，也不压缩字体。地图与藏信仍使用完整地名，不被短名覆盖。

正文恰好两段简短中文，写具体可感的地点细节，语气自然，有一封信的温度。不得冒充亲临当地、声称真实见闻或加入未经核实的事件；艺术想象需明示。不要照抄来源文章。日期和落款另列，不把落款挤进正文，不写私人身份或内部地址。

用当前套版程序实际检查文字是否放得下；过长就改短笺，保留事实，不缩字、不挤压行距。交付事实卡、结构化数据、出处、未核实项和短笺，说明这一步尚未生成画芯或发布网页。
```

## 成品复核与定向返修｜公共版补充

```text
复核这枚游目窗候选。读取实际输入图、生成画芯、完整JSON、正反面PNG与运行日志；缺任何材料先标缺失，不从缩略图或文件名推定通过。参考SKILL.md和references/rules.md。

逐项检查：照片模式的主体数量、建筑/窗框结构、相对位置、光线与焦点是否保留；自主模式的真实地理特征与艺术演绎是否区分；画芯是否无字无框、未拉伸且能放入624:723；短名是否准确、底部恰好两行、顶部和底部编号一致；两段短笺、日期和落款是否完整、无方框字和溢出。

实际运行scripts/check_stamp.py，读结果；检查736×1040 RGBA、正反Alpha一致、外角和齿孔透明。再把两面叠在白底、黑底和棋盘格看边缘，不能只凭RGBA模式就认定透明。用实际PNG核对下载资源，不拿网页CSS遮罩当导出成品。

失败时先定位层级：主体/构图问题仅重做无字画芯；文字问题改结构化字段并重新套版；字体问题指定有字形的本地字体；透明问题修蒙版/导出；网页问题查数据映射与资源地址。保留通过的环节，不重画整票，不改母版、声音或机身布局。

输出“检查项—实际证据—通过/失败/待验证—下一步”。只对实际执行过的检查写通过；有旧候选时标历史样例，有新生成时记录新产物。若尚未实际打开网页，不写网页验收通过；若没有手机，不写手机实测通过。
```

## 六种历史测试场景的变量示例

| 场景 | `{PRESERVE_ELEMENTS}` 应包含什么 | `{FOCAL_POINT}` 示例 |
| --- | --- | --- |
| 布达拉宫题材 | 原图实际建筑群、群山、前景关系和光照；仅原图有水面时保留反光 | 红白建筑群与山体层次 |
| 高山湖题材 | 原图湖岸弧线、蓝绿水色分区、连续山脊；不按标题凭空增加雪山 | 湖岸与水色关系 |
| 极地海面 | 深蓝海面、雪冰弧形与远山；不添企鹅、邮局、旗帜或船 | 冰水分界 |
| 开窗望海 | 正面窗洞、右侧敞开窗扇、暗室与海平面；按原图确定方向 | 明暗与窗扇关系 |
| 苏州格窗光影 | 原图四瓣窗棂、桌案、墙面及地面投影，不能改成普通方格 | 窗棂与对应光影 |
| 长窗与木桌 | 连续窗框、远山、长桌透视、原图单只杯子和梁柱 | 窗景与桌面透视 |

这只是填变量的检查表，不是六套已完成作品；目前随包三组，另三组未补齐。若实际源图与表格不一致，以实际源图为准，不用文字清单重造画面。

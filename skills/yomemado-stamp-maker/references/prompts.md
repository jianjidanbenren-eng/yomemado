# 完整画芯提示词

源自 W48；私人 001 风格参考已改为公开包 assets/style-reference.png。输出仅为画芯，之后仍需程序套版。

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

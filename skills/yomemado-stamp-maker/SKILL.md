---
name: yomemado-stamp-maker
description: 将用户照片转绘为木版画风格邮票画芯，或依据可信资料自主采风创作无字插画，再通过固定母版生成正反面 736×1040 RGBA 邮票。用于照片转邮票、游目窗制票、透明齿孔、两行地名排版及成品验收任务。
---

# 游目窗制票

使用同一个公开母版，按“事实与画芯 → 固定排版 → 正反面 PNG → 校验”完成作品。先读 [规则](references/rules.md)；需要生成画芯时读 [完整提示词](references/prompts.md)。

本 Skill 在 cakeni 的 Ukiyoe Picture Skill、Yan Liu 的 Mono Color Skill、FANTASY／梵想美学的 Photo Revival 等公开方法上学习、改写，再形成游目窗的制票约束。首次使用或再次分发时读 [来源与改写](references/sources.md)，保留作者、原仓库链接和随包许可。完整提示词另含总执行、事实短笺与成品复核入口；不要只执行画芯提示词就把整条流程标为完成。

## 选择入口

- 用户提供照片：采用 `mode=photo`。以实际照片确定主体、构图与物体关系。记录来源；不要把未附带的照片当成已经读过。
- 用户要求从真实地点自主创作：采用 `mode=autonomous`。先查可靠来源，保存地点全名、事实、来源 URL 与不确定项；未知坐标保留 null。
- 用户只要求从准备好的画芯套版：直接使用已有画芯，并明确标注这一步没有验证 AI 生图或原始照片转换。

图像模型只生成 624:723 的无字插画。使用当前环境提供的图像生成能力；没有图像工具时说明尚未生成，不拿旧样例冒充新作品。

## 输入与制作

1. 准备宽 624、高 723 的完整无字画芯，构图需要延展时先处理画芯，不拉伸主体。
2. 复制 `examples/001.json` 的结构，填写 id、mode、sourcePhoto 或 facts.citations、全称、日期、短笺、署名和 stamp 字段。测试用 TEST；示例编号与任何作者私人信箱无关。
3. 为底部地名提供恰好两个非空字符串。保留固定字级与基线；溢出时缩短准确文案，无法合理缩短时标为 NEEDS_TITLE_REVIEW。
4. 在本 Skill 目录运行：

```bash
python -m pip install -r requirements.txt
python scripts/render_stamp.py --art examples/001-art.png --data examples/001.json --font /path/to/local-songti-font --out output
python scripts/check_stamp.py output/001-front.png output/001-back.png
```

路径以实际输入替换。`--font` 指向本机有权使用的宋体/CJK 字体；Windows/macOS/部分 Linux 会自动检测常见宋体路径。英文短笺可省略该选项。没有中文字体时明确报错，不默默输出方框。可选 `--print-font` 控制正面英文衬线字体，替换后重新检查溢出。

5. 检查输出：正反面均为 736×1040 RGBA、同一 Alpha，四角与齿孔外部透明；在白底、黑底和棋盘格上检查无黑边。
6. 肉眼核对画芯、两行标题、编号、地名与短笺；脚本不替代视觉和事实检查。

## 样例与输出边界

随包包含三枚历史制票测试的画芯与数据：布达拉宫、普莫雍错、苏州留园。原始照片未随包分发；画芯来自旧测试候选，不是本次重新从照片生成的结果。`examples/provenance.json` 记录来源与未核实项。六场景的历史检查表不代表随包有六套成品。

`assets/master.png` 是清除私人图心和动态字段后的共享框纸/Alpha 母版；`assets/style-reference.png` 是公开画芯风格参考。程序接受已准备好的画芯，不调用模型、查询网络或投递网页。

交付画芯、完整 JSON、正反面 PNG、来源和实际校验结果。将“脚本通过”“新画芯已生成”“网页已发布”分别报告。网页机壳、字体和音乐的修改见仓库的模板使用说明；它们不是静态制票的前置条件。

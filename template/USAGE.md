# 部署后怎么换成自己的游目窗

1. 打开 `config.js`：改站点标题、收信人名字、初始已入藏编号。
2. 打开 `letters.js`：复制一条示例并修改 `id / place / region / latitude / longitude / title / subtitle / date / note / palette`。
3. 提交修改。Vercel / Netlify 会自动重新部署。
4. 若要换成自己的插画，可继续扩展 `letters.js` 增加图片 URL 字段；公开模板默认不携带私人 W51 母版、音乐或字体。

这是零后端静态模板。浏览器收藏状态保存在本机 `localStorage`，不会跨设备同步。
# 游目窗 · 可部署模板

这是公开仓库里的**可部署版本**：零后端、零密钥、零依赖。部署后会直接得到一台可以点地图、出票、翻面、下载 PNG 和入藏的游目窗。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjianjidanbenren-eng%2Fyomemado%2Ftree%2Fmain%2Ftemplate&project-name=my-yomemado&repository-name=my-yomemado)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jianjidanbenren-eng/yomemado&create_from_path=template)

部署成功后只需要改两个文件：

- `config.js`：站名、收信人、初始入藏状态。
- `letters.js`：自己的来信、地点、经纬度、短笺与配色。

更详细的说明见 [USAGE.md](USAGE.md)。

## 这个模板包含什么

- 世界地图红点选择
- RELEASE 出票
- 邮票正反面翻转
- 生成并下载正反面 PNG
- 手动「入藏」
- 本机 localStorage 保存收藏状态
- 电脑和手机响应式布局

## 它没有什么

这个公开模板**不包含**私人 W51 页面、私人来信、原音乐、第三方字体、私有插件、密钥或自动投递后端。它是为公开部署重新整理的静态版本。

如果要做跨设备同步、自动定时寄信或服务端来信 API，需要自行增加后端；这些能力不会偷偷依赖作者的私人服务。

## License

模板中的原创代码与文字采用 MIT License。请为你自行加入的图片、字体、音乐确认各自的使用许可。

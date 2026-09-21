# Universal Base64 Decoder

在任意 HTTP/HTTPS 网页中自动解码 Base64 文本，支持动态加载和文本更新。

## 使用

- 在 Base64 原文旁高亮显示解码结果，点击即可复制，也支持聚焦后按 Enter 或空格键复制。
- 只显示有效 UTF-8 文本；含异常控制字符的结果不显示，允许制表符、换行和回车。
- 跳过链接、脚本、表单控件和可编辑区域。解码出的 HTML 仅作为文本显示。
- 复制失败时会显示提示，可手动选中结果复制。

## 限制

仅识别标准 Base64：长度大于 8、为 4 的倍数，且填充合法。不支持 URL 安全格式、跨文本节点或递归解码，也不扫描 Shadow DOM。

文本检查无法完全排除误识别，请结合保留的原文核对。浏览器内部页面和 PDF 查看器不适用。

## 致谢

早期解码逻辑和样式参考了 [coolpace 的 V2EX Polish](https://github.com/coolpace/V2EX_Polish)（[原始实现](https://github.com/coolpace/V2EX_Polish/blob/0c42df6a806cbdd37236cfbf42cb7be118305da9/src/contents/helpers.ts)）。

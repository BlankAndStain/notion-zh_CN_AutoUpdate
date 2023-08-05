# notion-zh_CN_AutoUpdate
notion客户端的中文本地化文件自动更新脚本，本地化项目地址：https://github.com/Reamd7/notion-zh_CN

原理：  
    基于github的api实现的。通过自动获取和解析latest release信息从而获取最新文件的下载链接，并且保存到本地。

使用方法：
- 将cnLocalization.js放入"${NotionRoot}\resources\app\renderer"目录下
- 在"${NotionRoot}\resources\app\renderer\preload.js"中添加require("./cnLocalization")

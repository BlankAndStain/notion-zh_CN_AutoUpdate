const fs = require("fs")
const https = require("https");

// 调用当前的本地文件，没有则创建
let scriptFile = `${__dirname}/notion-zh_CN.js`
try {
    fs.accessSync(scriptFile, fs.constants.F_OK);
} catch(err){
    //创建一个空脚本
    fs.writeFileSync(scriptFile, "")
}
require("./notion-zh_CN")

// 获取github仓库最新release的信息
function getGithubRepoLatestReleaseInfo(repoName, onSuccess){
    let latestVersionURL = `https://api.github.com/repos/${repoName}/releases/latest`
    let options = {
        headers:{
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188"
        }
    }
    let rawData = ""
    https.get(latestVersionURL, options, (res) => {
        res.on("data", (chunk) => rawData+=chunk)
        res.on("end", () => {
            onSuccess(JSON.parse(rawData))
        })
    })
}

// 自动下载最新的notion-zh_CN.js
const repoName = "Reamd7/notion-zh_CN"
getGithubRepoLatestReleaseInfo(repoName,
    function (responseJson){
        var assets = responseJson["assets"]

        const targetAssetName = "notion-zh_CN.js"
        assets.forEach((asset) => {
            // 检查是否是target asset
            if (asset["name"] != targetAssetName)
                // 如果不是target asset则跳过更新
                return

            // 检查版本是否一致
            var versionFile = `${__dirname}/l10n_node.txt`
            try {
                fs.accessSync(versionFile, fs.constants.F_OK);
            } catch(err){
                //创建一个当前版本号记录
                fs.writeFileSync(versionFile, "")
            }
            var currentNode = fs.readFileSync(versionFile)
            var latestNode = asset["node_id"]
            if (currentNode == latestNode)
                // 如果版本node相同跳过更新
                return

            // 下载最新版本的文件
            let downloadURL = asset["browser_download_url"]
            let options = {
                headers:{
                    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188"
                }
            }
            https.get(downloadURL, options, (res) => {
                var newLocation = res.headers["location"]
                // 处理重定向
                https.get(newLocation, options, (_res) => {
                    let rawData = ""
                    _res.on("data", (d) => {
                        rawData += d
                    })
                    // 更新本地文件
                    _res.on("end", ()=>{
                        fs.writeFileSync(scriptFile, rawData)
                        fs.writeFileSync(versionFile, latestNode)
                        window.location.reload()
//                        alert(`中文本地化文件已经更新，请重启程序应用！`)
                    })
                })
            })
        })
    }
)



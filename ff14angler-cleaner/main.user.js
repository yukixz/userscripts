// ==UserScript==
// @name         饥饿的猫 - 过滤垃圾评论
// @namespace    https://dazzyd.org/
// @author       Dazzy Ding
// @version      0.3
// @downloadURL  https://raw.githubusercontent.com/yukixz/userscripts/master/ff14angler-cleaner/main.user.js
// @match        https://*.ff14angler.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const RUBBISH_WORDS = [
        "滚", "妈", "求", "死", "nm", // 单字地图炮
        "爸爸", "超度", "存在",
        "蝗虫", "垃圾", "没嘴", "你吗", "你嘴",
        "傻逼", "沙雕", "全脱",
        "小心", "许愿", "咬钩", "杂种", "崽种", "长嘴",
    ];

    document.querySelector("div.comment_list").addEventListener('DOMNodeInserted', (e) => {
        const node = e.target
        if (node.classList == null || !node.classList.contains("comment")) {
            return
        }
        // DOM刚插入时没有评论内容，延迟一下等饿猫渲染。
        setTimeout(() => {
            const text = node.textContent.toLowerCase()
            for (const word of RUBBISH_WORDS) {
                if (text.includes(word)) {
                    console.info(`删除垃圾评论：${word}|${text}`)
                    node.remove()
                    break
                }
            }
        }, 100)
    })
})();

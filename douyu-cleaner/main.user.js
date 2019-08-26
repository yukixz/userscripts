// ==UserScript==
// @name        Douyu Cleaner
// @namespace   http://dazzyd.org/
// @description 去掉乱七八糟的图标，更加干净整洁
// @version     0.0.1
// @author      Dazzy Ding
// @downloadURL https://raw.githubusercontent.com/yukixz/userscripts/master/douyu-cleaner/main.user.js
// @icon        https://www.douyu.com/favicon.ico
// @match       *://www.douyu.com/*
// @grant       none
// @run-at      document-idle
// ==/UserScript==


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


window.setTimeout(() => {

    // Clear Barrage
    $('#js-barrage-list').addEventListener('DOMNodeInserted', (e) => {
        const node = e.target
        if (node.tagName !== 'LI') {
            return
        }

        // Remove system message
        const SYSTEM_CLASSES = ['Barrage-message', 'Barrage-notice']
        for (const child of node.children) {
            for (const cls of SYSTEM_CLASSES) {
                if (child.classList.contains(cls)) {
                    node.remove()
                    return
                }
            }
        }

        // Remove icons
        const ICONS_SELECTORS = '.Barrage-icon, .ChatAchievement, .FansMedal, .Medal, .Motor, .RoomLevel, .UserLevel'
        for (const child of node.querySelectorAll(ICONS_SELECTORS)) {
            child.remove()
        }

        // Replace large barrage with normal
        const LARGE_CLASSES = ['Barrage-notice--noble', 'Barrage--paddedBarrage']
        for (const child of node.children) {
            for (const cls of LARGE_CLASSES) {
                child.classList.replace(cls, 'Barrage-notice--normalBarrage')
            }
        }
    })

}, 4000);


let timer = window.setInterval(() => {

    // No Activity
    for (const node of $$('#js-room-activity')) {
        node.remove()
    }

    // No Rank
    for (const node of $$('.layout-Player-rank')) {
        node.remove()
    }
    for (const node of $$('.layout-Player-barrage')) {
        node.style.top = "39px"
    }

}, 3000)
window.setTimeout(() => {
    window.clearInterval(timer);
}, 30000)

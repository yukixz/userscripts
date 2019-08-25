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
        const BARRAGE_HIDE_SELECTORS = '.FansMedal, .UserLevel, .RoomLevel, .Motor, .Barrage-noble'
        const node = e.target
        if (node.tagName === 'LI') {
            for (const childnode of node.querySelectorAll(BARRAGE_HIDE_SELECTORS)) {
                childnode.remove()
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

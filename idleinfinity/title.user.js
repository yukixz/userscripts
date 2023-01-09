// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.1.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


function new_title() {
    if (location.pathname === "/Map/Dungeon") {
        const seconds = document.querySelector('span.state')
        if (seconds != null) {
            return `${location.pathname} SAN:${seconds.textContent}`
        }
    }
    if (location.pathname === "/Battle/InDungeon") {
        const seconds = document.querySelector('span#time')
        if (seconds != null) {
            return `${location.pathname} ET:${seconds.textContent}`
        }
    }
    if (location.pathname.startsWith("/Help/")) {
        return `${location.pathname}${location.search}`
    }
    return location.pathname
}

function run() {
    document.title = new_title()
}


setTimeout(() => {
    run()
    setInterval(run, 100)
}, 0)
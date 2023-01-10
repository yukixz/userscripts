// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.3.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


/****************************************************************
 * title
 * 在标题栏显示页面信息
 ****************************************************************/

function update_title() {
  let title = location.pathname
  if (location.pathname === "/Map/Dungeon") {
    const seconds = document.querySelector('span.state')
    if (seconds != null) {
      title = `${location.pathname} SAN:${seconds.textContent}`
    }
  }
  if (location.pathname === "/Battle/InDungeon") {
    const seconds = document.querySelector('span#time')
    if (seconds != null) {
      title = `${location.pathname} ET:${seconds.textContent}`
    }
    setTimeout(update_title, 100)
  }
  if (location.pathname.startsWith("/Help/")) {
    title = `${location.pathname}${location.search}`
  }
  document.title = title
}

setTimeout(update_title, 0)

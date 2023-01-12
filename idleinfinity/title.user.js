// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.3.1
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


function update_title() {
  let title = location.pathname
  if (location.pathname === "/Map/Dungeon") {
    const explored = document.querySelector('.panel .explore').textContent
    const monster = document.querySelector('.panel .monster-left').textContent
    const boss = document.querySelector('.panel .boss-left').textContent
    title = `Map ${Math.floor(100 * explored / 400)}% mob:${monster}/${boss}`
  }
  if (location.pathname === "/Battle/InDungeon") {
    title = `Battle...`
    const seconds = document.querySelector('span#time')
    if (seconds != null) {
      title = `Battle in ${seconds.textContent}s`
      setTimeout(update_title, 100)
    }
  }
  if (location.pathname.startsWith("/Help/")) {
    title = `${location.pathname}${location.search}`
  }
  document.title = title
}

setTimeout(update_title, 0)

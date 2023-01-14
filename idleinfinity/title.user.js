// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.3.2
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
    setTimeout(update_title, 1000)
  }
  if (location.pathname === "/Battle/InDungeon") {
    const timeNode = document.getElementById("time")
    if (timeNode != null) {
      title = `Battle in ${timeNode.textContent}s`
      setTimeout(update_title, 200)
    }
    const dataNode = document.querySelector(".battle-data")
    if (dataNode != null) {
      title = dataNode.classList.contains("visually-hidden") ? "Battle ..." : "Battle done"
      setTimeout(update_title, 1000)
    }
  }
  if (location.pathname.startsWith("/Help/")) {
    title = `${location.pathname}${location.search}`
  }
  document.title = title
}

setTimeout(update_title, 0)

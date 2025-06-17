// ==UserScript==
// @name         Manarion Secretary
// @namespace    http://tampermonkey.net/
// @version      0.1-dev
// @description  Your private secretary for https://manarion.com/
// @author       Dazzy Ding
// @match        https://manarion.com/*
// @icon         https://manarion.com/icon.png
// @run-at       document-idle
// ==/UserScript==

function log(msg) {
  console.log(`[Secretary] ${msg}`)
}

let nodeQuestProgress = null
function checkQuestProgress() {
  // find
  if (nodeQuestProgress == null) {
    for (const node of document.querySelectorAll('h2.text-lg')) {
      if (node.textContent === "Quest Progress") {
        nodeQuestProgress = node.parentNode
        break
      }
    }
  }
  // click
  if (nodeQuestProgress.classList.contains('cursor-pointer')) {
    log('[Secretary] click QuestProgress')
    nodeQuestProgress.click()
  }
}
setInterval(checkQuestProgress, 1000 + 500 * Math.random())
// ==UserScript==
// @name         Idle Infinity - Upgrade
// @namespace    http://dazzyd.org/
// @version      0.1.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @license      MIT
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==

const actions = {
  "/Equipment/Material": () => {
    Array.from(document.querySelectorAll('.panel-heading'))
      .find(e => e.innerText.trim() === `宝石`)
      .parentNode.querySelector(".gem-upgrade").click()
    setTimeout(() => {
      document.querySelector("#modalGemUpgrade.in .gem-upgrade-apply").click()
    }, 200)
  },
  "/Skill/UserSkill": () => {
    document.querySelector('.skill-group-upgrade').click()
    setTimeout(() => {
      document.querySelector("#modalConfirm.in .confirm-ok").click()
    }, 200)
  },
}


setTimeout(() => {
  const action = actions[location.pathname]
  if (action != null) {
    action()
  }
}, 1000)


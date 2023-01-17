// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.4.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


const store = {
  load() {
    const saved = JSON.parse(localStorage.getItem(`dd_ui_title`) || "{}")
    for (const [key, val] of Object.entries(saved)) {
      this[key] = val
    }
  },
  save() {
    localStorage.setItem(`dd_ui_title`, JSON.stringify(this))
  },
}
const rules = {
  "/Home/Index": ["主页"],

  "/Character/Detail": ["角色"],
  "/Skill/Config": ["技能"],
  "/Equipment/Query": ["装备"],
  "/Equipment/Material": ["材料/符文/宝石"],
  "/Battle/BattleField": ["战场"],
  "/Character/Group": ["团队"],

  "/Map/Detail": ["地图"],
  "/Map/Dungeon": ["秘境", () => {
    const explored = document.querySelector('.panel .explore').textContent
    const monster = document.querySelector('.panel .monster-left').textContent
    const boss = document.querySelector('.panel .boss-left').textContent
    return `${Math.floor(100 * explored / 400)}% ${monster}/${boss}`
  }],
  "/Battle/InDungeon": ["战斗", () => {
    const timeNode = document.getElementById("time")
    if (timeNode != null) {
      return `in ${timeNode.textContent}s`
    }
    const dataNode = document.querySelector(".battle-data")
    if (dataNode != null) {
      return dataNode.classList.contains("visually-hidden") ? "Battle ..." : "Battle done"
    }
  }],

  "/Config/Query": ["物品过滤"],
  "/Character/RankingList": ["赛季排行"],
  "/Character/AllChar": ["角色等级排行"],
  "/Character/AllCharMCU": ["符文掉落排行"],

  "/Help/Content?url=Base": ["帮助-基础知识"],
  "/Help/Content?url=CharType": ["帮助-职业介绍"],
  "/Help/Content?url=Monsters": ["帮助-怪物介绍"],
  "/Help/Content?url=Equip": ["帮助-物品装备"],
  "/Help/Content?url=BaseEquip": ["帮助-普通物品"],
  "/Help/Content?url=Prefix": ["帮助-前缀"],
  "/Help/Content?url=Suffix": ["帮助-后缀"],
  "/Help/Content?url=SpecialAffix": ["帮助-固定词缀"],
  "/Help/Content?url=Set": ["帮助-套装"],
  "/Help/Content?url=Sacred": ["帮助-圣衣"],
  "/Help/Content?url=Unique": ["帮助-传奇物品"],
  "/Help/Content?url=Artifact": ["帮助-神器"],

  "/Guide/Query": ["攻略列表"],
  "/Guide/Detail": ["攻略详情"],
}

setTimeout(() => {
  const char = (() => {
    const matches = location.search.match(/\bid=(\d+)/i)
    if (matches == null) return
    const id = matches[1]

    store.load()
    if (store[id] == null) {
      const firstNavItem = document.querySelector("#navbar > ul > li")
      if (firstNavItem.classList.contains("dropdown")) {
        store[id] = firstNavItem.firstElementChild.text
        store.save()
      }
    }
    return store[id]
  })()

  const [title, getInfo] = (() => {
    for (const key of [location.pathname, `${location.pathname}${location.search}`]) {
      if (rules[key] != null) {
        return rules[key]
      }
    }
    return []
  })()

  function update() {
    document.title = [
      char != null ? `[${char}]` : null,
      title != null ? title : location.pathname,
      getInfo != null ? getInfo() : null,
    ].filter(x => x != null).join(' ')
  }
  if (getInfo != null) {
    setInterval(update, 1000)
  }
  update()
}, 0)

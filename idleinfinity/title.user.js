// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.3.3
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


const rules = {
  "/Home/Index": "主页",

  "/Character/Detail": "角色",
  "/Skill/Config": "技能",
  "/Equipment/Query": "装备",
  "/Equipment/Material": "材料/符文/宝石",
  "/Battle/BattleField": "战场",
  "/Character/Group": "团队",

  "/Map/Detail": "地图",
  "/Map/Dungeon": "秘境",
  "/Battle/InDungeon": "战斗",

  "/Config/Query": "物品过滤",
  "/Character/RankingList": "赛季排行",
  "/Character/AllChar": "角色等级排行",
  "/Character/AllCharMCU": "符文掉落排行",

  "/Help/Content?url=Base": "帮助-基础知识",
  "/Help/Content?url=CharType": "帮助-职业介绍",
  "/Help/Content?url=Monsters": "帮助-怪物介绍",
  "/Help/Content?url=Equip": "帮助-物品装备",
  "/Help/Content?url=BaseEquip": "帮助-普通物品",
  "/Help/Content?url=Prefix": "帮助-前缀",
  "/Help/Content?url=Suffix": "帮助-后缀",
  "/Help/Content?url=SpecialAffix": "帮助-固定词缀",
  "/Help/Content?url=Set": "帮助-套装",
  "/Help/Content?url=Sacred": "帮助-圣衣",
  "/Help/Content?url=Unique": "帮助-传奇物品",
  "/Help/Content?url=Artifact": "帮助-神器",

  "/Guide/Query": "攻略列表",
  "/Guide/Detail": "攻略详情",
}

function getCharName() {
  const firstNavItem = document.querySelector("#navbar > ul > li")
  if (firstNavItem.classList.contains("dropdown")) {
    return `[${firstNavItem.firstElementChild.text}]`
  }
}

function getPathName() {
  for (const key of [location.pathname, `${location.pathname}${location.search}`]) {
    if (rules[key] != null) {
      return rules[key]
    }
  }
  return location.pathname
}

function update_title() {
  let parts = [
    getCharName(),
    getPathName(),
  ]

  if (location.pathname === "/Map/Dungeon") {
    const explored = document.querySelector('.panel .explore').textContent
    const monster = document.querySelector('.panel .monster-left').textContent
    const boss = document.querySelector('.panel .boss-left').textContent
    parts.push(`${Math.floor(100 * explored / 400)}% ${monster}/${boss}`)
    setTimeout(update_title, 1000)
  }
  if (location.pathname === "/Battle/InDungeon") {
    const timeNode = document.getElementById("time")
    if (timeNode != null) {
      parts.push(`in ${timeNode.textContent}s`)
      setTimeout(update_title, 200)
    }
    const dataNode = document.querySelector(".battle-data")
    if (dataNode != null) {
      parts.push(dataNode.classList.contains("visually-hidden") ? "Battle ..." : "Battle done")
      setTimeout(update_title, 1000)
    }
  }

  document.title = parts.filter(x => x != null).join(' ')
}

setTimeout(update_title, 0)

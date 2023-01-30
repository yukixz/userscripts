// ==UserScript==
// @name         Idle Infinity - Equipment
// @namespace    http://dazzyd.org/
// @version      0.4.4
// @description  Idle Infinity
// @author       Dazzy Ding
// @license      MIT
// @grant        GM_addStyle
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


const store = {
  load() {
    const saved = JSON.parse(localStorage.getItem(`dd_ui_equip`) || "{}")
    for (const [key, val] of Object.entries(saved)) {
      this[key] = val
    }
  },
  save() {
    localStorage.setItem(`dd_ui_equip`, JSON.stringify(this))
  },
}
const tipRules = {
  "职业技能": [/\+(\d+) .{0,2}(.{2})技能/g, "", "skill"],
  "赋予技能": [/赋予Lv(\d+.+?)（/g, "", "skill"],
  "召唤数量": [/\+(\d+) (.{1,6})最大召唤数量/g, "", "magic"],
  "增强伤害(ed)": [/\+(\d+)\% 增强伤害/g, "ed", "physical"],
  "攻击速度(ias)": [/攻击速度提升 (\d+)\%/g, "ias", "physical"],
  "施法速度(fcr)": [/施法速度提升 (\d+)\%/g, "fcr", "magic"],
  "魔法装备(mf)": [/\+(\d+)\% 更佳的机会取得魔法装备/g, "mf", "state"],
  "额外金币(gf)": [/\+(\d+)\% 额外金币从怪物身上取得/g, "gf", "lightning"],
  "元素抗性(res)": [/元素抗性 \+(\d+)\%/g, "res", "skill"],
  "抗火(f)": [/抗火 \+(\d+)/g, "f", "fire"],
  "抗寒(c)": [/抗寒 \+(\d+)/g, "c", "cold"],
  "抗闪电(l)": [/抗闪电 \+(\d+)/g, "l", "lightning"],
  "抗毒(p)": [/抗毒 \+(\d+)/g, "p", "poison"],
  "凹槽": [/凹槽(\(0\/\d+\))/g, "", ""],
  "无法装备": [/（无法装备）/g, "❌", ""],
  "双手武器": [/双手伤害：/g, "2H", ""],
  "需要等级": [/需要等级：(\d+)/g, "rlv", ""],
}
const defaultTips = [
  "职业技能",
  "赋予技能",
  "召唤数量",
  "增强伤害(ed)",
  "攻击速度(ias)",
  "施法速度(fcr)",
  "魔法装备(mf)",
  "额外金币(gf)",
  "元素抗性(res)",
  "抗火(f)",
  "抗寒(c)",
  "抗闪电(l)",
  "抗毒(p)",
  "凹槽",
]


function parseContent(id, node) {
  if (node == null) {
    return
  }

  // 判断content是否有内容
  const lines = node.querySelectorAll('p')
  if (lines.length === 0) {
    return
  }
  // 提取content内容，拼接成一个字符串
  const content_lines = []
  for (const line of lines) {
    if (line.classList.contains('divider')) {
      break
    }
    content_lines.push(line.innerText.replace(/\s{2,}/g, ''))
  }
  const content = content_lines.join('|')

  store[id] = content
  store.save()
}

function addTips(id, equipNode) {
  if (store[id] == null) {
    return
  }
  if (equipNode == null) {
    equipNode = document.querySelector(`.equip-name[data-id="${id}"]`)
  }
  if (equipNode.parentNode.querySelector(".tips") != null) {
    return
  }

  const container = document.createElement('span')
  container.classList.add("tips")
  function addChild(text, className) {
    const span = document.createElement('span')
    span.innerText = text
    if (className != null && className != "") {
      span.classList.add(className)
    }
    container.append(span)
  }

  // 通过regexp提取信息
  const content = store[id]
  const tipNameList = store.tips || defaultTips
  for (const name of tipNameList) {
    const [regex, suffix, className] = tipRules[name]
    const matches = content.matchAll(regex)
    for (const match of matches) {
      const value = match.slice(1).join('')
      addChild(` ${value}${suffix}`, className)
    }
  }
  if (container.childElementCount === 0) {
    addChild(`-`)
  }

  equipNode.after(container)
}

function init() {
  store.load()

  // 先从缓存中渲染
  for (const node of document.querySelectorAll(".equip-name[data-id]")) {
    const id = node.attributes['data-id'].value
    addTips(id, node)
  }
  // 解析已装备
  for (const contentNode of document.querySelectorAll(".panel .equip-content")) {
    if (contentNode.childElementCount === 0) {
      continue
    }
    const equipNode = contentNode.previousElementSibling.getElementsByClassName('equip-name')[0]
    const id = equipNode.attributes['data-id'].value
    parseContent(id, contentNode)
    addTips(id, equipNode)
  }
  // 解析背包中
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        const node = mutation.target
        const id = node.attributes['data-id'].value
        parseContent(id, node)
        addTips(id)
        return
      }
    }
  })
  for (const node of document.querySelectorAll(".equip-content-container .equip-content")) {
    observer.observe(node, { childList: true })
  }

  // 增加CSS，鼠标移上去隐藏标记，避免内容过长换行
  GM_addStyle(`.equip-container > p:hover > .tips { display: none; }`)
}

function initUI() {
  /*
  <div class="btn-group open">
    <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      TIPS <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
      <li><a class="physical" >全部</a></li>
      <li><a class="base" ><input type="checkbox">近战武器</a></li>
      <li><a class="base" ><input type="checkbox">远程武器</a></li>
      <li><a class="base" ><input type="checkbox">元素武器</a></li>
      <li><a class="base" ><input type="checkbox">防具</a></li>
      <li><a class="base" ><input type="checkbox">饰品</a></li>
    </ul>
  </div>
  */
}


setTimeout(init, 0)

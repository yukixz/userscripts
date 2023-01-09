// ==UserScript==
// @name         Idle Infinity - UI
// @namespace    http://dazzyd.org/
// @version      0.2.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


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




const store_key = "dd_ui_equip"
const store = JSON.parse(localStorage.getItem(store_key) || "{}")
const added = {}

function parse_tips(id, dom) {
  if (dom == null) {
    return
  }
  if (store[id] != null) {
    return
  }

  // 判断content是否有内容
  const lines = dom.querySelectorAll('p')
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
  // 通过regexp提取信息
  const tips = []
  for (const [regex, suffix, class_name] of [
    [/\+(\d+) .*?(.{2})技能/g, "", "skill"],
    [/攻击速度提升 (\d+)\%/g, "ias", "physical"],
    [/施法速度提升 (\d+)\%/g, "fcr", "magic"],
    [/\+(\d+)\% 更佳的机会取得魔法装备/g, "mf", "state"],
    [/\+(\d+)\% 额外金币从怪物身上取得/g, "gf", "lightning"],
    [/元素抗性 \+(\d+)\%/g, "ar", "skill"],
    // [/抗火 \+(\d+)/, "f", "fire"],
    // [/抗寒 \+(\d+)/, "c", "cold"],
    // [/抗闪电 \+(\d+)/, "l", "lightning"],
    // [/抗毒 \+(\d+)/, "p", "poison"],
    // [/凹槽(\(\d+\/\d+\))/, "", ""],
    [/需要等级：(\d+)/g, "rlv", ""],
  ]) {
    const matches = content.matchAll(regex)
    for (const match of matches) {
      const value = match.slice(1).join('')
      tips.push([`${value}${suffix}`, class_name])
    }
  }

  store[id] = tips
  localStorage.setItem(store_key, JSON.stringify(store))
}

function add_tips(id) {
  if (added[id]) {
    return
  }

  const tips = store[id]
  if (tips == null) {
    return
  }
  if (tips.length === 0) {
    tips.push(["-", ""])
  }

  const equip = document.querySelector(`span[data-id="${id}"]`)
  for (const [text, class_name] of tips) {
    const span = document.createElement('span')
    span.innerText = ' ' + text
    if (class_name != null && class_name != "") {
      span.classList.add(class_name)
    }
    equip.append(span)
  }
  added[id] = true
}

function init_tips() {
  // 先从缓存中渲染
  for (const dom of document.querySelectorAll(".equip-name")) {
    const equip_id = dom.attributes['data-id'].value
    add_tips(equip_id)
  }
  // 解析已装备
  for (const content_dom of document.querySelectorAll(".panel .equip-content")) {
    if (content_dom.childElementCount === 0) {
      continue
    }
    const equip_dom = content_dom.previousElementSibling.getElementsByClassName('equip-name')[0]
    const equip_id = equip_dom.attributes['data-id'].value
    parse_tips(equip_id, content_dom)
    add_tips(equip_id)
  }
  // 解析背包中
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        const dom = mutation.target
        const equip_id = dom.attributes['data-id'].value
        parse_tips(equip_id, dom)
        add_tips(equip_id)
        return
      }
    }
  })
  for (const dom of document.querySelectorAll(".equip-content-container .equip-content")) {
    observer.observe(dom, { childList: true })
  }
  // 增加背包按钮
  if (location.pathname !== "/Equipment/Query") {
    return
  }
  const btn_all = document.createElement('a')
  btn_all.classList.add("btn", "btn-xs", "btn-danger")
  btn_all.innerText = "更新标记"
  document.querySelector(".panel-heading .pull-right").prepend(btn_all)
  btn_all.addEventListener("click", () => {
    const nodes = Array.from(document.querySelectorAll('.equip-box .equip-name'))
      .filter(dom => dom.childElementCount === 3)
    console.log(`Update ${nodes.length} nodes`)
    for (const [i, dom] of Object.entries(nodes)) {
      setTimeout(() => dom.dispatchEvent(new Event("mouseover")), 10 + i * 888)
      setTimeout(() => dom.dispatchEvent(new Event("mouseout")), 510 + i * 888)
    }
  })
}

setTimeout(init_tips, 0)

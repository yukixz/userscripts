// ==UserScript==
// @name         Idle Infinity - Equipment
// @namespace    http://dazzyd.org/
// @version      0.3.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


/****************************************************************
 * equipmnent
 * 在装备名称后增加重要信息标记
 ****************************************************************/

const store_key = "dd_ui_equip"
const store = JSON.parse(localStorage.getItem(store_key) || "{}")

function parse_equip_content(id, dom) {
  if (dom == null) {
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

  store[id] = content
  localStorage.setItem(store_key, JSON.stringify(store))
}

function add_tips(id) {
  if (store[id] == null) {
    return
  }
  const equip = document.querySelector(`.equip-name[data-id="${id}"]`)
  if (equip.childElementCount > 3) {
    return
  }

  // 通过regexp提取信息
  const content = store[id]
  const container = document.createElement('span')
  container.classList.add("tips")
  for (const [regex, suffix, class_name] of [
    [/\+(\d+) .*?(.{2})技能/g, "", "skill"],
    [/攻击速度提升 (\d+)\%/g, "ias", "physical"],
    [/施法速度提升 (\d+)\%/g, "fcr", "magic"],
    [/\+(\d+)\% 更佳的机会取得魔法装备/g, "mf", "state"],
    [/\+(\d+)\% 额外金币从怪物身上取得/g, "gf", "lightning"],
    [/元素抗性 \+(\d+)\%/g, "res", "skill"],
    [/抗火 \+(\d+)/g, "f", "fire"],
    [/抗寒 \+(\d+)/g, "c", "cold"],
    [/抗闪电 \+(\d+)/g, "l", "lightning"],
    [/抗毒 \+(\d+)/g, "p", "poison"],
    [/凹槽(\(0\/\d+\))/g, "", ""],
//    [/双手伤害：/g, "2H", ""],
//    [/需要等级：(\d+)/g, "rlv", ""],
  ]) {
    const matches = content.matchAll(regex)
    for (const match of matches) {
      const span = document.createElement('span')
      const value = match.slice(1).join('')
      span.innerText = ` ${value}${suffix}`
      if (class_name != null && class_name != "") {
        span.classList.add(class_name)
      }
      container.append(span)
    }
  }
  if (container.childElementCount === 0) {
    const span = document.createElement('span')
    span.innerText = "-"
    container.append(span)
  }

  equip.append(container)
}

function init_tips() {
  // 先从缓存中渲染
  for (const dom of document.querySelectorAll(".equip-name[data-id]")) {
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
    parse_equip_content(equip_id, content_dom)
    add_tips(equip_id)
  }
  // 解析背包中
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        const dom = mutation.target
        const equip_id = dom.attributes['data-id'].value
        parse_equip_content(equip_id, dom)
        add_tips(equip_id)
        return
      }
    }
  })
  for (const dom of document.querySelectorAll(".equip-content-container .equip-content")) {
    observer.observe(dom, { childList: true })
  }
  // 增加背包按钮
  // if (location.pathname !== "/Equipment/Query") {
  //   return
  // }
  // const btn_all = document.createElement('a')
  // btn_all.classList.add("btn", "btn-xs", "btn-danger")
  // btn_all.innerText = "更新数据"
  // document.querySelector(".panel-heading .pull-right").prepend(btn_all)
  // btn_all.addEventListener("click", () => {
  //   const nodes = Array.from(document.querySelectorAll('.equip-name'))
  //     .filter(dom => dom.childElementCount === 3)
  //   confirm(`预计更新${nodes.length}个装备，是否执行？`, () => {
  //     $("#modalConfirm").modal("hide")
  //     for (const [i, dom] of Object.entries(nodes)) {
  //       setTimeout(() => dom.dispatchEvent(new Event("mouseover")), 10 + i * 888)
  //       setTimeout(() => dom.dispatchEvent(new Event("mouseout")), 510 + i * 888)
  //     }
  //   })
  // })
}

setTimeout(init_tips, 0)

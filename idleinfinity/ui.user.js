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




function parse_equip_content(content_dom) {
    const content = Array.from(content_dom.querySelectorAll('p'))
        .map(e => e.innerText.replace(/\s{2,}/g, ''))
        .join('|')
    const tips = []
    for (const [regex, suffix, class_name] of [
        [/攻击速度提升 (\d+)\%/, "ias", "physical"],
        [/施法速度提升 (\d+)\%/, "fcr", "magic"],
        [/\+(\d+)\% 更佳的机会取得魔法装备/, "mf", "state"],
        [/\+(\d+)\% 额外金币从怪物身上取得/, "gf", "lightning"],
        [/元素抗性 \+(\d+)\%/, "ar", "skill"],
        // [/抗火 \+(\d+)/, "f", "fire"],
        // [/抗寒 \+(\d+)/, "c", "cold"],
        // [/抗闪电 \+(\d+)/, "l", "lightning"],
        // [/抗毒 \+(\d+)/, "p", "poison"],
        // [/凹槽(\(\d+\/\d+\))/, "", ""],
        [/\+(\d+) .*?(.{2})技能/, "", "skill"],
        [/需要等级：(\d+)/, "rlv", ""],
    ]) {
        const matches = content.match(regex)
        if (matches == null) {
            continue
        }
        const value = matches.slice(1).join('')
        tips.push([`${value}${suffix}`, class_name])
    }
    return tips
}

function update_equip(id, content_dom) {
    const store_key = "dd_ui_equip"
    const store = JSON.parse(localStorage.getItem(store_key) || "{}")
    if (store[id] == null) {
        store[id] = parse_equip_content(content_dom)
        localStorage.setItem(store_key, JSON.stringify(store))
    }

    const tips = store[id]
    const equip = document.querySelector(`span[data-id="${id}"]`)
    for (const [text, class_name] of tips) {
        const span = document.createElement('span')
        span.innerText = ' ' + text
        if (class_name != null && class_name != "") {
            span.classList.add(class_name)
        }
        equip.append(span)
    }
}

function init_equip() {
    for (const content_dom of document.querySelectorAll(".panel .equip-content")) {
        const equip_dom = content_dom.previousElementSibling.getElementsByClassName('equip-name')[0]
        const equip_id = equip_dom.attributes['data-id'].value
        update_equip(equip_id, content_dom)
    }
}

setTimeout(init_equip, 0)

// ==UserScript==
// @name         Idle Infinity
// @namespace    http://dazzyd.org/
// @version      1.1.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


// Config
const config = {
    initial_ms: 2000,
    interval_ms: 1000,
    preemptive_times: 3,
    max_failed: 10,
}

let char_id = (() => {
    const matched = location.search.match(/id=(\d+)/i)
    return matched != null ? parseInt(matched[1]) : null
})()
let state = {
    load() {
        const saved_str = localStorage.getItem(`iia_${char_id}`) || "{}"
        const saved = JSON.parse(saved_str)
        for (const [key, val] of Object.entries(saved)) {
            this[key] = val
        }
    },
    save() {
        localStorage.setItem(`iia_${char_id}`, JSON.stringify(this))
    },
    reset() {
        for (const [key, value] of Object.entries(this)) {
            if (value instanceof Function) {
                continue
            }
            delete this[key]
        }
    },
}

function acquire_runable() {
    const now = (new Date()).getTime()
    const last_id = parseInt(localStorage.getItem('iia_last_id')) || 0
    const last_ts = parseInt(localStorage.getItem('iia_last_ts')) || 0
    if (char_id === last_id && (now - last_ts) >= config.interval_ms) {
        localStorage.setItem('iia_last_ts', now)
        console.log(`acquire runable (running)`)
        return true
    }
    const preemptive_ms = config.initial_ms + config.initial_ms * config.preemptive_times
    if (char_id !== last_id && (now - last_ts) >= preemptive_ms) {
        localStorage.setItem('iia_last_id', char_id)
        localStorage.setItem('iia_last_ts', now)
        console.log(`acquire runable (preemptive)`)
        return true
    }
    return false
}

function in_map() {
    // 检测是否为新秘境
    const explored = parseInt(document.querySelector('span.explore').textContent)
    if (explored <= 5) {
        state.reset()
    }
    if (state.encounter == null) {
        state.encounter = Array(20 * 20).fill(0)
    }

    let map = Array(20 * 20)
    for (const dom of document.querySelectorAll(".dungeon-container > .block")) {
        const id = parseInt(dom.id)
        const row = Math.floor(id / 20)
        const col = id % 20
        let cell = { id, row, col, dom }
        for (const className of dom.classList) {
            cell[className] = true
        }
        map[row * 20 + col] = cell
    }
    for (const cell of map) {
        if (!cell.public) continue
        const { row, col } = cell
        cell.discoverable = (
            (row > 0 && !map[(row - 1) * 20 + col].public && !cell.top) ||
            (col > 0 && !map[(row) * 20 + col - 1].public && !cell.left) ||
            (row < 19 && !map[(row + 1) * 20 + col].public && !map[(row + 1) * 20 + col].top) ||
            (col < 19 && !map[(row) * 20 + col + 1].public && !map[(row) * 20 + col + 1].left)
        )
    }

    const interest_cells = map.filter(cell => state.encounter[cell.id] <= config.max_failed)
    for (const filter of [
        cell => cell.discoverable && !cell.monster,
        cell => cell.discoverable,
        cell => cell.monster && cell.boss,
        cell => cell.monster && cell.super,
        cell => cell.monster && !cell.normal,
    ]) {
        const cells = interest_cells.filter(filter)
        if (cells.length === 0) continue
        const cell = cells[Math.floor(Math.random() * cells.length)]
        if (acquire_runable()) {
            cell.dom.dispatchEvent(new Event('mousedown', {bubbles: true}))
            state.encounter[cell.id] += 1
        }
        return
    }
    // 未执行任何动作
    if (state.notified == null) {
        state.notified = new Notification(`${char_id}:无可执行动作`)
    }
}

function in_battle() {
    if (document.querySelector('.battle-data') == null) return
    if (document.querySelector('#modalAuto.in') == null) return
    const btn = document.querySelector('.panel-heading a.btn')
    if (acquire_runable()) {
        btn.click()
    }
}

function in_verification() {
    document.querySelector("[role='dialog'][data-code='True']")
}

function run() {
    if (char_id == null) {
        console.warn("无法解析角色ID")
        return
    }
    if (document.querySelector("[role='dialog'][data-code='True']") != null) {
        console.warn("检测到验证码")
        return
    }
    if (location.pathname === "/Map/Dungeon") {
        state.load()
        in_map()
        state.save()
    }
    if (location.pathname === "/Battle/InDungeon") {
        in_battle()
    }
}


setTimeout(() => {
    setInterval(run, Math.floor(Math.random() * 100 + 400))
}, config.initial_ms)

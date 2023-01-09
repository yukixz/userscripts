// ==UserScript==
// @name         Idle Infinity - Item parts
// @namespace    http://dazzyd.org/
// @version      0.1.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


// Config
const config = {
    initial_ms: 2000,
    interval_ms: 1200,
    rules: [
        ["全部", "武器", ["+ 骑士光环技能", 2]],
        ["全部", "防具", ["+ 骑士光环技能", 2]],
        ["全部", "饰品", ["+ 骑士光环技能", 1]],
        // ["全部", "武器", ["+ 武僧真言技能", 2]],
        ["全部", "防具", ["+ 武僧真言技能", 2]],
        ["全部", "饰品", ["+ 武僧真言技能", 1]],
        // ["全部", "武器", ["+ 死灵召唤技能", 2]],
        ["全部", "防具", ["+ 死灵召唤技能", 2]],
        ["全部", "饰品", ["+ 死灵召唤技能", 1]],
        ["全部", "武器", ["+ 法师元素技能", 1]],
        ["全部", "防具", ["+ 法师元素技能", 1]],
        ["全部", "饰品", ["+ 法师元素技能", 1]],
        ["全部", "武器", ["+ 战士作战技能", 1]],
        ["全部", "防具", ["+ 战士作战技能", 1]],
        ["全部", "饰品", ["+ 战士作战技能", 1]],
        ["全部", "武器", ["+ 游侠辅助技能", 1]],
        ["全部", "防具", ["+ 游侠辅助技能", 1]],
        ["全部", "饰品", ["+ 游侠辅助技能", 1]],
        ["全部", "武器", ["+ 牧师暗影技能", 1]],
        ["全部", "防具", ["+ 牧师暗影技能", 1]],
        ["全部", "饰品", ["+ 牧师暗影技能", 1]],
        ["全部", "武器", ["+ 刺客刺杀技能", 1]],
        ["全部", "防具", ["+ 刺客刺杀技能", 1]],
        ["全部", "饰品", ["+ 刺客刺杀技能", 1]],
        ["全部", "武器", ["+ 萨满元素技能", 1]],
        ["全部", "防具", ["+ 萨满元素技能", 1]],
        ["全部", "饰品", ["+ 萨满元素技能", 1]],
        ["全部", "武器", ["+ 贤者自然技能", 1]],
        ["全部", "防具", ["+ 贤者自然技能", 1]],
        ["全部", "饰品", ["+ 贤者自然技能", 1]],
        ["全部", "武器", ["+ 猎手陷阱技能", 1]],
        ["全部", "防具", ["+ 猎手陷阱技能", 1]],
        ["全部", "饰品", ["+ 猎手陷阱技能", 1]],

        ["全部", "手套", ["+% 更佳的机会取得魔法装备", 25]],
        ["全部", "靴子", ["+% 更佳的机会取得魔法装备", 35]],
        ["全部", "项链", ["+% 更佳的机会取得魔法装备", 50]],
        ["全部", "戒指", ["+% 更佳的机会取得魔法装备", 40]],
        ["全部", "护符", ["+% 更佳的机会取得魔法装备", 40]],
        // 当前最佳
        ["全部", "项链", ["+% 更佳的机会取得魔法装备", 20]],
        ["全部", "戒指", ["+% 更佳的机会取得魔法装备", 20]],
        ["全部", "护符", ["+% 更佳的机会取得魔法装备", 32]],

        ["全部", "头饰", ["+% 提升施法速度", 10]],
        ["全部", "项链", ["+% 提升施法速度", 10]],
        ["全部", "戒指", ["+% 提升施法速度", 10]],

        // 凹槽装备
        ["普通", "帽子", ["凹槽", 3]],
        ["普通", "锤", ["凹槽", 4]],
        ["普通", "手杖", ["凹槽", 2]],
        ["普通", "权杖", ["凹槽", 3]],
        ["普通", "骑士盾牌", ["+% 元素抗性", 40], ["凹槽", 4]],
        ["普通", "死灵副手", ["凹槽", 2]],

        // 其他装备
        ["全部", "全部", ["单项元素抗性之和%", 100]],
        ["全部", "饰品", ["+% 元素抗性", 10]],
        ["全部", "护符", ["+ 召唤技能最大召唤数量", 1]],
        ["魔法", "项链", ["物品等级", 60]],
        ["魔法", "护符", ["物品等级", 60]],
        ["套装", "全部"],
        ["传奇", "全部"],

        // 珠宝
        ["全部", "珠宝", ["+% 提升攻击速度", 15]],
        ["全部", "珠宝", ["+% 元素抗性", 10]],
        ["全部", "珠宝", ["+% 更佳的机会取得魔法装备", 10]],
    ],
}


function add(rule) {
    const btn_add_rule = document.querySelector("a[data-target='#modalConfig']")
    const btn_add_cond = document.querySelector("a[data-target='#modalConfig']")
}


function run() {
    let current = {}
    for (const row of document.querySelectorAll('tbody tr')) {
        let parts = []
        const tds = row.querySelectorAll('td')
        const index = tds[0].innerText
        parts.push(tds[1].innerText)
        parts.push(tds[2].innerText)
        for (const div of tds[3].querySelectorAll('div.col-sm-6')) {
            parts.push(div.innerText)
        }
        current[parts.join('|')] = index
    }

    let require = {}
    for (const row of config.rules) {
        let parts = []
        parts.push(row[0])
        parts.push(row[1])
        for (const [title, value] of row.slice(2)) {
            parts.push(`【${title}】 >= ${value}`)
        }
        require[parts.join('|')] = row
    }

    for (const [key, rule] of Object.entries(require)) {
        if (current[key] == null) {
            console.log(key)
        }
    }
}



setTimeout(() => {
    run()
    // setInterval(run, config.interval_ms)
}, config.initial_ms)

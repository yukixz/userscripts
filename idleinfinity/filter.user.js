// ==UserScript==
// @name         Idle Infinity - Filter
// @namespace    http://dazzyd.org/
// @version      0.2.0
// @description  Idle Infinity
// @author       Dazzy Ding
// @grant        none
// @match        https://www.idleinfinity.cn/Config/Query?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// ==/UserScript==


// Config
const config = {
  rules: [
    ["全部", "武器", ["+ 骑士光环技能", 3]],
    ["全部", "防具", ["+ 骑士光环技能", 3]],
    ["全部", "饰品", ["+ 骑士光环技能", 1]],
    ["全部", "武器", ["+ 武僧真言技能", 3]],
    ["全部", "防具", ["+ 武僧真言技能", 3]],
    ["全部", "饰品", ["+ 武僧真言技能", 1]],
    ["全部", "武器", ["+ 死灵召唤技能", 3]],
    ["全部", "防具", ["+ 死灵召唤技能", 3]],
    ["全部", "饰品", ["+ 死灵召唤技能", 1]],
    ["全部", "武器", ["+ 法师元素技能", 1]],
    ["全部", "防具", ["+ 法师元素技能", 1]],
    ["全部", "饰品", ["+ 法师元素技能", 1]],
    ["全部", "武器", ["+ 战士作战技能", 1]],
    ["全部", "防具", ["+ 战士作战技能", 1]],
    ["全部", "饰品", ["+ 战士作战技能", 1]],
    ["全部", "武器", ["+ 游侠辅助技能", 3]],
    ["全部", "防具", ["+ 游侠辅助技能", 2]],
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
    ["全部", "武器", ["+ 猎手陷阱技能", 3]],
    ["全部", "防具", ["+ 猎手陷阱技能", 2]],
    ["全部", "饰品", ["+ 猎手陷阱技能", 1]],

    ["全部", "手套", ["+% 更佳的机会取得魔法装备", 25]],
    ["全部", "靴子", ["+% 更佳的机会取得魔法装备", 35]],
    ["全部", "项链", ["+% 更佳的机会取得魔法装备", 50]],
    ["全部", "戒指", ["+% 更佳的机会取得魔法装备", 40]],
    ["全部", "护符", ["+% 更佳的机会取得魔法装备", 40]],
    // 当前最佳
    // ["全部", "项链", ["+% 更佳的机会取得魔法装备", 20]],
    // ["全部", "戒指", ["+% 更佳的机会取得魔法装备", 20]],
    // ["全部", "护符", ["+% 更佳的机会取得魔法装备", 32]],

    ["全部", "头饰", ["+% 提升施法速度", 10]],
    ["全部", "项链", ["+% 提升施法速度", 10]],
    ["全部", "戒指", ["+% 提升施法速度", 10]],

    // 凹槽装备
    ["普通", "帽子", ["凹槽", 3]],
    ["普通", "锤", ["凹槽", 4]],
    ["普通", "骑士盾牌", ["+% 元素抗性", 40], ["凹槽", 4]],
    ["普通", "权杖", ["凹槽", 3], ["骑士光环系-狂热光环", 3]],
    ["普通", "权杖", ["凹槽", 3], ["骑士光环系-审判光环", 3]],
    ["普通", "权杖", ["凹槽", 3], ["骑士光环系-冥想光环", 3]],
    ["普通", "手杖", ["凹槽", 2], ["死灵召唤系-骷髅复生", 3]],
    ["普通", "手杖", ["凹槽", 2], ["死灵召唤系-骷髅法师", 3]],
    ["普通", "手杖", ["凹槽", 2], ["死灵召唤系-支配骷髅", 3]],
    ["普通", "手杖", ["凹槽", 2], ["死灵召唤系-生生不息", 3]],
    ["普通", "死灵副手", ["凹槽", 2], ["死灵召唤系-骷髅复生", 3]],
    ["普通", "死灵副手", ["凹槽", 2], ["死灵召唤系-骷髅法师", 3]],
    ["普通", "死灵副手", ["凹槽", 2], ["死灵召唤系-支配骷髅", 3]],
    ["普通", "死灵副手", ["凹槽", 2], ["死灵召唤系-生生不息", 3]],

    // 其他装备
    ["全部", "全部", ["单项元素抗性之和%", 100]],
    ["全部", "饰品", ["+% 元素抗性", 10]],
    ["全部", "护符", ["+ 召唤技能最大召唤数量", 1]],
    // ["魔法", "项链", ["物品等级", 60]],
    // ["魔法", "护符", ["物品等级", 60]],
    ["全部", "秘境"],
    ["套装", "全部"],
    ["传奇", "全部"],

    // 珠宝
    ["全部", "珠宝", ["+% 提升攻击速度", 15]],
    ["全部", "珠宝", ["+% 元素抗性", 10]],
    ["全部", "珠宝", ["+% 更佳的机会取得魔法装备", 10]],
  ],
}


function init() {
  let current_rules = {}
  for (const row of document.querySelectorAll('tbody tr')) {
    let parts = []
    const tds = row.querySelectorAll('td')
    parts.push(tds[1].innerText)
    parts.push(tds[2].innerText)
    for (const div of tds[3].querySelectorAll('div.col-sm-6')) {
      parts.push(div.innerText)
    }
    current_rules[parts.join('|')] = row
  }

  let require_rules = {}
  for (const row of config.rules) {
    let parts = []
    parts.push(row[0])
    parts.push(row[1])
    for (const [title, value] of row.slice(2)) {
      parts.push(`【${title}】 >= ${value}`)
    }
    require_rules[parts.join('|')] = row
  }

  // 高亮不在配置中的多余规则
  for (const [key, dom] of Object.entries(current_rules)) {
    if (require_rules[key] == null) {
      console.log(`多余规则：${key}`)
      dom.style.backgroundColor = "#900"
    }
  }

  // 缺少规则
  let added = false  // 只触发一次自动新增操作
  for (const [key, rule] of Object.entries(require_rules)) {
    if (current_rules[key] == null) {
      console.log(`缺少规则：${key}`)
      if (!added) {
        added = true
        confirm(`是否添加规则：\n${rule}`, () => {
          $("#modalConfirm").modal("hide")
          add_step = 1
          setInterval(add_rule, 500, rule)
        })
      }
    }
  }
}


let add_step = 0

function add_rule(rule) {
  if (add_step === 0) {
    return
  }
  function select_value(dom, value) {
    for (const [index, option] of Object.entries(dom.options)) {
      if (option.text === value) {
        dom.selectedIndex = index
        return
      }
    }
    console.error(`无法在DOM${dom}中找到选项${value}`)
  }

  const btn_open_modal = document.querySelector("a[data-target='#modalConfig']")
  const div_modal = document.querySelector("#modalConfig")
  const btn_add_cond = div_modal.querySelector("button.config-magic-add")
  const btn_submit = div_modal.querySelector("button.config-apply")

  if (add_step === 1) {
    btn_open_modal.click()
    select_value(div_modal.querySelector("select#power"), rule[0])
    select_value(div_modal.querySelector("select#type"), rule[1])
    for (const _ of rule.slice(2)) {
      btn_add_cond.click()
    }
    add_step = 2
    return
  }
  if (add_step === 2) {
    const div_conds = div_modal.querySelectorAll("div.condition")
    for (const [index, [title, value]] of rule.slice(2).entries()) {
      const div = div_conds[index]
      if (title.match(/^.{4}系-.+$/)) {
        select_value(div.querySelector("select.prefix"), "+ 职业指定技能")
        select_value(div.querySelector("select.sk"), title)
      }
      else {
        select_value(div.querySelector("select.prefix"), title)
      }
      div.querySelector("input.min").value = value
    }
    add_step = 3
    return
  }
  if (add_step === 3) {
    btn_submit.click()
    add_step = 0
    return
  }
}



setTimeout(init, 0)

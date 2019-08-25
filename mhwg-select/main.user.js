// ==UserScript==
// @name        Enable Select on mhwx.org
// @namespace   http://dazzyd.org/
// @description Allow selection and content menu.
// @version     0.1
// @author      Dazzy Ding
// @downloadURL https://raw.githubusercontent.com/yukixz/userscripts/master/mhwg-select/main.user.js
// @match       *://wiki.mhxg.org/*
// @match       *://mhwg.org/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

const body = document.getElementById('body_game')
body.onselectstart = null
body.oncontextmenu = null
body.style.userSelect = ""

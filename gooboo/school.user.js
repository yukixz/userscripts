// ==UserScript==
// @name        gooboo自动做题
// @namespace   https://greasyfork.org/
// @version     2025042701
// @description gooboo自动做题
// @author      Dazzy Ding, sdozxm0618
// @match       *://gooboo.g8hh.com/*
// @match       *://gooboo.g8hh.com.cn/*
// @icon        https://gooboo.g8hh.com/favicon-32x32.png
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant       none
// @run-at      document-idle
// @license MIT
// ==/UserScript==

(() => {
  'use strict'

  //计时器毫秒数
  const maxtimes = 100
  // 初始状态为关闭
  let isOn = false
  // 定义计时器
  let timerId

  // 创建按钮
  let $switchButton = $(`<button>自动答题</button>`).appendTo('.v-toolbar__content')
  // 设置按钮点击事件
  $switchButton.on('click', function () {
    isOn = !isOn
    if (isOn) {
      // 开启时开始计时器
      startTimer()
      $(this).text('自动答题已开启')
    } else {
      // 关闭时停止计时器
      stopTimer()
      $(this).text('自动答题已关闭')
    }
  })
  // 启动计时器函数
  function startTimer() {
    // 停止已存在的定时器
    stopTimer()
    // 启动新的定时器
    timerId = setInterval(doAnswer, maxtimes)
    console.log('自动刷题计时器运行中...')
  }
  // 停止计时器函数
  function stopTimer() {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }
  function doAnswer() {
    // 检查答题输入框是否存在
    let answerInput = $('#answer-input-math')
    if (!answerInput.length) {
      return
    }

    let question = $('.text-center.question-text')[0].innerText
    let questionanswer = getAnswer(question)
    let answerinput1 = Number($('#answer-input-math').data("_value"))
    let answerinput2 = Number($('#answer-input-math').val())
    if (answerinput1 == questionanswer && answerinput1 == answerinput2) {
      //已填写答案
      $('.d-flex.justify-center.align-center.flex-wrap').children('button.v-btn')[0].click()
    } else {
      $('#answer-input-math').val(questionanswer)
      $('#answer-input-math').data("_value", questionanswer)
      //直接修改值并不会出发input事件，会导致后续模拟点击不能通过
      let evt = document.createEvent('HTMLEvents');//createEvent=创建windows事件
      let inputDom = document.querySelector('#answer-input-math')
      evt.initEvent('input', true, true)
      inputDom.dispatchEvent(evt)
    }
  }
  function getAnswer(question) {
    let normalized = question
      .replace(/\s/g, '')
      .replace(/√(\d+)/g, 'Math.sqrt($1)')
      .replace('^', '**')
    return eval(normalized)
  }

})()
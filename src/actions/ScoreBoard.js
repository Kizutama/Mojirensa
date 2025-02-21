// ScoreBoard.js

/**
 * 项目名称：文字連鎖小游戏
 * 功能概述：本项目是一款用于帮助玩家记忆变体假名及其对应汉字的记忆游戏，
 *          提供计分和倒计时功能。
 *
 * 本文件功能：ScoreBoard.js 用于定义全局的计分和倒计时逻辑。
 *              包括 reactive 状态（分数、剩余时间）、启动倒计时的函数、更新分数的函数，
 *              以及一个 computed 属性来格式化剩余时间显示。
 */

import { ref, computed } from 'vue';


// 全局分数和剩余时间（单位：秒）
export const score = ref(0);
export const timeLeft = ref(60); // 一局 1 分钟

let timerInterval = null;

// 启动倒计时，每秒减少 timeLeft，时间到时停止
export function startTimer() {
  // 如果已有定时器，先清除（防止重复启动）
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      // 此处可以扩展：例如通知游戏结束等
    }
  }, 1000);
}

// 更新分数：正确匹配加分，错误匹配减分
export function updateScore(amount) {
  score.value += amount;
}

// 格式化剩余时间显示（mm:ss 格式）
export const timeLeftDisplay = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

export function resetTimer() {
  // 清除现有定时器
  if (timerInterval) clearInterval(timerInterval);
  // 重置倒计时到初始值
  timeLeft.value = 60;  // 根据你的初始时间调整
}
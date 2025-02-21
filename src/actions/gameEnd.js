// 导入 Vue 中的 ref 和 watch API，用于创建响应式变量和监听响应式数据变化
import { ref, watch } from "vue";

// 从 ScoreBoard.js 中导入 timeLeft（确保路径正确）
// timeLeft 应该是一个响应式 ref，记录当前倒计时剩余时间
import { timeLeft } from "../actions/ScoreBoard.js";

/**
 * useGameEnd 用于监测游戏结束条件
 * 当 timeLeft 小于等于 0 时，将 isGameOver 设置为 true
 * 该函数返回一个对象，其中包含 isGameOver 的响应式引用
 */
export function useGameEnd() {
  // 创建一个响应式变量 isGameOver，初始值为 false
  const isGameOver = ref(false);

  // 使用 watch 监听 timeLeft 的变化
  watch(timeLeft, (newVal) => {
    // 当 timeLeft 小于或等于 0 时，标记游戏结束
    if (newVal <= 0) {
      isGameOver.value = true;
    }
  });

  // 返回一个包含 isGameOver 的对象，以便其它组件使用
  return { isGameOver };
}

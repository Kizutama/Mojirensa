<template>
  <div class="mode-container">
    <h2>选择模式</h2>
    <div class="button-group">
      <!-- 禁用“崩し字連鎖”按钮，并添加 disabled-btn 类 -->
      <button class="menu-btn disabled-btn" disabled>崩し字連鎖（鋭意製作中）</button>
      <!-- 其他模式按钮正常工作，点击时同时重置计时器和跳转 -->
      <button class="menu-btn" @click="handleGameHentaiganaClick">変体仮名連鎖</button>
      <br>
      <button class="menu-btn" @click="router.push('/')">ホームへ</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import "../card.css";

// 从 ScoreBoard.js 导入 startTimer 和 timeLeft
import { startTimer, timeLeft, score } from '../actions/ScoreBoard.js'
import { resultStore } from '../actions/resultStore.js'



// 获取 router 实例
const router = useRouter();

// 若将来开放崩し字模式，可以启用此函数
const startGame = (mode) => {
  router.push(`/game?mode=${mode}`)  // 传递模式参数
}

const emit = defineEmits(["go-home"]);




function onGoHome() {
  emit("go-home");
}

// 新增的点击处理函数
function handleGameHentaiganaClick() {
  console.log('handleGameHentaiganaClick triggered');
  // 重置计时器状态，例如重置剩余时间为 60 秒
  timeLeft.value = 60;
  startTimer();
  
  // 重置游戏状态：使用 Object.assign 触发响应式更新
  score.value = 0;
  Object.assign(resultStore, {
    results: [],
    currentIndex: -1,
    latestResult: null,
    multiplier: 1,
    treasureCount: 0,
    kanCards: []
  });
  
  // 延迟后刷新路由（如果当前路由已经是游戏页则替换）
  if (router.currentRoute.value.path === '/game-hentaigana') {
    router.replace({ path: '/game-hentaigana', query: { t: Date.now() } });
  } else {
    router.push('/game-hentaigana');
  }
}

</script>

<style scoped>
.mode-container {
  text-align: center;
  padding: 50px;
}

.button-group {
  gap: 1.5rem;
}
@media (min-width: 800px) {
  .button-group {
    width: 640px; /* 固定宽度，可根据需要调整 */
    margin: 0 auto; /* 居中显示 */
  }
}


/* 定义禁用按钮的样式 */
.disabled-btn {
  background-color: #F2F1ED;   /* 灰色背景 */
  color: var(--text-color);    /* 灰色文字 */
  cursor: not-allowed;         /* 禁止点击的鼠标指针 */
  opacity: 0.6;                /* 稍微透明 */
}
</style>

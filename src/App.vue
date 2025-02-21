<template>
  <div id="app">
    <!-- 加载界面：始终挂载，通过 ref 调用内部方法 -->
        <LoadingScreen ref="loadingScreenRef" @enterAnimationEnded="onEnterAnimationEnded" />

    <!-- 上方装饰条，包含顶部标题 -->
    <div class="global-edge top">
      <div class="top-bar">
        <router-view name="header" />
      </div>
    </div>

    <!-- 主体区域：左右布局 -->
    <div class="content">
      <!-- 左侧主体内容区域 -->
      <div :class="['main-content', { 'mode-select': isModeSelect }]">
        <router-view />
      </div>
      <!-- 右侧计分板区域 -->
      <div class="scoreboard-container" v-if="!isModeSelect">
        <router-view name="scoreboard" />
      </div>
    </div>

    <!-- 下方装饰条 -->
    <div class="global-edge bottom"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import LoadingScreen from './views/LoadingScreen.vue';
// 从 ScoreBoard.js 导入启动计时方法
import { startTimer, timeLeft } from './actions/ScoreBoard.js';
import { provide } from 'vue';
provide('startGame', startGame);
const router = useRouter();
const route = useRoute();


const isModeSelect = computed(() => route.name === 'ModeSelectView');
// 通过 ref 获取 LoadingScreen 组件实例
const loadingScreenRef = ref(null);


// 新游戏开始时调用，显示加载界面（但不自动启动计时器）
function startGame() {
  if (loadingScreenRef.value) {
    loadingScreenRef.value.showLoading();
  }
  // 0.3秒后开始跳转到 '/mode'
  setTimeout(() => {
    router.push('/mode')
      .then(() => {
        // 0.3秒后自动触发 handleGameHentaiganaClick()，等效于自动点击按钮
        setTimeout(() => {
          router.push('/game-hentaigana');
        }, 300);
      })
      .catch(err => {
        console.error("跳转到 '/mode' 失败", err);
      });
  }, 300);
}
function onEnterAnimationEnded() {
  // 重置计时器状态
  timeLeft.value = 60;
  // 当加载动画结束的那一刻，立即刷新计时器
  startTimer();
  // 延时 500ms 后隐藏加载界面
  setTimeout(() => {
    if (loadingScreenRef.value) {
      loadingScreenRef.value.hideLoading();
    }
  }, 500);
}



// // 调试用：页面挂载后自动启动游戏（你可以替换成路由切换或按钮触发）
// onMounted(() => {
//   startGame();
// });
</script>

<style>
:root {
  --bg-color: #FFFEF8;
  --text-color: #262729;
  --font-family: "Noto Serif JP", "Noto Serif Hentaigana", "Noto Serif SC", serif;
  --font-weight: 700;
}

body {
  margin: 0;
  background: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  font-weight: var(--font-weight);
  font-optical-sizing: auto;
  overflow: hidden;
}

.top-bar {
  flex: 17;
  height: 100%;
  display: flex;
  align-items: center;
}

.app-container {
  display: flex;
  position: relative;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.global-edge {
  flex: 1;
  position: fixed;
  left: 0;
  width: 100%;
  height: 11.11vh;
  background: var(--bg-color);
  z-index: 10;
}

.global-edge.top {
  top: 0;
  border-bottom: 1.5pt solid var(--text-color);
}

.global-edge.bottom {
  bottom: 0;
  border-top: 1.5pt solid var(--text-color);
}

.content {
  position: absolute;
  top: 11.11vh;
  bottom: 11.11vh;
  left: 0;
  right: 0;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 77.78vh;
  overflow: hidden;
}

@media (max-width: 640px) {
  .content {
    height: 55.56vh;
    bottom: 33.33vh;
  }
}

.main-content {
  margin-left: 2.94vh;
  margin-right: 5.88vh;
  flex: 13;
  overflow-y: auto;
  z-index: 2000;
}

.main-content.mode-select {
  flex: 17;
}

@media (max-width: 640px) {
  .main-content {
    margin-left: 2.94vh;
    margin-right: 2.94vh;
    flex: 17;
  }
}

.scoreboard-container {
  flex: 4;
  height: 100%;
  box-sizing: border-box;
  z-index: 1000;
}

.scoreboard-container.mode-select {
  flex: 0;
}

@media (max-width: 640px) {
  .scoreboard-container {
    flex: 0;
  }
}
</style>

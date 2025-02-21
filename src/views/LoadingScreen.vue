<template>
  <div v-show="visible" class="loading-overlay" :class="animationState" @animationend="handleAnimationEnd">
    <div class="loading-content">
      <h2 class="loading-title">読み込み中...</h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
// animationState 控制当前动画：enter（弹出）或 exit（弹入）
const animationState = ref('');

const emit = defineEmits(['enterAnimationEnded', 'exitAnimationEnded']);


// 显示加载界面并触发弹出动画
function showLoading() {
  visible.value = true;
  animationState.value = 'enter';
}
function hideLoading() {
  animationState.value = 'exit';
  setTimeout(() => {
    visible.value = false;
    animationState.value = '';
    emit('exitAnimationEnded'); // 新增退出动画完成事件
  }, 500);
}

// 监听动画结束事件，判断是哪种动画结束
function handleAnimationEnd(event) {
  if (animationState.value === 'enter') {
    emit('enterAnimationEnded'); // 通知父组件动画完成
  }
}

defineExpose({ showLoading, hideLoading });
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-color);
  border: 1.5pt solid var(--text-color);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 弹出动画：从上方滑入，并带轻微反弹 */
.loading-overlay.enter {
  animation: popOut 0.5s ease forwards;
}

/* 弹入动画：从当前位置滑出到上方 */
.loading-overlay.exit {
  animation: popIn 0.5s ease forwards;
}

@keyframes popOut {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes popIn {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}

.loading-content {
  text-align: center;
}

.loading-title {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
}
</style>

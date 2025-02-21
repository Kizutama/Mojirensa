<template>
  <div class="game-container">
    <!-- 显示计分和倒计时的组件 -->
    <ScoreBoard />

    <!-- 4×4网格容器，用于排列所有卡牌 -->
    <div class="grid">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card"
        :class="['card', card.animationClass, { 
          selected: selectedIndices.includes(index),
          removed: card.removed,
          matched: card.matched,
          treasure: card.isTreasure,
          error: card.error
        }]"
        @click="handleCardClick(index)"
      >
        <!-- 仅当卡牌未被移除时显示文字 -->
        <span v-if="!card.removed">{{ card.value }}</span>
      </div>
      <!-- 弹出提示直接放在网格容器内 -->
      <div class="yaku-popup-container">
          <div 
          v-for="msg in yakuMessages" 
          :key="msg.id" 
          class="yaku-popup">
          {{ msg.text }}
        </div>
      </div>
    </div>

    <!-- 新增：游戏结束弹窗，计时结束后显示 -->
    <GameOverModal
      v-if="isGameOver"
      :finalScore="score"
      :multiplier="resultStore.multiplier"
      :treasureCount="resultStore.treasureCount"
      :matchedResults="resultStore.results"
      :kanCards="resultStore.kanCards" 
      @replay="handleReplay"
      @go-home="handleGoHome"
    />

  </div>
</template>

<script setup>
import { useGameLogic } from "../actions/useGameLogic.js";
// 导入游戏结束检测模块
import { useGameEnd } from "../actions/gameEnd.js";
// 导入 ScoreBoard 组件
import ScoreBoard from "../views/ScoreBoard.vue";
// 导入卡牌样式
import "../card.css";

// 导入 GameOverModal 组件（位于 views 文件夹下）
import GameOverModal from "../views/GameOverModal.vue";

// 如果 ScoreBoard.js 中导出 score（ref）和你全局存储匹配结果的 resultStore
import { score } from "../actions/ScoreBoard.js";
import { resultStore } from "../actions/resultStore.js";

// 使用组合式函数管理游戏逻辑（卡牌数据、点击处理等）
const { cards, selectedIndices, handleCardClick } = useGameLogic();

// 使用 useGameEnd 监测游戏结束条件
const { isGameOver } = useGameEnd();

import { ref } from 'vue';
import { setOnYakuCallback } from '../actions/useGameLogic.js';
import { resetTimer } from '../actions/ScoreBoard.js';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()


// 定义一个响应式数组，用于存储多个役种提示消息
const yakuMessages = ref([]);

/**
 * showYaku 函数用于显示一个新的役种提示
 * @param {String} message - 役种名称，例如 "宝牌"
 */
function showYaku(message) {
  // 创建一个唯一 id（可以用 Date.now() 加上随机数保证唯一性）
  const id = Date.now() + Math.random();
  // 将新消息对象添加到 yakuMessages 数组中
  yakuMessages.value.push({ id, text: message });
  // 3秒后自动从数组中移除该消息
  setTimeout(() => {
    yakuMessages.value = yakuMessages.value.filter(msg => msg.id !== id);
  }, 3000);
}
// 将 showYaku 设置到 useGameLogic 的 onYakuCallback
setOnYakuCallback(showYaku);

/**
 * 以下为处理弹窗按钮点击的回调函数，
 * 你需要根据项目需求实现重置游戏状态或跳转主页的逻辑。
 */
const handleReplay = () => {
  // 显示加载动画
  if (loadingScreen.value && loadingScreen.value.showLoading) {
    loadingScreen.value.showLoading();
  }
  // 延时1秒后重置游戏或重载页面
  setTimeout(() => {
    score.value = 0;
    resultStore.results = [];
    window.location.reload();
  }, 1000);
  gameKey.value++;
  router.replace({ path: route.fullPath })
};

const handleGoHome = () => {
  // 重置计时器
  resetTimer();
  window.location.href = '/';
};



</script>

<style scoped>
.game-container {
  text-align: center;
}
/* 网格容器样式 */
.grid {
  display: grid; 
  /* 启用 CSS 网格布局 */
  grid-template-columns: repeat(4, 1fr);
  /* 固定4列，每列宽度均分 */
  gap: var(--card-gap); 
  /* 设置卡牌之间的间隙 */
  justify-content: center; 
  /* 水平居中网格 */
  align-items: center; 
  /* 垂直居中网格 */
  margin-top: 40px;
  /* 网格顶部外边距 */
  padding: var(--grid-padding); 
  /* 添加内边距，使实际卡牌区域小一圈 */
  box-sizing: border-box; 
  /* 包含内边距在内计算宽度 */
  overflow: visible; 
  /* 允许卡牌放大后溢出显示 */
  position: relative; 
  /* 新增：为绝对定位的子元素提供定位上下文 */
}

@media (max-width: 640px) {
    .grid {
      display: grid; 
      /* 启用 CSS 网格布局 */
      grid-template-columns: repeat(4, 1fr);
      /* 固定4列，每列宽度均分 */
      gap: var(--card-gap); 
      /* 设置卡牌之间的间隙 */
      justify-content: center; 
      /* 水平居中网格 */
      align-items: center; 
      /* 垂直居中网格 */
      margin-top: 0px;
      /* 网格顶部外边距 */
      padding: var(--grid-padding); 
      /* 添加内边距，使实际卡牌区域小一圈 */
      box-sizing: border-box; 
      /* 包含内边距在内计算宽度 */
      overflow: visible; 
      /* 允许卡牌放大后溢出显示 */
    }
}

.card.removed {
  visibility: hidden;
}




/* 弹出提示容器：绝对定位在 .grid 的右上角 */
.yaku-popup-container {
  position: absolute;
  top: 10px;       /* 距离父容器顶部 10px */
  right: 10px;     /* 距离父容器右侧 10px */
  z-index: 1000;   /* 保证在最上层 */
  pointer-events: none; /* 避免阻挡下层的交互 */
  display: flex;
  flex-direction: column;
  gap: 5px;
}
/* 提示容器，位于网格的右上角 */
.yaku-popup {
  background: linear-gradient(to right, rgba(255,252,204,0.2), rgba(255,252,204,0.7));  color: var(--text-color);
  width: 100px; 
  text-align: right; 
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  /* 组合两个动画：第一个 scale-in-hor-right 渐入，第二个 fade-out 淡出 */
  animation: 
    scale-in-hor-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both,
    fade-out 2.5s 0.5s forwards;
}
@media (max-width: 640px) {
  .yaku-popup {
    width: 11.11vh;
  }
}

/* scale-in-hor-right 动画（Webkit 和标准版本） */
@-webkit-keyframes scale-in-hor-right {
  0% {
    -webkit-transform: scaleX(0);
            transform: scaleX(0);
    -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1);
            transform: scaleX(1);
    -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
    opacity: 1;
  }
}
@keyframes scale-in-hor-right {
  0% {
    -webkit-transform: scaleX(0);
            transform: scaleX(0);
    -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1);
            transform: scaleX(1);
    -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
    opacity: 1;
  }
}

/* 淡出动画：从不透明到完全透明 */
@-webkit-keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}





@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}




</style>

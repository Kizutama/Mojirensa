<template>
  <div class="scoreboard">
    <!-- 显示当前分数 -->
    <div class="score">符: {{ score }}</div>

    <!-- 显示倒计时 -->
    <div class="timer">時: {{ timeLeftDisplay }}</div>

    <!-- 大结果牌容器 -->
    <div class="result-card-container">
      <template v-if="currentResult">
        <!-- 大结果牌：上 4/5 显示变态假名，下 1/5 分别显示平假名和原汉字 -->
        <div :class="['card', 'result', { treasure: currentResult.isTreasure }]">
          <div class="result-top">{{ currentResult.hentaigana }}</div>
          <div class="result-bottom">
            <span>{{ currentResult.hiragana }}</span>
            <span>{{ currentResult.kanji }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 没有匹配结果时显示占位文本 -->
        <div class="result-placeholder">カード河</div>
      </template>
    </div>

    <!-- 小结果牌区域：每匹配成功一组牌就追加一个小结果牌 -->
    <!-- 显示“カン”牌组 -->
    <div class="kan-area" v-if="resultStore.kanCards && resultStore.kanCards.length">
      <!-- 在这里显示“カン”标题或其他提示 -->
      <div class="kan-title">カン</div>
      <!-- 遍历每一组「カン」 -->
      <div class="kan-group" v-for="(group, idx) in resultStore.kanCards" :key="'kan-' + idx">

        <!-- 横向并列显示该组的4张卡牌 -->
        <div class="kan-cards-row">
          <div
            v-for="(card, cIdx) in group.cards"
            :key="'kancard-' + cIdx"
            :class="['card', 'small-result', { treasure: card.isTreasure }]"
          >
            <div class="small-result-top">{{ card.hentaigana }}</div>
            <div class="small-result-bottom">
              <span>{{ card.hiragana }}</span>
              <span>{{ card.kanji }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 显示剩余的小结果牌 -->
    <div class="small-result-cards">
      <div
        v-for="(result, idx) in resultStore.results"
        :key="idx"
        :class="['card', 'small-result', { treasure: result.isTreasure }]"
      >
        <div class="small-result-top">{{ result.hentaigana }}</div>
        <div class="small-result-bottom">
          <span>{{ result.hiragana }}</span>
          <span>{{ result.kanji }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入 Vue 中的 onMounted 与 computed
import { onMounted, computed } from 'vue';
// 从 ScoreBoard.js 导入 score、timeLeftDisplay 与启动计时器的函数
import { score, timeLeftDisplay, startTimer } from '../actions/ScoreBoard.js';
// 导入全局匹配结果存储模块
import { resultStore } from '../actions/resultStore.js';
// 导入统一的卡牌样式（包含 .card、.result、.small-result 等）
import "../card.css";

// 组件挂载时启动计时器
onMounted(() => {
  startTimer();
});

// 计算属性：获取最新匹配成功的牌（用于大结果牌显示）
const currentResult = computed(() => resultStore.latestResult);
</script>

<style scoped>
/* -----------------------------------
   宽屏版 ScoreBoard 样式
-------------------------------------- */
.scoreboard {
  position: fixed;                      /* 固定定位 */
  top: 0;
  right: 0;
  width: calc(100vw * 4 / 17);            /* 右侧固定宽度：视口宽度的 4/17 */
  height: 100vh;                        /* 高度占满整个视口 */
  background-color: var(--bg-color);     /* 背景色 */
  box-sizing: border-box;
  border-left: 1.5pt solid var(--text-color); /* 左侧边框 */
  padding: 10px;
  /* 使用 flex 布局，垂直排列各区域 */
  display: flex;
  flex-direction: column;
}

/* 分数与倒计时样式 */
.score {
  margin-bottom: 10px;
  font-size: 18px;
}
.timer {
  margin-bottom: 10px;
  font-size: 18px;
}

/* 大结果牌容器：固定最小高度，居中显示 */
.result-card-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border: 1px dashed var(--text-color);
  padding: 10px;
}

/* 占位文本样式 */
.result-placeholder {
  font-size: 16px;
  color: var(--text-color);
}

/* 小结果牌区域：排列所有小结果牌 */
.small-result-cards {
  margin-top: 20px;        /* 与大结果牌容器之间的间距 */
  display: flex;
  flex-wrap: wrap;         /* 多个小结果牌自动换行 */
  gap: 8px;                /* 小结果牌之间的间隔 */
  justify-content: center;
}

@media (min-width: 640px) {
    .kan-cards-row {
        width:calc(100vw * 4 / 17 * 0.9);
    }
}

/* -----------------------------------
   说明：宽屏版 ScoreBoard 显示在右侧，
   上面依次显示分数、倒计时、大结果牌、小结果牌区域
-------------------------------------- */
</style>

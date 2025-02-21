<template>
  <div class="scoreboard-narrow">
    <div class="scoreboard-inner">
      <!-- 左侧区域：包含分数、倒计时和小结果牌 -->
      <div class="left-side">
        <!-- 分数和倒计时区域 -->
        <div class="score-timer-area">
          <div class="score">符: {{ score }}</div>
          <div class="timer">時: {{ timeLeftDisplay }}</div>
        </div>
        <!-- 小结果牌区域 -->
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
      <!-- 右侧区域：显示大结果牌 -->
      <div class="right-side">
        <div class="result-card-container">
          <template v-if="currentResult">
            <div :class="['card', 'result', { treasure: currentResult.isTreasure }]">
              <div class="result-top">{{ currentResult.hentaigana }}</div>
              <div class="result-bottom">
                <span>{{ currentResult.hiragana }}</span>
                <span>{{ currentResult.kanji }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 当没有匹配结果时，显示固定宽高的虚线框 -->
            <div class="result-placeholder">カード河</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
// 导入分数、倒计时和启动计时器函数
import { score, timeLeftDisplay, startTimer } from '../actions/ScoreBoard.js';
// 导入全局匹配结果存储模块
import { resultStore } from '../actions/resultStore.js';
// 导入通用卡牌样式
import "../card.css";

// 启动计时器
onMounted(() => {
  startTimer();
});

// 计算属性：获取最新匹配结果，用于大结果牌显示
const currentResult = computed(() => resultStore.latestResult);
</script>

<style scoped>
/* -----------------------------------------------
   窄屏版记分板：固定在底部，采用左右布局
-------------------------------------------------- */
.scoreboard-narrow {
  /* 固定在页面底部 */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 33.33vh;            /* 可根据需要调整高度 */
  background-color: var(--bg-color);
  box-sizing: border-box;
  border-top: 1.5pt solid var(--text-color);
  padding: 10px;
}

/* 内部容器使用网格布局：左侧占 3/4，右侧占 1/4 */
.scoreboard-inner {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr;
  height: 100%;
}

/* 左侧区域：分数、倒计时和小结果牌 */
.left-side {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-rows: 1fr 5fr;  /* 上部 1/4（分数、倒计时），下部 3/4（小结果牌） */
  border-right: 1px solid var(--text-color);
  padding-right: 5px;
}

/* 分数和倒计时区域 */
.score-timer-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5px;
  border-bottom: 1px dashed var(--text-color);
  padding-bottom: 5px;
}

.score-timer-area .score,
.score-timer-area .timer {
  font-size: 16px;
}

/* 小结果牌区域 */
.small-result-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  margin-top: 10px;
  align-content: flex-start;
}


/* 右侧区域：大结果牌 */
.right-side {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;  /* 防止溢出 */
}

/* 修改后的大结果牌容器样式：固定宽度和高度 */
.result-card-container {
  width: calc(var(--card-width) + 2rem);         /* 固定宽度，可根据需求调整 */
  height: calc(var(--card-width) * (116 / 86) + 2rem);        /* 固定高度，可根据需求调整 */
  margin: auto;         /* 居中显示 */
  border: 1px dashed var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 占位文本 */
.result-placeholder {
  font-size: 16px;
  color: var(--text-color);
}
</style>

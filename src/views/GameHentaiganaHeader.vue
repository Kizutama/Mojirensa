<template>
  <div class="game-header">
    <h1>文字連鎖—変体仮名</h1>
    <!-- 返回主菜单按钮 -->
    <button class="icon-button" @click="onGoHome">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 14 4 9 9 4"></polyline>
        <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
      </svg>
    </button>
  </div>
</template>

<script>
import { resultStore } from '../actions/resultStore';
import "../card.css";
import { startTimer } from '../actions/ScoreBoard.js';




export default {
  name: 'GameHentaiganaHeader',
  methods: {
    onGoHome() {
      // 直接使用 Vue Router 跳转到首页
      this.$router.push('/');
      startTimer();
    },
    // 匹配成功时调用，将卡牌 JSON 数据写入 resultStore
    onMatchSuccess(cardData) {
      resultStore.results.push(cardData);
      resultStore.currentIndex = resultStore.results.length - 1;
      resultStore.latestResult = cardData;
    },
  }
};
</script>

<style scoped>
.game-header {
  display: flex;    
  flex:2;               /* 使用 flex 布局 */
  justify-content: space-between;  /* 左侧标题、右侧按钮分布 */
  align-items: center;             /* 垂直居中 */
  padding: 0.5rem;                 /* 内边距，根据需要调整 */
  padding-right: 2.94vh;
}
@media (min-width: 640px) {
  .game-header{
    padding-right: calc((100vw * 4 / 17) + 5.88vh);
  }
}

h1 {
  padding-left: 2.94vh;
  flex: 7;
}



/* 返回按钮样式 */





</style>

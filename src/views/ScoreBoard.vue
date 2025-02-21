<!-- src/views/ScoreBoard.vue -->
<template>
  <!-- 根据 isNarrow 动态切换使用 ScoreBoardWide 或 ScoreBoardNarrow -->
  <component :is="componentToShow" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ScoreBoardWide from './ScoreBoardWide.vue';
import ScoreBoardNarrow from './ScoreBoardNarrow.vue';

const isNarrow = ref(false);

/** 监听窗口大小，若小于 640
 * px 则 isNarrow = true，否则 false */
function handleResize() {
  isNarrow.value = window.innerWidth <= 640;
}

onMounted(() => {
  handleResize(); // 初始化时先判断一次
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 计算属性：决定当前使用哪个组件
const componentToShow = computed(() => {
  return isNarrow.value ? ScoreBoardNarrow : ScoreBoardWide;
});


</script>

<style scoped>
/* 可以在这里添加一些管理组件的样式 */
</style>

<template>
  <div class="start-container">
    <!-- 标题 -->
    <h1 class="title">文字連鎖</h1>

    <!-- 按钮组 -->
    <div class="button-group">
      <button class="menu-btn" @click="startGame">開始</button>
      <button class="menu-btn" @click="openInstructions">說明</button>
      <button class="menu-btn" @click="openReferences">参考資料</button>
    </div>
  </div>
    <!-- Teleport：将弹窗传送到 <body> 之下 -->
  <teleport to="body">
    <GameInstructionsModal 
      v-if="showInstructions" 
      @close="closeInstructions" 
    />
        <!-- 参考資料用モーダル -->
    <GameReferencesModal
      v-if="showReferences"
      @close="closeReferences"
    />
  </teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import "../card.css";
import GameInstructionsModal from '../views/GameInstructionsModal.vue';
import GameReferencesModal from '../views/GameReferencesModal.vue';

// 创建 Vue Router 实例
const router = useRouter();

// 定义控制说明弹窗显示的响应式变量
const showInstructions = ref(false);
const showReferences =ref(false);

// 点击 "開始" 按钮，跳转到模式选择页面
const startGame = () => {
  router.push('/mode');
};

// 点击 "說明" 按钮，显示游戏说明弹窗
const openInstructions = () => {
  showInstructions.value = true;
};

const openReferences = () => {
  showReferences.value = true;
};

// 关闭弹窗的回调函数
const closeInstructions = () => {
  showInstructions.value = false;
};

const closeReferences = () => {
  showReferences.value = false;
};


</script>

<style scoped>
/* 让整个容器始终固定在屏幕中央 */
.start-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

/* 标题样式 */
.title {
    font-size: 3.5rem;
    margin-bottom: 4rem;
    letter-spacing: 0.2em;
}



</style>

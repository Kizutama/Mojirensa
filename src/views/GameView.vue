<template>
    <div class="game-container">
        <h2>游戏模式：{{ mode }}</h2>
        <p>这里是游戏内容...</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const mode = route.query.mode || '未知模式'
</script>

<style scoped>
.game-container {
    text-align: center;
    padding: 50px;
}
</style>

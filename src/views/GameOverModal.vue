<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <!-- 动画组1：标题 -->
      <h2 :class="['animate-line', { active: lineActive >= 1 }]">終了</h2>
      
      <!-- 动画组2：役種列表 -->
      <div class="yaku-list animate-line" :class="{ active: lineActive >= 2 }">
        <div class="yaku-item">
          <div class="yaku-name">底和</div>
          <div class="yaku-quantity"></div>
          <div class="yaku-additional">+1飜</div>
        </div>
        <div v-if="treasureCount > 0" class="yaku-item">
          <div class="yaku-name">ドラ</div>
          <div class="yaku-quantity">{{ treasureCount }}</div>
          <div class="yaku-additional">+{{ treasureCount }}飜</div>
        </div>
        <div v-if="kanCards && kanCards.length > 0" class="yaku-item">
          <div class="yaku-name">カン</div>
          <div class="yaku-quantity">{{ kanCards.length }}</div>
          <div class="yaku-additional">+{{ kanCards.length　*2 }}飜</div>
        </div>
      </div>
      
      <!-- 动画组3：符数与飜数 -->
      <p class="final-total animate-line" :class="{ active: lineActive >= 3 }">
        <span class="score-number">{{ finalScore }}</span>
        <span class="score-symbol">符</span>
        <span class="multiplier-number">{{ multiplier }}</span>
        <span class="score-symbol">飜</span>
      </p>
      
      <!-- 动画组4：最终得点（延时1秒后出现） -->
      <transition name="final-point">
        <div v-if="showFinalPoint">
          <p class="final-point">最终得点</p>
          <p class="final-point-score">{{ finalScore * multiplier }}</p>
        </div>
      </transition>
      
      <!-- 新增：显示“カン”牌组，动画条件改为 kanActive（立即启动） -->
      <div class="kan-area animate-line" :class="{ active: kanActive }" v-if="kanCards && kanCards.length">
        <div class="kan-title">カン</div>
        <div class="kan-group" v-for="(group, idx) in kanCards" :key="'kan-' + idx">
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
      
      <!-- 小结果牌区域：使用 TransitionGroup 逐一显示小结果牌 -->
      <transition-group name="card-fade" tag="div" class="matched-cards">
        <div 
          v-for="(card, index) in matchedResults.slice(0, activeMatchedCount)"
          :key="card.id || index"
          :class="['card', 'small-result', { treasure: card.isTreasure }]"
        >
          <div class="small-result-top">{{ card.hentaigana }}</div>
          <div class="small-result-bottom">
            <span>{{ card.hiragana }}</span>
            <span>{{ card.kanji }}</span>
          </div>
        </div>
      </transition-group>
      
      <!-- 操作按钮 -->
      <div class="modal-buttons">
        <button @click="onReplay">もう一回</button>
        <button @click="onGoHome">ホームへ</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { resultStore } from '../actions/resultStore.js'
import { score } from '../actions/ScoreBoard.js'

// Define props and emits
const props = defineProps({
  finalScore: { type: [Number, String], default: 0 },
  multiplier: { type: Number, default: 1 },
  treasureCount: { type: Number, default: 0 },
  matchedResults: { type: Array, default: () => [] },
  kanCards: { type: Array, default: () => [] }
})
const emit = defineEmits(['replay', 'go-home'])

// Reactive state variables
const lineActive = ref(0)         // 控制标题、役種列表、符数与飜数区域的逐行动画
const showFinalPoint = ref(false) // 控制最终得点区域的显示
const activeMatchedCount = ref(0) // 当前已显示的小结果牌数量
const kanActive = ref(false)      // 控制“カン”区域的动画，要求最先播放

// 如果有 loadingScreen 组件的引用，可以用 ref 获取
const loadingScreen = ref(null)

// 从父组件获取 startGame 函数
const startGame = inject('startGame');


function onReplay() {
  if (startGame) {
    startGame(); // 调用 startGame 函数显示加载界面
  }

  // 延迟 2 秒后再重置游戏状态
  setTimeout(() => {
    emit("replay"); // 通知父组件重开游戏

    // 重置游戏状态
    score.value = 0;
    Object.assign(resultStore, {
      results: [],
      currentIndex: -1,
      latestResult: null,
      multiplier: 1,
      treasureCount: 0,
      kanCards: []
    });
    
    // 同时重置其他控制最终得点显示的变量
    lineActive.value = 0;      // 如果有逐行动画状态
    showFinalPoint.value = false; // 隐藏大结果牌
    activeMatchedCount.value = 0; // 清空小结果牌显示计数
    
    // 如果有其他重置逻辑，例如刷新牌组，也在这里调用
    // refreshCards();
  }, 1000);
}




function startAnimationSequence() {
  // 每200ms激活一行文字动画：标题、役種列表、符数与飜数区域
  const timer = setInterval(() => {
    lineActive.value++
    if (lineActive.value >= 3) {
      clearInterval(timer)
      // 第三行动画完成后，延时1秒显示最终得点区域
      setTimeout(() => {
        showFinalPoint.value = true
      }, 1000)
    }
  }, 200)
}




// 当 LoadingScreen 的进入动画结束时触发此回调
function onEnterAnimationEnded() {
  // 延时 500ms 后启动计时器
  setTimeout(() => {
    startTimer();
    // 根据需要延时后隐藏加载界面，例如再等待 1000ms后隐藏
    setTimeout(() => {
      if (loadingScreenRef.value) {
        loadingScreenRef.value.hideLoading();
      }
    }, 500);
  }, 500);
}


function onGoHome() {
  emit('go-home')
}

onMounted(() => {
  // 立即激活“カン”区域动画
  kanActive.value = true

  // 逐一显示小结果牌，每0.1秒增加一张
  const cardTimer = setInterval(() => {
    if (activeMatchedCount.value < props.matchedResults.length) {
      activeMatchedCount.value++
    } else {
      clearInterval(cardTimer)
      // 当所有小结果牌显示完毕后，启动上方文字动画序列（不包含カン区域）
      startAnimationSequence()
    }
  }, 100)
})
</script>


<style scoped>
/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹窗内容 */
.modal-content {
  background-color: #fff;
  padding: 20px;
  padding-bottom: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  border: 1.5pt solid var(--text-color);
  max-height: 90vh;
  overflow-y: auto;
}

/* 逐行动画初始状态：透明并略放大 */
.animate-line {
  opacity: 0;
  transform: scale(1.2);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.animate-line.active {
  opacity: 1;
  transform: scale(1);
}

/* 最终得点动画（淡入、轻微上移） */
.final-point-enter-active {
  transition: all 0.8s 0.3s;
}
.final-point-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.final-point-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 役種列表 */
.yaku-list {
  margin-bottom: 1rem;
  padding-left: 8.8vh;
  padding-right: 8.8vh;
}
.yaku-item {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.yaku-name {
  flex: 1;
  text-align: left;
}
.yaku-quantity {
  flex: 1;
  text-align: center;
}
.yaku-additional {
  flex: 1;
  text-align: right;
}

/* 符数与飜数展示 */
.final-total {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
.score-number,
.multiplier-number {
  font-size: 18px;
}
.score-symbol {
  font-size: 24px;
  line-height: 2.1rem;
}

/* 最终得点显示 */
.final-point {
  margin-bottom: 0.2rem;
  text-align: center;
  font-size: 18px;
}
.final-point-score {
  text-align: center;
  font-size: 30px;
  margin-top: 0.2rem;
}

/* 小结果牌区域 */
.matched-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

/* TransitionGroup 动画：轻微渐入 */
.card-fade-enter-active, .card-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.card-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.card-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
.card-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 操作按钮 */
.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.modal-buttons button {
  padding: 0.7rem 3rem;
  font-size: 1rem;
  background: none;
  border: 1.2pt solid var(--text-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family);
  font-weight: 400;
}
.modal-buttons button:hover {
  background: var(--text-color);
  color: var(--bg-color);
  font-weight: 900;
}

/* scale-in-hor-right 动画（Webkit 与标准版本） */
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

/* fade-out 动画 */
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
</style>

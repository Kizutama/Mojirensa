// src/actions/useGameLogic.js
import { ref, onMounted } from "vue";
import { getRandomHentaiganaPairs } from "../actions/hentaiganaGameData.js";
import { updateScore } from "../actions/ScoreBoard.js";
import { resultStore } from "../actions/resultStore.js";
import { checkForMatch } from "../actions/matchChecker.js";




let onYakuCallback = null;

export function setOnYakuCallback(callback) {
  onYakuCallback = callback;
}



/**
 * useGameLogic 封装了游戏状态管理和卡牌交互逻辑
 */
export function useGameLogic() {
  const cards = ref([]);            // 当前卡牌数据
  const firstSelected = ref(null);  // 第一次选中卡牌的索引
  const secondSelected = ref(null); // 第二次选中卡牌的索引
  const selectedIndices = ref([]);  // 用于显示选中效果的索引数组

  // 刷新卡牌：获取一组新的 16 张卡牌，并重置状态
  const refreshCards = async () => {
    cards.value = await getRandomHentaiganaPairs();
    firstSelected.value = null;
    secondSelected.value = null;
    selectedIndices.value = [];
  };

  // 处理卡牌点击
  const handleCardClick = (index) => {
    // 如果卡牌已匹配或已移除，则忽略点击
    if (cards.value[index].matched || cards.value[index].removed) return;
    // 如果已经有两张卡牌选中，则不响应新的点击
    if (firstSelected.value !== null && secondSelected.value !== null) return;

    // 添加选中效果（如果尚未添加）
    if (!selectedIndices.value.includes(index)) {
      selectedIndices.value.push(index);
    }

    // 按顺序记录选中卡牌索引
    if (firstSelected.value === null) {
      firstSelected.value = index;
    } else if (secondSelected.value === null) {
      secondSelected.value = index;
      // 两张卡牌选中后，延时调用匹配检测函数
      setTimeout(() => {
        checkForMatch({
          cards,
          firstSelected,
          secondSelected,
          selectedIndices,
          updateScore,
          refreshCards,
          resultStore,
          onYaku: onYakuCallback // 使用一个在组合式函数外部定义的回调函数
        });
      }, 200);
    }
  };

  onMounted(() => {
    refreshCards();
  });

  return {
    cards,
    selectedIndices,
    handleCardClick,
    refreshCards,
    setOnYakuCallback
  };
}

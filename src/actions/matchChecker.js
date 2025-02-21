// src/actions/matchChecker.js
/**
 * matchChecker.js
 * 
 * 该模块提供 checkForMatch 函数，用于检测两张选中卡牌是否匹配，
 * 并根据匹配结果更新卡牌状态、分数以及全局匹配结果存储。
 * 
 * 参数：
 *  params: {
 *    cards: ref 数组，当前卡牌数据；
 *    firstSelected: ref，第一次选中的卡牌索引；
 *    secondSelected: ref，第二次选中的卡牌索引；
 *    selectedIndices: ref 数组，当前所有选中的卡牌索引；
 *    updateScore: Function，更新分数的函数；
 *    refreshCards: Function，用于刷新卡牌的函数；
 *    resultStore: 对象，存储匹配结果的全局状态；
 *  }
 */
export function checkForMatch({
  cards,
  firstSelected,
  secondSelected,
  selectedIndices,
  updateScore,
  refreshCards,
  resultStore,
  onYaku
}) {
  // 获取第一次和第二次选中的卡牌对象
  const firstCard = cards.value[firstSelected.value];
  const secondCard = cards.value[secondSelected.value];

  if (firstCard && secondCard) {
    // 判断匹配条件：两个卡牌的 pairId 相同且类型不同（确保一张是假名，一张是汉字）
    if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
      // 匹配成功：更新卡牌状态
      firstCard.matched = true;
      secondCard.matched = true;
      // 始终选择类型为 "kana" 的卡牌数据，如果第一张不是，则用第二张
      const matchedPair = (firstCard.type === "kana" ? firstCard.pairData : secondCard.pairData);
      // 判断两张牌中任一张是否为宝牌
      const isTreasure = (firstCard.isTreasure || secondCard.isTreasure);
      // 将结果对象构造出来，并确保包含 isTreasure 属性
      resultStore.results.unshift({ ...matchedPair, isTreasure: isTreasure });
      resultStore.currentIndex = resultStore.results.length - 1;
      resultStore.latestResult = resultStore.results[resultStore.results.length - 1];

      // 更新分数，加 100 分
      updateScore(100);

      // 宝牌处理：如果任一张卡牌是宝牌
      if (isTreasure) {
        if (!resultStore.multiplier) {
           // 检查全局结果存储中的 multiplier 是否存在（或非假值），若未定义则初始化为 1
          resultStore.multiplier = 1;
        }
        resultStore.multiplier++;
        resultStore.treasureCount++;
        // 如果传入 onYaku 回调，则调用它，传入 "宝牌" 作为役种名称
        if (typeof onYaku === 'function') {
          onYaku("ドラ");
        }
      }
      
      // 添加动画标识，使匹配成功的卡牌触发消失动效
      // 新动画类名称为 "card-puff-out"，请在 CSS 中定义对应的动画
      firstCard.animationClass = 'card-puff-out';
      secondCard.animationClass = 'card-puff-out';
      
      // 延时 100ms后，将卡牌标记为 removed，并重置动画类和选中状态
      setTimeout(() => {
        firstCard.removed = true;
        secondCard.removed = true;
        // 清除动画类，以便下次使用
        firstCard.animationClass = '';
        secondCard.animationClass = '';
        firstSelected.value = null;
        secondSelected.value = null;
        selectedIndices.value = [];

        // 调用 checkKang() 检测牌河中的卡牌是否满足“カン”条件
        import('../actions/kangChecker.js').then(module => {
          module.checkKang();
        }).catch(console.error);

        const allRemoved = cards.value.every(card => card.removed);
        if (allRemoved) {
          refreshCards();
        }    
      }, 100);
    } else {
      // 匹配失败：更新分数，扣 10 分
      updateScore(-10);

      if (cards.value[firstSelected.value].isTreasure) {
        cards.value[firstSelected.value].isTreasure = false;
      }
      if (cards.value[secondSelected.value].isTreasure) {
        cards.value[secondSelected.value].isTreasure = false;
      }
      
      // 为确保每次失败都能触发错误动画，先将 error 属性重置为 false
      cards.value[firstSelected.value].error = false;
      cards.value[secondSelected.value].error = false;
      
      // 使用 setTimeout 0 延迟，将 error 属性设置为 true，以触发 CSS 动画
      setTimeout(() => {
        cards.value[firstSelected.value].error = true;
        cards.value[secondSelected.value].error = true;
      }, 0);
      
      // 延时后恢复选中状态（同时清除 error 状态），让玩家重新选择
      setTimeout(() => {
        cards.value[firstSelected.value].error = false;
        cards.value[secondSelected.value].error = false;
        selectedIndices.value = selectedIndices.value.filter(
          i => i !== firstSelected.value && i !== secondSelected.value
        );
        firstSelected.value = null;
        secondSelected.value = null;
      }, 100);
    }
  }
}

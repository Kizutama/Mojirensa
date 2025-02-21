import { resultStore } from "./resultStore.js";

/**
 * checkKang 用于检测牌河（resultStore.results）中是否有4张相同平假名的卡牌，
 * 如果存在，则将这4张卡牌从 resultStore.results 中删除，并存入 resultStore.kanCards，
 * 同时增加 multiplier（飜数）2。
 */
export function checkKang() {
  // 使用对象对 resultStore.results 按平假名分组
  const groups = {};
  resultStore.results.forEach((card, index) => {
    if (card.hiragana) {
      if (!groups[card.hiragana]) {
        groups[card.hiragana] = [];
      }
      groups[card.hiragana].push({ card, index });
    }
  });

  // 遍历分组，查找满足4张的组
  for (const hiragana in groups) {
    const group = groups[hiragana];
    if (group.length >= 4) {
      // 选择前4张牌构成一组
      const selectedGroup = group.slice(0, 4);
      // 从 resultStore.results 中删除这4张牌（注意从大到小删除以避免索引错乱）
      selectedGroup
        .sort((a, b) => b.index - a.index)
        .forEach(({ index }) => {
          resultStore.results.splice(index, 1);
        });
      // 将这一组牌存入 resultStore.kanCards
      resultStore.kanCards.push({
        hiragana: hiragana,
        cards: selectedGroup.map(item => item.card)
      });
      // 更新 multiplier：每达成一组「カン」增加2飜
      resultStore.multiplier += 2;
    }
  }
}

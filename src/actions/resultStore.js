// 导入 reactive 用于创建响应式对象
import { reactive } from 'vue';

// 定义全局匹配结果存储
export const resultStore = reactive({
  results: [],       // 存储所有匹配成功的牌数据
  currentIndex: -1,  // 当前显示结果牌的索引
  latestResult: null,// 最新匹配成功的牌
  multiplier: 1,     // 飜数，初始为1（通关自带底和1飜）
  treasureCount: 0,   // 宝牌匹配成功的数量，初始为0
  kanCards: []        // 新增：存储“カン”牌（每组四张相同平假名）
});
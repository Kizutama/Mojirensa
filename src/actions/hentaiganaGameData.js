/**
 * 项目名称：文字連鎖小游戏
 * 功能概述：本项目是一款用于帮助玩家快速记忆变体假名（变态假名）及其对应汉字的小游戏。
 *          游戏模式类似于百人一首和连连看，所有卡牌在游戏开始时均显示，
 *          玩家需要从中找到正确匹配的假名牌和汉字牌。
 *
 * 本文件功能：hentaiganaGameData.js 用于从服务器加载存储变体假名数据的 JSON 文件，
 *              随机打乱数据、选取 8 组数据后生成 16 张卡牌（每组生成一张假名牌和一张汉字牌）。
 *              每个卡牌对象包含匹配检测所需的属性。
 */

export async function getRandomHentaiganaPairs() {
    // 1. 从服务器加载 JSON 数据，JSON 文件存放在 /data/hentaigana_data_fixed.json
    const response = await fetch("/data/hentaigana_data_fixed.json");
    
    // 2. 解构获取 JSON 数据中的 hentaigana_data 数组（包含所有变体假名数据）
    const { hentaigana_data } = await response.json();

    // 3. 随机打乱原始数据顺序
    const shuffledData = hentaigana_data.sort(() => Math.random() - 0.5);

  // 4. 选取 8 组数据，保证每组数据的汉字（pair.kanji）不重复
    const selectedPairs = [];
    const seenKanji = new Set();
    for (let i = 0; i < shuffledData.length && selectedPairs.length < 8; i++) {
        const pair = shuffledData[i];
        if (!seenKanji.has(pair.kanji)) {
        seenKanji.add(pair.kanji);
        selectedPairs.push(pair);
        }
    }

    // 5. 测试代码：强制将前4组的平假名统一设为 "あ"
    //    这样生成的卡牌中，前4组的假名牌对应的平假名均为 "あ"，便于测试“カン”役种
    // for (let i = 0; i < 4; i++) {
    //     selectedPairs[i].hiragana = "あ";
    // }

    // 6. 使用 flatMap 将每组数据转换成两张卡牌，并随机设置宝牌状态
    const cards = selectedPairs.flatMap(pair => {
        // 生成宝牌标记，10%概率为宝牌（这里用 < 0.1 表示 10%）
        const isTreasure = Math.random() < 0.1;
        return [
            {   // 假名牌配置
                type: "kana",              // 卡牌类型：假名
                value: pair.hentaigana,    // 卡牌上显示的假名字符
                pairId: pair.kanji,        // 匹配标识：采用对应汉字
                matched: false,            // 初始状态：尚未匹配成功
                // 将宝牌标记同时传递给 pairData 对象
                pairData: { ...pair, isTreasure: isTreasure },
                isTreasure: isTreasure     // 设置宝牌状态
            },
            {   // 汉字牌配置
                type: "kanji",             // 卡牌类型：汉字
                value: pair.kanji,         // 卡牌上显示的汉字
                pairId: pair.kanji,        // 匹配标识：与假名牌使用相同标识
                matched: false,            // 初始状态：尚未匹配成功
                pairData: pair             // 保存整组原始数据（汉字牌不需要宝牌属性）
            }
        ];
    });

    // 7. 最后，再次随机打乱生成的 16 张卡牌顺序
    return cards.sort(() => Math.random() - 0.5);
}

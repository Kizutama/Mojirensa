<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="modal-title">ゲーム説明</h2>
      <div class="modal-body">
        <p>このゲームは、変体仮名を記憶するための記憶ゲームです。<br/>ゲーム開始時、すべてのカードが表示され、プレイヤーは正しいペアを素早く見つけ出す必要があります。</p>
        <p><strong>【基本ルール】</strong></p>
        <ul>
          <li>各ペアは、変体仮名カードとその対応する漢字カードで構成されます。</li>
          <li>プレイヤーはカードを2枚ずつ選び、正しい組み合わせを探します。</li>
          <li>正しいペアを見つけると、カードは消去され、<strong>符</strong>が加算されます。</li>
          <li>間違った組み合わせの場合、<strong>符</strong>は少し減点され、カードは元に戻ります。</li>
        </ul>
        <p><strong>【特別ルール】</strong></p>
        <ul>
          <li>
            <strong>ドラ</strong>：変体仮名カードには一定の確率で「ドラ」として進化され、正しくマッチングすれば追加の<strong>1飜</strong>が得られます。失敗時は通常のカードに戻ります。
          </li>
          <li>
            <strong>カン</strong>：<strong>カード河</strong>内に同じ平仮名に対応するカードが4枚揃うと「カン」が成立し、<strong>1飜</strong>が追加されます。
          </li>
        </ul>
        <p><strong>【ゲーム終了時】</strong></p>
        <p>ゲーム終了時、得点と翻数が表示され、<br/>最終得点は<strong>「符数×飜数」</strong>で計算されます。</p>
      </div>
      <div class="modal-buttons">
        <button class="menu-btn" @click="closeModal">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  使用 defineEmits 定义关闭事件。当点击弹窗外部（.modal-overlay）时也关闭弹窗
*/
const emit = defineEmits(["close"]);
function closeModal() {
  emit("close");
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* 弹窗内容样式 */
.modal-content {
  background-color: #fff;
  padding: 20px;
  padding-bottom: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  border: 1.5pt solid var(--text-color);
  max-height: 90vh;      /* 设置最大高度为视口高度的90% */
  overflow-y: auto;      /* 超出部分垂直滚动 */

}

.modal-title {
  position: relative;           /* 使伪元素以 h2 为参照 */
  display: inline-block;        /* 让 h2 的宽度仅限于文字内容 */
  padding-bottom: 0.25rem;  
}
.modal-title::after {
  content: "";                  /* 生成空内容 */
  position: absolute;           /* 绝对定位 */
  left: -0.2em;                 /* 向左延伸 0.2em（大约3px） */
  right: -0.2em;                /* 向右延伸 0.2em */
  bottom: 0;                    /* 位于 h2 底部 */
  border-bottom: 1.5px solid currentColor; /* 下划线，宽度2px，颜色与文字相同 */
}

.modal-body {
  text-align: left;
  font-size: 1rem;
  line-height: 1.5;
}

p{
    font-size: 12pt;
    font-weight: 400;
}

li{
    font-size: 10pt;
    font-weight: 460;
}
strong{
    font-weight: 700;
    margin-left: 1ren;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.menu-btn {
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

.menu-btn:hover {
  background: var(--text-color);
  color: var(--bg-color);
  font-weight: 900;
}
</style>

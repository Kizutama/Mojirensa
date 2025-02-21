<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="modal-title">参考資料</h2>
      <div class="modal-body">
        <p>
          変体仮名資料の公開元：国立国語研究所<br />
          サイト：
          <a href="https://cid.ninjal.ac.jp/kana/list/" target="_blank">
            https://cid.ninjal.ac.jp/kana/list/
          </a>
        </p>

        <p>
          本ゲームのフォントには google fonts の<br/>
          「Noto Serif Hentaigana VF」及び<br/>
          「Source Han Serif VF」 を使用しています。
        </p>
        <br/>
        <p>
         <strong style="position: relative; top: 1.5rem">Designed by:</strong>
        <img src="../Kizutama_logo.svg" alt="玊玉_Kizutama Logo" style="vertical-align: middle; width: 100px;margin-left: 8px;">
        <strong style="position: relative; top: 1.5rem;right:1.5rem;">玊玉_Kizutama</strong>
        </p>
      </div>
      <div class="modal-buttons">
        <button class="menu-btn" @click="closeModal">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  defineEmits で閉じるイベントを定義。
  @click.self="closeModal" は、背景部分をクリックした時に閉じるため。
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2001;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  border: 1.5pt solid var(--text-color);
  max-height: 90vh; /* 内容が多い場合にスクロールできるように */
  overflow-y: auto;
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
  line-height: 1.5;
  font-size: 1rem;
}

.modal-body a {
  color: var(--text-color);
  text-decoration: underline;
}

p{
    font-size: 12pt;
    font-weight: 400;
    padding-bottom: 1rem;
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

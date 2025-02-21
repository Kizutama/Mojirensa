/**
 * 项目名称：文字連鎖小游戏
 * 功能概述：本文件作为应用入口，负责创建 Vue 应用实例，
 *          配置路由映射并将应用挂载到 HTML 页面中。
 */

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// 导入根组件 App.vue（整个应用的容器组件）
import App from './App.vue';

// 导入各个页面组件
import StartView from './views/StartView.vue';         // 起始页面组件
import ModeSelectView from './views/ModeSelectView.vue';   // 模式选择页面组件
import GameView from './views/GameView.vue';             // 普通游戏页面组件
import GameOverModal from './views/GameOverModal.vue';     // 游戏结束弹窗组件（放在 views 文件夹下）

// 配置路由映射，注意使用具名视图加载多个组件
const routes = [
  { path: '/', component: StartView },               // 根路径显示起始页面
  { path: '/mode', name: 'ModeSelectView', component: ModeSelectView },       // /mode 显示模式选择页面
  { path: '/game', component: GameView },              // /game 显示普通游戏页面
  { 
    path: '/game-hentaigana',                           // /game-hentaigana 显示变态假名游戏页面
    components: {
      header: () => import('./views/GameHentaiganaHeader.vue'), // 页头组件
      default: () => import('./views/GameHentaigana.vue'),        // 主游戏组件
      scoreboard: () => import('./views/ScoreBoard.vue')          // 计分/倒计时组件
    }
  },
];

// 创建路由实例，使用 HTML5 历史记录模式
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 创建 Vue 应用实例，使用根组件 App.vue 作为入口
const app = createApp(App);

// 注册全局组件（此处在 app 创建后再注册）
app.component('GameOverModal', GameOverModal);

// 集成路由实例到应用中
app.use(router);

// 挂载应用到 HTML 页面中 id 为 "app" 的元素上
app.mount('#app');

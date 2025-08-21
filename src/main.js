/**
 * 应用程序入口文件
 * 负责初始化Vue应用、引入UI组件库、配置路由等
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入Vant UI组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入全局样式
import './styles/global.css'

// 移动端视口高度修复
function setViewportHeight() {
  // 计算真实的视口高度
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// 初始设置
setViewportHeight()

// 监听窗口大小变化
window.addEventListener('resize', setViewportHeight)
window.addEventListener('orientationchange', setViewportHeight)

// 创建Vue应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(Vant)

// 挂载应用
app.mount('#app')

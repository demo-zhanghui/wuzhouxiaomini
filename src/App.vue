<!--
  应用程序根组件
  负责渲染整个应用的页面结构和全局配置
-->

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
/**
 * App.vue 主要负责：
 * 1. 提供全局的页面容器
 * 2. 初始化全局状态
 * 3. 处理全局的样式和主题
 */

import { onMounted } from 'vue'
import { store } from '@/store'

// 应用启动时初始化全局状态
onMounted(() => {
  // 初始化用户角色状态
  store.initUserRole()
  
  // 初始化工作空间状态  
  store.initWorkspace()
  
  console.log('承运商统一APP已启动')
  console.log('当前角色:', store.userRole === 'driver' ? '公路司机' : '水路司机')
  console.log('当前工作空间:', store.currentWorkspace === 'personal' ? '个人空间' : '企业空间')
})
</script>

<style scoped>
/**
 * 应用容器样式
 */
.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--background-color, #f7f8fa);
}

/**
 * 页面切换动画
 * 提供平滑的页面过渡效果
 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* 确保路由视图占满整个容器 */
:deep(.router-view) {
  height: 100%;
  width: 100%;
}
</style>

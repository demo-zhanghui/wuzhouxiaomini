<!--
  应用程序根组件
  负责渲染整个应用的页面结构和全局配置
-->

<template>
  <div id="app" class="app-container">
    <!-- 路由视图容器 -->
    <router-view v-slot="{ Component }">
      <!-- 添加页面切换动画 -->
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
/**
 * App.vue 主要负责：
 * 1. 提供全局的页面容器
 * 2. 配置页面切换动画
 * 3. 处理全局的样式和主题
 */

import { onMounted } from 'vue'
import { store } from '@/store'

// 应用启动时初始化全局状态
onMounted(() => {
  // 初始化用户角色状态
  store.initUserRole()
  
  // 设置全局主题（如果需要）
  console.log('承运商统一APP已启动')
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

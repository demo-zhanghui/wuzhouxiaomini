<!--
  主布局组件
  包含底部导航栏和页面内容区域
  
  核心功能：
  1. 五导航栏底部布局
  2. 特殊的中心按钮设计
  3. 工作台模态弹窗
  4. 页面切换管理
-->

<template>
  <!-- APP整体容器 -->
  <div class="app-container">
    <div class="layout-container">
      <!-- 主内容区域 -->
      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- 底部导航栏 -->
      <van-tabbar 
        v-if="!route.meta.hideTabbar"
        v-model="activeTab" 
        @change="handleTabChange"
        class="custom-tabbar"
      >
      <!-- 运单（左） -->
      <van-tabbar-item name="yundan" icon="notes-o">
        运单
      </van-tabbar-item>

      <!-- 中心按钮：首页（跑货） -->
      <van-tabbar-item name="paohuo" class="center-tab-item">
        <template #icon>
          <div class="center-button">
            <van-icon name="home-o" size="24" />
          </div>
        </template>
        <span class="center-label">首页</span>
      </van-tabbar-item>

      <!-- 我的（右） -->
      <van-tabbar-item name="my" icon="user-o">
        我的
      </van-tabbar-item>
    </van-tabbar>
    </div>
  </div>
</template>

<script setup>
/**
 * 主布局逻辑
 * 处理导航切换、工作台弹窗等功能
 */

import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由实例
const router = useRouter()
const route = useRoute()

// 响应式数据
const activeTab = ref('paohuo')           // 当前激活的标签页

/**
 * 根据当前路由设置激活的标签页
 */
const setActiveTabFromRoute = () => {
  const routeName = route.name
  const tabMap = {
    'Paohuo': 'paohuo',
    'YunDan': 'yundan',
    'My': 'my'
  }
  
  if (tabMap[routeName]) {
    activeTab.value = tabMap[routeName]
  }
}

/**
 * 处理标签页切换
 * @param {string} name - 标签页名称
 */
const handleTabChange = (name) => {
  // 根据标签页名称跳转对应路由
  const routeMap = {
    'paohuo': '/main/paohuo',
    'yundan': '/main/yundan',
    'my': '/main/my'
  }
  
  if (routeMap[name]) {
    router.push(routeMap[name])
  }
}

/**
 * 监听路由变化，更新激活的标签页
 */
watch(route, () => {
  setActiveTabFromRoute()
})

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  setActiveTabFromRoute()
  console.log('主布局已加载')
})
</script>

<style scoped>
/**
 * APP整体容器样式
 */
.app-container {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

/**
 * 布局容器样式 - 模拟手机屏幕
 */
.layout-container {
  width: 100%;
  max-width: 375px;
  height: 100%;
  max-height: 812px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--background-color);
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

/* 隐藏滚动条但保持滚动功能 */
.content-area::-webkit-scrollbar {
  display: none;
}

.content-area {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

/* 页面切换动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 自定义底部导航栏样式 */
.custom-tabbar {
  background: white;
  height: 60px;
  position: relative !important;
  bottom: 0 !important;
}

/* 统一导航栏项目样式 */
:deep(.van-tabbar-item) {
  color: #969799 !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  transition: all 0.2s ease !important;
}

:deep(.van-tabbar-item--active) {
  color: var(--primary-color) !important;
  font-weight: 500 !important;
}

/* 统一图标样式 */
:deep(.van-tabbar-item__icon) {
  color: inherit !important;
  font-size: 20px !important;
  margin-bottom: 2px !important;
}

:deep(.van-tabbar-item__text) {
  color: inherit !important;
  font-size: 12px !important;
  line-height: 1.2 !important;
}

/* 确保所有图标颜色一致 */
:deep(.van-icon) {
  color: inherit !important;
}

/* 修复导航栏项目间距和对齐 */
:deep(.van-tabbar-item) {
  flex: 1 !important;
  padding: 5px 0 !important;
  min-height: 50px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 确保中心按钮项目对齐 */
.center-tab-item {
  position: relative;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 统一激活状态的视觉效果 */
:deep(.van-tabbar-item--active .van-tabbar-item__icon),
:deep(.van-tabbar-item--active .van-tabbar-item__text) {
  color: var(--primary-color) !important;
  transform: scale(1.05);
}

/* 中心按钮容器样式 - 已在上方定义，此处移除重复 */

.center-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  box-shadow: 0 6px 20px rgba(238, 90, 36, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 3px solid white;
  position: relative;
  top: -8px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.center-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(238, 90, 36, 0.5);
}

.center-button:active {
  transform: scale(0.95);
}

.center-button::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: inherit;
  filter: blur(10px);
  opacity: 0.6;
  z-index: -1;
}

.center-label {
  font-size: 12px !important;
  color: #969799 !important;
  font-weight: 400 !important;
  margin-top: 4px;
  transition: all 0.2s ease !important;
}

/* 中心按钮激活状态 */
.center-tab-item.van-tabbar-item--active .center-label {
  color: var(--primary-color) !important;
  font-weight: 500 !important;
}

/* 工作台模态层样式 */
.workbench-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  backdrop-filter: blur(4px);
}

.workbench-content {
  width: 100%;
  max-height: 85vh;
  background: white;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 拖拽指示器 */
.drag-indicator {
  width: 36px;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  margin: 12px auto 8px;
  cursor: pointer;
}

/* 工作台头部 */
.workbench-header {
  padding: 16px 24px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.workbench-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.workbench-subtitle {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 300;
}

/* 工作台主体 */
.workbench-body {
  flex: 1;
  overflow-y: auto;
}

/* 模态层动画 */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
}

.modal-slide-enter-from .workbench-content,
.modal-slide-leave-to .workbench-content {
  transform: translateY(100%);
}

.modal-slide-enter-active .workbench-content,
.modal-slide-leave-active .workbench-content {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .center-button {
    width: 50px;
    height: 50px;
    top: -6px;
  }
  
  .workbench-content {
    max-height: 90vh;
  }
  
  .layout-container {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100); /* 解决移动端100vh问题 */
  }
}

/* 修复移动端视口高度问题 */
@media (max-height: 667px) {
  .workbench-content {
    max-height: 80vh;
  }
}

/* 安全区域适配 - 移除fixed定位后不需要 */
</style>

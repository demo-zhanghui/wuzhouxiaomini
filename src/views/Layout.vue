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
        <!-- 个人空间导航 -->
        <template v-if="isPersonalWorkspace">
          <!-- 运单 -->
          <van-tabbar-item name="yundan" icon="notes-o" />

          <!-- 中心按钮：首页（跑货） -->
          <van-tabbar-item name="paohuo" class="center-tab-item">
            <template #icon>
              <div class="center-button">
                <van-icon name="home-o" size="24" />
              </div>
            </template>
          </van-tabbar-item>

          <!-- 我的 -->
          <van-tabbar-item name="my" icon="user-o" />
        </template>

        <!-- 企业空间导航 -->
        <template v-else>
          <!-- 首页 -->
          <van-tabbar-item name="home" icon="home-o" />

          <!-- 待办 -->
          <van-tabbar-item name="todo" icon="todo-list-o">
            <van-badge v-if="todoCount > 0" :content="todoCount" />
          </van-tabbar-item>

          <!-- 工作台（中心突出按钮） -->
          <van-tabbar-item name="workbench" class="center-tab-item">
            <template #icon>
              <div class="center-button workbench-button">
                <van-icon name="apps-o" size="24" />
              </div>
            </template>
          </van-tabbar-item>

          <!-- 应用 -->
          <van-tabbar-item name="apps" icon="apps-o" />

          <!-- 我的 -->
          <van-tabbar-item name="my" icon="user-o" />
        </template>
      </van-tabbar>
    </div>
  </div>
</template>

<script setup>
/**
 * 主布局逻辑
 * 处理导航切换、工作空间切换等功能
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/store'

// 路由实例
const router = useRouter()
const route = useRoute()

// 响应式数据
const activeTab = ref('paohuo')           // 当前激活的标签页
const todoCount = ref(5)                  // 待办数量

// 计算属性 - 是否为个人空间
const isPersonalWorkspace = computed(() => {
  return store.currentWorkspace === 'personal'
})

/**
 * 根据当前路由设置激活的标签页
 */
const setActiveTabFromRoute = () => {
  const routeName = route.name
  
  // 个人空间路由映射
  const personalTabMap = {
    'YunDan': 'yundan',
    'Paohuo': 'paohuo',
    'My': 'my'
  }
  
  // 企业空间路由映射
  const enterpriseTabMap = {
    'EnterpriseHome': 'home',
    'EnterpriseTodo': 'todo',
    'EnterpriseWorkbench': 'workbench',
    'EnterpriseApps': 'apps',
    'EnterpriseMy': 'my'
  }
  
  const tabMap = isPersonalWorkspace.value ? personalTabMap : enterpriseTabMap
  
  if (tabMap[routeName]) {
    activeTab.value = tabMap[routeName]
  }
}

/**
 * 处理标签页切换
 * @param {string} name - 标签页名称
 */
const handleTabChange = (name) => {
  let targetRoute = ''
  
  if (isPersonalWorkspace.value) {
    // 个人空间路由映射
    const personalRouteMap = {
      'yundan': '/main/yundan',
      'paohuo': '/main/paohuo',
      'my': '/main/my'
    }
    targetRoute = personalRouteMap[name]
  } else {
    // 企业空间路由映射
    const enterpriseRouteMap = {
      'home': '/enterprise/home',
      'todo': '/enterprise/todo',
      'workbench': '/enterprise/workbench',
      'apps': '/enterprise/apps',
      'my': '/enterprise/my'
    }
    targetRoute = enterpriseRouteMap[name]
  }
  
  if (targetRoute) {
    router.push(targetRoute)
  }
}

/**
 * 监听路由变化，更新激活的标签页
 */
watch(route, () => {
  setActiveTabFromRoute()
})

/**
 * 监听工作空间变化，更新导航状态
 */
watch(() => store.currentWorkspace, () => {
  setActiveTabFromRoute()
})

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  setActiveTabFromRoute()
  console.log('主布局已加载，当前工作空间:', store.currentWorkspace)
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
  font-size: 22px !important;
  margin-bottom: 0 !important;
  margin-top: 8px !important;
}

:deep(.van-tabbar-item__text) {
  display: none !important;
}

/* 修复导航栏项目间距和对齐 */
:deep(.van-tabbar-item) {
  flex: 1 !important;
  padding: 8px 0 !important;
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
:deep(.van-tabbar-item--active .van-tabbar-item__icon) {
  color: var(--primary-color) !important;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

/* 确保图标可见性 */
:deep(.van-tabbar-item) {
  color: #646566 !important;
}

:deep(.van-tabbar-item--active) {
  color: var(--primary-color) !important;
}

/* 调试：确保图标显示 */
:deep(.van-tabbar-item__icon) {
  display: block !important;
  visibility: visible !important;
}

:deep(.van-icon) {
  display: block !important;
  visibility: visible !important;
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

/* 企业工作台按钮样式 */
.workbench-button {
  background: linear-gradient(135deg, #1989fa, #4fc3f7) !important;
  box-shadow: 0 6px 20px rgba(25, 137, 250, 0.4) !important;
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

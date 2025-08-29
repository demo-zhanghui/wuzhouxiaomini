<template>
  <div class="app-page-container">
    <!-- 导航栏 -->
    <van-nav-bar title="全部应用" />
    
    <!-- 应用布局图片 -->
    <van-image
      :src="'/images/all_apps_mockup.png'"
      :show-loading="true"
      :show-error="true"
      loading-text="正在加载应用布局..."
      error-text="图片加载失败"
      fit="contain"
      class="app-layout-image"
    />
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
/* 核心滚动容器 - 确保不遮挡底部导航栏 */
.app-page-container {
  height: calc(100vh - 50px - 46px); /* 视口高度 - 底部导航高度 - 顶部导航高度 */
  overflow-y: auto;
  background-color: #f7f8fa;
}

/* 导航栏样式 */
:deep(.van-nav-bar) {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 图片样式 */
.app-layout-image {
  width: 100%;
  height: auto;
  padding: 16px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 12px;
  margin: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.app-layout-image:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 375px) {
  .app-layout-image {
    padding: 12px;
    margin: 8px;
  }
}
</style>

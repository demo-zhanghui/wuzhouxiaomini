<template>
  <div class="yundan-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar 
      title="运单" 
      left-arrow 
      @click-left="goBack"
    >
      <template #right>
        <van-icon name="filter-o" @click="showFilter" />
      </template>
    </van-nav-bar>

    <!-- 状态过滤Tab -->
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :name="tab.value"
        :title="tab.title"
      />
    </van-tabs>

    <!-- 运单列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      class="order-list"
    >
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-card"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="order-number">运单号 {{ order.number }}</div>
          <van-tag :type="getStatusTagType(order.status)" round size="medium" class="status-tag">
            {{ tabs.find(t => t.value === order.status)?.title || order.status }}
          </van-tag>
        </div>

        <!-- 卡片内容主体 -->
        <div class="card-content">
          <!-- 简要信息胶囊（起止地 + 时间） -->
          <div class="info-brief">
            <span class="pill">{{ order.origin }}</span>
            <span class="pill">{{ order.destination }}</span>
            <span class="pill">{{ order.scheduleTime }}</span>
          </div>

          <!-- 公司信息（两条圆点列表） -->
          <div class="company-list">
            <div class="company-item">{{ order.shipper }}</div>
            <div class="company-item">{{ order.consignee }}</div>
          </div>
        </div>

        <!-- 核心信息条 -->
        <div class="core-bar">
          <van-icon name="shop-collect-o" class="core-icon" />
          <div class="core-text">{{ formatCoreInfo(order) }}</div>
          <div class="core-time">{{ order.updateTime }}</div>
        </div>

        <!-- 操作栏（图标 + 文字） -->
        <div class="action-bar" :class="`cols-${getActionButtons(order.status).length}`">
          <div
            v-for="action in getActionButtons(order.status)"
            :key="action.key"
            class="action-item"
            @click="handleAction(action.key, order)"
          >
            <van-icon :name="action.icon" :class="['action-icon', action.class]" />
            <div class="action-text">{{ action.text }}</div>
          </div>
        </div>
      </div>
    </van-list>

    <!-- 空状态 -->
    <van-empty 
      v-if="filteredOrders.length === 0 && !loading" 
      description="暂无运单数据" 
      image="search"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'

// 路由实例
const router = useRouter()

// 响应式数据
const activeTab = ref('accepted')
const loading = ref(false)
const finished = ref(false)

// 移除了用户角色概念，现在统一使用运单数据结构

// Tab配置
const tabs = ref([
  { value: 'accepted', title: '已接单' },
  { value: 'loaded', title: '已装货' },
  { value: 'unloaded', title: '已卸货' },
  { value: 'verified', title: '已复核' },
  { value: 'settled', title: '已结算' }
])

// 运单数据（整合了原Yunying.vue的完整数据）
const waybillData = ref({
  accepted: [
    {
      id: '12345678910111213',
      number: '12345678910111213',
      origin: '梧峰',
      destination: '区仓库',
      scheduleTime: '明天0-12点装货',
      shipper: '衢州宝红建材有限公司',
      consignee: '浙江宝红商品仓有限公司',
      transportType: '运输单价',
      price: '240',
      updateTime: '02-14 15:54',
      status: 'accepted',
      tags: ['普货', '建材']
    },
    {
      id: '12345678910111214',
      number: '12345678910111214', 
      origin: '梧峰',
      destination: '区仓库',
      scheduleTime: '明天0-12点装货',
      shipper: '衢州宝红建材有限公司',
      consignee: '浙江宝红商品仓有限公司',
      transportType: '已接单',
      price: '240',
      updateTime: '02-14 15:54',
      status: 'accepted',
      tags: ['普货', '建材']
    }
  ],
  loaded: [
    {
      id: '12345678910111215',
      number: '12345678910111215',
      origin: '梧峰',
      destination: '区仓库',
      scheduleTime: '明天0-12点装货',
      shipper: '衢州宝红建材有限公司',
      consignee: '浙江宝红商品仓有限公司',
      transportType: '装货净重',
      price: '240',
      updateTime: '02-14 15:54',
      status: 'loaded',
      tags: ['已装货', '建材']
    }
  ],
  unloaded: [
    {
      id: '12345678910111216',
      number: '12345678910111216',
      origin: '梧峰',
      destination: '区仓库',
      scheduleTime: '明天0-12点装货',
      shipper: '衢州宝红建材有限公司',
      consignee: '浙江宝红商品仓有限公司',
      transportType: '卸货净重',
      price: '240',
      updateTime: '02-14 15:54',
      status: 'unloaded',
      hasAlert: true,
      alertText: '有异常',
      tags: ['已卸货', '有异常']
    }
  ],
  verified: [
    {
      id: '12345678910111217',
      number: '12345678910111217',
      origin: '梧峰',
      destination: '区仓库',
      scheduleTime: '明天0-12点装货',
      shipper: '衢州宝红建材有限公司',
      consignee: '浙江宝红商品仓有限公司',
      transportType: '卸货净重',
      price: '240',
      updateTime: '02-14 15:54',
      status: 'verified',
      tags: ['已复核', '建材']
    }
  ],
  settled: [
    {
      id: '12345678910111218',
      number: '12345678910111218',
      origin: '梧峰',
      destination: '区仓库',
      scheduleTime: '今天已完成',
      shipper: '衢州宝红建材有限公司',
      consignee: '浙江宝红商品仓有限公司',
      transportType: '结算金额',
      price: '15000',
      updateTime: '02-14 18:30',
      status: 'settled',
      tags: ['已结算', '完成']
    }
  ]
})

// 计算当前显示的运单列表
const filteredOrders = computed(() => {
  return waybillData.value[activeTab.value] || []
})

// 获取Tab对应的数量
const getTabCount = (tabValue) => {
  return waybillData.value[tabValue]?.length || 0
}

// 获取状态标签类型（按状态值映射）
const getStatusTagType = (status) => {
  const typeMap = {
    accepted: 'primary',
    loaded: 'success',
    unloaded: 'warning',
    verified: 'default',
    settled: 'success'
  }
  return typeMap[status] || 'default'
}

// 获取操作按钮 (状态驱动)
const getActionButtons = (status) => {
  const buttonMap = {
    accepted: [
      { key: 'cancel', text: '取消', type: 'default', class: 'btn-cancel', icon: 'cross' },
      { key: 'load', text: '装货', type: 'primary', class: 'btn-load', icon: 'logistics' }
    ],
    loaded: [
      { key: 'report', text: '异常上报', type: 'default', class: 'btn-report', icon: 'warning-o' },
      { key: 'supplement', text: '补录凭证', type: 'warning', class: 'btn-supplement', icon: 'edit' },
      { key: 'unload', text: '卸货', type: 'primary', class: 'btn-unload', icon: 'underway-o' }
    ],
    unloaded: [
      { key: 'upload', text: '上传回单', type: 'primary', class: 'btn-upload', icon: 'photograph' },
      { key: 'confirm', text: '费用确认', type: 'success', class: 'btn-confirm', icon: 'passed' }
    ],
    verified: [
      { key: 'detail', text: '查看详情', type: 'default', class: 'btn-detail', icon: 'search' }
    ],
    settled: []
  }
  return buttonMap[status] || []
}

// 处理操作按钮点击
const handleAction = async (actionKey, order) => {
  switch (actionKey) {
    case 'cancel':
      await showDialog({
        title: '确认取消',
        message: `确定要取消运单 ${order.id} 吗？`
      })
      showToast('已取消运单')
      break
    
    case 'load':
      showToast('开始装货')
      break
    
    case 'report':
      showToast('异常上报')
      break
    
    case 'supplement':
      showToast('补录凭证')
      break
    
    case 'unload':
      showToast('开始卸货')
      break
    
    case 'upload':
      showToast('上传回单')
      break
    
    case 'confirm':
      showToast('费用确认')
      break
    
    case 'detail':
      showToast('查看详情')
      break
    
    default:
      showToast(`执行操作: ${actionKey}`)
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 显示筛选器
const showFilter = () => {
  showToast('筛选功能')
}

// 加载更多
const onLoad = () => {
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 1000)
}

// 切换角色 (测试用，实际应该从全局状态获取)
const toggleRole = () => {
  userRole.value = userRole.value === 'driver' ? 'shipOwner' : 'driver'
  showToast(`切换到${userRole.value === 'driver' ? '司机' : '船东'}角色`)
}

// 组件挂载时初始化
onMounted(() => {
  console.log('运单页面已加载')
  // 可以添加测试按钮来切换角色
  // setTimeout(() => {
  //   toggleRole()
  // }, 3000)
})

// 组装核心信息文本
const formatCoreInfo = (order) => {
  const unit = order.transportType.includes('金额') ? '' : (order.transportType.includes('重') ? ' 吨' : '')
  return `${order.transportType} ${order.price}${unit}`
}
</script>

<style scoped>
/**
 * 运单页面样式
 */

.yundan-container {
  min-height: 100vh;
  background: #f5f5f5;
  /* 页面级字体变量（仅影响当前页面） */
  --van-font-size-xs: 10px;
  --van-font-size-sm: 12px;
  --van-font-size-md: 14px;
  --van-font-size-lg: 16px;
  --van-nav-bar-title-font-size: 17px;
  --van-tab-font-size: 14px;
  --van-tag-font-size: 12px;
  --van-badge-font-size: 10px;
}

/* 顶部导航栏 */
.van-nav-bar {
  --van-nav-bar-background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.van-nav-bar :deep(.van-nav-bar__title) {
  font-size: var(--van-nav-bar-title-font-size);
  font-weight: 600;
}

/* Tab切换器 */
.van-tabs {
  background: white;
  --van-tabs-bottom-bar-color: #1989fa;
}

.van-tabs :deep(.van-tab) {
  position: relative;
  font-weight: 500;
}

.van-tabs :deep(.van-tab__text) {
  font-size: var(--van-tab-font-size);
}

.van-tabs :deep(.van-tab--active) {
  color: #1989fa;
  font-weight: 600;
}

/* 运单列表 */
.order-list {
  padding: 16px;
}

/* 运单卡片 */
.order-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 顶部状态角标优化 */
.status-tag {
  border: none;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-number {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 卡片内容 */
.card-content {
  margin-bottom: 12px;
}

/* 简要信息胶囊 */
.info-brief {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.pill {
  padding: 3px 8px;
  background: #f0f6ff;
  color: #3b82f6;
  border-radius: 999px;
  font-size: 12px;
}

/* 公司信息列表 */
.company-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.company-item {
  position: relative;
  padding-left: 14px;
  font-size: 13px;
  color: #333;
}

.company-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4da3ff;
}

/* 核心信息条 */
.core-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f7ff;
  border-radius: 10px;
  padding: 8px 10px;
  margin-bottom: 10px;
}

.core-icon {
  color: #4d79ff;
  font-size: 18px;
}

.core-text {
  flex: 1;
  margin: 0 8px;
  font-size: 13px;
  color: #263238;
  font-weight: 600;
}

.core-time {
  font-size: 12px;
  color: #9aa1a7;
}

/* 操作栏（图标 + 文案） */
.action-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 0;
  row-gap: 0;
  padding: 6px 4px 0 4px;
  border-top: 1px solid #f0f0f0;
}

/* 动态列数：两项时左右贴边，三项时平均分 */
.action-bar.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.action-bar.cols-1 {
  grid-template-columns: 1fr;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
}

.action-icon {
  font-size: 18px;
}

.action-text {
  font-size: 13px;
  color: #333;
}

.btn-cancel {
  --van-button-default-color: #ff4d4f;
  --van-button-default-border-color: #ff4d4f;
}

.btn-load, .btn-unload, .btn-upload {
  --van-button-primary-background: #1989fa;
}

.btn-supplement {
  --van-button-warning-background: #fa8c16;
}

.btn-confirm {
  --van-button-success-background: #52c41a;
}

.btn-report, .btn-detail {
  --van-button-default-color: #666;
  --van-button-default-border-color: #d9d9d9;
}

/* 空状态 */
.van-empty {
  padding: 60px 20px;
}

/* Tab标题和Badge样式 */
.tab-title-wrapper {
  display: inline-block;
  position: relative;
}

.tab-title-text {
  line-height: 1;
  display: inline-block;
}

/* 调整角标尺寸与位置，使其在标题右上角清晰可见 */
.tab-badge {
  display: inline-block;
}

.tab-badge :deep(.van-badge__content) {
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
  font-size: var(--van-badge-font-size);
  border-radius: 8px;
  border: 1px solid #fff;
}

/* 标签字体微调 */
.info-tags :deep(.van-tag),
.card-header :deep(.van-tag) {
  font-size: var(--van-tag-font-size);
}

/* 响应式适配 */
@media (max-width: 375px) {
  .order-card {
    padding: 12px;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }
  
  .info-tags {
    gap: 4px;
  }
}
</style>

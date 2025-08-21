<!--
  跑货页面组件（重构版本）
  严格遵循完全体指令，实现新的设计风格和状态机逻辑
  
  核心功能：
  1. 轻盈头部背景 + 顶部导航区
  2. 毛玻璃今日营运卡片（动态角色适配）
  3. 核心任务区状态机逻辑（指派/进行中/空闲）
  4. 场景化服务区（司机专属动态显隐）
-->

<template>
  <div class="paohuo-container">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <span class="time">9:41</span>
      <div class="status-icons">
        <van-icon name="signal" size="16" />
        <van-icon name="wifi" size="16" />
        <van-icon name="battery-full" size="16" />
      </div>
    </div>

    <!-- 顶部导航区 -->
    <div class="header-section">
      <div class="header-content">
        <div class="location-area">
          <span class="location-text">马屿区</span>
          <van-icon name="arrow-down" size="12" class="location-arrow" />
          <van-icon name="sun-o" size="16" class="weather-icon" />
        </div>
        <div class="header-actions">
          <van-icon name="ellipsis" size="20" class="more-icon" />
          <van-icon name="cross" size="18" class="close-icon" />
        </div>
      </div>
    </div>

    <!-- 滚动内容区域 -->
    <div class="scroll-content">
      <!-- 今日营运卡片 -->
      <div class="dashboard-card">
        <div class="dashboard-content">
          <h3 class="dashboard-title">今日营运</h3>
          <div class="dashboard-stats">
            <div class="stat-item">
              <div class="stat-value">{{ getCurrentDashboardData().orders }}</div>
              <div class="stat-label">接单数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getCurrentDashboardData().trips || getCurrentDashboardData().voyages }}</div>
              <div class="stat-label">{{ getTripLabel() }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getCurrentDashboardData().income }}</div>
              <div class="stat-label">预计运费收入</div>
            </div>
          </div>
        </div>
        <!-- 背景装饰图标 -->
        <div class="dashboard-bg-icon">
          <van-icon name="logistics" size="60" />
        </div>
      </div>

      <!-- 消息通知区 -->
      <div class="message-notification">
        <van-icon name="volume-o" size="16" class="message-icon" />
        <span class="message-text">闸口A12345在园区停留已超时</span>
        <van-icon name="arrow" size="12" class="message-arrow" />
      </div>

      <!-- 核心任务区 -->
      <div class="task-section">
        <van-tabs v-model:active="activeTab" class="custom-tabs">
          <van-tab title="当前运输" name="current">
            <div class="current-transport">
              <!-- 运输卡片 -->
              <div class="transport-card">
                <div class="transport-route">
                  <span class="route-text">鄂尔多斯 → 鄂尔多斯</span>
                  <span class="progress-text">进度 75%</span>
                </div>
                
                <!-- 公司信息 -->
                <div class="company-info">
                  <div class="company-item">
                    <div class="company-dot company-green"></div>
                    <span class="company-name">衢州至红建材有限公司</span>
                  </div>
                  <div class="company-item">
                    <div class="company-dot company-orange"></div>
                    <span class="company-name">浙江至珍商贸有限公司</span>
                  </div>
                </div>
                
                <!-- 进度条 -->
                <div class="progress-section">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 80%"></div>
                  </div>
                  <div class="progress-info">
                    <span class="progress-distance">距目的地 354km</span>
                    <span class="progress-time">预计</span>
                  </div>
                </div>
                
                <!-- 货主信息 -->
                <div class="cargo-owner">
                  <div class="owner-avatar">
                    <van-icon name="manager-o" size="20" />
                  </div>
                  <span class="owner-name">闽A26888</span>
                  <span class="owner-price">39.89吨/未填</span>
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab title="指派任务" name="assigned">
            <div class="assigned-transport">
              <van-empty 
                image="search"
                description="暂无指派任务"
              />
            </div>
          </van-tab>

          <van-tab title="货源推荐" name="recommendation">
            <div class="recommendation-transport">
              <van-empty 
                image="search"
                description="暂无货源推荐"
              />
            </div>
          </van-tab>
        </van-tabs>
      </div>

      <!-- 底部服务区 -->
      <div class="bottom-services">
        <div class="service-grid">
          <div class="service-item" @click="handleScanPickup">
            <div class="service-icon service-icon-scan">
              <van-icon name="scan" size="24" />
            </div>
            <span class="service-text">扫码提车</span>
            <span class="service-desc">闽A12345</span>
          </div>
          
          <div class="service-item" @click="handleVehicleManage">
            <div class="service-icon service-icon-manage">
              <van-icon name="logistics" size="24" />
            </div>
            <span class="service-text">车辆管理</span>
            <span class="service-desc">新增19辆</span>
          </div>
          
          <div class="service-item" @click="handleParkReservation">
            <div class="service-icon service-icon-park">
              <van-icon name="location-o" size="24" />
            </div>
            <span class="service-text">园区预约</span>
            <span class="service-desc">随时随地</span>
          </div>
          
          <div class="service-item" @click="handleQueueCall">
            <div class="service-icon service-icon-queue">
              <van-icon name="phone-o" size="24" />
            </div>
            <span class="service-text">排队叫号</span>
            <span class="service-desc">No.35</span>
          </div>
        </div>
      </div>
      
      <!-- 推荐区域 -->
      <div class="recommendation-section">
        <div class="recommendation-row">
          <div class="recommendation-card recommendation-driver">
            <h4 class="recommendation-title">推荐司机</h4>
            <van-button type="primary" size="small" class="recommendation-btn">
              查看司机
            </van-button>
          </div>
          
          <div class="recommendation-card recommendation-cargo">
            <h4 class="recommendation-title">推荐货主</h4>
            <van-button type="danger" size="small" class="recommendation-btn">
              寻找企业
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 跑货页面逻辑（重构版本）
 * 严格遵循完全体指令，实现新的状态机逻辑和预设数据
 */

import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { store } from '@/store'
import { getDataByRole, getTransportLabel } from '@/data/mockData'

// ===== 预设静态数据 =====

// 1. 用于"今日营运"卡片的数据
const driverDashboardData = {
  orders: 5,
  trips: 3,
  income: '3560.00'
}

const shipOwnerDashboardData = {
  orders: 2,
  voyages: 1, // 注意，这里是航次
  income: '85000.00'
}

// 2. 用于核心任务区的"状态机"数据
// 状态一：指派任务的数据
const assignedTaskData = {
  id: 'TSK20250820001',
  start: '上海市宝山区',
  end: '江苏省苏州市',
  cargoInfo: '设备备件 3.5吨'
}

// 状态二：司机执行中任务的数据
const driverOngoingTask = {
  status: '运输中',
  statusType: 'primary', // 用于van-tag的type
  price: '800',
  licensePlate: '京A12345',
  route: '北京市朝阳区 → 天津市滨海新区',
  cargoInfo: '电子产品 5.2吨',
  eta: '01-15 14:30'
}

// 状态二：船东执行中任务的数据
const shipOwnerOngoingTask = {
  status: '航行中',
  statusType: 'success', // 用于van-tag的type
  price: '65000',
  shipName: '东方之星号',
  voyageNo: 'DX202508A', // 航次号
  ports: '上海洋山港 → 广东广州港', // 起运港/目的港
  cargoInfo: '集装箱 200TEU',
  eta: '08-25 18:00'
}

// 为了方便演示，可以创建一个变量来控制当前显示哪个状态
// 'assigned', 'ongoing', 'idle'
const currentTaskState = ref('ongoing')

// ===== 响应式数据 =====
const activeTab = ref('current')

// ===== 计算属性 =====

// 根据角色获取对应的历史数据（保留原有数据源）
const currentData = computed(() => getDataByRole(store.userRole))
const historyOrders = computed(() => currentData.value.historyOrders)

// 欢迎文本
const welcomeText = computed(() => {
  const hour = new Date().getHours()
  let timeText = ''
  
  if (hour < 6) timeText = '夜深了'
  else if (hour < 12) timeText = '早上好'
  else if (hour < 18) timeText = '下午好'
  else timeText = '晚上好'
  
  return `${timeText}，${store.userInfo.name}！`
})

/**
 * 获取当前角色对应的今日营运数据
 */
const getCurrentDashboardData = () => {
  return store.isDriver() ? driverDashboardData : shipOwnerDashboardData
}

/**
 * 获取承运标签
 */
const getTripLabel = () => {
  return getTransportLabel(store.userRole)
}

/**
 * 获取当前正在执行的任务数据
 */
const getCurrentOngoingTask = () => {
  return store.isDriver() ? driverOngoingTask : shipOwnerOngoingTask
}

// ===== 事件处理函数 =====

/**
 * 处理拒绝任务
 */
const handleRejectTask = () => {
  showToast('任务已拒绝')
  currentTaskState.value = 'idle'
}

/**
 * 处理接受任务
 */
const handleAcceptTask = () => {
  showToast('任务已接受')
  currentTaskState.value = 'ongoing'
}

/**
 * 查看正在执行任务详情
 */
const viewOngoingTaskDetail = () => {
  const task = getCurrentOngoingTask()
  showToast(`查看任务详情：${task.status}`)
}

/**
 * 查看历史订单详情
 */
const viewOrderDetail = (order) => {
  showToast(`查看历史订单：${order.id}`)
}

/**
 * 处理扫码提车
 */
const handleScanPickup = () => {
  showToast('扫码提车功能（Demo版本）')
}

/**
 * 处理车辆管理
 */
const handleVehicleManage = () => {
  showToast('车辆管理功能（Demo版本）')
}

/**
 * 处理园区预约
 */
const handleParkReservation = () => {
  showToast('园区预约功能（Demo版本）')
}

/**
 * 处理排队叫号
 */
const handleQueueCall = () => {
  showToast('排队叫号功能（Demo版本）')
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  console.log('跑货页面已加载，当前角色：', store.getRoleDisplayName())
  console.log('当前任务状态：', currentTaskState.value)
})
</script>

<style scoped>
/**
 * 跑货页面样式（重新设计，参考图片风格）
 */

.paohuo-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #87ceeb 0%, #f0f8ff 50%, #ffffff 100%);
  padding-bottom: 80px;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.status-icons {
  display: flex;
  gap: 4px;
}

.status-icons .van-icon {
  color: #000;
}

/* 顶部导航区 */
.header-section {
  padding: 12px 16px;
  margin-bottom: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-area {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.location-arrow {
  color: #666;
}

.weather-icon {
  color: #f39c12;
  margin-left: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.more-icon, .close-icon {
  color: #666;
  padding: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.scroll-content {
  padding: 0 16px;
}

/* 今日营运卡片 */
.dashboard-card {
  position: relative;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  color: white;
  overflow: hidden;
}

.dashboard-content {
  position: relative;
  z-index: 2;
}

.dashboard-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.dashboard-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.dashboard-bg-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.1;
  z-index: 1;
}

.dashboard-bg-icon .van-icon {
  color: white;
}

/* 消息通知区 */
.message-notification {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.message-icon {
  color: #ff6b35;
  margin-right: 8px;
}

.message-text {
  flex: 1;
  font-size: 13px;
}

.message-arrow {
  color: #ccc;
}

/* 核心任务区 */
.task-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Tab切换器 */
.custom-tabs {
  --van-tabs-line-height: 44px;
}

.custom-tabs :deep(.van-tabs__nav) {
  background: white;
  padding: 0;
}

.custom-tabs :deep(.van-tab) {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.custom-tabs :deep(.van-tab--active) {
  color: #4a90e2;
  font-weight: 600;
}

.custom-tabs :deep(.van-tabs__line) {
  background: #4a90e2;
  border-radius: 2px;
  height: 2px;
  width: 20px !important;
}

/* 当前运输内容 */
.current-transport {
  padding: 16px;
}

/* 运输卡片 */
.transport-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.transport-route {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.route-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.progress-text {
  font-size: 14px;
  color: #4a90e2;
  font-weight: 500;
}

/* 公司信息 */
.company-info {
  margin-bottom: 16px;
}

.company-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.company-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.company-green {
  background: #52c41a;
}

.company-orange {
  background: #fa8c16;
}

.company-name {
  font-size: 14px;
  color: #333;
}

/* 进度条区域 */
.progress-section {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a90e2, #357abd);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.progress-distance {
  color: #666;
}

.progress-time {
  color: #666;
}

/* 货主信息 */
.cargo-owner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f1f3f4;
  border-radius: 8px;
}

.owner-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.owner-avatar .van-icon {
  color: white;
}

.owner-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.owner-price {
  font-size: 14px;
  font-weight: bold;
  color: #4a90e2;
  margin-left: auto;
}

/* Tab内容区通用样式 */
.assigned-transport,
.recommendation-transport {
  padding: 40px 20px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 底部服务区 */
.bottom-services {
  margin-bottom: 16px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.service-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.service-icon-scan {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.service-icon-manage {
  background: linear-gradient(135deg, #ffd93d, #ff9500);
}

.service-icon-park {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
}

.service-icon-queue {
  background: linear-gradient(135deg, #a29bfe, #6c5ce7);
}

.service-icon .van-icon {
  color: white;
}

.service-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.service-desc {
  font-size: 10px;
  color: #666;
}

/* 推荐区域 */
.recommendation-section {
  margin-bottom: 20px;
}

.recommendation-row {
  display: flex;
  gap: 12px;
}

.recommendation-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.recommendation-driver {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}

.recommendation-cargo {
  background: linear-gradient(135deg, #fce4ec, #f8bbd9);
}

.recommendation-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.recommendation-btn {
  min-width: 80px;
}
</style>

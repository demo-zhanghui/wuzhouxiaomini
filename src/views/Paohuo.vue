<!--
  个人空间首页 - 完全重建版本
  核心特性：
  1. 角色驱动的动态内容适配
  2. 容器归一化的统一布局
  3. 紧凑高效的驾驶舱风格
  4. 隔离容器 + 嵌套Flexbox + 强制覆盖Vant样式
-->

<template>
  <div class="cockpit-page">
    <!-- A. 背景层：纯粹展示的渐变背景 -->
    <div class="header-background"></div>
    
    <!-- B. 唯一内容包裹层：贯穿整个页面的内容容器 -->
    <div class="content-wrapper">
      
      <!-- 模块一：顶部信息区 (非卡片) -->
      <div class="top-info-section">
        <div class="location-info">
          <van-icon name="location-o" class="info-icon" />
          <span class="info-text">福州市</span>
        </div>
        <div class="weather-info">
          <van-icon name="cloudy-o" class="info-icon" />
          <span class="info-text">28℃ 多云</span>
        </div>
      </div>

      <!-- 模块二："运输任务"数据卡片 -->
      <div class="glass-card task-metrics">
        <van-grid :column-num="3" :border="false" class="metrics-grid">
          <van-grid-item>
            <div class="metric-item">
              <div class="metric-value">{{ dashboard.orders }}</div>
              <div class="metric-label">运单</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div class="metric-item">
              <div class="metric-value">{{ secondMetricValue }}</div>
              <div class="metric-label">{{ secondMetricLabel }}</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div class="metric-item">
              <div class="metric-value">{{ dashboard.exceptions || 0 }}</div>
              <div class="metric-label">异常</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 模块三："主推运单"卡片 -->
      <div class="content-card featured-order">
        <div class="card-header">
          <div class="order-info">
            <div class="order-group-left">
              <div class="order-number-line">
                <span class="order-label">运单号:</span>
                <span class="order-number">{{ featured.orderNo }}</span>
              </div>
            </div>
            
            <div class="right-section">
              <div class="cargo-tag">
                <span>{{ featured.cargoType }}</span>
              </div>
              <div class="price-text">
                <span class="price-value">{{ featured.price }}</span>
                <span class="price-unit">{{ featured.priceUnit }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-content">
          <div class="route-section">
            <div class="route-line">
              <span class="start-point">{{ featured.origin }}</span>
              <div class="route-arrow">
                <div class="arrow-line"></div>
                <div class="arrow-head">→</div>
              </div>
              <span class="end-point">{{ featured.destination }}</span>
            </div>
          </div>
          
          <div class="details-section">
            <p class="transport-details">{{ featured.details }}</p>
            <p class="vehicle-info">{{ isDriver ? '车牌号: ' + featured.licensePlate : '船舶名/航次号: ' + featured.shipName + ' / ' + featured.voyageNo }}</p>
          </div>
        </div>
        
        <div class="card-actions">
          <div class="action-buttons">
            <van-button size="small" plain type="default" class="action-btn">更多</van-button>
            <van-button size="small" plain type="danger" class="action-btn">取消运单</van-button>
            <van-button size="small" type="primary" class="action-btn primary-btn">{{ isDriver ? '立即装货' : '立即装货' }}</van-button>
          </div>
        </div>
      </div>

      <!-- 模块四："快捷操作"区 -->
      <div class="quick-actions-section">
        <div class="actions-container">
          <div class="action-btn qa-blue">扫码接单</div>
          <div class="action-btn qa-green">出收车打卡</div>
          <div v-if="isDriver" class="action-btn qa-cyan">入场预约</div>
          <div v-else class="action-btn qa-purple">港口服务</div>
        </div>
      </div>

      <!-- 模块五："我的运单"区 -->
      <div class="content-card my-orders">
        <div class="section-title">我的运单</div>
        <van-tabs v-model:active="activeTab" class="orders-tabs">
          <van-tab title="全部" name="all" />
          <van-tab title="已接单" name="received" />
          <van-tab title="已装货" name="loaded" />
          <van-tab title="已卸货" name="unloaded" />
        </van-tabs>
        
        <div class="orders-list">
          <van-list :finished="true" finished-text="已加载全部" class="list-container">
            <div v-for="item in currentOrders" :key="item.id" class="order-card">
              <!-- A. 卡片头部 -->
              <div class="order-header">
                <div class="order-id">
                  <span class="order-id-label">运单号:</span>
                  <span class="order-id-value">{{ item.id }}</span>
                </div>
                <van-tag type="primary" size="small" class="status-tag">{{ item.status }}</van-tag>
              </div>
              
              <!-- B. 信息标签行 -->
              <div class="tags-row">
                <van-tag 
                  v-for="tag in item.tags" 
                  :key="tag" 
                  type="default" 
                  plain 
                  round 
                  size="small"
                  class="info-tag"
                >
                  {{ tag }}
                </van-tag>
              </div>
              
              <!-- C. 起止地信息 -->
              <div class="locations-info">
                <ul class="location-list">
                  <li class="location-item">
                    <span class="location-label">起运地:</span>
                    <span class="location-value">{{ item.origin }}</span>
                  </li>
                  <li class="location-item">
                    <span class="location-label">目的地:</span>
                    <span class="location-value">{{ item.destination }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- D. 信息汇总栏 -->
              <div class="summary-bar">
                <div class="summary-left">
                  <van-icon :name="item.summaryIcon" class="summary-icon" />
                  <span class="summary-status">{{ item.summaryStatus }}</span>
                  <span class="summary-value">{{ item.summaryValue }}</span>
                </div>
                <div class="summary-right">
                  <span class="summary-date">{{ item.summaryDate }}</span>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store } from '@/store'

// 角色标识
const isDriver = computed(() => store.userRole === 'driver')

// 1. 司机 ('driver') 角色数据
const driverDashboardData = { orders: 3, trips: 2, exceptions: 1, income: '9999.99' }
const featuredDriverTask = {
  orderNo: '12345678910111213',
  cargoType: '普货',
  price: '35',
  priceUnit: '元/吨',
  origin: '福州 仓山',
  destination: '香港 铜锣湾',
  details: '预计运输总里程: 300km | 3个装货点 | 2个卸货点',
  licensePlate: '闽A·K00993D'
}
// 【关键】用于"我的运单"列表的全新数据结构
const driverOrders = [
  {
    id: 'D20250821001',
    status: '已接单',
    tags: ['梧峰', '区仓库', '明天0-12点装货'],
    origin: '衢州宝红建材有限公司',
    destination: '浙江宝红商品仓有限公司',
    summaryIcon: 'wap-home-o',
    summaryStatus: '已接单',
    summaryValue: '240',
    summaryDate: '02-14 15:54',
    licensePlate: '闽A·K00993D'
  },
  {
    id: 'D20250821002',
    status: '已装货',
    tags: ['长协', '建材', '明天12-18点装货'],
    origin: '厦门同安建材市场',
    destination: '深圳盐田港',
    summaryIcon: 'logistics',
    summaryStatus: '已装货',
    summaryValue: '18',
    summaryDate: '02-15 10:30',
    licensePlate: '闽A·A77777'
  }
]

// 2. 船东 ('shipOwner') 角色数据
const shipOwnerDashboardData = { orders: 5, voyages: 3, exceptions: 2, income: '88888.88' }
const featuredShipOwnerTask = {
  orderNo: '98765432109876543',
  cargoType: '集装箱',
  price: '80',
  priceUnit: '元/箱',
  origin: '厦门港',
  destination: '新加坡港',
  details: '预计总航程: 1800海里 | 1个装货港 | 1个卸货港',
  shipName: '东方之星号',
  voyageNo: 'DX202509A'
}
// 【关键】用于"我的运单"列表的全新数据结构
const shipOwnerOrders = [
  {
    id: 'S20250821001',
    status: '已装货',
    tags: ['长协', '外贸', '20GP'],
    origin: '厦门远海码头',
    destination: '新加坡港PSA码头',
    summaryIcon: 'logistics',
    summaryStatus: '已装货',
    summaryValue: '120TEU',
    summaryDate: '02-15 18:00',
    shipName: '东方之星号',
    voyageNo: 'DX202508A'
  },
  {
    id: 'S20250821002',
    status: '已接单',
    tags: ['散货', '内贸', '40GP'],
    origin: '福州港马尾港区',
    destination: '香港港葵青货柜码头',
    summaryIcon: 'wap-home-o',
    summaryStatus: '已接单',
    summaryValue: '8000',
    summaryDate: '02-16 09:15',
    shipName: '海洋之心号',
    voyageNo: 'HY202508B'
  }
]

// 动态绑定
const dashboard = computed(() => (isDriver.value ? driverDashboardData : shipOwnerDashboardData))
const featured = computed(() => (isDriver.value ? featuredDriverTask : featuredShipOwnerTask))
const allOrders = computed(() => (isDriver.value ? driverOrders : shipOwnerOrders))

// 运输任务毛玻璃第二项的值与标签
const secondMetricValue = computed(() => (isDriver.value ? dashboard.value.trips : dashboard.value.voyages))
const secondMetricLabel = computed(() => (isDriver.value ? '趟数' : '航次'))

// 我的运单 Tab
const activeTab = ref('all')
const currentOrders = computed(() => allOrders.value)
</script>

<style scoped>
/* 全局样式重置和基础设置 */
.cockpit-page {
  min-height: 100vh;
  background: #f7f8fa;
  position: relative;
  overflow-x: hidden;
}

/* A. 背景层：纯粹展示的渐变背景 */
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, #e6f2ff 0%, #f7f8fa 100%);
  z-index: 1;
}

/* B. 唯一内容包裹层：贯穿整个页面的内容容器 */
.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 0 16px;
  box-sizing: border-box;
  width: 100%;
}

/* 模块一：顶部信息区 (非卡片) */
.top-info-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 16px; /* 减少padding */
}

.location-info,
.weather-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-icon {
  color: #4a90e2;
  font-size: 16px; /* 稍微减小图标大小 */
}

.info-text {
  font-size: 15px; /* 稍微减小字体 */
  font-weight: 600;
  color: #2b2f36;
}

/* 模块二："运输任务"数据卡片 */
.glass-card {
  position: relative;
  border-radius: 12px; /* 稍微减小圆角 */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(28, 43, 64, 0.12); /* 稍微减小阴影 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 12px; /* 减少底部间距 */
  overflow: hidden;
}

.task-metrics {
  padding: 12px; /* 减少padding */
}

.metrics-grid {
  width: 100% !important;
  box-sizing: border-box !important;
}

.metric-item {
  text-align: center;
  height: 50px; /* 减少高度从60px到50px */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px; /* 减少padding */
  box-sizing: border-box;
}

.metric-value {
  font-size: 22px; /* 稍微减小字体从24px到22px */
  font-weight: 700;
  color: #1f2d3d;
  line-height: 1.1; /* 减少行高 */
  margin-bottom: 3px; /* 减少底部间距 */
}

.metric-label {
  font-size: 12px; /* 稍微减小字体从13px到12px */
  color: #6b7683;
  font-weight: 500;
  line-height: 1.1; /* 减少行高 */
}

/* 模块三："主推运单"卡片 */
.content-card {
  background: #ffffff;
  border-radius: 12px; /* 稍微减小圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 稍微减小阴影 */
  margin-bottom: 12px; /* 减少底部间距 */
  overflow: hidden;
}

.featured-order {
  padding: 12px; /* 减少padding从16px到12px */
}

.card-header {
  margin-bottom: 12px; /* 减少底部间距从16px到12px */
}

.order-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f9ff;
  padding: 10px 14px; /* 减少padding */
  border-radius: 10px; /* 稍微减小圆角 */
  border: 1px solid #e1f5fe;
  min-height: 45px; /* 减少最小高度从50px到45px */
  width: 100%;
  box-sizing: border-box;
}

.order-group-left {
  display: flex;
  align-items: center;
  gap: 10px; /* 减少间距从12px到10px */
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.right-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px; /* 减少间距从12px到10px */
  flex-shrink: 0;
}

.order-number-line {
  display: flex;
  align-items: center;
  gap: 6px; /* 减少间距从8px到6px */
  white-space: nowrap;
}

.order-label {
  font-size: 13px; /* 稍微减小字体从14px到13px */
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.order-number {
  font-size: 13px; /* 稍微减小字体从14px到13px */
  color: #1f2d3d;
  font-weight: 600;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  white-space: nowrap;
}

.cargo-tag {
  background: #e6f2ff;
  padding: 3px 8px; /* 减少padding */
  border-radius: 5px; /* 稍微减小圆角 */
  border: 1px solid #d1e9ff;
  font-size: 11px; /* 稍微减小字体从12px到11px */
  color: #3498db;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  text-align: center;
  min-width: 45px; /* 减少最小宽度从50px到45px */
}

/* 【关键】价格展示：纯文本形式，不使用独立卡片 */
.price-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
}

.price-value {
  font-size: 20px; /* 稍微减小字体从22px到20px */
  font-weight: 700;
  color: #ff4757;
  line-height: 1;
  margin-bottom: 2px;
}

.price-unit {
  font-size: 9px; /* 稍微减小字体从10px到9px */
  color: #666;
  font-weight: 500;
}

.card-content {
  margin-bottom: 12px; /* 减少底部间距从16px到12px */
}

.route-section {
  margin-bottom: 10px; /* 减少底部间距从12px到10px */
}

.route-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0; /* 减少padding从12px到10px */
}

.start-point,
.end-point {
  font-size: 17px; /* 稍微减小字体从18px到17px */
  font-weight: 600;
  color: #1f2d3d;
  flex: 1;
}

.start-point {
  text-align: left;
}

.end-point {
  text-align: right;
}

.route-arrow {
  display: flex;
  align-items: center;
  flex: 0 0 70px; /* 减少宽度从80px到70px */
  justify-content: center;
  position: relative;
}

.arrow-line {
  width: 50px; /* 减少宽度从60px到50px */
  height: 2px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 1px;
}

.arrow-head {
  position: absolute;
  right: 0;
  font-size: 15px; /* 稍微减小字体从16px到15px */
  color: #3498db;
  font-weight: 600;
}

.details-section {
  border-top: 1px solid #f5f7fa;
  padding-top: 10px; /* 减少padding从12px到10px */
}

.transport-details {
  font-size: 12px; /* 稍微减小字体从13px到12px */
  color: #6b7683;
  line-height: 1.3; /* 减少行高 */
  margin: 0 0 6px 0; /* 减少底部间距从8px到6px */
}

.vehicle-info {
  font-size: 11px; /* 稍微减小字体从12px到11px */
  color: #8a9199;
  margin: 0;
}

.card-actions {
  border-top: 1px solid #f5f7fa;
  padding-top: 12px; /* 减少padding从16px到12px */
}

.action-buttons {
  display: flex;
  gap: 8px; /* 减少间距从10px到8px */
  align-items: center;
}

.action-btn {
  font-size: 12px; /* 稍微减小字体从13px到12px */
  height: 32px; /* 减少高度从36px到32px */
  border-radius: 8px; /* 稍微减小圆角 */
  flex: 1;
  min-width: 0;
}

.action-btn:first-child {
  flex: 0.8;
}

.action-btn.primary-btn {
  flex: 1.3;
  background: #3498db !important;
  border-color: #3498db !important;
  font-weight: 600;
}

/* 模块四："快捷操作"区 */
.quick-actions-section {
  margin: 12px 0; /* 减少间距从16px到12px */
}

.actions-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px; /* 减少间距从15px到12px */
}

.action-btn {
  display: block;
  text-align: center;
  padding: 12px 18px; /* 减少padding */
  border-radius: 12px; /* 稍微减小圆角 */
  color: #1f2d3d;
  font-weight: 700;
  background: #f5f7fa;
  border: none;
  max-width: 150px; /* 稍微减小最大宽度 */
  margin: 0 auto;
  font-size: 12px; /* 稍微减小字体从13px到12px */
  transition: all 0.2s ease;
  box-sizing: border-box;
  cursor: pointer;
}

.action-btn:active {
  transform: scale(0.98);
}

.qa-blue { background: #e6f1ff; }
.qa-green { background: #e5fbef; }
.qa-cyan { background: #e8fbff; }
.qa-purple { background: #f3ebff; }

/* 模块五："我的运单"区 */
.my-orders {
  padding-bottom: 12px; /* 减少padding从16px到12px */
}

.section-title {
  padding: 14px 16px 10px; /* 减少padding */
  font-size: 17px; /* 稍微减小字体从18px到17px */
  font-weight: 700;
  color: #1f2d3d;
}

.orders-tabs {
  width: 100% !important;
  box-sizing: border-box !important;
}

.orders-list {
  padding: 10px 16px 12px; /* 减少padding */
}

.list-container {
  width: 100% !important;
  box-sizing: border-box !important;
}

/* 【核心】列表项卡片重构 */
.order-card {
  border: 1px solid #eef2f7;
  border-radius: 10px; /* 稍微减小圆角 */
  overflow: hidden;
  margin-bottom: 10px; /* 减少底部间距从12px到10px */
  background: #ffffff;
  padding: 12px; /* 减少padding从16px到12px */
}

/* A. 卡片头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* 减少底部间距从12px到10px */
}

.order-id {
  display: flex;
  align-items: center;
  gap: 5px; /* 减少间距从6px到5px */
}

.order-id-label {
  font-size: 11px; /* 稍微减小字体从12px到11px */
  color: #5e6a73;
}

.order-id-value {
  font-size: 13px; /* 稍微减小字体从14px到13px */
  color: #1989fa;
  font-weight: 600;
}

.status-tag {
  font-size: 10px; /* 稍微减小字体从11px到10px */
}

/* B. 信息标签行 */
.tags-row {
  display: flex;
  gap: 6px; /* 减少间距从8px到6px */
  margin-bottom: 10px; /* 减少底部间距从12px到10px */
  flex-wrap: wrap;
}

.info-tag {
  font-size: 10px; /* 稍微减小字体从11px到10px */
  padding: 3px 6px; /* 减少padding */
}

/* C. 起止地信息 */
.locations-info {
  margin-bottom: 10px; /* 减少底部间距从12px到10px */
}

.location-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.location-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px; /* 减少底部间距从6px到5px */
  font-size: 12px; /* 稍微减小字体从13px到12px */
}

.location-item::before {
  content: "•";
  color: #3498db;
  font-weight: bold;
  margin-right: 6px; /* 减少右边距从8px到6px */
  font-size: 15px; /* 稍微减小字体从16px到15px */
}

.location-label {
  color: #5e6a73;
  margin-right: 6px; /* 减少右边距从8px到6px */
  min-width: 55px; /* 稍微减小最小宽度从60px到55px */
}

.location-value {
  color: #1f2d3d;
  font-weight: 500;
}

/* D. 信息汇总栏 */
.summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px; /* 减少padding从12px到10px */
  background: #f8f9fa;
  border-radius: 6px; /* 稍微减小圆角 */
  border: 1px solid #e9ecef;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 4px; /* 减少间距从5px到4px */
}

.summary-icon {
  color: #3498db;
  font-size: 13px; /* 稍微减小字体从14px到13px */
}

.summary-status {
  font-size: 11px; /* 稍微减小字体从12px到11px */
  color: #6b7683;
}

.summary-value {
  font-size: 13px; /* 稍微减小字体从14px到13px */
  color: #1f2d3d;
  font-weight: 600;
}

.summary-right {
  flex-shrink: 0;
}

.summary-date {
  font-size: 10px; /* 稍微减小字体从11px到10px */
  color: #8a9199;
}

/* 强制覆盖Vant默认样式 */
:deep(.van-grid) {
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.van-grid-item) {
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.van-tabs) {
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.van-list) {
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.van-tabs__nav) {
  background: #ffffff !important;
}

:deep(.van-tab) {
  font-size: 14px !important;
}

:deep(.van-tag) {
  border-radius: 6px !important;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .content-wrapper {
    padding: 0 12px;
  }
  
  .action-btn {
    max-width: 140px;
    padding: 12px 16px;
  }
  
  .order-card {
    padding: 12px;
  }
}
</style>


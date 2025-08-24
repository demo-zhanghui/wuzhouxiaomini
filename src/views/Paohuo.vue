<template>
  <div class="cockpit-page">
    <!-- 第一项：增补页面顶部的内容 (营造场景氛围) -->
    <div class="header-gradient">
      <div class="header-inner">
        <div class="header-left">
          <van-icon name="location-o" class="loc-icon" />
          <span class="location-text">福州市</span>
        </div>
        <div class="header-right">
          <div class="weather-info">
            <van-icon name="cloudy-o" class="weather-icon" />
            <span class="weather-temp">28℃</span>
            <span class="weather-desc">多云</span>
          </div>
        </div>
      </div>

      <!-- 第一项：顶部的"运输任务"数据卡片 -->
      <div class="glass-card task-metrics">
        <van-grid :column-num="3" :border="false">
          <van-grid-item>
            <div class="metric">
              <div class="metric-value">{{ secondMetricValue }}</div>
              <div class="metric-label">{{ secondMetricLabel }}</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div class="metric">
              <div class="metric-value">{{ dashboard.orders }}</div>
              <div class="metric-label">运单</div>
            </div>
          </van-grid-item>
          <van-grid-item>
            <div class="metric">
              <div class="metric-value">{{ dashboard.exceptions || 0 }}</div>
              <div class="metric-label">异常</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>

    <div class="content-wrap">
      <!-- 第二项：中间的"主推运单"卡片 -->
      <div class="card featured-order">
        <div class="card-header">
          <!-- 订单信息区域 -->
          <div class="order-info">
            <div class="order-group-left">
              <div class="order-number-line">
                <span class="order-label">运单号:</span>
                <span class="order-number">{{ featured.orderNo }}</span>
              </div>
              <div class="cargo-tag">
                <span>{{ featured.cargoType }}</span>
              </div>
            </div>
            
            <div class="price-tag">
              <span class="price-value">{{ featured.price }}</span>
              <span class="price-unit">{{ featured.priceUnit }}</span>
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

      <!-- 第三项：下方的"快捷操作"区域 -->
      <div class="quick-actions">
        <div class="quick-actions-container">
          <van-grid :column-num="2" :gutter="12" :border="false">
            <van-grid-item>
              <div class="qa-btn qa-blue">扫码接单</div>
            </van-grid-item>
            <van-grid-item>
              <div class="qa-btn qa-green">出收车打卡</div>
            </van-grid-item>
            <van-grid-item v-if="isDriver">
              <div class="qa-btn qa-cyan">入场预约</div>
            </van-grid-item>
            <van-grid-item v-else>
              <div class="qa-btn qa-purple">港口服务</div>
            </van-grid-item>
          </van-grid>
        </div>
      </div>

      <!-- 我的运单区 -->
      <div class="card my-orders">
        <div class="section-title">我的运单</div>
        <van-tabs v-model:active="activeTab" class="orders-tabs">
          <van-tab title="全部" name="all" />
          <van-tab title="已接单" name="received" />
          <van-tab title="已装货" name="loaded" />
          <van-tab title="已卸货" name="unloaded" />
        </van-tabs>
        <div class="orders-list">
          <van-list :finished="true" finished-text="已加载全部">
            <div v-for="item in currentOrders" :key="item.id" class="order-item">
              <div class="oi-head">
                <span class="oi-title">{{ isDriver ? '车牌号' : '船舶名' }}</span>
                <span class="oi-value">{{ isDriver ? item.plateNumber : item.shipName }}</span>
              </div>
              <div class="oi-body">
                <div class="oi-route">
                  <span class="oi-origin">{{ isDriver ? item.origin : item.departurePort }}</span>
                  <span class="oi-arrow">→</span>
                  <span class="oi-dest">{{ isDriver ? item.destination : item.arrivalPort }}</span>
                </div>
                <div class="oi-extra">
                  <span class="oi-cargo">{{ item.cargoInfo }}</span>
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

// 预设静态数据（严格按需求）
// 1. 司机角色的数据
const driverDashboardData = { orders: 3, trips: 2, exceptions: 1 }
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
const driverOrders = [
  { id: 'D001', plateNumber: '闽A·K00993D', origin: '福州 仓山', destination: '香港 铜锣湾', cargoInfo: '普货 35吨' },
  { id: 'D002', plateNumber: '闽A·A77777', origin: '厦门 同安', destination: '深圳 盐田', cargoInfo: '建材 18吨' }
]

// 2. 船东角色的数据
const shipOwnerDashboardData = { orders: 5, voyages: 3, exceptions: 2 }
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
const shipOwnerOrders = [
  { id: 'S001', shipName: '东方之星号', departurePort: '厦门港', arrivalPort: '新加坡港', cargoInfo: '集装箱 120TEU' },
  { id: 'S002', shipName: '海洋之心号', departurePort: '福州港', arrivalPort: '香港港', cargoInfo: '散货 8000吨' }
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
.cockpit-page {
  min-height: 100vh;
  background: #f7f8fa;
  /* 添加统一的容器约束 */
  max-width: 100%;
  overflow-x: hidden;
}

/* 第一项：增补页面顶部的内容 (营造场景氛围) */
.header-gradient {
  position: relative;
  padding: 16px 16px 100px; /* 统一左右边距为16px */
  background: linear-gradient(180deg, #e6f2ff 0%, #f7f8fa 100%);
  /* 确保容器宽度一致 */
  width: 100%;
  box-sizing: border-box;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px; /* 添加底部间距 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.loc-icon {
  color: #4a90e2;
  font-size: 18px;
}

.location-text {
  font-size: 16px;
  font-weight: 600;
  color: #2b2f36;
}

.header-right {
  display: flex;
  align-items: center;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.weather-icon {
  color: #4a90e2;
  font-size: 16px;
}

.weather-temp {
  font-size: 15px;
  font-weight: 600;
  color: #2b2f36;
}

.weather-desc {
  font-size: 13px;
  color: #6b7683;
  font-weight: 500;
}

/* 第一项：顶部的"运输任务"毛玻璃数据卡片 */
.glass-card {
  position: absolute;
  left: 16px; /* 统一左边距 */
  right: 16px; /* 统一右边距 */
  bottom: -30px; /* 进一步减少底部偏移，最小化与主推运单的间距 */
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(28, 43, 64, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* 确保宽度计算正确 */
  width: calc(100% - 32px);
  box-sizing: border-box;
}

.task-metrics {
  padding: 20px 16px;
}

.metric {
  text-align: center;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
  box-sizing: border-box;
}

.metric-value {
  font-size: 24px; /* 增大字体 */
  font-weight: 700;
  color: #1f2d3d;
  line-height: 1.2;
  margin-bottom: 6px;
}

.metric-label {
  font-size: 14px; /* 增大字体 */
  color: #6b7683;
  font-weight: 500;
  line-height: 1.2;
}

/* 第一项：内容区容器 - 确保足够的顶部间距 */
.content-wrap {
  padding: 60px 16px 16px; /* 进一步减少顶部内边距从70px到60px，最小化与数据卡片的间距 */
  /* 添加统一的容器约束 */
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

/* 白色圆角卡片通用样式 */
.card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px; /* 缩小垂直间距从20px改为16px */
  /* 确保所有卡片宽度一致 */
  width: 100%;
  box-sizing: border-box;
  /* 添加明确的左右边距 */
  margin-left: 0;
  margin-right: 0;
}

/* 第二项：中间的"主推运单"卡片 */
.featured-order {
  padding: 20px;
  margin-top: 0; /* 完全消除与上方数据卡片的间距 */
  /* 确保宽度一致 */
  width: 100%;
  box-sizing: border-box;
}

.card-header {
  margin-bottom: 20px;
}

.order-info {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  background: #f0f9ff;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid #e1f5fe;
  overflow: hidden; /* 防止内容溢出 */
  min-height: 60px; /* 确保最小高度 */
  width: 100%; /* 确保宽度100% */
  box-sizing: border-box; /* 确保padding不会影响总宽度 */
  position: relative; /* 添加相对定位 */
  /* 调试边框 */
  /* border: 2px solid red; */
}

.order-group-left {
  display: flex !important;
  align-items: center !important;
  gap: 16px; /* 增加间距 */
  flex: 1; /* 占据剩余空间 */
  min-width: 0; /* 允许flex子项收缩 */
  overflow: hidden; /* 防止内容溢出 */
  /* 调试边框 */
  /* border: 1px solid blue; */
}

.order-group-spacer {
  justify-self: center !important;
  width: 20px; /* 固定宽度 */
  /* 调试边框 */
  /* border: 1px solid green; */
}

.order-number-line {
  display: flex;
  align-items: center;
  gap: 6px; /* 减少运单号和编码之间的间距 */
  white-space: nowrap; /* 防止换行 */
}

.order-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  white-space: nowrap; /* 防止换行 */
}

.order-number {
  font-size: 14px;
  color: #1f2d3d;
  font-weight: 600;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  white-space: nowrap; /* 防止换行 */
}

.cargo-tag {
  background: #e6f2ff;
  padding: 6px 10px; /* 增加内边距 */
  border-radius: 8px; /* 增加圆角 */
  border: 1px solid #d1e9ff;
  font-size: 13px;
  color: #3498db;
  font-weight: 600;
  white-space: nowrap; /* 防止换行 */
  flex-shrink: 0; /* 防止收缩 */
}

.price-tag {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  background: #e6f2ff;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d1e9ff;
  flex-shrink: 0; /* 防止收缩 */
  min-width: 0; /* 允许收缩 */
  overflow: hidden; /* 防止内容溢出 */
  text-align: center; /* 确保文字居中 */
  white-space: nowrap; /* 防止换行 */
  /* 调试边框 */
  /* border: 1px solid orange; */
}

.price-value {
  font-size: 24px;
  font-weight: 700;
  color: #ff4757;
  line-height: 1;
}

.price-unit {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  font-weight: 500;
}

.card-content {
  margin-bottom: 20px;
}

.route-section {
  margin-bottom: 16px;
}

.route-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.start-point, .end-point {
  font-size: 18px;
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
  flex: 0 0 80px;
  justify-content: center;
  position: relative;
}

.arrow-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 1px;
}

.arrow-head {
  position: absolute;
  right: 0;
  font-size: 16px;
  color: #3498db;
  font-weight: 600;
}

.details-section {
  border-top: 1px solid #f5f7fa;
  padding-top: 16px;
}

.transport-details {
  font-size: 14px;
  color: #6b7683;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.vehicle-info {
  font-size: 13px;
  color: #8a9199;
  margin: 0;
}

.card-actions {
  border-top: 1px solid #f5f7fa;
  padding-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  font-size: 14px;
  height: 40px;
  border-radius: 10px;
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

/* 第三项：下方的"快捷操作"区域 */
.quick-actions {
  margin: 16px 0; /* 缩小垂直间距从20px改为16px */
  padding: 0 16px; /* 确保与卡片边距一致 */
  /* 确保容器宽度一致 */
  width: 100%;
  box-sizing: border-box;
}

/* 快捷操作容器样式 - 确保与其他容器一致 */
.quick-actions-container {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 20px;
  /* 确保宽度一致 */
  width: 100%;
  box-sizing: border-box;
  /* 添加明确的左右边距 */
  margin-left: 0;
  margin-right: 0;
}

/* 优化快捷操作按钮的尺寸和间距 */
.qa-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 16px 12px; /* 适当减小padding，让按钮更精致 */
  border-radius: 14px;
  color: #1f2d3d;
  font-weight: 700;
  background: #f5f7fa;
  border: none;
  max-width: 180px; /* 设置最大宽度，让按钮更精致 */
  margin: 0 auto;
  font-size: 14px; /* 稍微减小字体 */
  transition: all 0.2s ease; /* 添加过渡效果 */
  /* 确保按钮容器宽度一致 */
  box-sizing: border-box;
}

.qa-btn:active {
  transform: scale(0.98); /* 点击时的缩放效果 */
}

.qa-blue { background: #e6f1ff; }
.qa-green { background: #e5fbef; }
.qa-cyan { background: #e8fbff; }
.qa-purple { background: #f3ebff; }

/* 我的运单区 */
.my-orders {
  padding-bottom: 20px;
  margin-top: 16px; /* 缩小与上方快捷操作的间距从20px改为16px */
  /* 确保宽度一致 */
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  padding: 16px 16px 12px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2d3d;
}

.orders-tabs :deep(.van-tabs__nav) {
  background: #ffffff;
}

.orders-list {
  padding: 12px 16px 16px;
}

.order-item {
  border: 1px solid #eef2f7;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #ffffff;
}

.oi-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e9f3ff;
  padding: 12px 16px;
}

.oi-title {
  font-size: 13px;
  color: #5e6a73;
}

.oi-value {
  font-size: 13px;
  color: #2b2f36;
  font-weight: 600;
}

.oi-body { 
  padding: 16px; 
}

.oi-route {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #1f2d3d;
  font-weight: 600;
}

.oi-extra {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7683;
}

.arrow, .oi-arrow { 
  color: #9aa4af; 
}

/* 添加全局样式重置，确保Vant组件不影响布局 */
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
</style>


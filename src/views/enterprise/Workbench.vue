<template>
  <div class="enterprise-workbench">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">企业工作台</h1>
      <div class="header-actions">
        <van-icon name="setting-o" size="20" @click="handleSettings" />
      </div>
    </div>

    <!-- 工作台内容 -->
    <div class="workbench-content">
      <!-- 关键业务数据卡片 -->
      <div class="data-card">
        <div class="card-header">
          <div class="card-title">
            <van-icon name="bar-chart-o" size="18" />
            <span>关键业务数据</span>
          </div>
          <div class="card-status">
            <van-loading size="14" />
            <span>数据正在加载中...</span>
          </div>
        </div>
        <div class="card-content placeholder">
          <div class="placeholder-grid">
            <div class="placeholder-item">
              <div class="placeholder-value">--</div>
              <div class="placeholder-label">今日订单</div>
            </div>
            <div class="placeholder-item">
              <div class="placeholder-value">--</div>
              <div class="placeholder-label">运输中</div>
            </div>
            <div class="placeholder-item">
              <div class="placeholder-value">--</div>
              <div class="placeholder-label">已完成</div>
            </div>
            <div class="placeholder-item">
              <div class="placeholder-value">--</div>
              <div class="placeholder-label">营业额</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 在途运单监控卡片 -->
      <div class="data-card">
        <div class="card-header">
          <div class="card-title">
            <van-icon name="location-o" size="18" />
            <span>在途运单监控</span>
          </div>
          <div class="card-status coming-soon">
            <van-icon name="clock-o" size="14" />
            <span>地图模块即将上线...</span>
          </div>
        </div>
        <div class="card-content placeholder">
          <div class="map-placeholder">
            <div class="map-icon">
              <van-icon name="location" size="48" color="#1989fa" />
            </div>
            <div class="map-text">
              <h3>实时地图监控</h3>
              <p>在途车辆位置追踪</p>
              <p>运输路径优化分析</p>
              <p>异常情况实时预警</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 财务总览卡片 -->
      <div class="data-card">
        <div class="card-header">
          <div class="card-title">
            <van-icon name="balance-list-o" size="18" />
            <span>财务总览</span>
          </div>
          <div class="card-status coming-soon">
            <van-icon name="star-o" size="14" />
            <span>敬请期待...</span>
          </div>
        </div>
        <div class="card-content placeholder">
          <div class="finance-placeholder">
            <div class="finance-grid">
              <div class="finance-item">
                <div class="finance-icon">
                  <van-icon name="gold-coin-o" size="24" color="#ff976a" />
                </div>
                <div class="finance-info">
                  <div class="finance-label">应收账款</div>
                  <div class="finance-value">即将开放</div>
                </div>
              </div>
              <div class="finance-item">
                <div class="finance-icon">
                  <van-icon name="credit-pay" size="24" color="#07c160" />
                </div>
                <div class="finance-info">
                  <div class="finance-label">已收款项</div>
                  <div class="finance-value">即将开放</div>
                </div>
              </div>
              <div class="finance-item">
                <div class="finance-icon">
                  <van-icon name="coupon-o" size="24" color="#1989fa" />
                </div>
                <div class="finance-info">
                  <div class="finance-label">成本分析</div>
                  <div class="finance-value">即将开放</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作卡片 -->
      <div class="data-card">
        <div class="card-header">
          <div class="card-title">
            <van-icon name="apps-o" size="18" />
            <span>快捷操作</span>
          </div>
        </div>
        <div class="card-content">
          <div class="quick-actions">
            <div 
              v-for="action in quickActions" 
              :key="action.id"
              class="action-item"
              @click="handleQuickAction(action)"
            >
              <div class="action-icon">
                <van-icon :name="action.icon" size="20" :color="action.color" />
              </div>
              <div class="action-text">{{ action.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统通知卡片 -->
      <div class="data-card">
        <div class="card-header">
          <div class="card-title">
            <van-icon name="bell" size="18" />
            <span>系统通知</span>
          </div>
          <div class="card-more" @click="handleMoreNotifications">
            <span>查看全部</span>
            <van-icon name="arrow" size="12" />
          </div>
        </div>
        <div class="card-content">
          <div class="notification-list">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              class="notification-item"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-dot" :class="notification.type"></div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'

// 快捷操作数据
const quickActions = ref([
  { id: 1, title: '发布货源', icon: 'add-o', color: '#1989fa' },
  { id: 2, title: '调度派车', icon: 'logistics', color: '#ff976a' },
  { id: 3, title: '查看报表', icon: 'bar-chart-o', color: '#07c160' },
  { id: 4, title: '财务结算', icon: 'balance-list-o', color: '#ee0a24' }
])

// 系统通知数据
const notifications = ref([
  {
    id: 1,
    title: '您有3个待审批的运单异常',
    time: '5分钟前',
    type: 'urgent'
  },
  {
    id: 2,
    title: '系统将于今晚23:00-24:00进行维护',
    time: '1小时前',
    type: 'info'
  },
  {
    id: 3,
    title: '新功能"智能调度"已上线',
    time: '2小时前',
    type: 'success'
  }
])

// 事件处理函数
const handleSettings = () => {
  showToast('打开工作台设置')
}

const handleQuickAction = (action) => {
  showToast(`执行操作：${action.title}`)
}

const handleMoreNotifications = () => {
  showToast('查看全部通知')
}

const handleNotificationClick = (notification) => {
  showToast(`查看通知：${notification.title}`)
}

onMounted(() => {
  console.log('企业工作台已加载')
})
</script>

<style scoped>
.enterprise-workbench {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin: 0;
}

.header-actions {
  color: #969799;
  cursor: pointer;
}

.workbench-content {
  padding: 12px 16px;
}

.data-card {
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #323233;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
}

.card-status.coming-soon {
  color: #1989fa;
}

.card-more {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #1989fa;
  cursor: pointer;
}

.card-content {
  padding: 16px;
}

.card-content.placeholder {
  background: #fafbfc;
  border: 1px dashed #dcdee0;
  margin: 16px;
  border-radius: 8px;
  padding: 24px;
}

.placeholder-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.placeholder-item {
  text-align: center;
}

.placeholder-value {
  font-size: 24px;
  font-weight: 600;
  color: #c8c9cc;
  margin-bottom: 4px;
}

.placeholder-label {
  font-size: 12px;
  color: #969799;
}

.map-placeholder {
  text-align: center;
  padding: 20px 0;
}

.map-icon {
  margin-bottom: 16px;
}

.map-text h3 {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin: 0 0 12px 0;
}

.map-text p {
  font-size: 13px;
  color: #646566;
  margin: 4px 0;
  line-height: 1.4;
}

.finance-placeholder {
  padding: 12px 0;
}

.finance-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.finance-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
}

.finance-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.finance-info {
  flex: 1;
}

.finance-label {
  font-size: 13px;
  color: #646566;
  margin-bottom: 2px;
}

.finance-value {
  font-size: 14px;
  color: #969799;
  font-weight: 500;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.action-item:hover {
  background: #f7f8fa;
}

.action-icon {
  width: 44px;
  height: 44px;
  background: #f7f8fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.action-text {
  font-size: 12px;
  color: #646566;
  text-align: center;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
}

.notification-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.notification-dot.urgent {
  background: #ee0a24;
}

.notification-dot.info {
  background: #1989fa;
}

.notification-dot.success {
  background: #07c160;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  color: #323233;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #969799;
}
</style>

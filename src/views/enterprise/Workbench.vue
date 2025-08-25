<template>
  <div class="enterprise-workbench">
    <!-- 模块一：顶部欢迎与角色切换区 (非卡片) -->
    <div class="welcome-section">
      <div class="welcome-left">
        <div class="welcome-text">曹益坤，欢迎你</div>
        <div class="role-text">体验管理员</div>
      </div>
      <div class="welcome-right">
        <van-dropdown-menu>
          <van-dropdown-item 
            v-model="currentEnterprise" 
            :options="enterpriseOptions"
            @change="handleEnterpriseChange"
          />
        </van-dropdown-menu>
      </div>
    </div>

    <!-- 模块二：系统通知区 (非卡片) -->
    <div class="notice-section">
      <van-notice-bar
        left-icon="volume-o"
        text="系统将于今晚23:00进行升级维护，请提前做好准备。"
        color="#1989fa"
        background="#f0f9ff"
      />
    </div>

    <!-- 模块三：常用应用区 (白色卡片，聚焦运输) -->
    <div class="app-section">
      <div class="section-header">
        <div class="section-title">常用应用</div>
        <van-icon name="setting-o" size="18" color="#969799" />
      </div>
      <van-grid :column-num="4" :border="false">
        <van-grid-item 
          v-for="app in transportApps" 
          :key="app.id"
          :icon="app.icon"
          :text="app.name"
          @click="handleAppClick(app)"
        />
      </van-grid>
    </div>

    <!-- 模块四：我的待办区 (白色卡片，聚焦运输) -->
    <div class="todo-section">
      <div class="section-header">
        <div class="section-title">我的待办</div>
      </div>
      <van-cell-group>
        <van-cell
          v-for="todo in transportTodos"
          :key="todo.id"
          :title="todo.title"
          is-link
          @click="handleTodoClick(todo)"
        >
          <template #right-icon>
            <van-badge :content="todo.count" :show="todo.count > 0" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 模块五：推广/内容区 (通栏Banner) -->
    <div class="banner-section">
      <van-image
        src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=120&fit=crop&crop=center"
        width="100%"
        height="120"
        radius="8"
        fit="cover"
      />
    </div>

    <!-- 模块六：数据总览区 (白色卡片，聚焦运输) -->
    <div class="overview-section">
      <div class="section-header">
        <div class="section-title">数据总览</div>
        <div class="section-more" @click="handleMoreOverview">
          更多 <van-icon name="arrow" size="12" />
        </div>
      </div>
      
      <!-- 运输执行总览 -->
      <div class="overview-card">
        <div class="overview-header">
          <div class="overview-title">运输执行总览</div>
          <div class="update-time">更新于 2分钟前</div>
        </div>
        <div class="chart-placeholder">
          <div class="gauge-chart">
            <div class="gauge-circle">
              <div class="gauge-value">98.5%</div>
              <div class="gauge-label">准时率</div>
            </div>
          </div>
        </div>
        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="kpi-value">152</div>
            <div class="kpi-label">在途运单数</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">89</div>
            <div class="kpi-label">今日完成</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">2.5天</div>
            <div class="kpi-label">平均运输时长</div>
          </div>
        </div>
      </div>

      <!-- 运输成本分析 -->
      <div class="overview-card">
        <div class="overview-header">
          <div class="overview-title">运输成本分析</div>
          <div class="update-time">更新于 5分钟前</div>
        </div>
        <div class="chart-placeholder">
          <div class="pie-chart">
            <div class="pie-circle">
              <div class="pie-segment fuel"></div>
              <div class="pie-segment labor"></div>
              <div class="pie-segment maintenance"></div>
            </div>
            <div class="pie-legend">
              <div class="legend-item">
                <span class="legend-color fuel"></span>
                <span>燃油费 45%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color labor"></span>
                <span>人工费 35%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color maintenance"></span>
                <span>维护费 20%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="kpi-value">¥1,250,800</div>
            <div class="kpi-label">总成本</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">¥280</div>
            <div class="kpi-label">百公里成本</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">燃油费</div>
            <div class="kpi-label">主要成本项</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'

// 当前选中的企业
const currentEnterprise = ref('enterprise1')

// 企业选项
const enterpriseOptions = ref([
  { text: '体验企业', value: 'enterprise1' },
  { text: '体验网点', value: 'enterprise2' },
  { text: '测试企业', value: 'enterprise3' }
])

// 运输相关应用
const transportApps = ref([
  { id: 1, name: '汽运计划', icon: 'logistics' },
  { id: 2, name: '调度中心', icon: 'guide-o' },
  { id: 3, name: '货源管理', icon: 'bag-o' },
  { id: 4, name: '运单管理', icon: 'orders-o' },
  { id: 5, name: '在途监控', icon: 'location-o' },
  { id: 6, name: '司机管理', icon: 'contact' },
  { id: 7, name: '车辆管理', icon: 'car-o' },
  { id: 8, name: '结算中心', icon: 'balance-list-o' }
])

// 运输待办事项
const transportTodos = ref([
  { id: 1, title: '待指派', count: 12 },
  { id: 2, title: '待接单', count: 8 },
  { id: 3, title: '异常处理', count: 3 },
  { id: 4, title: '待复核', count: 15 },
  { id: 5, title: '待结算', count: 25 }
])

// 事件处理函数
const handleEnterpriseChange = (value) => {
  const selectedOption = enterpriseOptions.value.find(option => option.value === value)
  showToast(`已切换至 ${selectedOption.text}，数据正在刷新...`)
}

const handleAppClick = (app) => {
  showToast(`打开应用：${app.name}`)
}

const handleTodoClick = (todo) => {
  showToast(`查看待办：${todo.title}`)
}

const handleMoreOverview = () => {
  showToast('查看更多数据总览')
}
</script>

<style scoped>
.enterprise-workbench {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 模块一：顶部欢迎与角色切换区 */
.welcome-section {
  background: white;
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.welcome-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.role-text {
  font-size: 14px;
  color: #969799;
}

.welcome-right {
  min-width: 120px;
}

/* 模块二：系统通知区 */
.notice-section {
  margin: 0 16px 12px 16px;
}

/* 模块三：常用应用区 */
.app-section {
  background: white;
  border-radius: 8px;
  margin: 0 16px 12px 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 16px 16px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.section-more {
  font-size: 14px;
  color: #1989fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 模块四：我的待办区 */
.todo-section {
  background: white;
  border-radius: 8px;
  margin: 0 16px 12px 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 模块五：推广/内容区 */
.banner-section {
  margin: 0 16px 12px 16px;
}

/* 模块六：数据总览区 */
.overview-section {
  background: white;
  border-radius: 8px;
  margin: 0 16px 12px 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.overview-card {
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.overview-card:last-child {
  border-bottom: none;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.overview-title {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
}

.update-time {
  font-size: 12px;
  color: #969799;
}

.chart-placeholder {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

/* 仪表盘图表样式 */
.gauge-chart {
  position: relative;
  width: 120px;
  height: 80px;
}

.gauge-circle {
  width: 120px;
  height: 60px;
  border-radius: 60px 60px 0 0;
  background: conic-gradient(from 0deg, #07c160 0deg, #07c160 315deg, #ebedf0 315deg, #ebedf0 360deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.gauge-circle::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 40px;
  border-radius: 40px 40px 0 0;
  background: white;
}

.gauge-value {
  font-size: 16px;
  font-weight: 600;
  color: #07c160;
  z-index: 1;
}

.gauge-label {
  font-size: 12px;
  color: #969799;
  z-index: 1;
}

/* 环形图样式 */
.pie-chart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pie-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff976a 0deg,
    #ff976a 162deg,
    #1989fa 162deg,
    #1989fa 306deg,
    #07c160 306deg,
    #07c160 360deg
  );
  position: relative;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #646566;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.fuel {
  background: #ff976a;
}

.legend-color.labor {
  background: #1989fa;
}

.legend-color.maintenance {
  background: #07c160;
}

/* KPI网格样式 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.kpi-item {
  text-align: center;
  padding: 12px 8px;
  background: #f7f8fa;
  border-radius: 6px;
}

.kpi-value {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 12px;
  color: #969799;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gauge-chart {
    width: 100px;
    height: 70px;
  }
  
  .gauge-circle {
    width: 100px;
    height: 50px;
    border-radius: 50px 50px 0 0;
  }
  
  .gauge-circle::before {
    width: 70px;
    height: 35px;
    border-radius: 35px 35px 0 0;
  }
}
</style>

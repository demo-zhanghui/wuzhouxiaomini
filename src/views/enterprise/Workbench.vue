<template>
  <div class="enterprise-workbench">
    <!-- 模块一：顶部欢迎与角色切换区 (非卡片) -->
    <div class="welcome-section">
      <div class="welcome-left">
        <div class="welcome-text">曹益坤，欢迎你</div>
        <div class="role-text">{{ currentRole.displayName }}</div>
      </div>
      <div class="welcome-right">
        <van-button 
          size="small" 
          type="primary" 
          @click="showRoleSelector = true"
        >
          切换角色
        </van-button>
      </div>
    </div>

    <!-- 模块二：系统通知区 (非卡片) -->
    <div class="notice-section">
      <van-notice-bar
        left-icon="volume-o"
        :text="currentRole.noticeText"
        color="#1989fa"
        background="#f0f9ff"
      />
    </div>

    <!-- 模块三：我的待办区 (白色卡片，横排展示) -->
    <div class="todo-section">
      <div class="section-header">
        <div class="section-title">我的待办</div>
      </div>
      <div class="todo-grid">
        <div 
          v-for="todo in currentRole.todos" 
          :key="todo.id"
          class="todo-item"
          @click="handleTodoClick(todo)"
        >
          <div class="todo-icon">
            <van-icon :name="todo.icon" size="24" :color="todo.color" />
          </div>
          <div class="todo-content">
            <div class="todo-title">{{ todo.title }}</div>
            <div class="todo-count">{{ todo.count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块四：推广/内容区 (通栏Banner) -->
    <div class="banner-section">
      <van-image
        :src="currentRole.bannerImage"
        width="100%"
        height="120"
        radius="8"
        fit="cover"
      />
    </div>

    <!-- 模块五：数据总览区 (白色卡片，聚焦运输) -->
    <div class="overview-section">
      <div class="section-header">
        <div class="section-title">{{ currentRole.overviewTitle }}</div>
        <div class="section-more" @click="handleMoreOverview">
          更多 <van-icon name="arrow" size="12" />
        </div>
      </div>
      
      <!-- 动态数据总览卡片 -->
      <div 
        v-for="overview in currentRole.overviews" 
        :key="overview.id"
        class="overview-card"
      >
        <div class="overview-header">
          <div class="overview-title">{{ overview.title }}</div>
          <div class="update-time">更新于 {{ overview.updateTime }}</div>
        </div>
        <div class="chart-placeholder">
          <div v-if="overview.chartType === 'gauge'" class="gauge-chart">
            <div class="gauge-circle">
              <div class="gauge-value">{{ overview.chartValue }}</div>
              <div class="gauge-label">{{ overview.chartLabel }}</div>
            </div>
          </div>
          <div v-else-if="overview.chartType === 'pie'" class="pie-chart">
            <div class="pie-circle"></div>
            <div class="pie-legend">
              <div 
                v-for="legend in overview.legends" 
                :key="legend.label"
                class="legend-item"
              >
                <span class="legend-color" :style="{ background: legend.color }"></span>
                <span>{{ legend.label }} {{ legend.percentage }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="kpi-grid">
          <div 
            v-for="kpi in overview.kpis" 
            :key="kpi.label"
            class="kpi-item"
          >
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色选择器弹窗 -->
    <van-popup 
      v-model:show="showRoleSelector" 
      position="bottom" 
      round 
      :style="{ height: '40%' }"
    >
      <div class="role-selector">
        <div class="role-selector-header">
          <h3>选择身份/空间</h3>
        </div>
        <div class="role-options">
          <div 
            v-for="role in availableRoles" 
            :key="role.id"
            class="role-option"
            :class="{ active: currentRole.id === role.id }"
            @click="switchRole(role)"
          >
            <div class="role-info">
              <van-icon :name="role.icon" size="20" :color="role.color" />
              <span class="role-name">{{ role.displayName }}</span>
            </div>
            <van-icon 
              v-if="currentRole.id === role.id" 
              name="success" 
              size="16" 
              color="#07c160" 
            />
          </div>
        </div>
        <div class="role-selector-footer">
          <van-button 
            block 
            @click="showRoleSelector = false"
          >
            取消
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'

// 角色选择器显示状态
const showRoleSelector = ref(false)

// 当前选中的角色
const currentRoleId = ref('roadDriver')

// 可用角色列表
const availableRoles = ref([
  {
    id: 'roadDriver',
    displayName: '公路司机',
    icon: 'logistics',
    color: '#1989fa',
    noticeText: '系统将于今晚23:00进行升级维护，请提前做好准备。',
    todos: [
      { id: 1, title: '待接单', count: 8, icon: 'orders-o', color: '#07c160' },
      { id: 2, title: '运输中', count: 12, icon: 'logistics', color: '#1989fa' },
      { id: 3, title: '待复核', count: 15, icon: 'passed', color: '#7232dd' },
      { id: 4, title: '待结算', count: 25, icon: 'balance-list-o', color: '#ee0a24' },
      { id: 5, title: '有异常', count: 3, icon: 'warning-o', color: '#ff976a' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=120&fit=crop&crop=center',
    overviewTitle: '运输数据总览',
    overviews: [
      {
        id: 1,
        title: '运输执行总览',
        updateTime: '2分钟前',
        chartType: 'gauge',
        chartValue: '98.5%',
        chartLabel: '准时率',
        kpis: [
          { value: '152', label: '在途运单数' },
          { value: '89', label: '今日完成' },
          { value: '2.5天', label: '平均运输时长' }
        ]
      },
      {
        id: 2,
        title: '运输成本分析',
        updateTime: '5分钟前',
        chartType: 'pie',
        legends: [
          { label: '燃油费', percentage: '45%', color: '#ff976a' },
          { label: '人工费', percentage: '35%', color: '#1989fa' },
          { label: '维护费', percentage: '20%', color: '#07c160' }
        ],
        kpis: [
          { value: '¥1,250,800', label: '总成本' },
          { value: '¥280', label: '百公里成本' },
          { value: '燃油费', label: '主要成本项' }
        ]
      }
    ]
  },
  {
    id: 'waterwayShipowner',
    displayName: '水路船东',
    icon: 'ship',
    color: '#07c160',
    noticeText: '港口作业时间调整通知：本周六起，夜班作业时间延长至凌晨2点。',
    todos: [
      { id: 1, title: '待装货', count: 5, icon: 'bag-o', color: '#07c160' },
      { id: 2, title: '航行中', count: 8, icon: 'ship', color: '#1989fa' },
      { id: 3, title: '待卸货', count: 12, icon: 'logistics', color: '#7232dd' },
      { id: 4, title: '待结算', count: 18, icon: 'balance-list-o', color: '#ee0a24' },
      { id: 5, title: '异常处理', count: 2, icon: 'warning-o', color: '#ff976a' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=120&fit=crop&crop=center',
    overviewTitle: '航运数据总览',
    overviews: [
      {
        id: 1,
        title: '船舶运营总览',
        updateTime: '3分钟前',
        chartType: 'gauge',
        chartValue: '95.2%',
        chartLabel: '准班率',
        kpis: [
          { value: '8', label: '在航船舶数' },
          { value: '156', label: '本月完成航次' },
          { value: '3.2天', label: '平均航程时长' }
        ]
      },
      {
        id: 2,
        title: '港口作业分析',
        updateTime: '8分钟前',
        chartType: 'pie',
        legends: [
          { label: '装卸费', percentage: '40%', color: '#ff976a' },
          { label: '港口费', percentage: '35%', color: '#1989fa' },
          { label: '燃油费', percentage: '25%', color: '#07c160' }
        ],
        kpis: [
          { value: '¥2,180,500', label: '总成本' },
          { value: '¥15,600', label: '单航次成本' },
          { value: '装卸费', label: '主要成本项' }
        ]
      }
    ]
  },
  {
    id: 'enterpriseStaff',
    displayName: '企业职员',
    icon: 'contact',
    color: '#7232dd',
    noticeText: '企业年度会议将于下周三召开，请各部门负责人准时参加。',
    todos: [
      { id: 1, title: '待审批', count: 15, icon: 'passed', color: '#07c160' },
      { id: 2, title: '待处理', count: 22, icon: 'orders-o', color: '#1989fa' },
      { id: 3, title: '待回复', count: 8, icon: 'chat-o', color: '#7232dd' },
      { id: 4, title: '待跟进', count: 12, icon: 'clock-o', color: '#ff976a' },
      { id: 5, title: '待归档', count: 18, icon: 'folder-o', color: '#ee0a24' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=120&fit=crop&crop=center',
    overviewTitle: '企业运营总览',
    overviews: [
      {
        id: 1,
        title: '业务处理总览',
        updateTime: '1分钟前',
        chartType: 'gauge',
        chartValue: '92.8%',
        chartLabel: '处理效率',
        kpis: [
          { value: '156', label: '待处理事项' },
          { value: '89', label: '今日完成' },
          { value: '1.8天', label: '平均处理时长' }
        ]
      },
      {
        id: 2,
        title: '部门工作量分析',
        updateTime: '6分钟前',
        chartType: 'pie',
        legends: [
          { label: '运营部', percentage: '45%', color: '#ff976a' },
          { label: '财务部', percentage: '30%', color: '#1989fa' },
          { label: '人事部', percentage: '25%', color: '#07c160' }
        ],
        kpis: [
          { value: '¥3,250,800', label: '总预算' },
          { value: '¥180,500', label: '本月支出' },
          { value: '运营部', label: '主要部门' }
        ]
      }
    ]
  }
])

// 当前角色计算属性
const currentRole = computed(() => {
  return availableRoles.value.find(role => role.id === currentRoleId.value) || availableRoles.value[0]
})

// 事件处理函数
const switchRole = (role) => {
  currentRoleId.value = role.id
  showRoleSelector.value = false
  showToast(`已切换至 ${role.displayName}`)
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

/* 模块三：我的待办区（横排展示） */
.todo-section {
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

/* 待办横排网格样式 */
.todo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
}

.todo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 8px;
  background: #f7f8fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.todo-item:hover {
  background: #e8f4fd;
  transform: translateY(-2px);
}

.todo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-content {
  text-align: center;
}

.todo-title {
  font-size: 12px;
  color: #646566;
  margin-bottom: 4px;
  line-height: 1.2;
}

.todo-count {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

/* 模块四：推广/内容区 */
.banner-section {
  margin: 0 16px 12px 16px;
}

/* 模块五：数据总览区 */
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
    #ff976a 144deg,
    #1989fa 144deg,
    #1989fa 252deg,
    #07c160 252deg,
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

/* 角色选择器样式 */
.role-selector {
  padding: 20px;
}

.role-selector-header {
  text-align: center;
  margin-bottom: 20px;
}

.role-selector-header h3 {
  margin: 0;
  font-size: 18px;
  color: #323233;
}

.role-options {
  margin-bottom: 20px;
}

.role-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f7f8fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-option:hover {
  background: #e8f4fd;
}

.role-option.active {
  background: #e8f4fd;
  border: 2px solid #1989fa;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-name {
  font-size: 16px;
  color: #323233;
  font-weight: 500;
}

.role-selector-footer {
  padding-top: 20px;
  border-top: 1px solid #ebedf0;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .todo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
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

@media (max-width: 320px) {
  .todo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>

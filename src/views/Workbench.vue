<!--
  情境感知工作台组件
  实现动态任务卡片和状态切换功能
  
  核心功能：
  1. 运单状态切换模拟
  2. 动态任务卡片内容
  3. 上下文信息显示
  4. 操作按钮动态变化
-->

<template>
  <div class="workbench-container">
    <!-- 状态切换器 -->
    <div class="state-selector">
      <van-steps :active="currentStateIndex" direction="horizontal" active-color="#667eea">
        <van-step 
          v-for="(state, index) in stateList" 
          :key="state.key"
          @click="switchState(index)"
        >
          {{ state.shortTitle }}
        </van-step>
      </van-steps>
    </div>

    <!-- 任务卡片区域 -->
    <div class="task-card-area">
      <div class="task-card">
        <!-- 任务状态指示 -->
        <div class="task-status">
          <van-icon :name="currentState.icon" size="32" class="status-icon" />
          <div class="status-info">
            <h3 class="task-title">{{ currentState.title }}</h3>
            <p class="task-content">{{ currentState.content }}</p>
          </div>
        </div>

        <!-- 进度指示器 -->
        <div class="progress-section">
          <van-progress 
            :percentage="getProgressPercentage()" 
            stroke-width="8"
            color="linear-gradient(to right, #667eea, #764ba2)"
            track-color="#f0f0f0"
          />
          <span class="progress-text">{{ getProgressText() }}</span>
        </div>
      </div>
    </div>

    <!-- 上下文信息区域 -->
    <div class="context-section">
      <div class="context-card">
        <h4 class="context-title">任务详情</h4>
        <div class="context-content">
          <div 
            v-for="(value, key) in currentState.contextInfo" 
            :key="key"
            class="context-item"
          >
            <span class="context-label">{{ getContextLabel(key) }}：</span>
            <span class="context-value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="actions-section">
      <div class="action-buttons">
        <van-button 
          v-for="button in currentState.buttons" 
          :key="button.action"
          :type="button.type"
          :size="button.size || 'normal'"
          block
          round
          @click="handleAction(button)"
          class="action-button"
        >
          {{ button.text }}
        </van-button>
      </div>
    </div>

    <!-- 辅助工具区域 -->
    <div class="tools-section">
      <div class="tool-buttons">
        <van-button 
          icon="phone-o" 
          type="default" 
          size="small" 
          round
          @click="handleContact"
        >
          联系调度
        </van-button>
        
        <van-button 
          icon="location-o" 
          type="default" 
          size="small" 
          round
          @click="handleNavigation"
        >
          实时导航
        </van-button>
        
        <van-button 
          icon="photograph" 
          type="default" 
          size="small" 
          round
          @click="handlePhoto"
        >
          拍照上传
        </van-button>
      </div>
    </div>

    <!-- 关闭按钮 -->
    <div class="close-section">
      <van-button 
        icon="cross" 
        type="default" 
        size="small" 
        round
        @click="handleClose"
        class="close-button"
      >
        收起工作台
      </van-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 情境感知工作台逻辑
 * 处理任务状态切换和操作响应
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showImagePreview } from 'vant'
import { workbenchStates } from '@/data/mockData'

// 仅用于父组件关闭，因此无需显式导入 defineEmits 宏
const emit = defineEmits(['close'])

// 路由
const router = useRouter()

// 响应式数据
const currentStateIndex = ref(0)

// 状态列表配置
const stateList = [
  { 
    key: 'pickup', 
    shortTitle: '待提货',
    icon: 'location-o'
  },
  { 
    key: 'loading', 
    shortTitle: '装货中',
    icon: 'goods-collect-o'
  },
  { 
    key: 'transporting', 
    shortTitle: '运输中',
    icon: 'logistics'
  },
  { 
    key: 'unloading', 
    shortTitle: '待卸货',
    icon: 'completed'
  },
  { 
    key: 'completed', 
    shortTitle: '已完成',
    icon: 'success'
  }
]

// 计算属性
const currentState = computed(() => {
  const stateKey = stateList[currentStateIndex.value].key
  const baseState = workbenchStates[stateKey]
  
  return {
    ...baseState,
    icon: stateList[currentStateIndex.value].icon
  }
})

/**
 * 切换状态
 */
const switchState = (index) => {
  currentStateIndex.value = index
  showToast({
    message: `切换到：${stateList[index].shortTitle}`,
    duration: 1500
  })
}

/**
 * 获取进度百分比
 */
const getProgressPercentage = () => {
  return ((currentStateIndex.value + 1) / stateList.length) * 100
}

/**
 * 获取进度文本
 */
const getProgressText = () => {
  return `${currentStateIndex.value + 1}/${stateList.length} - ${stateList[currentStateIndex.value].shortTitle}`
}

/**
 * 获取上下文标签
 */
const getContextLabel = (key) => {
  const labelMap = {
    address: '地址',
    distance: '距离',
    eta: '预计时间',
    cargoWeight: '货物重量',
    loadingProgress: '装货进度',
    estimatedTime: '预计完成时间',
    destination: '目的地',
    remainingDistance: '剩余距离',
    arrivalTime: '到达时间',
    unloadingDock: '卸货位置',
    contactPerson: '联系人',
    completionTime: '完成时间',
    totalAmount: '运费金额',
    settlementStatus: '结算状态'
  }
  return labelMap[key] || key
}

/**
 * 处理操作按钮点击
 */
const handleAction = (button) => {
  const actionMessages = {
    navigate: '开始导航（Demo版本）',
    confirm_arrival: '确认到达（Demo版本）',
    scan_loading: '扫码装货（Demo版本）',
    upload_weight: '上传磅单（Demo版本）',
    report_exception: '上报异常',
    contact_dispatch: '联系调度（Demo版本）',
    scan_receipt: '扫码签收（Demo版本）',
    upload_receipt: '上传回单（Demo版本）',
    view_billing: '查看费用明细（Demo版本）',
    rate_order: '评价订单（Demo版本）'
  }
  
  const message = actionMessages[button.action] || `执行操作：${button.text}`
  
  if (button.action === 'report_exception') {
    router.push('/main/exception')
    return
  } else {
    showToast({
      message,
      duration: 2000
    })
  }

  // 模拟某些操作完成后自动切换到下一状态
  if (['confirm_arrival', 'scan_loading', 'scan_receipt'].includes(button.action)) {
    setTimeout(() => {
      if (currentStateIndex.value < stateList.length - 1) {
        switchState(currentStateIndex.value + 1)
      }
    }, 2000)
  }
}

/**
 * 处理联系调度
 */
const handleContact = () => {
  showToast('拨打调度电话：400-1234-567（Demo版本）')
}

/**
 * 处理实时导航
 */
const handleNavigation = () => {
  showToast('启动实时导航（Demo版本）')
}

/**
 * 处理拍照上传
 */
const handlePhoto = () => {
  // 模拟拍照并显示预览
  const mockImages = [
    'https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    'https://cdn.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
  ]
  
  showImagePreview({
    images: mockImages,
    startPosition: 0,
    onClose: () => {
      showToast('照片上传成功（Demo版本）')
    }
  })
}

/**
 * 处理关闭工作台
 */
const handleClose = () => {
  emit('close')
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  console.log('情境感知工作台已加载')
})
</script>

<style scoped>
/**
 * 工作台样式
 */
.workbench-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

/* 状态选择器样式 */
.state-selector {
  margin-bottom: 24px;
}

:deep(.van-step) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.van-step:hover) {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 4px;
}

:deep(.van-step__title) {
  font-size: 12px;
  font-weight: 500;
}

/* 任务卡片样式 */
.task-card-area {
  margin-bottom: 20px;
}

.task-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.task-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 16px;
}

.status-icon {
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.status-info {
  text-align: left;
}

.task-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.task-content {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
}

/* 进度区域样式 */
.progress-section {
  margin-top: 20px;
}

.progress-text {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 8px;
  display: block;
}

/* 上下文信息样式 */
.context-section {
  margin-bottom: 20px;
}

.context-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.context-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

.context-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.context-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.context-label {
  color: #646566;
  font-weight: 500;
}

.context-value {
  color: #323233;
  font-weight: 600;
  text-align: right;
  flex: 1;
  margin-left: 12px;
}

/* 操作按钮样式 */
.actions-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--primary-color), #4facfe);
  border: none;
}

:deep(.van-button--warning) {
  background: linear-gradient(135deg, #ff976a, #ff6b35);
  border: none;
}

/* 辅助工具样式 */
.tools-section {
  margin-bottom: 20px;
}

.tool-buttons {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.tool-buttons .van-button {
  flex: 1;
  font-size: 12px;
}

/* 关闭按钮样式 */
.close-section {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.close-button {
  background: #f8f9fa;
  color: #646566;
  border: 1px solid #e8eaff;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .workbench-container {
    padding: 16px;
  }
  
  .task-card {
    padding: 20px;
  }
  
  .task-status {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .status-info {
    text-align: center;
  }
  
  .task-title {
    font-size: 18px;
  }
  
  .action-button {
    height: 44px;
    font-size: 15px;
  }
  
  .tool-buttons {
    flex-direction: column;
    gap: 8px;
  }
}

/* 动画效果 */
.task-card {
  animation: cardPulse 3s ease-in-out infinite;
}

@keyframes cardPulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
  }
}

/* 进度条样式覆盖 */
:deep(.van-progress__portion) {
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 4px;
}

:deep(.van-progress) {
  margin-bottom: 8px;
}
</style>

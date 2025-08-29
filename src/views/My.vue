<!--
  我的页面组件
  实现四区域布局和角色动态适配功能
  
  核心功能：
  1. 个人信息区（动态里程/航程显示）
  2. 运单中心区
  3. 与我相关区（动态车辆/船舶显示）
  4. 功能列表区（动态显隐功能）
-->

<template>
  <div class="my-container">
    <!-- 个人信息区 -->
    <div class="profile-card">
      <div class="profile-content">
        <!-- 左侧头像 -->
        <van-image
          :src="store.userInfo.avatar || defaultAvatar"
          round
          width="60"
          height="60"
          fit="cover"
          class="user-avatar"
        />
        
        <!-- 右侧用户信息 -->
        <div class="user-info">
          <div class="user-name-row">
            <h2 class="user-name">张师傅</h2>
          </div>
          <div class="tags-container">
            <!-- 合并后的角色/空间切换器：单个蓝色标签 -->
            <van-tag 
              type="primary" 
              size="small"
              class="role-tag clickable-tag"
              @click="showUnifiedSelector"
            >
              {{ getUnifiedDisplayText() }}
            </van-tag>
            <!-- 企业标签 -->
            <van-tag 
              v-if="store.userRole === 'driver' || store.userRole === 'shipOwner'"
              size="small"
              class="enterprise-tag"
            >
              {{ store.userRole === 'driver' ? '企业司机' : '企业船东' }}
            </van-tag>
            <!-- 认证标签 -->
            <van-tag 
              v-if="store.userRole === 'driver' || store.userRole === 'shipOwner'"
              type="success" 
              size="small"
              class="certification-tag"
            >
              已认证
            </van-tag>
          </div>
          <div class="user-stats">
            <span class="stat-item">完成 {{ achievements.totalTrips }} 次运输</span>
            <span class="stat-divider">·</span>
            <span class="stat-item">{{ getMileageLabelText() }} {{ getMileageValue() }}</span>
          </div>
        </div>
      </div>
    </div>



    <!-- 运单中心区 -->
    <div class="order-center-card">
      <div class="card-header">
        <div class="card-title">运单中心</div>
        <div class="card-more" @click="handleOrderMore">
          更多 <van-icon name="arrow" />
        </div>
      </div>
      <div class="order-grid-custom">
        <div class="order-grid-row">
          <div 
            v-for="status in orderStatusList.slice(0, 3)" 
            :key="status.key"
            @click="handleOrderStatus(status)"
            class="order-grid-item-custom"
          >
            <div class="grid-icon-container">
              <van-icon :name="status.icon" size="22" class="grid-icon" />
              <van-badge 
                v-if="status.count > 0" 
                :content="status.count > 99 ? '99+' : status.count" 
                class="grid-badge"
              />
            </div>
            <div class="grid-label">{{ status.label }}</div>
          </div>
        </div>
        <div class="order-grid-row">
          <div 
            v-for="status in orderStatusList.slice(3, 6)" 
            :key="status.key"
            @click="handleOrderStatus(status)"
            class="order-grid-item-custom"
          >
            <div class="grid-icon-container">
              <van-icon :name="status.icon" size="22" class="grid-icon" />
              <van-badge 
                v-if="status.count > 0" 
                :content="status.count > 99 ? '99+' : status.count" 
                class="grid-badge"
              />
            </div>
            <div class="grid-label">{{ status.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 与我相关区 -->
    <div class="related-card">
      <div class="card-title">与我相关</div>
      <div class="related-row">
        <div class="related-item" @click="handleCertificates">
          <van-icon name="certificate" size="24" class="related-icon" />
          <span class="related-text">我的证件</span>
        </div>
        
        <div class="related-item" @click="handleVehicleManage">
          <template v-if="store.userRole === 'shipOwner'">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="related-icon"
              aria-hidden="true"
            >
              <path d="M3 15h18l-2 6H5l-2-6z" fill="currentColor"/>
              <path d="M12 3l4 2v6h-4V3z" fill="currentColor" opacity=".9"/>
              <path d="M8 11V7l4-2v6H8z" fill="currentColor" opacity=".7"/>
            </svg>
          </template>
          <template v-else>
            <van-icon name="logistics" size="24" class="related-icon" />
          </template>
          <span class="related-text">{{ getVehicleLabelText() }}</span>
        </div>
        
        <div class="related-item" @click="handleFavorites">
          <van-icon name="like-o" size="24" class="related-icon" />
          <span class="related-text">我的关注</span>
        </div>
        
        <div class="related-item" @click="handleQRCode">
          <van-icon name="qr" size="24" class="related-icon" />
          <span class="related-text">我的码夹</span>
        </div>
      </div>
    </div>

    <!-- 去除单独的工作空间切换卡片（合并到统一选择器） -->

    <!-- 功能列表区 -->
    <div class="function-card">
      <van-cell-group inset>
        <!-- 异常报备 - 所有角色通用 -->
        <van-cell 
          is-link
          @click="handleExceptionReport"
          class="function-cell"
        >
          <template #icon>
            <div class="cell-icon-wrapper">
              <van-icon name="warning-o" size="18" class="cell-icon" />
            </div>
          </template>
          <template #title>
            <div class="cell-title">异常报备</div>
          </template>
          <template #label>
            <div class="cell-subtitle">查看上报异常</div>
          </template>
        </van-cell>

        <!-- 入场预约记录 -->
        <van-cell 
          is-link
          @click="handleEntryRecord"
          class="function-cell"
        >
          <template #icon>
            <div class="cell-icon-wrapper">
              <van-icon name="calendar-o" size="18" class="cell-icon" />
            </div>
          </template>
          <template #title>
            <div class="cell-title">入场预约记录</div>
          </template>
          <template #label>
            <div class="cell-subtitle">入场提货单据</div>
          </template>
        </van-cell>

        <!-- 进城申请记录 -->
        <van-cell 
          is-link
          @click="handleCityApplicationRecord"
          class="function-cell"
        >
          <template #icon>
            <div class="cell-icon-wrapper">
              <van-icon name="todo-list-o" size="18" class="cell-icon" />
            </div>
          </template>
          <template #title>
            <div class="cell-title">进城申请记录</div>
          </template>
          <template #label>
            <div class="cell-subtitle">货车进城通行申请</div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 其他相关 -->
    <div class="other-card">
      <div class="card-title">其他相关</div>
      <div class="other-row">
        <div class="other-item" @click="handleHelpFeedback">
          <van-icon name="comment-o" size="24" class="other-icon" />
          <div class="other-title">评价与反馈</div>
          <div class="other-subtitle">意见反馈</div>
        </div>
        <div class="other-item" @click="handleHotline">
          <van-icon name="phone-o" size="24" class="other-icon" />
          <div class="other-title">客服热线</div>
          <div class="other-subtitle">400-500-5689</div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button 
        type="danger" 
        size="large" 
        plain 
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>

    <!-- 统一切换动作面板：公路司机/水路船东/企业职员 -->
    <van-action-sheet
      v-model:show="showRolePicker"
      title="选择身份/空间"
      :actions="roleActions"
      cancel-text="取消"
      @select="onRoleSelect"
      class="role-picker-sheet"
    />
  </div>
</template>

<script setup>
/**
 * 我的页面逻辑
 * 处理个人信息展示、动态适配等功能
 */

import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { store } from '@/store'
import { getDataByRole, getMileageLabel, getVehicleLabel, commonData } from '@/data/mockData'

// 路由实例
const router = useRouter()

// 角色选择器状态
const showRolePicker = ref(false)

// 计算属性
const currentData = computed(() => getDataByRole(store.userRole))
const achievements = computed(() => currentData.value.achievements)
const accountBalance = computed(() => commonData.accountBalance)
const orderFilters = computed(() => commonData.orderFilters)

// 运单状态列表（6个状态）
const orderStatusList = computed(() => [
  { key: 'accepted', label: '已接单', icon: 'checked', count: 0 },
  { key: 'transporting', label: '运输中', icon: 'logistics', count: 0 },
  { key: 'pending_review', label: '待复核', icon: 'passed', count: 19 },
  { key: 'pending_settlement', label: '待结算', icon: 'balance-list-o', count: 99 },
  { key: 'completed', label: '已完成', icon: 'success', count: 18 },
  { key: 'exception', label: '有异常', icon: 'warning-o', count: 3 }
])

// 默认头像
const defaultAvatar = 'https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg'

// 角色动作列表：水路船东、公路司机、企业职员
const roleActions = computed(() => [
  {
    name: '水路船东',
    value: 'shipOwner',
    disabled: store.currentWorkspace === 'personal' && store.userRole === 'shipOwner'
  },
  {
    name: '公路司机',
    value: 'driver',
    disabled: store.currentWorkspace === 'personal' && store.userRole === 'driver'
  },
  {
    name: '企业职员',
    value: 'enterprise',
    disabled: store.currentWorkspace === 'enterprise'
  }
])

/**
 * 获取里程标签
 */
const getMileageLabelText = () => {
  const mileageData = getMileageLabel(store.userRole)
  return mileageData.label
}

/**
 * 获取里程数值
 */
const getMileageValue = () => {
  const mileageData = getMileageLabel(store.userRole)
  return mileageData.value
}

/**
 * 获取车辆/船舶标签
 */
const getVehicleLabelText = () => {
  const vehicleData = getVehicleLabel(store.userRole)
  return vehicleData.label
}

/**
 * 获取车辆/船舶图标
 */
const getVehicleIcon = () => {
  const vehicleData = getVehicleLabel(store.userRole)
  return vehicleData.icon
}

/**
 * 获取统一标签显示文本
 */
const getUnifiedDisplayText = () => {
  if (store.currentWorkspace === 'enterprise') {
    return '企业员工'
  }
  return store.userRole === 'driver' ? '公路司机' : '水路船东'
}

/**
 * 显示角色选择器
 */
const showUnifiedSelector = () => {
  showRolePicker.value = true
}

/**
 * 处理角色选择
 */
const onRoleSelect = (item) => {
  showRolePicker.value = false // 选择后立即关闭

  if (item.value === 'driver' || item.value === 'shipOwner') {
    // 更新个人空间的角色
    if (item.value !== store.userRole && typeof store.setUserRole === 'function') {
      store.setUserRole(item.value)
    }
    if (store.currentWorkspace !== 'personal') {
      if (typeof store.switchWorkspace === 'function') {
        store.switchWorkspace('personal')
      } else {
        store.setCurrentWorkspace('personal')
      }
    }
    router.push('/main/paohuo')
    const roleName = item.value === 'driver' ? '公路司机' : '水路船东'
    showToast({ message: `已切换为：${roleName}`, duration: 2000 })
  } else if (item.value === 'enterprise') {
    // 切换到企业空间
    if (typeof store.switchWorkspace === 'function') {
      store.switchWorkspace('enterprise')
    } else {
      store.setCurrentWorkspace('enterprise')
    }
    router.push('/enterprise/home')
    showToast({ message: '已切换为：企业职员', duration: 2000 })
  }
}

/**
// （已合并到统一选择器）移除单独的工作空间选择逻辑

/**
 * 格式化金额
 */
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 处理认证中心点击
 */
const handleAuthCenter = () => {
  showToast('认证中心功能（Demo版本）')
}

/**
 * 处理运单状态点击
 */
const handleOrderStatus = (status) => {
  showToast(`查看${status.label}（Demo版本）`)
}

/**
 * 处理运单更多点击
 */
const handleOrderMore = () => {
  router.push('/main/yundan')
}

/**
 * 处理我的关注
 */
const handleFavorites = () => {
  showToast('我的关注功能（Demo版本）')
}

/**
 * 处理我的码买
 */
const handleQRCode = () => {
  showToast('我的码夹功能（Demo版本）')
}

/**
 * 处理支出记录
 */
const handleExpenseRecord = () => {
  showToast('支出记录功能（Demo版本）')
}

/**
 * 处理工资条
 */
const handleSalaryRecord = () => {
  showToast('工资条功能（Demo版本）')
}

/**
 * 处理余额详情
 */
const handleBalanceDetail = () => {
  showToast('余额详情功能（Demo版本）')
}

/**
 * 处理提现
 */
const handleWithdraw = () => {
  showToast('提现功能（Demo版本）')
}

/**
 * 处理运单筛选
 */
const handleOrderFilter = (filter) => {
  showToast(`查看${filter.label}（Demo版本）`)
}

/**
 * 处理车辆/船舶管理
 */
const handleVehicleManage = () => {
  if (store.userRole === 'driver') {
    router.push('/main/vehicle')
  } else {
    router.push('/main/ship')
  }
}

/**
 * 处理证件管理
 */
const handleCertificates = () => {
  showToast('证件管理功能（Demo版本）')
}

/**
 * 处理保险服务
 */
const handleInsurance = () => {
  showToast('保险服务功能（Demo版本）')
}

/**
 * 处理紧急联系
 */
const handleEmergency = () => {
  showToast('紧急联系功能（Demo版本）')
}

/**
 * 处理入场预约记录（仅司机角色）
 */
const handleEntryRecord = () => {
  showToast('入场预约记录功能（Demo版本）')
}

/**
 * 处理进城申请记录
 */
const handleCityApplicationRecord = () => {
  showToast('进城申请记录功能（Demo版本）')
}

/**
 * 处理过磅记录（仅司机角色）
 */
const handleWeighingRecord = () => {
  showToast('过磅记录功能（Demo版本）')
}

/**
 * 处理收入记录
 */
const handleIncomeRecord = () => {
  showToast('收入记录功能（Demo版本）')
}

/**
// （已合并到统一选择器）移除单独的企业空间切换

/**
 * 处理异常报备
 */
const handleExceptionReport = () => {
  router.push('/main/exception')
}

/**
 * 处理服务中心
 */
const handleServiceCenter = () => {
  showToast('服务中心功能（Demo版本）')
}

/**
 * 处理帮助反馈
 */
const handleHelpFeedback = () => {
  showToast('帮助反馈功能（Demo版本）')
}

/**
 * 处理客服热线
 */
const handleHotline = () => {
  showConfirmDialog({
    title: '联系客服',
    message: '拨打客服热线：400-500-5689',
    confirmButtonText: '拨打',
    cancelButtonText: '取消'
  })
    .then(() => {
      try {
        window.location.href = 'tel:4005005689'
      } catch (e) {
        showToast('请在手机设备上拨打：400-500-5689')
      }
    })
    .catch(() => {})
}

/**
 * 处理退出登录
 */
const handleLogout = async () => {
  try {
    const result = await showConfirmDialog({
      title: '退出登录',
      message: '确定要退出当前账户吗？',
      confirmButtonText: '确定退出',
      cancelButtonText: '取消'
    })
    
    if (result === 'confirm') {
      // 清除用户数据
      localStorage.removeItem('userRole')
      localStorage.removeItem('currentWorkspace')
      localStorage.removeItem('isLoggedIn')
      
      // 跳转到登录页
      router.push('/login')
      showToast('已退出登录')
    }
  } catch (error) {
    // 用户取消操作
    console.log('用户取消退出')
  }
}



/**
 * 组件挂载时初始化
 */
onMounted(() => {
  console.log('我的页面已加载，当前角色：', store.getRoleDisplayName())
})
</script>

<style scoped>
/**
 * 我的页面样式 - 严格遵循卡片化布局
 */
.my-container {
  min-height: 100vh;
  background: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
}

/* 通用卡片样式 */
.profile-card,
.order-center-card,
.related-card,
.function-card,
.other-card {
  background-color: #ffffff;
  border-radius: 12px;
  margin: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 工作空间切换样式 */
.workspace-switch {
  margin: 12px;
}

.switch-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.switch-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1989fa;
}

.switch-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f8ff 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.switch-content {
  flex: 1;
}

.switch-title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.switch-desc {
  font-size: 12px;
  color: #969799;
  line-height: 1.3;
}

.switch-arrow {
  color: #c8c9cc;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.switch-card:hover .switch-arrow {
  transform: translateX(2px);
  color: #1989fa;
}

/* 个人信息区样式 */
.profile-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

/* 标签容器样式 */
.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}

/* 企业标签样式 */
.enterprise-tag {
  background-color: #e8f3ff !important;
  color: #1989fa !important;
  border-color: #1989fa !important;
}

/* 认证标签样式 */
.certification-tag {
  background-color: #f0f9ff !important;
  color: #07c160 !important;
  border-color: #07c160 !important;
}

.role-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  padding: 4px 12px;
  height: auto;
  line-height: 1.2;
  border: none;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
}

.role-tag:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
}

.role-tag:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(25, 137, 250, 0.2);
}

/* 可点击标签样式（与企业空间保持一致） */
.clickable-tag {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.clickable-tag:hover {
  transform: scale(1.05);
}

.clickable-tag::after {
  content: '⇄';
  margin-left: 4px;
  font-size: 10px;
  opacity: 0.8;
}

/* 工作空间标签样式 */
.workspace-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  padding: 4px 12px;
  height: auto;
  line-height: 1.2;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.workspace-tag:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.workspace-tag:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-stats {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 14px;
  color: #666;
  font-weight: 400;
  line-height: 1.4;
}

.stat-divider {
  color: #ddd;
  font-weight: 300;
  font-size: 12px;
}







/* 卡片标题和更多链接样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.card-more {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* 运单中心网格样式 */
.order-grid-custom {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-grid-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.order-grid-row-single {
  justify-content: center;
}

.order-grid-item-custom {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.order-grid-item-custom:hover {
  background-color: #f5f5f5;
}

.order-grid-item-custom:active {
  transform: scale(0.95);
}

.grid-icon-container {
  position: relative;
  margin-bottom: 6px;
}

.grid-icon {
  color: #666;
  font-size: 22px;
}

.grid-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  transform: scale(0.8);
}

.grid-label {
  font-size: 11px;
  color: #666;
  text-align: center;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.2;
}

/* 与我相关网格样式 */
.related-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.related-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.related-item:hover {
  background-color: #f5f5f5;
}

.related-item:active {
  transform: scale(0.95);
}

.related-icon {
  color: #1989fa;
  margin-bottom: 8px;
}

.related-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.2;
}

/* 功能列表样式 */
.function-card .van-cell-group--inset {
  margin: 0;
}

.function-cell {
  padding: 16px;
}

.cell-icon-wrapper {
  width: 32px;
  height: 32px;
  background: #f7f8fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.cell-icon {
  color: #1989fa;
}

.cell-title {
  font-size: 15px;
  color: #323233;
  font-weight: 500;
}

.cell-subtitle {
  font-size: 13px;
  color: #969799;
  margin-top: 2px;
}

/* 其他相关样式 */
.other-row {
  display: flex;
  gap: 12px;
}

.other-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: #fff;
}

.other-icon {
  color: #1989fa;
  margin-bottom: 8px;
}

.other-title {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.other-subtitle {
  font-size: 12px;
  color: #969799;
  margin-top: 2px;
}

/* 退出登录按钮样式 */
.logout-section {
  margin: 20px 16px;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .profile-card,
  .order-center-card,
  .related-card,
  .function-card {
    margin: 8px;
    padding: 12px;
  }
  
  .user-name {
    font-size: 16px;
  }
  
  .card-title {
    font-size: 15px;
  }
}





/* 角色选择动作面板样式 */
.role-picker-sheet {
  --van-action-sheet-max-height: 50%;
}

.role-picker-sheet .van-action-sheet__header {
  padding: 20px 16px 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  border-bottom: 1px solid #f0f0f0;
}

.role-picker-sheet .van-action-sheet__item {
  padding: 16px;
  font-size: 16px;
  color: #323233;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.role-picker-sheet .van-action-sheet__item:hover {
  background-color: #f7f8fa;
}

.role-picker-sheet .van-action-sheet__item--disabled {
  color: #c8c9cc;
  cursor: not-allowed;
}

.role-picker-sheet .van-action-sheet__cancel {
  padding: 16px;
  font-size: 16px;
  color: #646566;
  background-color: #f7f8fa;
  border-top: 8px solid #f0f0f0;
}


</style>

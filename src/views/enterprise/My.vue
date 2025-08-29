<template>
  <div class="enterprise-my">
    <!-- 用户信息区 -->
    <div class="profile-section">
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar-wrapper">
            <van-image
              round
              width="60"
              height="60"
              :src="userInfo.avatar"
              fit="cover"
            />
          </div>
          <div class="user-details">
            <h3 class="username">{{ userInfo.name }}</h3>
            <div class="user-tags">
              <van-tag type="primary" size="small" @click="showUnifiedSelector" class="clickable-tag">{{ getUnifiedDisplayText() }}</van-tag>
              <van-tag size="small" class="enterprise-tag">企业职员</van-tag>
              <van-tag type="success" size="small" class="certification-tag">{{ userInfo.certification }}</van-tag>
            </div>
            <div class="company-info">
              <van-icon name="shop-o" size="12" />
              <span>{{ userInfo.company }}</span>
            </div>
          </div>
        </div>
        <div class="settings-btn" @click="handleSettings">
          <van-icon name="setting-o" size="20" />
        </div>
      </div>
    </div>


    <!-- 我的服务 -->
    <div class="service-section">
      <van-cell-group inset>
        <div class="service-header">
          <h3 class="service-title">常用应用</h3>
        </div>
        <van-grid :column-num="4" :border="false" class="service-grid">
          <van-grid-item 
            v-for="item in serviceList" 
            :key="item.id"
            :text="item.name"
            @click="handleServiceClick(item)"
          >
            <template #icon>
              <div class="service-icon" :style="{ backgroundColor: item.iconBg }">
                <van-icon :name="item.icon" size="20" :color="item.iconColor" />
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </van-cell-group>
    </div>

    <!-- 功能列表和系统功能合并 -->
    <div class="function-system-section">
      <van-cell-group inset>
        <van-cell 
          v-for="item in functionList" 
          :key="item.id"
          :title="item.title"
          :label="item.description"
          is-link
          @click="handleFunctionClick(item)"
        >
          <template #icon>
            <div class="function-icon" :style="{ backgroundColor: item.iconBg }">
              <van-icon :name="item.icon" size="18" :color="item.iconColor" />
            </div>
          </template>
        </van-cell>
        
        <van-cell 
          v-for="item in systemList" 
          :key="item.id"
          :title="item.title"
          :label="item.description"
          is-link
          @click="handleSystemClick(item)"
        >
          <template #icon>
            <div class="system-icon">
              <van-icon :name="item.icon" size="18" color="#969799" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
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
      v-model:show="showUnifiedSelectorSheet"
      :actions="unifiedActions"
      @select="onUnifiedSelect"
      cancel-text="取消"
      title="选择身份/空间"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'
import { store } from '@/store'

const router = useRouter()

// 统一选择器状态
const showUnifiedSelectorSheet = ref(false)

// 用户信息
const userInfo = ref({
  name: '张经理',
  role: '企业管理员',
  certification: '已认证',
  company: '顺丰物流有限公司',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
})

// 当前角色状态（个人空间下）
const currentRole = ref(store.userRole) // 'driver' | 'shipOwner'

// 统一动作列表：水路船东、公路司机、企业职员
const unifiedActions = computed(() => [
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

// 功能列表
const functionList = ref([
  {
    id: 1,
    title: '账户与安全',
    description: '密码修改、安全设置',
    icon: 'lock',
    iconColor: '#1989fa',
    iconBg: '#e8f3ff'
  }
])

// 我的服务列表
const serviceList = ref([
  {
    id: 1,
    name: '账户与安全',
    icon: 'lock',
    iconColor: '#1989fa',
    iconBg: '#e8f3ff'
  },
  {
    id: 2,
    name: '企业信息',
    icon: 'shop-o',
    iconColor: '#07c160',
    iconBg: '#f0f9ff'
  },
  {
    id: 3,
    name: '消息设置',
    icon: 'bell',
    iconColor: '#ff976a',
    iconBg: '#fff7e6'
  },
  {
    id: 4,
    name: '帮助客服',
    icon: 'service-o',
    iconColor: '#7232dd',
    iconBg: '#f3f0ff'
  },
  {
    id: 5,
    name: '我的回单',
    icon: 'description',
    iconColor: '#ee0a24',
    iconBg: '#ffe6e6'
  },
  {
    id: 6,
    name: '运单开票',
    icon: 'bill-o',
    iconColor: '#00b42a',
    iconBg: '#e8f9e8'
  },
  {
    id: 7,
    name: '数据统计',
    icon: 'chart-trending-o',
    iconColor: '#ff6b35',
    iconBg: '#fff2e6'
  },
  {
    id: 8,
    name: '更多服务',
    icon: 'apps-o',
    iconColor: '#8a8a8a',
    iconBg: '#f5f5f5'
  }
])

// 系统功能列表
const systemList = ref([
  {
    id: 1,
    title: '帮助与客服',
    description: '使用帮助、在线客服',
    icon: 'question-o'
  },
  {
    id: 2,
    title: '意见反馈',
    description: '问题反馈、建议提交',
    icon: 'comment-o'
  },
  {
    id: 3,
    title: '关于我们',
    description: '版本信息、公司介绍',
    icon: 'info-o'
  }
])

// 事件处理函数
const handleSettings = () => {
  showToast('打开设置')
}

const showUnifiedSelector = () => {
  showUnifiedSelectorSheet.value = true
}

const onUnifiedSelect = (action) => {
  const value = action.value
  if (value === 'enterprise') {
    if (typeof store.switchWorkspace === 'function') {
      store.switchWorkspace('enterprise')
    } else {
      store.setCurrentWorkspace('enterprise')
    }
    router.push('/enterprise/home')
    showToast({ message: '已切换为：企业员工', duration: 2000 })
    showUnifiedSelectorSheet.value = false
    return
  }

  // 司机/船东 → 切回个人空间
  if (value !== store.userRole && typeof store.setUserRole === 'function') {
    store.setUserRole(value)
  }
  if (store.currentWorkspace !== 'personal') {
    if (typeof store.switchWorkspace === 'function') {
      store.switchWorkspace('personal')
    } else {
      store.setCurrentWorkspace('personal')
    }
  }
  router.push('/main/paohuo')
  const roleName = value === 'driver' ? '公路司机' : '水路船东'
  showToast({ message: `已切换为：${roleName}`, duration: 2000 })
  showUnifiedSelectorSheet.value = false
}

// 展示统一身份/空间的标签文案
const getUnifiedDisplayText = () => {
  if (store.currentWorkspace === 'enterprise') {
    return '企业员工'
  }
  return store.userRole === 'driver' ? '公路司机' : '水路船东'
}

const handleFunctionClick = (item) => {
  showToast(`打开功能：${item.title}`)
}

const handleServiceClick = (item) => {
  showToast(`打开服务：${item.name}`)
}

const handleSystemClick = (item) => {
  showToast(`打开系统功能：${item.title}`)
}

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

onMounted(() => {
  console.log('企业我的页已加载')
})
</script>

<style scoped>
.enterprise-my {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

.profile-section {
  background: linear-gradient(135deg, #1989fa 0%, #4fc3f7 100%);
  padding: 20px 16px 24px;
  color: white;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.username {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: white;
}

.user-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
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



.settings-btn {
  color: white;
  cursor: pointer;
  padding: 4px;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  opacity: 0.9;
}

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


.function-section, .service-section, .system-section {
  margin: 12px 0;
}

.function-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

/* 我的服务模块样式 */
.service-section {
  margin: 12px 0;
}

.service-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f5f5f5;
}

.service-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #323233;
}

.service-grid {
  padding: 16px 0;
}

.service-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.service-icon:hover {
  transform: scale(1.05);
}

/* 覆盖van-grid-item的默认样式 */
.service-grid :deep(.van-grid-item__content) {
  padding: 12px 8px;
  background: transparent;
}

.service-grid :deep(.van-grid-item__text) {
  font-size: 12px;
  color: #646566;
  margin-top: 4px;
  line-height: 1.2;
}

/* 功能列表和系统功能合并模块样式 */
.function-system-section {
  margin: 12px 0;
}

.function-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.system-icon {
  width: 32px;
  height: 32px;
  background: #f7f8fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.logout-section {
  margin: 20px 16px;
}

/* 响应式优化 */
@media (max-width: 375px) {
  .profile-section {
    padding: 16px 12px 20px;
  }
  
  .username {
    font-size: 16px;
  }
  

}
</style>

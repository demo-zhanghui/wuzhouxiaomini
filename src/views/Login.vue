<!--
  登录页面组件
  实现用户登录和角色选择功能
  
  核心功能：
  1. 手机号和验证码输入
  2. 角色切换器（司机/船东）
  3. 获取验证码倒计时
  4. 登录验证和跳转
-->

<template>
  <!-- 模拟手机容器，与公路司机页一致 -->
  <div class="app-container">
    <div class="layout-container">
      <div class="login-container">
        <!-- 顶部状态栏 -->
        <div class="status-bar">
          <span class="time">9:41</span>
          <div class="status-icons">
            <van-icon name="signal" size="16" />
            <van-icon name="wifi" size="16" />
            <van-icon name="battery-full" size="16" />
          </div>
        </div>

        <!-- 顶部Logo区域 -->
        <div class="logo-section">
          <div class="logo-icon">🚛</div>
          <h1 class="app-title">智慧梧州港物流信息平台</h1>
          <p class="app-subtitle">公路·水路·统一平台</p>
        </div>

        <!-- 登录方式选择器 -->
        <div class="login-method-selector">
          <!-- 快捷登录按钮 -->
          <div class="login-button-section">
            <van-button
              round
              block
              type="primary"
              size="large"
              :loading="isQuickLoading"
              class="quick-login-button"
              @click="showPhoneSelector = true"
            >
              <van-icon name="wechat" size="18" />
              {{ isQuickLoading ? '登录中...' : '快捷登录' }}
            </van-button>
          </div>

          <!-- 账号密码登录按钮 -->
          <div class="login-button-section">
            <van-button
              round
              block
              size="large"
              class="password-login-button"
              @click="showPasswordForm = true"
            >
              <van-icon name="user-o" size="18" />
              账号密码登录
            </van-button>
          </div>
        </div>

        <!-- 账号密码登录表单 -->
        <div v-if="showPasswordForm" class="password-login-form">
          <van-form @submit="handlePasswordLogin">
            <!-- 账号输入框 -->
            <van-field
              v-model="formData.username"
              name="username"
              label="账号"
              placeholder="请输入账号"
              :rules="usernameRules"
              left-icon="user-o"
              maxlength="30"
            />

            <!-- 密码输入框 -->
            <van-field
              v-model="formData.password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="passwordRules"
              left-icon="lock"
              type="password"
              maxlength="20"
            />

            <!-- 登录按钮 -->
            <div class="submit-section">
              <van-button
                round
                block
                type="primary"
                native-type="submit"
                :loading="isLoading"
                class="submit-button"
              >
                {{ isLoading ? '登录中...' : '登录' }}
              </van-button>
            </div>
          </van-form>
        </div>

        <!-- 手机号选择弹窗 -->
        <van-popup
          v-model:show="showPhoneSelector"
          position="bottom"
          :style="{ height: '60%' }"
          round
          closeable
        >
          <div class="phone-selector-popup">
            <h3 class="popup-title">选择登录手机号</h3>
            <div class="phone-list">
              <div 
                v-for="phone in phoneList" 
                :key="phone.number"
                class="phone-item"
                @click="selectPhone(phone)"
              >
                <div class="phone-info">
                  <div class="phone-number">{{ phone.number }}</div>
                  <div class="phone-desc">{{ phone.description }}</div>
                </div>
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </van-popup>

        <!-- 登录表单区域 -->
        <div class="form-section">
          <!-- 服务协议 -->
          <div class="agreement-section">
            <van-checkbox v-model="agreedToTerms" icon-size="14px">
              <span class="agreement-text">
                登录即代表您已同意
                <span class="agreement-link" @click="showAgreement('service')">《用户服务协议》</span>
                和
                <span class="agreement-link" @click="showAgreement('privacy')">《隐私政策》</span>
              </span>
            </van-checkbox>
          </div>
        </div>

        <!-- 协议弹窗 -->
        <van-popup
          v-model:show="showAgreementPopup"
          position="bottom"
          :style="{ height: '70%' }"
          round
          closeable
        >
          <div class="agreement-popup">
            <h3 class="agreement-title">{{ currentAgreementTitle }}</h3>
            <div class="agreement-content">
              <p>{{ currentAgreementContent }}</p>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页面逻辑
 * 处理用户登录、角色选择、表单验证等功能
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { store } from '@/store'

// 路由实例
const router = useRouter()

// 响应式数据定义
const formData = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const isQuickLoading = ref(false)
const agreedToTerms = ref(true)
const showAgreementPopup = ref(false)
const currentAgreementType = ref('')
const showPhoneSelector = ref(false) // 控制手机号选择弹窗
const showPasswordForm = ref(false) // 控制账号密码表单

// 手机号列表数据
const phoneList = ref([
  {
    number: '138****8888',
    description: '公路运输公司 - 张三',
    type: 'road'
  },
  {
    number: '139****9999', 
    description: '水路运输公司 - 李四',
    type: 'water'
  },
  {
    number: '137****7777',
    description: '综合物流公司 - 王五',
    type: 'comprehensive'
  }
])

/**
 * 选择手机号进行快捷登录
 */
const selectPhone = async (phone) => {
  // 关闭弹窗
  showPhoneSelector.value = false
  
  // 开始加载
  isQuickLoading.value = true
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 根据手机号类型设置用户角色
    let userRole = 'driver' // 默认公路司机
    let roleName = '公路司机'
    
    switch (phone.type) {
      case 'road':
        userRole = 'driver'
        roleName = '公路司机'
        break
      case 'water':
        userRole = 'captain'
        roleName = '水路船东'
        break
      case 'comprehensive':
        userRole = 'manager'
        roleName = '综合管理员'
        break
    }
    
    // 模拟快捷登录成功
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userRole', userRole)
    
    // 设置用户角色到全局状态
    if (typeof store.setUserRole === 'function') {
      store.setUserRole(userRole)
    }
    
    showToast({ 
      message: `快捷登录成功，欢迎${roleName}！`, 
      duration: 1500 
    })
    
    setTimeout(() => {
      // 根据用户角色跳转到对应空间
      if (userRole === 'driver' || userRole === 'captain') {
        // 司机和船东跳转到跑货页面
        router.replace('/main/paohuo')
      } else {
        // 企业管理员跳转到企业空间首页
        router.replace('/enterprise/home')
      }
    }, 600)
    
  } catch (error) {
    console.error('快捷登录失败:', error)
    showToast('快捷登录失败，请重试')
  } finally {
    isQuickLoading.value = false
  }
}

/**
 * 表单验证规则
 */
const usernameRules = [
  { required: true, message: '请输入账号' }
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^.{6,}$/, message: '密码至少6位' }
]

/**
 * 计算属性
 */
// 账号/密码登录无需验证码逻辑

// 当前协议标题
const currentAgreementTitle = computed(() => {
  return currentAgreementType.value === 'service' ? '用户服务协议' : '隐私政策'
})

// 当前协议内容
const currentAgreementContent = computed(() => {
  if (currentAgreementType.value === 'service') {
    return `
      欢迎使用承运商统一APP！
      
      本协议是您与我们之间关于使用本应用服务的法律协议。
      
      1. 服务内容
      我们为承运商提供统一的货运信息平台服务，包括但不限于订单管理、运输跟踪、结算服务等。
      
      2. 用户责任
      用户应确保提供信息的真实性和准确性，遵守相关法律法规。
      
      3. 服务变更
      我们保留随时修改或终止服务的权利，并会提前通知用户。
      
      本协议的最终解释权归本公司所有。
    `
  } else {
    return `
      我们非常重视您的隐私保护！
      
      本政策说明我们如何收集、使用和保护您的个人信息。
      
      1. 信息收集
      我们会收集您的手机号、位置信息等必要信息以提供服务。
      
      2. 信息使用
      收集的信息仅用于提供服务、改善用户体验和保障账户安全。
      
      3. 信息保护
      我们采用行业标准的安全措施保护您的个人信息。
      
      4. 信息共享
      除法律要求外，我们不会向第三方分享您的个人信息。
      
      如有疑问，请联系我们的客服。
    `
  }
})

// 已移除验证码逻辑

/**
 * 处理账号密码登录
 */
const handlePasswordLogin = async () => {
  // 检查是否同意协议
  if (!agreedToTerms.value) {
    showToast('请先同意用户服务协议和隐私政策')
    return
  }
  
  // 开始加载
  isLoading.value = true
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Demo规则：非空账号且密码≥6位即通过
    if (formData.value.username && formData.value.password && formData.value.password.length >= 6) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'driver') // 默认设置为公路司机
      
      // 设置用户角色到全局状态
      if (typeof store.setUserRole === 'function') {
        store.setUserRole('driver')
      }
      
      showToast({ 
        message: `登录成功，欢迎公路司机！`, 
        duration: 1500 
      })
      
      setTimeout(() => {
        // 账号密码登录默认跳转到企业空间
        router.replace('/enterprise/home')
      }, 600)
    } else {
      showToast('账号或密码不正确')
    }
    
  } catch (error) {
    console.error('登录失败:', error)
    showToast('登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}

/**
 * 显示协议弹窗
 * @param {string} type - 协议类型 ('service' | 'privacy')
 */
const showAgreement = (type) => {
  currentAgreementType.value = type
  showAgreementPopup.value = true
}

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  // 已登录则直接跳转
  if (localStorage.getItem('isLoggedIn') === 'true') {
    const userRole = localStorage.getItem('userRole') || 'driver'
    
    // 设置用户角色到全局状态
    if (typeof store.setUserRole === 'function') {
      store.setUserRole(userRole)
    }
    
    // 根据用户角色跳转到对应空间
    const currentUserRole = localStorage.getItem('userRole') || 'driver'
    if (currentUserRole === 'driver' || currentUserRole === 'captain') {
      // 司机和船东跳转到跑货页面
      router.replace('/main/paohuo')
    } else {
      // 企业管理员跳转到企业空间首页
      router.replace('/enterprise/home')
    }
  }
  console.log('登录页面已加载')
})
</script>

<style scoped>
/**
 * 登录页面样式
 */
/* 模拟手机外壳，与 Layout.vue 保持一致 */
.app-container {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.layout-container {
  width: 100%;
  max-width: 375px;
  height: 100%;
  max-height: 812px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--background-color);
}

/* 登录容器 */
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 顶部状态栏（对标公路司机） */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.status-icons {
  display: flex;
  gap: 4px;
}

/* Logo区域样式 */
.logo-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 60px 0 40px;
}

.logo-icon {
  font-size: 64px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.app-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 300;
}

/* 表单区域样式 */
.form-section {
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 24px 24px 40px;
  margin: 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

/* 登录方式选择器样式 */
.login-method-selector {
  padding: 0 24px;
  margin-bottom: 32px;
}

.login-button-section {
  margin-bottom: 16px;
}

.quick-login-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.password-login-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: #fff;
  border: 2px solid #e8e8e8;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.password-login-button:hover {
  border-color: #667eea;
  color: #667eea;
}

/* 账号密码登录表单样式 */
.password-login-form {
  padding: 0 24px;
  margin-bottom: 24px;
}

/* 手机号选择弹窗样式 */
.phone-selector-popup {
  padding: 24px;
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.phone-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.phone-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phone-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.phone-info {
  flex: 1;
}

.phone-number {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.phone-desc {
  font-size: 12px;
  color: #666;
}

.phone-item .van-icon {
  color: #999;
  font-size: 16px;
}

/* 已移除标签页相关样式 */

/* 验证码按钮样式 */
.code-button {
  height: 32px;
  font-size: 12px;
  min-width: 80px;
}

/* 已移除角色切换器样式 */

/* 登录按钮样式 */
.submit-section {
  margin: 32px 0 24px;
}

.submit-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, var(--primary-color), #4facfe);
  border: none;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
}

/* 协议区域样式 */
.agreement-section {
  text-align: center;
}

.agreement-text {
  font-size: 12px;
  color: #646566;
  line-height: 1.5;
}

.agreement-link {
  color: var(--primary-color);
  text-decoration: none;
  cursor: pointer;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 协议弹窗样式 */
.agreement-popup {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.agreement-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: #323233;
}

.agreement-content {
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
  color: #646566;
  white-space: pre-line;
}

/* 响应式设计 */
@media (max-height: 700px) {
  .logo-section {
    padding: 40px 0 20px;
  }
  
  .logo-icon {
    font-size: 48px;
  }
  
  .app-title {
    font-size: 24px;
  }
}

/* 表单字段样式覆盖 */
:deep(.van-field) {
  margin-bottom: 16px;
}

:deep(.van-field__label) {
  font-weight: 500;
}

:deep(.van-radio-group) {
  display: flex;
  gap: 12px;
}
</style>

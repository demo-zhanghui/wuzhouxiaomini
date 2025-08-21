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
  <div class="login-container">
    <!-- 顶部Logo区域 -->
    <div class="logo-section">
      <div class="logo-icon">
        🚛
      </div>
      <h1 class="app-title">承运商统一APP</h1>
      <p class="app-subtitle">公路·水路·统一平台</p>
    </div>

    <!-- 登录表单区域 -->
    <div class="form-section">
      <van-form @submit="handleLogin">
        <!-- 手机号输入框 -->
        <van-field
          v-model="formData.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="phoneRules"
          left-icon="phone-o"
          maxlength="11"
          type="tel"
        />

        <!-- 验证码输入框 -->
        <van-field
          v-model="formData.code"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
          :rules="codeRules"
          left-icon="shield-o"
          maxlength="6"
          type="number"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="isCodeButtonDisabled"
              @click="getVerificationCode"
              class="code-button"
            >
              {{ codeButtonText }}
            </van-button>
          </template>
        </van-field>

        <!-- 【Demo核心】角色切换器 -->
        <div class="role-selector">
          <div class="role-title">
            <van-icon name="user-o" />
            <span>模拟登录角色</span>
          </div>
          <van-radio-group v-model="selectedRole" direction="horizontal">
            <van-radio name="driver" class="role-radio">
              <template #icon="props">
                <div class="role-option" :class="{ active: props.checked }">
                  <van-icon name="logistics" size="20" />
                  <span>公路司机</span>
                </div>
              </template>
            </van-radio>
            <van-radio name="shipOwner" class="role-radio">
              <template #icon="props">
                <div class="role-option" :class="{ active: props.checked }">
                  <van-icon name="gem-o" size="20" />
                  <span>水路船东</span>
                </div>
              </template>
            </van-radio>
          </van-radio-group>
        </div>

        <!-- 登录按钮 -->
        <div class="submit-section">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="isLoading"
            class="login-button"
          >
            {{ isLoading ? '登录中...' : '登录/注册' }}
          </van-button>
        </div>
      </van-form>

      <!-- 服务协议 -->
      <div class="agreement-section">
        <van-checkbox v-model="agreedToTerms" icon-size="14px">
          <span class="agreement-text">
            登录/注册即代表您已同意
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
</template>

<script setup>
/**
 * 登录页面逻辑
 * 处理用户登录、角色选择、表单验证等功能
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { store } from '@/store'

// 路由实例
const router = useRouter()

// 响应式数据定义
const formData = ref({
  phone: '',    // 手机号
  code: ''      // 验证码
})

const selectedRole = ref('driver')        // 选中的角色，默认为司机
const isLoading = ref(false)             // 登录加载状态
const agreedToTerms = ref(true)          // 是否同意服务协议
const countdown = ref(0)                 // 验证码倒计时
const showAgreementPopup = ref(false)    // 显示协议弹窗
const currentAgreementType = ref('')     // 当前显示的协议类型

/**
 * 表单验证规则
 */
const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]

const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '请输入6位数字验证码' }
]

/**
 * 计算属性
 */
// 验证码按钮是否禁用
const isCodeButtonDisabled = computed(() => {
  return countdown.value > 0 || !formData.value.phone || !/^1[3-9]\d{9}$/.test(formData.value.phone)
})

// 验证码按钮文本
const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}秒后重试` : '获取验证码'
})

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

/**
 * 获取验证码
 * Demo版本：模拟倒计时，无需真实发送短信
 */
const getVerificationCode = () => {
  // 开始倒计时
  countdown.value = 60
  
  // 倒计时逻辑
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // 显示成功提示
  showToast({
    message: '验证码已发送（Demo版本：输入任意6位数字即可）',
    duration: 3000
  })
}

/**
 * 处理登录提交
 * Demo版本：简单验证后直接登录成功
 */
const handleLogin = async () => {
  // 检查是否同意协议
  if (!agreedToTerms.value) {
    showToast('请先同意用户服务协议和隐私政策')
    return
  }
  
  // 开始加载
  isLoading.value = true
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo版本：任意6位数字都可以通过验证
    if (formData.value.code.length === 6) {
      // 设置用户角色到全局状态
      store.setUserRole(selectedRole.value)
      
      // 显示登录成功提示
      const roleText = selectedRole.value === 'driver' ? '公路司机' : '水路船东'
      showToast({
        message: `登录成功！当前角色：${roleText}`,
        duration: 2000
      })
      
      // 延迟跳转到主页
      setTimeout(() => {
        router.replace('/main/paohuo')
      }, 1000)
      
    } else {
      showToast('请输入正确的验证码')
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
  // 如果已经登录，直接跳转到主页
  if (localStorage.getItem('userRole')) {
    router.replace('/main/paohuo')
  }
  
  console.log('登录页面已加载')
})
</script>

<style scoped>
/**
 * 登录页面样式
 */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  padding: 0 24px;
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
  padding: 32px 24px 40px;
  margin: 0 -24px -24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

/* 验证码按钮样式 */
.code-button {
  height: 32px;
  font-size: 12px;
  min-width: 80px;
}

/* 角色选择器样式 */
.role-selector {
  margin: 24px 0;
  padding: 20px 16px;
  background: #f8f9ff;
  border-radius: 12px;
  border: 1px solid #e8eaff;
}

.role-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.role-title .van-icon {
  margin-right: 6px;
  color: var(--primary-color);
}

.role-radio {
  flex: 1;
  margin: 0;
}

.role-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border-radius: 8px;
  border: 2px solid #e8eaff;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.role-option.active {
  border-color: var(--primary-color);
  background: #f0f8ff;
  color: var(--primary-color);
}

.role-option .van-icon {
  margin-bottom: 6px;
}

.role-option span {
  font-size: 12px;
  font-weight: 500;
}

/* 登录按钮样式 */
.submit-section {
  margin: 32px 0 24px;
}

.login-button {
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

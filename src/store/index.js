/**
 * 全局状态管理
 * 负责管理用户角色状态，实现动态适配的核心功能
 * 
 * 支持的角色类型：
 * - 'driver': 公路司机
 * - 'shipOwner': 水路船东
 */

import { reactive } from 'vue'

// 创建响应式状态对象
export const store = reactive({
  // 当前用户角色，默认为司机
  userRole: 'driver', // 'driver' | 'shipOwner'
  
  // 用户基本信息
  userInfo: {
    name: '张师傅',
    phone: '138****8888',
    avatar: '', // 头像URL
    isVerified: true, // 是否已认证
  },

  /**
   * 设置用户角色
   * @param {string} role - 用户角色 ('driver' | 'shipOwner')
   */
  setUserRole(role) {
    this.userRole = role
    // 持久化存储到本地
    localStorage.setItem('userRole', role)
    
    // 根据角色更新用户信息
    this.updateUserInfoByRole(role)
    
    console.log(`角色已切换为: ${role === 'driver' ? '公路司机' : '水路船东'}`)
  },

  /**
   * 根据角色更新用户信息
   * @param {string} role - 用户角色
   */
  updateUserInfoByRole(role) {
    if (role === 'driver') {
      this.userInfo.name = '张师傅'
      this.userInfo.phone = '138****8888'
    } else if (role === 'shipOwner') {
      this.userInfo.name = '李船长'
      this.userInfo.phone = '139****9999'
    }
  },

  /**
   * 初始化用户角色
   * 从本地存储中恢复角色状态
   */
  initUserRole() {
    const savedRole = localStorage.getItem('userRole')
    if (savedRole && ['driver', 'shipOwner'].includes(savedRole)) {
      this.userRole = savedRole
      this.updateUserInfoByRole(savedRole)
    }
  },

  /**
   * 获取角色显示名称
   * @returns {string} 角色的中文显示名称
   */
  getRoleDisplayName() {
    return this.userRole === 'driver' ? '公路司机' : '水路船东'
  },

  /**
   * 检查是否为司机角色
   * @returns {boolean}
   */
  isDriver() {
    return this.userRole === 'driver'
  },

  /**
   * 检查是否为船东角色
   * @returns {boolean}
   */
  isShipOwner() {
    return this.userRole === 'shipOwner'
  },

  /**
   * 清除用户数据（退出登录时使用）
   */
  clearUserData() {
    this.userRole = 'driver'
    this.userInfo = {
      name: '',
      phone: '',
      avatar: '',
      isVerified: false,
    }
    localStorage.removeItem('userRole')
  }
})

// 应用启动时初始化角色状态
store.initUserRole()

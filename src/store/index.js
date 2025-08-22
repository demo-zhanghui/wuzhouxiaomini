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
  
  // 当前工作空间，默认为个人空间
  currentWorkspace: 'personal', // 'personal' | 'enterprise'
  
  // 用户基本信息
  userInfo: {
    name: '张师傅',
    phone: '138****8888',
    avatar: '', // 头像URL
    isVerified: true, // 是否已认证
    // 企业信息
    companyName: '顺通物流有限公司',
    companyStatus: '已认证',
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
   * 设置当前工作空间
   * @param {string} workspace - 工作空间 ('personal' | 'enterprise')
   */
  setCurrentWorkspace(workspace) {
    this.currentWorkspace = workspace
    // 持久化存储到本地
    localStorage.setItem('currentWorkspace', workspace)
    
    console.log(`工作空间已切换为: ${workspace === 'personal' ? '个人空间' : '企业空间'}`)
  },

  /**
   * 切换工作空间（与 setCurrentWorkspace 等价，便于语义化调用）
   * @param {string} workspace - 工作空间 ('personal' | 'enterprise')
   */
  switchWorkspace(workspace) {
    this.setCurrentWorkspace(workspace)
  },

  /**
   * 初始化用户角色
   * 从本地存储中恢复状态
   */
  initUserRole() {
    const savedRole = localStorage.getItem('userRole')
    if (savedRole && ['driver', 'shipOwner'].includes(savedRole)) {
      this.userRole = savedRole
      this.updateUserInfoByRole(savedRole)
    }
  },

  /**
   * 初始化工作空间
   * 从本地存储中恢复状态
   */
  initWorkspace() {
    const savedWorkspace = localStorage.getItem('currentWorkspace')
    if (savedWorkspace && ['personal', 'enterprise'].includes(savedWorkspace)) {
      this.currentWorkspace = savedWorkspace
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
   * 检查是否在个人空间
   * @returns {boolean}
   */
  isPersonalWorkspace() {
    return this.currentWorkspace === 'personal'
  },

  /**
   * 检查是否在企业空间
   * @returns {boolean}
   */
  isEnterpriseWorkspace() {
    return this.currentWorkspace === 'enterprise'
  },

  /**
   * 获取工作空间显示名称
   * @returns {string} 工作空间的中文显示名称
   */
  getWorkspaceDisplayName() {
    return this.currentWorkspace === 'personal' ? '个人空间' : '企业空间'
  },

  /**
   * 清除用户数据（退出登录时使用）
   */
  clearUserData() {
    this.userRole = 'driver'
    this.currentWorkspace = 'personal'
    this.userInfo = {
      name: '',
      phone: '',
      avatar: '',
      isVerified: false,
      companyName: '',
      companyStatus: '',
    }
    localStorage.removeItem('userRole')
    localStorage.removeItem('currentWorkspace')
  }
})

// 应用启动时初始化角色状态
store.initUserRole()
// 应用启动时初始化工作空间状态
store.initWorkspace()

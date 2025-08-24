/**
 * 路由配置文件
 * 定义应用的所有路由规则和页面导航
 * 支持个人空间和企业空间的动态切换
 */

import { createRouter, createWebHistory } from 'vue-router'

// 导入布局组件
import Layout from '@/views/Layout.vue'

// 导入页面组件
import Login from '@/views/Login.vue'
import YunDan from '@/views/YunDan.vue'
import Paohuo from '@/views/Paohuo.vue'
import My from '@/views/My.vue'
import YunDanDetail from '@/views/YunDanDetail.vue'
import LoadingDetail from '@/views/LoadingDetail.vue'
import UnloadingDetail from '@/views/UnloadingDetail.vue'

// 导入企业工作空间页面组件
import EnterpriseHome from '@/views/enterprise/Home.vue'
import EnterpriseTodo from '@/views/enterprise/Todo.vue'
import EnterpriseWorkbench from '@/views/enterprise/Workbench.vue'
import EnterpriseApps from '@/views/enterprise/Apps.vue'
import EnterpriseMy from '@/views/enterprise/My.vue'

/**
 * 路由配置数组
 * 包含个人空间和企业空间的路由结构
 */
const routes = [
  {
    path: '/',
    redirect: '/login' // 默认进入登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      hideLayout: true
    }
  },
  
  // 个人空间路由（司机/船东）
  {
    path: '/main',
    component: Layout,
    redirect: '/main/paohuo',
    meta: {
      workspace: 'personal',
      title: '个人空间'
    },
    children: [
      {
        path: 'yundan',
        name: 'YunDan',
        component: YunDan,
        meta: {
          title: '运单',
          workspace: 'personal'
        }
      },
      {
        path: 'paohuo',
        name: 'Paohuo',
        component: Paohuo,
        meta: {
          title: '跑货',
          workspace: 'personal'
        }
      },
      {
        path: 'my',
        name: 'My',
        component: My,
        meta: {
          title: '我的',
          workspace: 'personal'
        }
      },
      // 运单详情页面
      {
        path: 'yundan/:id',
        name: 'YunDanDetail',
        component: YunDanDetail,
        meta: {
          title: '运单详情',
          workspace: 'personal'
        }
      },
      // 装货详情页面
      {
        path: 'loading/:id',
        name: 'LoadingDetail',
        component: LoadingDetail,
        meta: {
          title: '装货详情',
          workspace: 'personal'
        }
      },
      // 卸货详情页面
      {
        path: 'unloading/:id',
        name: 'UnloadingDetail',
        component: UnloadingDetail,
        meta: {
          title: '卸货详情',
          workspace: 'personal'
        }
      }
    ]
  },
  
  // 企业空间路由
  {
    path: '/enterprise',
    component: Layout,
    redirect: '/enterprise/home',
    meta: {
      workspace: 'enterprise',
      title: '企业空间'
    },
    children: [
      {
        path: 'home',
        name: 'EnterpriseHome',
        component: EnterpriseHome,
        meta: {
          title: '首页',
          workspace: 'enterprise'
        }
      },
      {
        path: 'todo',
        name: 'EnterpriseTodo',
        component: EnterpriseTodo,
        meta: {
          title: '待办',
          workspace: 'enterprise'
        }
      },
      {
        path: 'workbench',
        name: 'EnterpriseWorkbench',
        component: EnterpriseWorkbench,
        meta: {
          title: '工作台',
          workspace: 'enterprise'
        }
      },
      {
        path: 'apps',
        name: 'EnterpriseApps',
        component: EnterpriseApps,
        meta: {
          title: '应用',
          workspace: 'enterprise'
        }
      },
      {
        path: 'my',
        name: 'EnterpriseMy',
        component: EnterpriseMy,
        meta: {
          title: '我的',
          workspace: 'enterprise'
        }
      }
    ]
  }
]

/**
 * 创建路由实例
 * 使用HTML5 History模式，提供更好的用户体验
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局前置守卫
 * 用于路由跳转前的权限检查、工作空间同步和页面标题设置
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    const workspaceText = to.meta.workspace === 'enterprise' ? '企业空间' : '承运商APP'
    document.title = `${to.meta.title} - ${workspaceText}`
  }

  // 同步工作空间状态
  if (to.meta.workspace) {
    // 导入store（动态导入避免循环依赖）
    import('@/store').then(({ store }) => {
      if (typeof store.switchWorkspace === 'function') {
        store.switchWorkspace(to.meta.workspace)
      } else if (typeof store.setCurrentWorkspace === 'function') {
        store.setCurrentWorkspace(to.meta.workspace)
      }
    })
  }

  // Demo版本：在非登录页时，自动设置默认用户角色与工作空间
  if (to.path !== '/login') {
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'driver') // 默认设置为司机角色
    }
    if (!localStorage.getItem('currentWorkspace')) {
      localStorage.setItem('currentWorkspace', 'personal') // 默认设置为个人空间
    }
  }
  
  next()
})

export default router
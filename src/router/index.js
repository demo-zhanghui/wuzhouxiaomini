/**
 * 路由配置文件
 * 定义应用的所有路由规则和页面导航
 */

import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import Paohuo from '@/views/Paohuo.vue'

import YunDan from '@/views/YunDan.vue'
import My from '@/views/My.vue'
import VehicleManage from '@/views/VehicleManage.vue'
import ShipManage from '@/views/ShipManage.vue'
import ExceptionReport from '@/views/ExceptionReport.vue'
import YunDanDetail from '@/views/YunDanDetail.vue'
import LoadingDetail from '@/views/LoadingDetail.vue'
import UnloadingDetail from '@/views/UnloadingDetail.vue'

/**
 * 路由配置数组
 * 每个路由对象包含路径、组件、元信息等配置
 */
const routes = [
  {
    path: '/',
    redirect: '/main' // 默认重定向到APP主界面
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      hideTabbar: true // 登录页不显示底部导航
    }
  },
  {
    path: '/main',
    name: 'Layout',
    component: Layout,
    redirect: '/main/paohuo', // 默认显示跑货页
    children: [
      {
        path: 'paohuo',
        name: 'Paohuo',
        component: Paohuo,
        meta: {
          title: '跑货',
          tabbarIndex: 1 // 对应底部导航的索引
        }
      },
      {
        path: 'yundan',
        name: 'YunDan',
        component: YunDan,
        meta: {
          title: '运单',
          tabbarIndex: 3
        }
      },
      {
        path: 'waybill/:id',
        name: 'WaybillDetail',
        component: YunDanDetail,
        meta: {
          title: '运单详情',
          hideTabbar: true
        }
      },
      {
        path: 'my',
        name: 'My',
        component: My,
        meta: {
          title: '我的',
          tabbarIndex: 4
        }
      },
      {
        path: 'vehicle',
        name: 'VehicleManage',
        component: VehicleManage,
        meta: {
          title: '车辆管理',
          hideTabbar: true
        }
      },
      {
        path: 'ship',
        name: 'ShipManage',
        component: ShipManage,
        meta: {
          title: '船舶管理',
          hideTabbar: true
        }
      },
      {
        path: 'exception',
        name: 'ExceptionReport',
        component: ExceptionReport,
        meta: {
          title: '异常报备',
          hideTabbar: true
        }
      },
      {
        path: 'loading/:id',
        name: 'LoadingDetail',
        component: LoadingDetail,
        meta: {
          title: '装货详情',
          hideTabbar: true
        }
      },
      {
        path: 'unloading/:id',
        name: 'UnloadingDetail',
        component: UnloadingDetail,
        meta: {
          title: '卸货详情',
          hideTabbar: true
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
 * 用于路由跳转前的权限检查和页面标题设置
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 承运商统一APP`
  }

  // Demo版本：自动设置默认用户角色（用于演示）
  if (!localStorage.getItem('userRole')) {
    localStorage.setItem('userRole', 'driver') // 默认设置为司机角色
  }
  
  next()
})

export default router

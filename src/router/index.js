import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/loginWecomSuccess',
    component: () => import('@/views/login/loginWecomSuccess'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/reservation',
    meta: { title: '会议预约', icon: 'img-hyyy', affix: true },
    children: [
      {
        path: 'reservation',
        component: () => import('@/views/meeting/reservation'),
        name: 'reservation',
        meta: { title: '会议室预约', icon: 'img-hyyy', affix: true }
      }
      // {
      //   path: 'online',
      //   component: () => import('@/views/meeting/onlineMeeting'),
      //   name: 'onlineMeeting',
      //   meta: { title: '线上会议预约', icon: 'img-dqhy', affix: true }
      // }
    ]
  },
  {
    path: '/currentMeeting',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/meeting/currentMeeting'),
        name: 'currentMeeting',
        meta: { title: '当前会议', icon: 'img-dqhy', affix: true }
      }
    ]
  },
  {
    path: '/historyMeeting',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/meeting/historyMeeting'),
        name: 'historyMeeting',
        meta: { title: '历史会议', icon: 'img-lshy', affix: true }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/meeting/statistics'),
        name: 'statistics',
        meta: { title: '数据统计', icon: 'img-sjtj', affix: true }
      }
    ]
  },
  {
    path: '/dorwayScreen',
    component: () => import('@/views/meeting/dorwayScreen'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/manageMeeting',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/meeting/manageMeeting'),
        name: 'manageMeeting',
        meta: { title: '会议管理', roles: ['admin'], icon: 'img-dqhy', affix: true }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

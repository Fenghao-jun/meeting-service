import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/dorwayScreen', '/loginWecomSuccess'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        const { roles } = await store.dispatch('user/getInfo')
        // determine whether the user has obtained his permission roles through getInfo
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        router.addRoutes(accessRoutes)
        // console.log('getInfo', to, accessRoutes, router)
        // 目前导致卡死，暂时没理解清楚为什么要在这里添加子路由
        // router.addRoutes(accessRoutes)
        // console.log({ ...to, replace: true })
        next({ ...to, replace: true })
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }

  // if (hasToken) {
  //   if (to.path === "/login" || to.path === "/appLoadingPage") {
  //     next();
  //     NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  //   } else {
  //     // 菜单没有数据 返回登录
  //     if (!store.getters.menus || store.getters.menus.length === 0) {
  //       next("/login");
  //       // 放顶部了
  //       // store.dispatch('GenerateRoutes', { menus: store.getters.menus }).then(() => { // 根据roles权限生成可访问的路由表
  //       //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
  //       // })
  //     } else {
  //       next();
  //     }
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // 在免登录白名单，直接进入
  //     if (
  //       !store.getters.permission_routers ||
  //       store.getters.permission_routers.length === 0
  //     ) {
  //       store.dispatch("GenerateRoutes", {}).then(() => {
  //         // 根据roles权限生成可访问的路由表
  //         // addRouter(store.getters.addRouters) // 动态添加可访问路由表
  //         for (const x of store.getters.addRouters) {
  //           router.addRoute(x);
  //         }
  //         next({ ...to, replace: true });
  //       });
  //     } else {
  //       next();
  //     }
  //   } else {
  //     next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
  //     NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
  //   }

  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

import Vue from 'vue'
import VueRouter from 'vue-router'
// 如果目录下是加载index开头的，就可以省略，index.vue/index.js可以省略
import Login from '@/views/login'
import Layout from '@/views/layout'
import DashBoard from '@/views/dashboard'
import Article from '@/views/article'
import Test from '@/views/test'
import store from '@/store'
Vue.use(VueRouter)

// 创建路由对象
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        { path: '/dashboard', component: DashBoard },
        { path: '/article', component: Article }
      ]
    },
    // 这个test是为了测试一下弹出对话框，与实际本项目功能无关
    { path: '/test', component: Test }
  ]
})

// 页面分类：登录页 和 非登录页
// 逻辑：登录页可以访问的，但是其他所有的页面，都需要token才能访问
// 问题：什么时候需要拦截到登录？
// 非登录页 且 无token => 直接拦截到登录，其他情况正常放行

// 全局前置导航守卫 => 实现登录访问拦截(只有登录过的用户，才能往里面看)
router.beforeEach((to, from, next) => {
  // 通过原生vuex语法，获取到vuex中的token，记住：以vuex为主，storage为辅，统一入口！
  const token = store.state.user.token
  if (to.path !== '/login' && !token) {
    // 需要拦截 (去的不是登录，且还没token) 拦截到登录
    next('/login')
  } else {
    // 要么是去登录，要么是有token，都是直接放行
    next()
  }
})

export default router

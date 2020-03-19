import Vue from 'vue'
import Router from 'vue-router'

import home from '@/router/home.js'

Vue.use(Router)

const router = new Router({
    // mode: 'history',
    routes:[
        {
            path:'/',
            redirect:'/index'
        },
        {   
            name:'index',
            path: '/index',
            component: resolve => require(['@/views/index.vue'], resolve),
            children:[
            ],
            meta:{
                keepAlive: false
            }

        },
        ...home
    ]
})

//路由守卫
// router.beforeEach(async (to, from, next) => {
//     if (to.matched.length === 0) { // 如果未匹配到路由
//     //   from.name ? next({name: from.name}) : next('/login') // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
//     } else {
//       // 如果匹配到正确跳转
//       next()
//     }
// })
  
// router.afterEach((to) => {
// })

export default router
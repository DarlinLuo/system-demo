/**
 * 首页路由
 **/
export default[
    //首页路由
    {
        name:'goods.main',
        path:'/goods/main',
        component:resolve => void (require(['@/views/goods/main.vue'], resolve)),
        meta: {
            keepAlive: false,
            breadcrumb: [
              { name: '', href: null }
            ]
          }
    }
]
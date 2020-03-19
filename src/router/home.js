/**
 * 首页路由
 **/
export default[
    //首页路由
    {
        name:'home',
        path:'/home',
        component:resolve => void (require(['@/views/home/main.vue'], resolve)),
        meta: {
            keepAlive: false,
            breadcrumb: [
              { name: '', href: null }
            ]
          }
    }
]
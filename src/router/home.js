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
              { name: '商品管理', href: null },
              { name: '商品信息', href: null }
            ]
          }
    },
    //定价路由
    {
      name:'goods.prices',
      path:'/goods/prices',
      component:resolve => void (require(['@/views/goods/prices.vue'], resolve)),
      meta: {
          keepAlive: false,
          breadcrumb: [
            { name: '商品管理', href: null },
            { name: '价格保护', href: null },
          ]
        }
  }
]
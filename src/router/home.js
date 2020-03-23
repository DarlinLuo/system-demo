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
      path:'/goods/price-protection',
      component:resolve => void (require(['@/views/goods/prices.vue'], resolve)),
      meta: {
          keepAlive: false,
          breadcrumb: [
            { name: '商品管理', href: null },
            { name: '价格保护', href: null },
          ]
        }
  },
  // 折扣上下限
  {
    name: 'goods.discount.limit',
    path: '/goods/discount-limit',
    component: resolve => void (require(['@/views/goods/discountLimit.vue'], resolve)),
    meta: {
      keepAlive: false,
      breadcrumb: [
        { name: '商品管理', href: null },
        { name: '导入折扣上下线', href: null }
      ]
    }
  },
  // 导入商品定价
  {
    name: 'goods.pricing',
    path: '/goods/pricing',
    component: resolve => void (require(['@/views/goods/pricing.vue'], resolve)),
    meta: {
      keepAlive: false,
      breadcrumb: [
        { name: '商品管理', href: null },
        { name: '导入定价列表', href: null }
      ]
    }
  }
]
/**
 * 策划页面
* */
export default [
  // 首页
  {
    name: 'scheme.index',
    path: '/scheme/schemepage',
    component: resolve => require(['@/views/scheme/schemepage.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '策划列表',
        href: null
      },
      {
        name: '首页',
        href: null
      }
      ]
    }
  },
  // 店铺列表
  {
    name: 'scheme.storepage',
    path: '/scheme/storepage',
    component: resolve => require(['@/views/scheme/storepage.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '策划列表',
        href: null
      },
      {
        name: '店铺列表',
        href: null
      }
      ]
    }
  }, // 店铺列表
  {
    name: 'scheme.records',
    path: '/scheme/records',
    component: resolve => require(['@/views/scheme/records.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '策划列表',
        href: null
      },
      {
        name: '策划页面',
        href: null
      }
      ]
    }
  }]

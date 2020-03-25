/**
 * 策划页面
* */
export default [
  // 计划列表
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
  }]

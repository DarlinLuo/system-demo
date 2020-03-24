/**
 * 商品规划页面
 **/
export default [
  // 计划列表
  {
    name: 'plan.planlist',
    path: '/plan/plan-list',
    component: resolve => require(['@/views//plan/planList/planList.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '计划管理',
        href: null
      },
      {
        name: '计划列表',
        href: null
      }
      ]
    }
  },
  // 销售目标新增
  {
    name: 'plan.target.index',
    path: '/plan/target/index/:id/:type/:year',
    component: resolve => require(['@/views//plan/target/index.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '计划管理',
        href: null
      },
      {
        name: '计划列表',
        href: null
      },
      {
        name: '',
        href: null
      }
      ]
    }
  },
  // 商品规划-买货总规划
  {
    name: 'plan.purchase.overall',
    path: '/plan/purchase/overall/:id/:type',
    component: resolve => require(['@/views/plan/purchase/overall.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '计划管理',
        href: null
      },
      {
        name: '计划列表',
        href: null
      },
      {
        name: '',
        href: null
      }
      ]
    }
  },
  {
    name: 'plan.purchase.quarter',
    path: '/plan/purchase/quarter/:id/:type/:name',
    component: resolve => require(['@/views/plan/purchase/quarter.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '计划管理',
        href: null
      },
      {
        name: '计划列表',
        href: null
      },
      {
        name: '',
        href: null
      }
      ]
    }
  },
  {
    name: 'plan.purchase.details',
    path: '/plan/purchase/details',
    component: resolve => require(['@/views/plan/purchase/details.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '计划管理',
        href: null
      },
      {
        name: '计划列表',
        href: null
      },
      {
        name: '买货详情',
        href: null
      }
      ]
    }
  },
  {
    name: 'plan.purchase.category',
    path: '/plan/purchase/category/:id/:type/:year/:target_saleroom/:target_year/:goods_type/:annual_cumulative_discount',
    component: resolve => require(['@/views/plan/purchase/category.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [{
        name: '计划管理',
        href: null
      },
      {
        name: '计划列表',
        href: null
      },
      {
        name: '',
        href: null
      }
      ]
    }
  }
]


export default [
  {
    name: 'brand',
    path: '/brand',
    component: resolve => require(['@/views/brand/brand.vue'], resolve),
    meta: {
      keepAlive: false,
      breadcrumb: [
        { name: '品牌数据管理', href: null },
        { name: '品牌列表', href: null }
      ]
    }
  }
]

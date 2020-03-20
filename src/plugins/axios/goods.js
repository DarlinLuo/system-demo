//接口模块化管理示例
export default {
    api: new Map([
      [
        'v1.0.0',
        {
          // 获取品牌
          getBrandList: {
            url: 'api/aggregation/brand',
            method: 'get'
          }
        }
      ]
    ])
  }
  
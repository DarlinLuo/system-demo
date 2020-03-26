// 模块名称
export const moduleEnums = {
  'header': '店招',

  'navigation-module': '导航栏模块',
  'poster-module': '海报/焦点图模块',
  'coupon-module': '优惠券模块',
  'gift-module': '赠品模块',

  'custom-module': '自定义模块',
  'collection-module': '专场模块',
  'collection-absolute-module': '定位专场模块',
  'collection-custom-module': '自定义专场模块',
  'category-module': '分类模块',
  'category-absolute-module': '定位分类模块',
  'category-custom-module': '自定义分类模块',
  'recommendation-module': '主推荐模块',
  'bulletin-module': '品牌宣传模块',

  'tarbar-module': '选项卡',

  getValue (key) {
    for (let i in this) {
      if (i === key) {
        return this[i]
      }
    }
    return ''
  }

}

// 元素名称
export const elementEnums = {
  'navigation-element': '导航分类元素',
  'navigation-collection-element': '导航专场元素',
  'goods-element': '商品元素',
  'goods-absolute-element': '商品元素',
  'focus-element': '海报元素',
  'gift-element': '赠品元素',
  'coupon-element': '优惠券元素',
  'category-element': '分类入口元素',
  'category-absolute-element': '分类入口元素',
  'collection-element': '专场入口元素',
  'collection-absolute-element': '专场入口元素',
  'recommendation-element': '推荐专场元素',
  'bulletin-element': '品牌入口元素',
  'text-element': '文字元素',
  'image-element': '图片元素',

  'tarbar-element': '选项卡元素',

  getValue (key) {
    for (let i in this) {
      if (i === key) {
        return this[i]
      }
    }
    return ''
  }

}

export const seasonEnums = {
  '1': '春',
  '2': '夏',
  '3': '秋',
  '4': '冬',
  getValue (key) {
    for (let i in this) {
      if (typeof this[i] !== 'function') {
        if (i === key) {
          return this[i]
        }
      }
    }
    return ''
  },
  getOptions () {
    let options = []
    for (let i in this) {
      if (typeof this[i] !== 'function') {
        options.push({
          season: i,
          label: this[i],
          disabled: false
        })
      }
    }
    return options
  }
}

// 侧重类型
export const emphasisTypeEnums = {
  '0': 'none',
  '1': 'year',
  '2': 'season',
  '3': 'category',
  '4': 'periodicity',
  getValue (key) {
    for (let i in this) {
      if (i === key) {
        return this[i]
      }
    }
    return ''
  },
  getKey (value) {
    for (let i in this) {
      if (this[i] === value) {
        return i
      }
    }
    return ''
  }
}

// 条件类型
export const conditionTypeEnums = {
  '0': 'filter',
  '1': 'exclude',
  getValue (key) {
    for (let i in this) {
      if (i === key) {
        return this[i]
      }
    }
    return ''
  },
  getKey (value) {
    for (let i in this) {
      if (this[i] === value) {
        return i
      }
    }
    return ''
  }
}

// 推荐类型
export const recommendTypeEnums = {
  '0': 'saleNumber',
  '1': 'saleMoney',
  getValue (key) {
    for (let i in this) {
      if (i === key) {
        return this[i]
      }
    }
    return ''
  },
  getKey (value) {
    for (let i in this) {
      if (this[i] === value) {
        return i
      }
    }
    return ''
  }
}

// 专场 page_type
export const collectionPageType = {
  1: 'index',
  2: 'news',
  3: 'best',
  4: 'mall',
  5: 'special',
  6: 'buy_three_free_one',
  7: 'package_discount',
  8: 'poly_cost_effective',
  9: 'collection',
  10: 'star',
  getValue (key) {
    for (let i in this) {
      if (Number(i) === Number(key)) {
        return this[i]
      }
    }
    return ''
  },
  getKey (value) {
    for (let i in this) {
      if (this[i] === value) {
        return i
      }
    }
    return ''
  }
}

export const schemeIcon = new Map([
  ['v1', {
    'tarbar-module': 'icon-tarbar-module',
    'navigation-module': 'icon-navigation-module',
    'category-module': 'icon-category-module',
    'category-absolute-module': 'icon-category-absolute-module',
    'category-custom-module': 'icon-category-custom-module',
    'collection-module': 'icon-collection-module',
    'collection-absolute-module': 'icon-collection-absolute-module',
    'collection-custom-module': 'icon-collection-custom-module',
    'poster-module': 'icon-poster-module',
    'coupon-module': 'icon-coupon-module',
    'gift-module': 'icon-gift-module',
    'bulletin-module': 'icon-bulletin-module',
    'recommendation-module': 'icon-recommendation-module',
    'custom-module': 'icon-custom-module',
    'blank-element': 'icon-blank-element',
    'tarbar-element': 'icon-tarbar-element',
    'navigation-element': 'icon-navigation-element',
    'navigation-collection-element': 'icon-navigation-collection-element',
    'category-element': 'icon-category-element',
    'category-absolute-element': 'icon-category-absolute-element',
    'collection-element': 'icon-collection-element',
    'collection-absolute-element': 'icon-collection-absolute-element',
    'recommendation-element': 'icon-recommendation-element',
    'coupon-element': 'icon-coupon-element',
    'gift-element': 'icon-gift-element',
    'image-element': 'icon-image-element',
    'text-element': 'icon-text-element',
    'goods-element': 'icon-goods-element',
    'goods-absolute-element': 'icon-goods-absolute-element',
    'focus-element': 'icon-focus-element',
    'bulletin-element': 'icon-bulletin-element'
  }],
  ['v2', {
    'tarbar-module': 'icon-tb-tarbar-module',
    'navigation-module': 'icon-tb-navigation-module',
    'category-module': 'icon-tb-category-module',
    'category-absolute-module': 'icon-tb-category-absolute-module',
    'category-custom-module': 'icon-tb-category-custom-module',
    'collection-module': 'icon-tb-collection-module',
    'collection-absolute-module': 'icon-tb-collection-absolute-module',
    'collection-custom-module': 'icon-tb-collection-custom-module',
    'poster-module': 'icon-tb-poster-module',
    'coupon-module': 'icon-tb-coupon-module',
    'gift-module': 'icon-tb-gift-module',
    'bulletin-module': 'icon-tb-bulletin-module',
    'recommendation-module': 'icon-tb-recommendation-module',
    'custom-module': 'icon-tb-custom-module',
    'blank-element': 'icon-tb-blank-element',
    'tarbar-element': 'icon-tb-tarbar-element',
    'navigation-element': 'icon-tb-navigation-element',
    'navigation-collection-element': 'icon-tb-navigation-collection-element',
    'category-element': 'icon-tb-category-element',
    'category-absolute-element': 'icon-tb-category-absolute-element',
    'collection-element': 'icon-tb-collection-element',
    'collection-absolute-element': 'icon-tb-collection-absolute-element',
    'recommendation-element': 'icon-tb-recommendation-element',
    'coupon-element': 'icon-tb-coupon-element',
    'gift-element': 'icon-tb-gift-element',
    'image-element': 'icon-tb-image-element',
    'text-element': 'icon-tb-text-element',
    'goods-element': 'icon-tb-goods-element',
    'goods-absolute-element': 'icon-tb-goods-absolute-element',
    'focus-element': 'icon-tb-focus-element',
    'bulletin-element': 'icon-tb-bulletin-element'
  }]
])

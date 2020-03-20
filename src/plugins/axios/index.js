import Vue from 'vue'

import request from '@/plugins/axios/request'
import { Loading } from 'element-ui'

import { transformRequestFn } from '@/utils/index'

const version = 'v1.0.0'

let urls = {
  goods: require('./goods').default.api.get(version)
}

let debounceTimer
const debounce = (fn, delay) => {
  var delay = delay || 200

  var th = this
  var args = arguments
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(function () {
    debounceTimer = null
    fn.apply(th, args)
  }, delay)
}

let loading = null

let item2Function = (item) => {
  if (item['url']) {
    return function (params = {}, options = {
      showLoading: true,
      isGetFormDataId: false,
      isFormData: false,
      config: {},
      toUrlParams: false
    }) {
      if (options.showLoading === undefined) options.showLoading = true
      if (options.config === undefined) options.config = {}
      if (options.edit === undefined) options.edit = false

      let dataKey = 'data'

      if (item['method'] && (item['method'].toLowerCase() === 'get' || item['method'].toLowerCase() === 'delete')) {
        dataKey = 'params'
      }

      let url = `/${item['url']}` // 对应代理的/api
      if (params.id && url.match(/\{id\}/)) {
        url = url.replace(/\{id\}/, params.id)
        // delete params.id;
      }
      if (params.brand_id && url.match(/\{brand_id\}/)) {
        url = url.replace(/\{brand_id\}/, params.brand_id)
      }
      if (options.isGetFormDataId && url.match(/\{id\}/)) {
        url = url.replace(/\{id\}/, params.get('id'))
      }

      if (options.toUrlParams) {
        url = url + '?' + transformRequestFn(options.toUrlParams)
      }

      let formDataParams
      // post请求，参数处理成formData格式
      if (options.isFormData) {
        formDataParams = new URLSearchParams()
        for (let prop in params) {
          if (params.hasOwnProperty(prop)) {
            formDataParams.append(prop, params[prop])
          }
        }
      }

      if (options.showLoading) {
        loading = Loading.service({
          customClass: 'loading-bis-custom',
          spinner: 'lit-gif-loading',
          background: 'rgba(0,0,0,0.6)',
          text: '数据加载中...',
          fullscreen: true
        })
      }

      return request({
        url,
        [dataKey]: options.isFormData ? formDataParams : params,
        method: item['method'] ? item['method'] : 'get'
      }).then(rs => {
        if (options.showLoading && loading) {
          debounce(function () {
            loading.close()
          }, 1000)
        }
        return rs.data
      }).catch(err => {
        // console.log(err)
        if (options.showLoading && loading) {
          loading.close()
        }
        throw new Error(err)
        // return err.response ? err.response.data : { code: -400 } // 修改返回层级和正常一致
      })
    }
  } else {
    return function () {
      console.log('接口未定义')
    }
  }
}

let tranUrls = (urls) => {
  let apis = {}

  for (let v in urls) {
    apis[v] = urls[v].url ? item2Function(urls[v]) : tranUrls(urls[v])
  }
  return apis
}
export const api = tranUrls(urls)

const apiInstall = {
  install (Vue) {
    Vue.prototype.$api = api //挂载到vue全局中使用
  }
}

Vue.use(apiInstall)

/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '@/router/index' // 请求异常按需跳转到设置好的异常页面，这里不需要

import { Notification } from 'element-ui'

axios.defaults.baseURL = Object.is(process.env.NODE_ENV, 'development') ? '/api' : window.location.origin

// 请求超时时间30秒
axios.defaults.timeout = 30000

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器 响应拦截及异常处理
axios.interceptors.response.use(
  res => {
    // 接口报错处理
    if (res.data.code && res.data.code !== 0) {
      Notification({
        title: '失败',
        message: res.data.message,
        type: 'error',
        duration: 5000
      })
      return Promise.reject(res)
    }
    return res
  },
  error => {
    console.log(error)
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          console.log('错误请求')
          break
        case 401:
          console.log('未授权，请重新登录')
          break
        case 403:
          console.log('拒绝访问')
          break
        case 404:
          console.log('请求错误,未找到该资源')
          break
        case 405:
          console.log('请求方法未允许')
          break
        case 408:
          console.log('请求超时')
          break
        case 500:
          console.log('服务器端出错')
          break
        case 501:
          console.log('网络未实现')
          break
        case 502:
          console.log('网络错误')
          break
        case 503:
          console.log('服务不可用')
          break
        case 504:
          console.log('网络超时')
          break
        case 505:
          console.log('http版本不支持该请求')
          break
        default:
          console.log(`连接错误${error.response.status}`)
      }
    } else {
      console.log('连接到服务器失败')
    }
    return Promise.resolve(error.response)
  }
)

export default axios

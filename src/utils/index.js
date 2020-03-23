/*
 * @Author: darlinking
 * @Date: 2019-12-20 16:03:20
 * @Last Modified by: lizhenchao
 * @Last Modified time: 2020-03-10 11:55:39
 */
export function isArrayObject (data) {
    return (
      Object.prototype.toString.call(data) === '[object Array]' &&
      Object.prototype.toString.call(data[0]) === '[object Object]'
    )
  }
  
  export function isObject (data) {
    return Object.prototype.toString.call(data) === '[object Object]'
  }
  
  export function isFunction (data) {
    return Object.prototype.toString.call(data) === '[object Function]'
  }
  
  export function isArray (data) {
    return Object.prototype.toString.call(data) === '[object Array]'
  }
  
  export function isString (data) {
    return Object.prototype.toString.call(data) === '[object String]'
  }
  
  export function clone (val, sort) {
    return val instanceof Object ? JSON.parse(JSON.stringify(val)) : val
  }
  
  export function paramsToFormData (obj) {
    if (isObject(obj)) {
      let params = new URLSearchParams()
      for (let key in obj) {
        params.append(key, obj[key])
      }
      return params
    }
    return obj
  }
  
  export function isPositiveNumber (number) {
    return number > 0
  }
  
  // 转换千分号
  export function toThousands (num) {
    if (num === null) return null
    num = (num || 0).toString()
    let number = 0
    let floatNum = ''
    let intNum = ''
    let isPositive = true
  
    // 判断正数
    if (num[0] === '-') {
      num = Math.abs(num).toString()
      isPositive = false
    }
  
    // 判断是否有小数位，有则截取小数点后的数字
    if (num.indexOf('.') > 0) {
      number = num.indexOf('.') // 获取小数点出现的位置
      floatNum = num.substr(number) // 截取arr.substr(form, length)
      intNum = num.substring(0, number) // 截取arr.substring(start, end)
    } else {
      intNum = num
    }
    let result = []
    let counter = 0
    intNum = intNum.split('')
    // 利用3的倍数，向数组插入','
    for (let i = intNum.length - 1; i >= 0; i--) {
      counter++
      result.unshift(intNum[i])
      if (!(counter % 3) && i !== 0) {
        result.unshift(',')
      }
    }
    return (!isPositive ? '-' : '') + result.join('') + floatNum || ''
  }
  
  /**
   * 还原千分号字符串
   * @param {*} str 带千分号字符串
   */
  export function thousandToNumber (str) {
    if (str === null) return null
    str = str.replace(/,/g, '')
    return Number(str)
  }
  
  /**
   * 数组（对象）通过制定键排序
   * @param array
   * @param key
   * @param orderBy
   */
  export function arraySortByKey (array, key, orderBy = 'desc') {
    return array.sort(compare(key, orderBy))
  }
  
  function compare (key, orderBy) {
    return function (a, b) {
      var value1 = a[key]
      var value2 = b[key]
  
      if (orderBy === 'asc') {
        return value1 - value2
      }
  
      return value2 - value1
    }
  }
  
  /**
   * 当前修改路由参数
   * @param url
   * @param arg
   * @param arg_val
   * @returns {*}
   */
  // eslint-disable-next-line camelcase
  export function changeUrl (url, arg, arg_val) {
    var pattern = arg + '=([^&]*)'
    // eslint-disable-next-line camelcase
    var replaceText = arg + '=' + arg_val
    if (url.match(pattern)) {
      var tmp = '/(' + arg + '=)([^&]*)/gi'
      // eslint-disable-next-line no-eval
      tmp = url.replace(eval(tmp), replaceText)
      return tmp
    } else {
      if (url.match('[?]')) {
        return url + '&' + replaceText
      } else {
        return url + '?' + replaceText
      }
    }
  }
  
  /**
   * 数组换位置
   * @param {array} arr 数组
   * @param {index} index1 数组下标1
   * @param {index} index2 数组下标2
   */
  export function swapArr (arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
  }
  
  /**
   * 数组中的元素移动到指定位置
   * @param {*} arr 要操作的数组
   * @param {*} moveIndsArr 要移动的元素下标数组
   * @param {*} moveToInd 目标下标值
   * @param {*} isBeforeAfter 移动到目标值前/后（0/1）
   */
  export function moveArray (arr, moveIndsArr, moveToInd, isBeforeAfter) {
    var temp = []
    moveIndsArr.sort(function (x, y) { return x - y })
    moveToInd += isBeforeAfter
    for (var i = 0; i < moveIndsArr.length; i++) {
      if (moveIndsArr[i] < moveToInd) {
        moveToInd -= 1
      }
      temp[temp.length] = arr.splice(moveIndsArr[i] - i, 1)[0]
    }
    temp.unshift(moveToInd, 0)
    return Array.prototype.splice.apply(arr, temp)
  }
  
  export function numberRandom (begin, end) {
    var num = Math.round(Math.random() * (end - begin) + begin)
    return num
  }
  
  // 使data对象变为以&连接键值对的序列化数据
  export function transformRequestFn (obj) {
    const str = []
    for (const p in obj) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
    return str.join('&')
  }
  
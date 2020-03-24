<template>
  <!-- <el-input
    v-on="$listeners"
    v-bind="$attrs"
    v-model="inputStr"
    @keyup.native="handleKeyup($event)"
    @change="handleChange"
  >-->
  <el-input v-on="$listeners" v-bind="$attrs" v-model="inputStr" @keyup.native="handleKeyup($event)" @change="handleChange">
    <i v-if="type === '2'" class="el-input__icon" slot="suffix">%</i>
  </el-input>
</template>

<script>
import { toThousands, thousandToNumber } from '../utils/index'
export default {
  props: {
    value: {
      default: null
    },
    type: {
      default: '1'
    }
  },
  data () {
    return {
      inputStr: '',
      selfChange: false
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (this.selfChange === false) {
        if (this.type === '0') {
          this.inputStr = this.toThousands(newVal)
        } else {
          this.inputStr = newVal
        }
      }
      this.selfChange = false
    }
  },
  created () {
    if (this.type === '0') {
      this.inputStr = toThousands(this.value)
    } else {
      this.inputStr = this.value
      if (this.type === 2) {
      }
    }
  },
  methods: {
    toNumber (str) { // 还原千分位
      return thousandToNumber(str)
    },
    toThousands (num) { // 转换千分位
      return toThousands(num)
    },
    handleKeyup (event) {
      this.selfChange = true
      this.filterFunc()
    },
    filterFunc () {
      const msgList = [/^([1-9][0-9]*?|0)$/, /^(0|100|[1-9][0-9]{0,1}|[0-9]\.[0-9]{0,1}|[1-9][0-9]\.[0-9]{0,1})$/]
      let msg
      if (this.type === '0' || this.type === '1') {
        msg = msgList[0]
      } else {
        msg = msgList[1]
      }
      if (!msg.test(this.inputStr)) { // 当数值不满足正则表达式
        if (msg.test(this.inputStr.substr(1, this.inputStr.length - 1)) && this.inputStr.substr(0, 1) === '0') { // 从下标为1的字符开始截取，满足正则表达式
          this.inputStr = this.inputStr.substr(1, this.inputStr.length - 1)
        } else if (msg.test(this.inputStr.substr(0, this.inputStr.length - 1))) {
          this.inputStr = this.inputStr.substr(0, this.inputStr.length - 1)
        } else if (this.inputStr === '') {
          this.inputStr = '0'
        }
      }
      let realNum = this.toNumber(this.inputStr)
      if (this.type === '0') {
        this.inputStr = this.toThousands(realNum)
      }
      this.$emit('input', realNum)
    },
    handleChange (str) {
      this.filterFunc()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  text-align: center;
}
</style>

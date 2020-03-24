/**
* @name: 计划管理设置店铺目标
*/
<template>
  <div>
    <div class="target-box">
      <span>
        <span class="explain">品牌：</span>
        <span class="explainse">{{brand}}</span>
      </span>
      <span style="margin-top:4px;margin-left:45px;">
        <span class="explain">目标年份：</span>
        <span class="explainse">{{goal_year}}</span>
      </span>
      <span style="margin-left:45px;">
        <span class="explain">目标金额：</span>
        <input
          v-model="target_saleroom"
          type="text"
          :class="(target_saleroom.length === 0 ||target_saleroom ===0 ) ?'breathe':'gloamoney'"
          @input="changeval(target_saleroom)"
          @blur="inputMoney(target_saleroom)"
          :disabled="isinputval"
        />
        <span class="explain">万元</span>
      </span>
    </div>
    <div class="target-box">
      <el-row>
        <span class="explain">算法选择：</span>
        <el-radio-group v-model="arithmeticRadio" size="small">
          <el-radio label='1' :disabled="isinputval">
            <span class="explainse">默认算法</span>
          </el-radio>
          <el-radio label='2' :disabled="isinputval">
            <span class="explainse">推算算法</span>
            <span style="font-size:14px;color:rgba(150,150,150,1);">(需导入销售数据)</span>
          </el-radio>
        </el-radio-group>
      </el-row>
    </div>
    <div class="target-box">
      <span class="explain">主流平台：</span>
      <el-checkbox-group v-model="checkedMainPlatform" :min="0">
        <el-checkbox
          v-for="(item,index) in mainPlatforms"
          :label="item.platform"
          :key="index"
          class="explainse"
          @change="singleMainPlatform(item)"
          :disabled="isinputval"
        >{{item.platform}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="target-box">
      <el-tooltip effect="dark" content="主流平台全选才可以选其他平台" placement="top">
        <span class="explain">其他平台：</span>
      </el-tooltip>
      <el-checkbox-group v-model="checkedMainPlatform" :min="0">
        <el-checkbox
          v-for="(item,index) in lessPlatforms"
          :label="item.platform"
          :key="index"
          class="explainse"
          @change="singleLessPlatform(item)"
          :disabled="isinputval"
        >{{item.platform}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="target-box" style="padding-top:30px">
      <p class="explainse pp">店铺目标销售占比设置</p>
      <ul class="tablist">
        <li class="has-gutter">
          <p>平台店铺</p>
          <p>店铺性质</p>
          <p>店铺年份</p>
          <p>
            <span>目标销售金额</span>
            <br />
            <span>(万元)</span>
          </p>
          <p>销售占比</p>
          <p>退货率</p>
          <p>操作</p>
        </li>
        <li v-for="(item,index) in platformData" :key="index">
          <p>{{item.platform}}</p>
          <p>
            <el-select v-model="item.store" @change='changestore(item)' style="width:80px;" :disabled="isinputval">
              <el-option
                style="text-align: center;"
                v-for="item in storeoptions"
                :key="item.value"
                :label="item.store"
                :value="item.value"
              ></el-option>
            </el-select>
          </p>
          <p>
            <el-select v-model="item.mothed" style="width:80px;" :disabled="isinputval">
              <el-option
                style="text-align: center;"
                v-for="item in mothedsoptions"
                :key="item.value"
                :label="item.mothed"
                :value="item.value"
              ></el-option>
            </el-select>
          </p>
          <p>
            <span style="border-radius:4px;border:1px solid #bbb;width:82px;display: inline-block">
              <input
                type="text"
                v-model="item.specificValue.sales_amount"
                :disabled="isinputval"
                style="width:80px;text-align: center;color: rgba(100, 100, 100, 1);outline: none;border:none"
                @input="salesAmount(index)"
                @blur="salea"
              />
            </span>
          </p>
          <p>
            <span style="border-radius:4px;border:1px solid #bbb;width:62px;display: inline-block">
              <input
                type="text"
                v-model="item.specificValue.sales_accounted"
                :disabled="isinputval"
                style="width:60px;text-align: center;color: rgba(100, 100, 100, 1);outline: none;border:none"
                @input="accounted(index)"
                @blur="percent"
              />
            </span>
          </p>
          <p>
            <span style="border-radius:4px;border:1px solid #bbb;width:62px;display: inline-block">
              <input
                type="text"
                v-model="item.specificValue.sales_return"
                :disabled="isinputval"
                style="width:60px;text-align: center;color: rgba(100, 100, 100, 1);outline: none;border:none"
                @input="salesReturn(index)"
                @blur="percentreturn"
              />
            </span>
          </p>
          <p class="mothds">
            <span @click.stop="nextstep(item)">月份目标设置</span>&nbsp;
            <span v-if="deleteval" @click="deleteOperation(index)">删除</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="total">
      <div class="proportion-left">
        <p>合计</p>
      </div>
      <div class="proportion-right">
        <p :style="issave?'':'color:red;'">{{amountTotal}}</p>
        <p :style="issave?'margin-left:30px':'color:red;margin-left:30px'">{{sales_accounted}}</p>
        <p style="margin-left:20px">{{sales_return}}</p>
        <div class="modth-box">
          <p @click="allMonth">所有月份目标查看</p>
          <p @click="PlanBuyGoods">买货总规划</p>
        </div>
      </div>
    </div>
    <el-row class="nextonebtn">
      <button
        type="lightBlue"
        style="width:136px;height:34px"
        v-text="openval"
        :class="issave? 'hassaves': 'notsave'"
        @click="saveOperation"
      ></button>
    </el-row>
  </div>
</template>
<script>
import { toThousands, thousandToNumber } from '../../../../utils/index'
// import { isError } from 'util'
// import { timingSafeEqual } from 'crypto'
export default {

  data () {
    return {
      openval: '保存',
      deleteval: true, // 是否显示删除
      isinputval: false, // 禁止输入
      brand: '', // 目标品牌
      arithmeticRadio: '', // 算法单选按钮
      checkedMainPlatform: [], // 选中的全部平台
      target_saleroom: '', // 目标金额
      goal_year: '', // 目标年份
      amountTotal: '', // 合计目标销售金额
      isSetsave: false, // 是否已经保存
      issave: false, // 是否高亮保存按钮
      // 主流平台
      mainPlatforms: [],
      // 其他平台
      lessPlatforms: [],
      // 店铺性质
      storeoptions: [
        {
          store: '新店',
          value: 1
        },
        {
          store: '成长中店',
          value: 2
        },
        {
          store: '老店',
          value: 3
        }
      ],
      mothedsoptions: [
        {
          mothed: '全年',
          value: 0
        },
        {
          mothed: '1月开始',
          value: 1
        },
        {
          mothed: '2月开始',
          value: 2
        },
        {
          mothed: '3月开始',
          value: 3
        },
        {
          mothed: '4月开始',
          value: 4
        },
        {
          mothed: '5月开始',
          value: 5
        },
        {
          mothed: '6月开始',
          value: 6
        },
        {
          mothed: '7月开始',
          value: 7
        },
        {
          mothed: '8月开始',
          value: 8
        },
        {
          mothed: '9月开始',
          value: 9
        },
        {
          mothed: '10月开始',
          value: 10
        },
        {
          mothed: '11月开始',
          value: 11
        },
        {
          mothed: '12月开始',
          value: 12
        }
      ],
      // 销售占比数据列表
      platformData: [],
      sales_accounted: 0, // 销售占比
      sales_return: 0, // 退货率
      brand_id: '', // 品牌目标id
      allbrandlist: [], // 全部平台列表
      indexvalue: [] // 平台变化相应变化数组
    }
  },
  methods: {
    // 返回或者保存
    async saveOperation () {
      if (this.openval === '保存' && this.issave === true) {
        if (this.isSetsave === false) {
          let a = await this.savedata()
          if (a === 1) {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            })
            this.isSetsave = true
          } else {
            this.$notify.error({
              title: '错误',
              message: '保存失败'
            })
            this.isSetsave = false
          }
        } else if (this.isSetsave === true) {
          this.$notify({
            title: '提示',
            message: '数据没发生更改，已经保存过了',
            type: 'warning'
          })
        }
      } else if (this.openval === '返回') {
        this.$router.push({
          name: 'plan.planlist'
        })
      }
    },
    // 提交保存店铺目标数据
    savedata () {
      const dataArr = []
      this.platformData.forEach(item => {
        dataArr.push({
          name: item.platform,
          platform_id: item.value,
          store_grade: item.store,
          target_percent: item.specificValue.sales_accounted.split('%')[0],
          target_saleroom: item.specificValue.sales_amount * 10000,
          begin_month: item.mothed,
          return_rate: item.specificValue.sales_return
        })
      })
      return this.$api.planList.updataBrandTargets({
        _method: 'PUT',
        id: this.brand_id,
        target_saleroom: this.target_saleroom * 10000,
        store_targets: dataArr
      }).then(res => {
        this.platformData.length = 0
        res.data.store_targets.forEach(item => {
          this.platformData.push({
            storeid: item.id,
            platform: item.name,
            value: item.platform_id,
            store: item.store_grade,
            mothed: item.begin_month,
            specificValue: {
              sales_amount: (item.target_saleroom / 10000).toFixed(0), // 目标销售金额
              sales_accounted: (item.target_percent * 1).toFixed(0) + '%', // 销售占比
              sales_return: (item.return_rate * 1).toFixed(0)// 退货率
            }
          })
        })
        return 1
      })
    },
    // 限制目标金额输入框的输入内容
    changeval (val) {
      val = val.replace(/(^\s*)|(\s*$)/g, '')
      if (!val) {
        this.a = ''
        return
      }
      let reg = /[^\d.]/g
      val = val.replace(reg, '')
      val = val.replace(/^\./g, '')
      val = val
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d)*$/, '$1$2')
      this.target_saleroom = toThousands(val)
    },
    // 删除操作
    deleteOperation (index) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.checkedMainPlatform.splice(index, 1)
          this.platformData.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.isSetsave = false
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消删除'
          })
        })
    },
    // 所有月份目标查看
    allMonth () {
      if (this.isSetsave === true || this.isinputval === true) {
        this.$emit('pre_next', {
          tepy: 'all',
          num: 1,
          storeid: []// 全部月份目标查看应该是一个数组
        })
      } else if (this.isSetsave === false) {
        this.$confirm('当前数据发生变动，是否保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async () => {
            if (this.target_saleroom === this.amountTotal &&
             this.sales_accounted === '100%') {
              let b = await this.savedata()
              if (b === 1) {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.isSetsave = true
                this.$emit('pre_next', {
                  tepy: 'all',
                  num: 1,
                  storeid: []
                })
              }
              this.isSetsave = false
            } else {
              this.$alert('请检查金额设置是否正确', {
                confirmButtonText: '确定'
              })
            }
          })
          .catch(() => {
            this.$emit('pre_next', {
              tepy: 'all',
              num: 1,
              storeid: []
            })
          })
      }
    },
    // 买货总规划
    PlanBuyGoods () {
      if (this.isSetsave === true || this.isinputval === true) {
        this.$router.push({
          name: 'plan.purchase.overall',
          params: {}
        })
      } else if (this.isSetsave === false) {
        this.$confirm('当前数据发生变动，是否保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async () => {
            if (this.target_saleroom === this.amountTotal &&
             this.sales_accounted === '100%') {
              let b = await this.savedata()
              if (b === 1) {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.isSetsave = true
                this.$router.push({
                  name: 'plan.purchase.overall',
                  params: {}
                })
              }
              this.isSetsave = false
            } else {
              this.$alert('请检查金额设置是否正确', {
                confirmButtonText: '确定'
              })
            }
          })
          .catch(() => {
            this.$router.push({
              name: 'plan.purchase.overall',
              params: {}
            })
          })
      }
    },
    // 主流平台的变化
    singleMainPlatform (e) {
      if (this.checkedMainPlatform.length === 0) {
        this.$notify({
          title: '提示',
          message: '主流平台至少选择一个',
          type: 'warning'
        })
        this.checkedMainPlatform.push(e.platform)
        return
      }
      this.indexvalue.length = 0
      this.checkedMainPlatform.forEach(item => {
        this.allbrandlist.forEach(i => {
          if (i.name === item) {
            this.indexvalue.push({ value: i.id, name: i.name })
          }
        })
      })
      this.platformData = this.indexvalue.map((item, index) => {
        return {
          storeid: '',
          platform: item.name,
          value: item.value,
          store: 3,
          mothed: 0,
          specificValue: {
            sales_amount: 1, // 目标销售金额
            sales_accounted: 0, // 销售占比
            sales_return: 0 // 退货率
          }
        }
      })
      this.calculateTargetmoney()
      this.isSetsave = false
    },
    // 计算合计目标销售总额联动销售占比
    calculateTargetmoney () {
      let sum = 0
      let salesAccounted = 0
      this.platformData.forEach((item, index) => {
        sum += item.specificValue.sales_amount * 1
        this.platformData.forEach(i => {
          i.specificValue.sales_accounted = parseInt(
            (i.specificValue.sales_amount / sum).toFixed(2) * 100
          )
          i.specificValue.sales_accounted =
            i.specificValue.sales_accounted + '%'
        })
        salesAccounted +=
          parseInt((item.specificValue.sales_amount / sum).toFixed(2)) * 100
      })
      this.amountTotal = sum
      this.sales_accounted = salesAccounted + '%'
      this.amountTotal = toThousands(this.amountTotal)
      this.isSetsave = false
    },
    // 计算合计销售占比联动目标销售金额
    calculateProportion () {
      let sumProportion = 0
      let sum = 0
      this.platformData.forEach((item, index) => {
        if (item.specificValue.sales_accounted.indexOf('%') !== -1) {
          let a = item.specificValue.sales_accounted.split('%')
          item.specificValue.sales_amount =
            (thousandToNumber(this.target_saleroom) * a[0] * 1) / 100
          sumProportion += a[0] * 1
        } else {
          sumProportion += item.specificValue.sales_accounted * 1
        }
        sum += item.specificValue.sales_amount * 1
        this.sales_accounted = sumProportion + '%'
      })
      this.amountTotal = sum
      this.amountTotal = toThousands(this.amountTotal)
      this.isSetsave = false
    },

    // 其他平台的变化
    singleLessPlatform (val) {
      if (this.checkedMainPlatform.length === 1) {
        this.mainPlatforms.forEach(item => {
          if (this.checkedMainPlatform.indexOf(item) === -1) {
            this.$notify({
              title: '提示',
              message: '主流平台至少选择一个',
              type: 'warning'
            })
          }
        })
      }
      this.indexvalue.length = 0
      this.checkedMainPlatform.forEach(item => {
        this.allbrandlist.forEach(i => {
          if (i.name === item) {
            this.indexvalue.push({ value: i.id, name: i.name })
          }
        })
      })
      this.platformData = this.indexvalue.map((item, index) => {
        return {
          storeid: '',
          platform: item.name,
          value: item.value,
          store: 3,
          mothed: 0,
          specificValue: {
            sales_amount: 1, // 目标销售金额
            sales_accounted: 0, // 销售占比
            sales_return: 0 // 退货率
          }
        }
      })
      this.calculateTargetmoney()
      this.isSetsave = false
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // 月份目标设置或查看
    nextstep (val) {
      if (this.isSetsave === true || this.isinputval === true) {
        this.$emit('pre_next', {
          tepy: 'one',
          num: 1,
          storeid: val.storeid
        })
      } else if (this.isSetsave === false) {
        this.$confirm('当前数据发生变动，是否保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async () => {
            if (this.target_saleroom === this.amountTotal &&
            this.sales_accounted === '100%') {
              let a = await this.savedata()
              if (a === 1) {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.isSetsave = true
                this.$emit('pre_next', {
                  tepy: 'one',
                  num: 1,
                  storeid: val.storeid
                })
              }
              this.isSetsave = false
            } else {
              this.$alert('请检查金额设置是否正确', {
                confirmButtonText: '确定'
              })
            }
          })
          .catch(() => {
            if (val.storeid === '') {
              this.$notify({
                title: '提示',
                message: '请进行保存才能设置月份目标',
                type: 'warning'
              })
            } else {
              this.$emit('pre_next', {
                tepy: 'one',
                num: 1,
                storeid: val.storeid
              })
            }
          })
      }
    },
    // 目标销售金额
    salesAmount (value) {
      this.platformData.forEach((item, index) => {
        if (value === index) {
          this.platformData[value].specificValue.sales_amount = item.specificValue.sales_amount.replace(
            /[^\d]/g,
            ''
          )
        }
      })
      this.calculateTargetmoney()
    },
    // 销售占比
    accounted (i) {
      this.platformData.forEach((item, index) => {
        if (i === index) {
          this.platformData[i].specificValue.sales_accounted = item.specificValue.sales_accounted.replace(
            /[^%\d]/g,
            ''
          )
        }
      })
      this.calculateProportion()
    },
    // 补全百分号销售占比
    percent () {
      this.platformData.forEach((item, index) => {
        if (item.specificValue.sales_accounted.indexOf('%') === -1) {
          item.specificValue.sales_accounted =
            item.specificValue.sales_accounted + '%'
        }
      })
    },
    // 补全退货率百分号
    percentreturn () {
      this.platformData.forEach((item, index) => {
        if (
          item.specificValue.sales_return != 0 &&
          item.specificValue.sales_return.indexOf('%') === -1
        ) {
          item.specificValue.sales_return =
            item.specificValue.sales_return + '%'
        }
      })
    },
    // 更新销售占比
    salea () {
      let arr = []
      let a = ''
      let m = 0
      this.platformData.forEach(item => {
        a = item.specificValue.sales_accounted.split('%')
        arr.push(a[0])
      })
      arr.forEach(item => {
        m += item * 1
      })
      this.sales_accounted = m + '%'
    },
    // 计算退货率
    salesRe () {
      let arrone = []
      let b = ''
      let n = 0
      this.platformData.forEach(item => {
        if (item.specificValue.sales_return !== 0) {
          b = item.specificValue.sales_return.split('%')
          arrone.push(b[0])
        }
      })
      arrone.forEach(item => {
        n += (item * 1) / this.platformData.length
      })
      if (n == 0) {
        this.sales_return = n
      } else {
        this.sales_return = n + '%'
      }
    },
    // 退货率
    salesReturn (j) {
      this.platformData.forEach((item, index) => {
        if (j == index) {
          this.platformData[j].specificValue.sales_return = item.specificValue.sales_return.replace(
            /[^%\d]/g,
            ''
          )
        }
      })
      this.salesRe()
    },
    // 目标金额
    inputMoney (val) {
      if (val > 0 && this.platformData.length !== 0) {
        let anums = (val * (1 / this.platformData.length)).toFixed(0)
        this.platformData.forEach(item => {
          item.specificValue.sales_amount = anums
        })
        this.calculateTargetmoney()
        this.salea()
        this.isSetsave = false
      } else {
        this.amountTotal = 0
      }
    },
    // 店铺更改
    async changestore (val) {
      this.isSetsave = false
      let arrstore = []
      this.platformData.forEach(item => {
        if (val.platform === item.platform) {
          arrstore.push({
            platform_id: val.value,
            store_grade: val.store
          })
        } else {
          arrstore.push({
            platform_id: item.value,
            store_grade: item.store
          })
        }
      })
      if (val.storeid) {
        let a = await this.refreshStoreTarget(arrstore, val.storeid)
        if (a === 1) {
          this.$notify({
            title: '成功',
            message: '刷新列表成功',
            type: 'success'
          })
        }
        this.isSetsave = false
      } else {
        this.$notify.error({
          title: '操作失败',
          message: '刷新列表失败，请先保存'
        })
      }
    },

    // 刷新店铺目标接口(当条件切换的时候调用)接口可能存在问题
    refreshStoreTarget (val, targetid) {
      return this.$api.planList.refreshStoreTargets({
        brand_target_id: targetid,
        target_saleroom: this.target_saleroom * 10000,
        store_calculate_type: this.arithmeticRadio,
        store_targets: val
      }).then(res => {
        return 1
      })
    },

    getplatformlist () {
      this.checkedMainPlatform.length = 0
      this.platformData.length = 0
      let nums = 0
      // 获取品牌详情信息
      this.$api.planList.BrandTargetDetails({ id: this.brand_id, with: ['brand', 'store_targets'] }).then(res => {
        this.goal_year = res.data.year
        this.target_saleroom = (res.data.target_saleroom / 10000).toFixed(0)
        this.arithmeticRadio = res.data.store_calculate_type.toString()
        res.data.store_targets.forEach(item => {
          this.checkedMainPlatform.push(item.name.split(' ')[0])
          this.platformData.push({
            storeid: item.id,
            platform: item.name.split(' ')[0],
            value: item.platform_id,
            store: item.store_grade,
            mothed: item.begin_month,
            specificValue: {
              sales_amount: (item.target_saleroom / 10000).toFixed(0), // 目标销售金额
              sales_accounted: (item.target_percent * 1).toFixed(0) + '%', // 销售占比
              sales_return: (item.return_rate * 1).toFixed(0)// 退货率
            }
          })
          nums += item.target_saleroom * 1
        })
        this.amountTotal = toThousands((nums / 10000).toFixed(0)) // 合计金额千分位置换
        this.salea()
      })
      // 获取平台列表
      this.$api.platforms.getplatforms().then(res => {
        res.data.data.forEach(item => {
          if (item.grade === 1) {
            this.mainPlatforms.push({
              platform: item.name,
              value: item.id
            })
          } else if (item.grade === 2) {
            this.lessPlatforms.push({
              platform: item.name,
              value: item.id
            })
          }
          this.allbrandlist.push(item)
        })
      })
    }
  },
  created () {
    // 目标金额千分位置换
    this.target_saleroom = toThousands(this.target_saleroom)
    // 接受路由参数获取年份
    if (this.$route.params.type === 'view') {
      this.isinputval = true
      this.deleteval = false
      this.goal_year = this.$route.params.year
      this.openval = '返回'
      this.issave = true
      this.brand_id = this.$route.params.id
    } else if (this.$route.params.type === 'edit') {
      this.isinputval = false
      this.goal_year = this.$route.params.year
      this.openval = '保存'
      this.brand_id = this.$route.params.id
    }
    this.isSetsave = true
    // 设置导航栏
    this.$route.meta.breadcrumb[2].name = this.goal_year + '目标设置'
    // 获取品牌
    this.brand = this.$store.state.brand.selectBrand.name
    // 获取平台列表和获取品牌详情信息
    this.getplatformlist()
  },
  updated: function () {
    if (
      this.target_saleroom === this.amountTotal &&
      this.sales_accounted === '100%' && this.checkedMainPlatform.length > 0
    ) {
      this.issave = true
    } else {
      this.issave = false
    }
  }
}
</script>
<style lang="less" scope>
.gloamoney {
  width: 100px;
  height: 24px;
  margin-right: 10px;
  font-size: 18px;
  color: rgb(2, 2, 2);
  outline: none;
  padding-left: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.breathe {
  animation: glow 800ms ease-out infinite alternate;
  width: 100px;
  height: 26px;
  margin-right: 10px;
  font-size: 18px;
  outline: none;
  border: none;
  padding-left: 10px;
}
@keyframes glow {
  0% {
    border-color: rgba(100, 188, 255, 1);
    box-shadow: 0 0 0 rgba(100, 188, 255, 1),
      inset 0 0 4px rgba(100, 188, 255, 1);
  }
  100% {
    border-color: rgba(100, 188, 255, 1);
    box-shadow: 0 0 5px rgba(100, 188, 255, 1),
      inset 0 0 4px rgba(100, 188, 255, 1);
  }
}
.explain {
  color: rgba(150, 150, 150, 1);
  font-size: 14px;
}
.explainse {
  color: rgba(50, 50, 50, 1);
  font-size: 18px;
  font-weight: 500;
}
.target-box {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 80%;
  margin: 32px 0 0 10%;
  .pp {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.total {
  height: 110px;
  margin-left: 10%;
  width: 72%;
  background: rgba(247, 250, 254, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .proportion-left {
    width: 45%;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      width: 200px;
      text-align: center;
    }
  }
  .proportion-right {
    width: 55%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      width: 120px;
      text-align: center;
    }
    .modth-box {
      width: 160px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      p {
        font-size: 14px;
        color: rgba(100, 188, 255, 1);
        cursor: pointer;
      }
    }
  }
}
.nextonebtn {
  width: 90px;
  margin: 20px 40% 0;
}
.tablist {
  list-style: none;
  width: 90%;
  margin-top: -4px;
  margin-left: -40px;
  position: relative;
  li {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 56px;
    p {
      width: 140px;
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      color: rgba(100, 100, 100, 1);
    }
    .mothds {
      color: rgba(100, 188, 255, 1);
      font-weight: 400;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .has-gutter {
    background: rgba(225, 241, 253, 1);
  }
  .el-input__suffix {
    margin-top: 0px;
    right: -3px;
}
}
</style>>

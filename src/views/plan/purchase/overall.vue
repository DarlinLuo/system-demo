<template>
    <div id="overall">
        <el-steps class='steps' :active="0" align-center>
            <el-step title="买货总规划"></el-step>
            <el-step title="季度买货规划"></el-step>
            <el-step title="品类买货规划"></el-step>
        </el-steps>
        <div class="overall-header">
            <el-form v-model="overall_from" class="header-from">
                <el-form-item>
                    <span class="title">目标年份:</span>&nbsp;&nbsp;
                    <span style="font-size:18px" class="title-content">{{overall_data.year}}</span>
                    <span class="title">目标金额:</span>&nbsp;&nbsp;
                    <span class="title-content-adorn">{{Math.round((overall_data.target_saleroom/10000))|toThousands}}</span>
                    <span class="title">万元</span>
                    <el-button @click="_onClickGoDetails" class="title-btn" type="primary">全年季度买货规划</el-button>
                </el-form-item>
                <el-form-item label="算法选择:">
                    <el-radio @change="_onChange" :disabled="!isEdit" v-for="(item,key) in overall_options.algorithm" :key="key" v-model="overall_from.algorithm" :label="item.label">{{item.name}}</el-radio>
                </el-form-item>
                <el-form-item label="货品类型:">
                    <el-checkbox-group :disabled="!isEdit" v-model="overall_from.goods_type">
                        <el-checkbox @change="_onChange" v-for="(item,key) in overall_options.goods_type" :key="key" :label="item.label">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item  label="货品侧重:" v-if="overall_from.algorithm === 1">
                    <el-radio @change="_onChange" :disabled="!isEdit" v-for="(item,key) in overall_options.emphasis" :key="key" v-model="overall_from.emphasis" :label="item.label">{{item.name}}</el-radio>
                </el-form-item>
                <!-- <el-form-item>
                    <span class="title-content">旧货库存</span>
                    <div>
                        <span class="title">库存吊牌额:</span>
                        <span class="title-content">{{overall_data.inventory.standard_amount|toThousands}}万元</span>
                        <span class="title">预计销售金额:</span>
                        <span class="title-content">{{overall_data.inventory.saleroom|toThousands}}万元</span>
                        <span class="title">旧货销售占比:</span>
                        <span class="title-content">{{overall_data.inventory.sales_percent|toThousands}}万元</span>
                        <span class="title">SKU:</span>
                        <span class="title-content">{{overall_data.inventory.sku_num}}</span>
                        <span class="title">总件数:</span>
                        <span class="title-content">{{overall_data.inventory.num}}</span>
                        <span class="title">折扣:</span>
                        <span class="title-content">{{overall_data.inventory.annual_cumulative_discount}}%</span>
                    </div>
                </el-form-item> -->
            </el-form>
        </div>
        <div style="padding:0px 226px 0 227px;">
        <el-table border :header-cell-style='headerCellStyleFunc' :row-style='rowStyleFunc' class="table-box" :data="table_data" :cell-style="cellStyleFunc">
            <el-table-column align="center" label="货品类型" prop="goods_type" width="100px">
                <template slot-scope="scope">
                    <span v-if="scope.row.goods_type === 1">新货</span>
                    <span v-if="scope.row.goods_type === 2">旧货</span>
                    <span v-if="scope.row.goods_type === 3">特供</span>
                    <span v-if="scope.row.goods_type === 4">加单</span>
                    <span v-if="scope.row.goods_type === 5">合计</span>
                </template>
            </el-table-column>
            <el-table-column prop="sale_percent" align="center" label="销售比例" width="100px">
                <template slot-scope="scope">
                    <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" @change="_onChangeSave(scope,1)" type="2" class="input-font" v-model="scope.row.sale_percent"></PriceInput>
                    <span v-else>{{Number(scope.row.sale_percent).toFixed(1) + '%'}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="销售比例参考值" min-width="120px">
                <template slot-scope="scope">
                    <div v-if="!scope.row.hasOwnProperty('type')">
                    <div>
                        <span class="row-content-tilte">默认:</span>
                        <span class="row-content">{{scope.row.salesRatio.default}}</span>
                    </div>
                    <div>
                        <span class="row-content-tilte">推算:</span>
                        <span class="row-content">{{scope.row.salesRatio.calculation}}</span>
                    </div>
                    </div>
                    <span v-else></span>
                </template>
            </el-table-column> -->
            <el-table-column  prop="expected_saleroom" align="center" label="预销售金额" min-width="150">
                <template slot-scope="scope">
                    <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" type="0" @change="_onChangeSave(scope,2)" class="input-font" v-model="scope.row.expected_saleroom"></PriceInput>
                    <span v-else>{{Number(scope.row.expected_saleroom).toFixed(1)|toThousands}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="预销售金额参考值" min-width="120px">
                <template slot-scope="scope">
                    <div v-if="!scope.row.hasOwnProperty('type')">
                        <div>
                        <span class="row-content-tilte">默认:</span>
                        <span class="row-content">{{scope.row.preSalesAmt.default|toThousands}}</span>
                    </div>
                    <div>
                        <span class="row-content-tilte">推算:</span>
                        <span class="row-content">{{scope.row.preSalesAmt.calculation|toThousands}}</span>
                    </div>
                    </div>
                    <span v-else></span>
                </template>
            </el-table-column> -->
            <el-table-column prop="digestibility" align="center" label="消化率" width="100px">
                <template slot-scope="scope">
                    <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" type="2" @change="_onChangeSave(scope,3)" class="input-font" v-model="scope.row.digestibility"></PriceInput>
                    <span v-else>{{Number(scope.row.digestibility).toFixed(1) + '%'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="annual_cumulative_discount" align="center" label="全年累计折扣" width="100px">
                <template slot-scope="scope">
                    <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" type="2" @change="_onChangeSave(scope,3)" class="input-font" v-model="scope.row.annual_cumulative_discount"></PriceInput>
                     <span v-else>{{Number(scope.row.annual_cumulative_discount).toFixed(1) + '%'}}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" align="center" label="预计吊牌金额" prop="expected_standard_amount">
                <template slot-scope="scope">
                    {{Number(scope.row.expected_standard_amount).toFixed(1)|toThousands}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180px">
                <template slot-scope="scope">
                    <div v-if="!scope.row.hasOwnProperty('type')">
                      <!-- && constraintCondition.isTotal -->
                        <span v-if="(scope.row.goods_type !== 4) && (!isSave)" class="table_link" style="margin-right:10px;" @click="_onClickGoQuarter(scope.row)">季度买货计划</span>
                        <span v-if="isEdit" @click="_onClickDelete(scope)" class="table_link">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="overall-footer-btn">
            <el-button :disabled="!this.constraintCondition.isTotal || !isEdit" :class="!this.constraintCondition.isTotal?'save-btn save-btn-disabled':'save-btn'" type="primary" @click="_onClickSave">保存</el-button>
        </div>
    </div>
</template>

<script>
import { toThousands, thousandToNumber } from '../../../utils/index'
import PriceInput from '../../../components/PriceInput'
import test from './test.json'
import brandMixins from '../../../mixins/brandMixins'
// import Decimal from 'decimal'
export default {
  name: 'purchase-overall',
  mixins: [brandMixins],
  data () {
    return {
      overall_from: {
        algorithm: 1, // 算法选择
        goods_type: [], // 货品类型
        emphasis: 1 // 货品侧重
      },
      overall_options: {
        algorithm: [
          { label: 1, name: '默认算法' },
          { label: 2, name: '推算算法' }
        ],
        goods_type: [
          { label: 1, name: '新品' },
          { label: 2, name: '旧货' },
          { label: 3, name: '特供' },
          { label: 4, name: '加单' }
        ],
        emphasis: [
          { label: 1, name: '正常比例' },
          { label: 2, name: '侧重新货' },
          { label: 3, name: '侧重旧货' },
          { label: 4, name: '侧重特供' }
        ]
      },
      table_data: [], // 列表数据
      overall_data: {}, // 头部数据
      isSave: false, // 是否保存
      total_table: [],
      constraintCondition: {
        sale_percent: true,
        expected_saleroom: true,
        isTotal: true
      }, // 是否不满足约束条件
      isEdit: true, // 是否编辑
      table_dataMap: {}, // 表格数据Map
      table_dataKey: '0000' // 键位
    }
  },
  created () {
    this.init()
  },
  components: {
    PriceInput
  },
  methods: {
    headerCellStyleFunc () {
      return { 'background-color': 'rgba(225,241,253,1)', 'height': '44px', 'font-size': '14px', 'color': '#323232FF' }
    },
    init () {
      this.getOverall()
    },
    setNavTitleOfEnable () { // 设置导航栏标题及设置是否启用编辑
      this.$route.meta.breadcrumb[2].name = this.overall_data.brand.name + this.overall_data.year + '年买货总规划'
      if (this.$route.params.type === 'view') {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
    },
    _onChangeSave (scope, type) { // 输入框change事件  是否保存false  输入框计算公式
      this.isSave = true
      switch (type) {
        case 1:this.changeSalePercent(scope); break
        case 2:this.changeExpectedSaleroom(scope); break
        case 3:this.changeDigestibility(scope); break
      }
      this.loopTotal()
    },
    changeSalePercent (scope) { // 销售比例值改变的计算
      /*
                预销售金额=销售比例*目标金额
                预计吊牌金额=销售比例 * 目标金额 / 消化率 / 全年累计折扣
            */
      this.expectedSaleroomFormula(scope.row)
      this.digestibilityFormula(scope.row)
    },
    changeExpectedSaleroom (scope) { // 预销售金额改变的计算
      /*
                销售比例=预销售金额/目标金额
                预计吊牌金额=预销售金额/消化率/全年折扣
            */
      this.salePercentFormula(scope.row)
      this.digestibilityFormula(scope.row)
    },
    changeDigestibility (scope) { // 消化率 及全年折扣改变的计算
      /*
                预计吊牌金额=预销售金额/消化率/全年折扣
            */
      this.digestibilityFormula(scope.row)
    },
    salePercentFormula (row) { // 销售比例计算公式
      row.sale_percent = row.expected_saleroom / this.overall_data.target_saleroom * 100
    },
    expectedSaleroomFormula (row) { // 预计销售金额计算公式
      row.expected_saleroom = row.sale_percent * this.overall_data.target_saleroom / 100
    },
    digestibilityFormula (row) { // 预计吊牌金额计算公式
      if (Number(row.digestibility) !== 0 && Number(row.annual_cumulative_discount) !== 0) {
        row.expected_standard_amount = row.expected_saleroom / row.digestibility / 100 / row.annual_cumulative_discount / 100
      } else {
        row.expected_standard_amount = 0
      }
    },
    rowStyleFunc () { // 行样式
      return { 'font-size': '16px', 'font-weight': 400, 'height': '56px', 'color': 'rgba(50,50,50,1)' }
    },
    cellStyleFunc ({ row, column, rowIndex, columnIndex }) { // 单元格样式
      if (row.goods_type === 5) {
        if (!this.constraintCondition.sale_percent && column.property === 'sale_percent') {
          return {
            'background': 'rgba(247,250,254,1)',
            'color': 'red',
            'font-weight': 'bold'
          }
        } else if (!this.constraintCondition.expected_saleroom && column.property === 'expected_saleroom') {
          return {
            'background': 'rgba(247,250,254,1)',
            'color': 'red',
            'font-weight': 'bold'
          }
        } else {
          return {
            'background': 'rgba(247,250,254,1)'
          }
        }
      }
    },
    _onClickGoDetails () { // 跳转全年季度买货规划
      if (this.overall_from.goods_type.length === 0) {
        return
      }
      if (this.isSave) {
        this.$confirm('当前数据发生改变,是否保存', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._onClickSave()
        }).catch(() => {
          this.getGODetails()
        })
      } else {
        this.getGODetails()
      }
    },
    getGODetails () {
      this.$router.push({
        name: 'plan.purchase.details',
        params: {
          type: this.$route.params.type,
          id: this.$route.params.id,
          year: this.overall_data.target_year,
          target_saleroom: this.overall_data.target_saleroom
        }
      })
    },
    _onClickDelete (scope) {
      if (this.table_data.length === 1) {
        this.$notify({
          title: '提示',
          message: '货品类型不能为空'
        })
        return
      }
      this.$confirm('此操作将删除该行数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isSave = false
        this.overall_from.goods_type.splice(scope.$index, 1)
        this.table_data.splice(scope.$index, 1)
        if (this.table_data.length === 1) {
          this.table_data = []
        }
        this.refreshList()
        this.$notify({
          title: '提示',
          message: '需要点击保存才能够在后台更改哦!',
          type: 'info'
        })
      })
    },
    _onClickSave (urlType, row) {
      let data = {
        _method: 'PUT',
        id: this.$route.params.id,
        purchase_calculate_type: this.overall_from.algorithm,
        emphasis_type: this.overall_from.emphasis,
        goods_purchases: this.table_data.filter((item, key) => {
          if (item.goods_type !== 5) {
            return {
              goods_type: item.goods_type,
              sale_percent: item.sale_percent,
              expected_saleroom: item.expected_saleroom,
              digestibility: item.digestibility,
              annual_cumulative_discount: item.annual_cumulative_discount,
              expected_standard_amount: item.expected_standard_amount
            }
          }
        })
      }
      this.$api.purchase.updateOveral(data).then((res) => {
        if (res.code === 0) {
          this.$notify({
            message: '保存成功',
            title: '提示',
            type: 'success'
          })
          if (urlType === 'Quarter') {
            this.goQuarterFunc(row)
          } else if (urlType === 'Details') {
            this.getGODetails()
          }
          this.isSave = false
        }
      })
    },
    _onChange () {
      this.isSave = true
      this.refreshList()
    },
    _onClickGoQuarter (row) { // 跳转季度卖货计划
      if (this.isSave) {
        this.$confirm('当前数据发生改变,是否保存', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._onClickSave('Quarter', row)
        }).catch(() => {
          this.goQuarterFunc(row)
        })
      } else {
        this.goQuarterFunc(row)
      }
    },
    getOverall () {
      let data = {
        id: this.$route.params.id,
        with: ['goods_purchases', 'brand']
      }
      this.$api.purchase.getOverallData(data).then((res) => {
        if (res.code === 0) {
          this.overall_data = res.data
          this.table_data = res.data.goods_purchases
          if (this.table_data.length !== 0) {
            this.overall_from.goods_type = this.table_data.map((item) => {
              return item.goods_type
            })
            this.overall_from.algorithm = this.overall_data.purchase_calculate_type
            this.overall_from.emphasis = this.overall_data.emphasis_type
            this.loopTotal()
            this.setNavTitleOfEnable()
          } else {
            this.constraintCondition.isTotal = false
            this.constraintCondition.sale_percent = false
            this.constraintCondition.expected_saleroom = false
          }
        }
      })
      this.table_dataMap = test.overallMap.data
    },
    beforeConditionSave (data) { // 判断是否满足保存条件
      if (data.sale_percent !== 100) {
        this.constraintCondition.sale_percent = false
        this.constraintCondition.isTotal = false
      } else {
        this.constraintCondition.sale_percent = true
        this.constraintCondition.isTotal = true
      }
      if (data.expected_saleroom !== this.overall_data.target_saleroom) {
        this.constraintCondition.expected_saleroom = false
        this.constraintCondition.isTotal = false
      } else {
        this.constraintCondition.expected_saleroom = true
        this.constraintCondition.isTotal = true
      }
    },
    loopTotal () { // 循环获取统计数据
      if (this.overall_from.goods_type.length === 0) {
        return
      }
      if (this.table_data[this.table_data.length - 1].goods_type === 5) {
        this.table_data.pop()
      }
      let loopTotal = {
        goods_type: 5,
        sale_percent: 0,
        expected_saleroom: 0,
        annual_cumulative_discount: 0,
        expected_standard_amount: 0,
        digestibility: 0,
        type: ''
      }
      for (let i = 0; i < this.table_data.length; i++) {
        loopTotal.sale_percent += Number(this.table_data[i].sale_percent)
        loopTotal.expected_saleroom += Number(this.table_data[i].expected_saleroom)
        loopTotal.annual_cumulative_discount += Number(this.table_data[i].annual_cumulative_discount)
        loopTotal.expected_standard_amount += Number(this.table_data[i].expected_standard_amount)
        loopTotal.digestibility += Number(this.table_data[i].digestibility)
      }
      this.beforeConditionSave(loopTotal)
      this.table_data.push(loopTotal)
    },
    sortGoodType (goodType) { // 货品类型排序
      goodType.sort((a, b) => {
        return a - b
      })
      let one_sub, two_val
      if (goodType.indexOf(2) !== -1) {
        one_sub = goodType.indexOf(2)
        two_val = goodType[0]
        goodType[one_sub] = two_val
        goodType[0] = 2
      }
    },
    goQuarterFunc (row) {
      this.$router.push({
        name: 'plan.purchase.quarter',
        params: {
          id: row.id,
          type: this.$route.params.type,
          name: this.overall_data.brand.name
        }
      })
    },
    refreshList () {
      this.table_dataKey = this.array2binary(this.overall_from.goods_type) // 转化货品类型组合二进制
      if (this.overall_from.goods_type.length === 0) {
        return
      }
      // list[推算类型][货品类型组合的二进制编码][货品类型][侧重类型]
      let defaultData = this.table_dataMap['default'][this.table_dataKey]
      let calculateData = this.table_dataMap['calculate'][this.table_dataKey]

      let evalTypeString = this.overall_from.algorithm === 1 ? defaultData : calculateData
      this.sortGoodType(this.overall_from.goods_type) // 货品类型排序
      this.table_data = this.overall_from.goods_type.map((item, key) => {
        return evalTypeString[item][this.overall_from.emphasis]
      })
      this.loopTotal()
    },
    array2binary (array) {
      let result = 0
      array.forEach(item => {
        result += Math.pow(2, item - 1)
      })
      return result.toString(2)
    }
  }
}
</script>

<style lang='scss' scoped>
#overall{
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // //min-height:770px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    margin-left: 5px;
    margin-right: 21px;
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    .steps{
       margin:33px 226px 49px 226px;
    }
    .overall-header{
      display:flex;
      justify-content: center;
      .header-from{
        width:100%;
        margin:0px 226px 0 227px;
        .title, /deep/.el-form-item__label {
            font-size:14px;
            font-weight:400;
            color:rgba(150,150,150,1);
            // margin-right:4px;
        }
        .title-content{
            font-size:16px;
            font-weight:500;
            color:rgba(50,50,50,1);
            margin-right:45px;
        }
        /deep/.el-checkbox__label,/deep/ .el-radio__label{
            font-size:16px;
            font-weight:500;
            color:rgba(50,50,50,1);
        }
        .title-content-adorn{
            font-size:18px;
            font-weight:500;
            color:rgba(50,50,50,1);
            margin-right:4px;
        }
        .title-btn{
            position: absolute;
            right:0;
            height:32px;
            width:130px;
            border-radius:6px;
        }
      }
    }
    .table-box{
        // padding:0px 226px 0 227px;
        // width:100%;
        // border:none;
        .row-content-tilte{
            font-size:14px;
            font-weight:400;
            color:rgba(150,150,150,1);
        }
        .row-content{
            font-size:16px;
            font-weight:500;
            color:rgba(50,50,50,1);
        }
        /deep/ .el-input__inner{
            text-align:center;
        }
    }
    /deep/ .el-table__footer{
        height:56px;
        font-size:16px;
        font-weight:500;
        color:rgba(50,50,50,1);
    }
    .overall-footer-btn{
        margin-top:21px;
        height:40px;
        text-align:center;
        margin-bottom:10px;
    }
    .save-btn{
        width:136px;
        height:34px;
        background:rgba(100,188,255,1);
        border-radius:6px;
    }
    .save-btn-disabled{
        color: #606266;
        background: #cccccc;
        border: none;
    }
    .input-font{
        font-size:16px;
        font-weight:500;
        color:rgba(50,50,50,1);
    }
    /deep/ .el-table__footer{
        background:rgba(247,250,254,1);
        margin-top:5px;
        .is-leaf{
            border:none;
        }
    }
}
.el-button{
    background:rgba(100,188,255,1);
    border-radius:6px;
    border-color: rgba(100,188,255,1);
}
</style>

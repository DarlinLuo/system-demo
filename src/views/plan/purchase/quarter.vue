<template>
    <div id="quarter">
        <div class="quarter-steps">
            <el-steps :active="1" align-center>
                <el-step @click.native="_onClickGO" title="买货总规划"></el-step>
                <el-step title="季度买货规划"></el-step>
                <el-step title="品类买货规划"></el-step>
            </el-steps>
        </div>
        <!-- <el-divider></el-divider> -->
        <div class="quarter-header">
          <div style="display:inline-block">
            <el-form :inline="true">
                <!-- <el-form-item label="品牌:">
                    <span class="title-con">达衣岩</span>
                </el-form-item> -->
                <el-form-item label="目标年份:">
                    <span class="title-con" v-if="overallData.brand_target">{{overallData.brand_target.year}}&nbsp;年</span>
                </el-form-item>
                <el-form-item label="货品类型:">
                    <span class="title-con" v-if="goods_type === 0">新货</span>
                    <span class="title-con" v-if="goods_type === 1">旧货</span>
                    <span class="title-con" v-if="goods_type === 2">特供</span>
                    <span class="title-con" v-if="goods_type === 3">加单</span>
                </el-form-item>
                <el-form-item label="预计销售金额:">
                    <span class="title-con">{{overallData.expected_saleroom/10000|toThousands}}&nbsp;万元</span>
                </el-form-item>
            </el-form>
            <el-form :inline="true">
                <el-form-item v-if="goods_type === 1" label="货品年份:">
                    <el-select :disabled="!isEdit" @visible-change="_onVisibleChangeGoodsYear" size="small" v-model="quarter_from.goods_year" multiple>
                        <el-option v-for="(item,key) in form_options.goods_year" :key=key :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货品销售月份">
                    <el-select :disabled="!isEdit" style="width:100px" size="small" v-model="quarter_from.sales_month_one">
                        <el-option :disabled="quarter_from.sales_month_tow>item.value?false:true" v-for="(item,key) in form_options.sales_month" :key=key :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span style="margin:0 5px">-</span>
                    <el-select :disabled="!isEdit" style="width:100px" size="small" v-model="quarter_from.sales_month_tow">
                        <el-option :disabled="quarter_from.sales_month_one>=item.value?true:false" v-for="(item,key) in form_options.sales_month" :key=key :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="!isEdit" class="form-confirm-btn " size="small" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
          </div>
            <div class="quarter-header-btn">
                <el-button class="header-btn" style="background:rgba(255,255,255,1);color:rgba(200,200,200,1);border:1px solid rgba(226,226,226,1);" type="primary" @click="_onClickGO" size="small">返回</el-button>
                <el-button @click='_onClickExportQuarter' class="header-btn " type="primary" size="small">导出</el-button>
                <el-button :disabled="this.conditionSave.isTotal ||!isEdit" @click="_onClickSave" :class="this.conditionSave.isTotal ?'header-btn save-btn-disabled':'header-btn'" type="primary" size="small">保存</el-button>
            </div>
        </div>
        <!-- <el-divider></el-divider> -->
        <div class="quarter-content" v-for="(item,key) in quarter_content" :key="key">
            <div class="content-header">
                <span class="header_con"></span>
                <el-form v-if="!item.hasOwnProperty('name')" class="header-from" :inline="true">
                    <el-form-item class="header-form-item" label="货品年份">
                        <span class="header-title-con">{{item.year}}</span>
                    </el-form-item>
                    <el-form-item  class="header-form-item" label="年份买货占比">
                        <PriceInput :disabled="!isEdit" type="3" class="header-title-con" style="width:100px;" size="small" v-model="item.percent"></PriceInput>
                        <span style="color:rgba(150,150,150,1);">%</span>
                    </el-form-item>
                    <el-form-item class="header-form-item" label="侧重季节">
                        <el-radio-group :disabled="!isEdit" v-model="item.emphasis_type">
                            <el-radio style="height:50px;line-height:50px;" v-for="(value,index) in form_options.focus_season" :key="index" :label="value.value">{{value.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span class="header_con1">{{item.name}}</span>
            </div>
            <el-table :header-cell-style='headerCellStyleFunc' :row-style='rowStyleFunc'  border :data="item.seasons" :cell-style="cellStyleFunc">
                <el-table-column width="60" align="center" prop="season_purchases" label="季节">
                   <template slot-scope="scope">
                       <span v-if="scope.row.season === 1">春</span>
                       <span v-if="scope.row.season === 2">夏</span>
                       <span v-if="scope.row.season === 3">秋</span>
                       <span v-if="scope.row.season === 4">冬</span>
                       <span v-if="scope.row.season === 5">总计</span>
                       <span v-if="scope.row.season === 6">剩余</span>
                       <span v-if="scope.row.season === 7">合计</span>
                   </template>
                </el-table-column>
                <el-table-column width="80" align="center" prop="spu_num" label="款数"></el-table-column>
                <el-table-column width="80" align="center" prop="sku_num" label="色数"></el-table-column>
                <el-table-column width="80" align="center" prop="order_quantity" label="订货量">
                    <template slot-scope="scope">
                        <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" @change="_onChangeSave(scope,1)" type="1" v-model="scope.row.order_quantity"></PriceInput>
                        <span v-else>{{scope.row.order_quantity}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" align="center" label="订货吊牌额" prop="order_amount">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.order_amount | toThousands}}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="80" align="center" label="预计销售金额(万元)" prop="expected_saleroom">
                    <template slot-scope="scope">
                        <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')"   @change="_onChangeSave(scope,2)" type="0" v-model="scope.row.expected_saleroom"></PriceInput>
                        <span v-else>{{scope.row.expected_saleroom | toThousands}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column min-width="120" align="center" prop="estimat_sales_amt_rr" label="预计销售金额参考值(万元)">
                    <template slot-scope="scope">
                        <div class="table-col-con">
                            默认:<span class="table-col-text">{{scope.row.estimat_sales_amt_rr.default|toThousands}}</span>
                        </div>
                        <div class="table-col-con">
                            推算:<span class="table-col-text">{{scope.row.estimat_sales_amt_rr.calculation|toThousands}}</span>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" label="买货占比" prop="purchase_percent">
                    <template slot-scope="scope">
                        <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')"  @change="_onChangeSave(scope,3)" type="2" v-model="scope.row.purchase_percent"></PriceInput>
                        <span v-else>{{scope.row.purchase_percent+'%'}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" prop="buying_ratio_rr" label="买货占比参考值">
                    <template slot-scope="scope">
                        <div class="table-col-con">
                            默认:<span class="table-col-text">{{scope.row.buying_ratio_rr.default}}</span>
                        </div>
                        <div class="table-col-con">
                            推算:<span class="table-col-text">{{scope.row.buying_ratio_rr.calculation}}</span>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" label="消化率" prop="digestibility">
                    <template slot-scope="scope">
                        <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" type="2" v-model="scope.row.digestibility"></PriceInput>
                        <span v-else-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.digestibility+'%'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="累计折扣" prop="annual_cumulative_discount">
                    <template slot-scope="scope">
                        <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')"  @change="_onChangeSave(scope,5)" type="2" v-model="scope.row.annual_cumulative_discount"></PriceInput>
                        <span v-else-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.annual_cumulative_discount+'%'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="款均订货件数" prop="inventory_remain">
                </el-table-column>
                <el-table-column align="center" label="库存剩余量" prop="inventory_price_of_standard">
                </el-table-column>
                <el-table-column align="center" label="库存吊牌额" prop="enough_inventory_price_of_standard">
                    <template slot-scope="scope">
                        <span :style="scope.row.inventory_tag_amount >= scope.row.expected_saleroom?'color:#8FC31FFF':'color:#FA4659FF'">{{scope.row.enough_inventory_price_of_standard|toThousands}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="库存缺口吊牌额" prop="inventor_gap_tag_amount">
                </el-table-column> -->
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.hasOwnProperty('type')" @click="_onClickGoCateGory(item,scope.row)" class="table_link">品类买货计划</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { toThousands } from '../../../utils/index'
import PriceInput from '../../../components/PriceInput'
import brandMixins from '../../../mixins/brandMixins'
export default {
  name: 'purchase-quarter',
  components: {
    PriceInput
  },
  mixins: [brandMixins],
  data () {
    return {
      form_options: {
        goods_year: [],
        sales_month: [
          { label: '1月', value: 1 },
          { label: '2月', value: 2 },
          { label: '3月', value: 3 },
          { label: '4月', value: 4 },
          { label: '5月', value: 5 },
          { label: '6月', value: 6 },
          { label: '7月', value: 7 },
          { label: '8月', value: 8 },
          { label: '9月', value: 9 },
          { label: '10月', value: 10 },
          { label: '11月', value: 11 },
          { label: '12月', value: 12 }
        ],
        focus_season: [
          { label: '正常比例', value: '1' },
          { label: '侧重春夏', value: '2' },
          { label: '侧重秋冬', value: '3' }
        ]
      },
      quarter_from: {
        goods_year: [],
        sales_month_one: 1,
        sales_month_tow: 12
      },
      quarter_content: [],
      lastNumerical: '',
      isSave: false, // 是否保存
      isEdit: true, // 是否编辑
      totalMap: {}, // 合计
      goods_type: '', // 目标年份---货品类型
      conditionSave: {
        is_expected_saleroom: false,
        is_purchase_percent: false,
        isTotal: false
      },
      overallData: {} // 接口请求所以数据
    }
  },
  created () {
    this.getYearOption()
    this.getQuarter()
  },
  methods: {
    headerCellStyleFunc () {
      return { 'background-color': 'rgba(225,241,253,1)', 'height': '56px', 'font-size': '14px', 'color': '#323232FF', 'text-align': 'center' }
    },
    _onClickExportQuarter () {
      window.open(`/api/aggregation/plan/season_purchases/export?goods_purchase_id=${Number(this.$route.params.id)}`)
    },
    setNavTitleOfEnable () { // 设置导航栏或启用编辑
      this.$route.meta.breadcrumb[2].name = this.$route.params.name + this.overallData.brand_target.year + '年季度规划'
      if (this.$route.params.type === 'view') {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
    },
    getQuarter () { // 请求列表数据
      let req = {
        id: this.$route.params.id,
        with: ['season_purchases', 'brand_target'],
        season_purchases_sort: 'group_by_year_season'
      }
      // this.$api.purchase.getQuarterData(req).then((res) => {
      this.overallData = res.data
      this.setNavTitleOfEnable()
      this.quarter_content = []
      this.quarter_from.goods_year = []
      for (let i in res.data.season_purchases) {
        this.quarter_content.push({
          year: i,
          percent: data.season_purchases[i].conditino_list.percent,
          emphasis_type: data.season_purchases[i].condition_list.emphasis_type,
          seasons: data.season_purchases[i].seasons
        })
        this.quarter_from.goods_year.push(i)
      }
      if (res.data.condition.length !== 0) {
        this.quarter_from.sales_month_one = res.data.condition.sales_months.start
        this.quarter_from.sales_month_tow = res.data.condition.sales_months.end
      }
      this.goods_type = res.data.goods_type
      this.loopTotalSurplus()
      // }
    },
    _onChangeSave (scope, type) { // 是否修改数据
      this.isSave = true
      switch (type) {
        case 1:this.changeOrderQuantity(scope); break
        case 2:this.changeExpectedSaleroom(scope); break
        case 3:this.changePurchasePercent(scope); break
        case 4:this.changeDigestibility(scope); break
        case 5:this.changeAnnualCumlatieDis(scope); break
      }
      this.loopTotalSurplus()
    },
    changeOrderQuantity (scope) { // 订货量更改
      this.orderAmtFormula(scope.row)
      this.expectedSaleroomFormula(scope.row)
      this.purchasePercentFormula(scope.row)
      this.formula(scope.row)
    },
    changeExpectedSaleroom (scope) { // 预计销售金额
      this.orderAmtFormula(scope.row)
      this.orderFormula(scope.row)
      this.purchasePercentFormula(scope.row)
      this.formula(scope.row)
    },
    changePurchasePercent (scope) { // 买货占比
      this.expectedSaleroomFormula(scope.row)
      this.orderFormula(scope.row)
      this.orderAmtFormula(scope.row)
      this.formula(scope.row)
    },
    changeDigestibility (scope) { // 消化率
    },
    changeAnnualCumlatieDis (scope) { // 累计折扣
      this.orderAmtFormula()
      this.orderFormula()
      this.formula()
    },
    /*
      订货量-计算规则
      订货量=订货吊牌额/平均吊牌价
    */
    orderFormula (row) {
      row.order_quantity = row.order_amount / row.standard_amount_avg
    },
    /*
      预计销售金额 - 计算规则
      预计销售金额=买货占比*货品年份总预计销售金额
    */
    expectedSaleroomFormula (row) {

    },
    /*
      订货吊牌额=预计销售金额/累计折扣
    */
    orderAmtFormula (row) {
      row.order_amount = row.expected_saleroom / row.annual_cumulative_discount
    },
    /*
      买货占比=预计销售金额 / 货品年份总预计销售金额
    */
    purchasePercentFormula (row) {
    },
    /*
      消化率=预计销售金额/订货吊牌额
    */
    digestibilityFormula (row) {
      row.digestibility = row.expected_saleroom / row.order_amount
    },
    /*
      累计折扣=预计销售金额/订货吊牌额
    */
    annualFormula (row) {
      row.annual_cumulative_discount = row.expected_saleroom / row.order_amount
    },
    /*
      款均订货件数=订货量/款数
      库存缺口吊牌额=订货吊牌额-库存吊牌额
    */
    formula (row) {

    },
    cellStyleFunc ({ row, column, rowIndex, columnIndex }) { // 单元格样式
      if (row.season === 5) {
        if (column.property === 'expected_saleroom' && this.conditionSave.is_expected_saleroom) {
          return {
            'color': 'red',
            'font-weight': 'bold'
          }
        } else if (column.property === 'purchase_percent' && this.conditionSave.is_purchase_percent) {
          return {
            'color': 'red',
            'font-weight': 'bold'
          }
        }
      }
    },
    rowStyleFunc ({ row, rowIndex }) { // 行样式
      return { 'font-size': '14px', 'font-weight': 400, 'height': '56px', 'color': 'rgba(50,50,50,1)' }
    },
    _onClickGO () { // 跳转到总规划
      if (this.isSave) {
        this.$confirm('当前数据发生改变,是否保存!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._onClickSave('Overall')
        }).catch(() => {
          this.goOverallFunc()
        })
      } else {
        this.goOverallFunc()
      }
    },
    // 处理年份
    getYearOption () {
      let maxYear = new Date().getFullYear() // 当年的年份 加允许最大的年份
      let minYear = new Date().getFullYear() - 3
      let year_tmp = []
      while (minYear <= maxYear) {
        year_tmp.push({
          value: minYear,
          label: minYear.toString() + '年'
        })
        minYear += 1
      }
      this.form_options.goods_year = year_tmp
    },
    _onClickSave (urlType, item, row) {
      let seasons = []
      this.quarter_content.forEach((item, key) => {
        item.seasons.forEach((val, index) => {
          if (!val.hasOwnProperty('type')) {
            seasons.push({
              order_quantity: val.order_quantity,
              order_amount: val.order_amount,
              expected_saleroom: val.expected_saleroom,
              purchase_percent: val.purchase_percent,
              digestibility: val.digestibility,
              digestive_amount: val.digestive_amount,
              spu_avg_num: val.spu_avg_num,
              annual_cumulative_discount: val.annual_cumulative_discount,
              year: val.year,
              season: val.season
            })
          }
        })
      })
      let data = {
        _method: 'PUT',
        condition: {
          sales_months: {
            start: this.quarter_from.sales_month_one,
            end: this.quarter_from.sales_month_tow
          },
          list: this.quarter_content.map((item) => {
            return {
              year: item.year,
              emphasis_type: item.emphasis_type,
              percent: item.percent
            }
          })
        },
        season_purchases: seasons
      }
      this.$api.purchase.updateQuarter(data).then((res) => {
        this.isSave = false
        this.$notify({
          title: '成功',
          type: 'success',
          message: '保存成功'
        })
        if (urlType === 'Categroy') {
          this.goCateGoryFunc(item, row)
        } else if (urlType === 'Overall') {
          this.goOverallFunc()
        }
      })
    },
    _onVisibleChangeGoodsYear (val) {
      this.isSave = true
      this.getQuarter()
    },
    _onClickGoCateGory (item, row) { // 跳转到品类规划
      if (this.isSave) {
        this.$confirm('当前数据发生改变,是否保存', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._onClickSave('Category', item, row)
        }).catch(() => {
          this.goCateGoryFunc(item, row)
        })
      } else {
        this.goCateGoryFunc(item, row)
      }
    },
    beforeConditionSave (data) { // 判断是否满足保存条件
      if (this.totalMap.expected_saleroom_total !== this.overallData.expected_saleroom) {
        this.conditionSave.is_expected_saleroom = true
        this.conditionSave.isTotal = true
      } else {
        this.conditionSave.is_expected_saleroom = false
        this.conditionSave.isTotal = false
      }
      if (this.totalMap.purchase_percent_total !== 100) {
        this.conditionSave.is_purchase_percent = true
        this.conditionSave.isTotal = true
      } else {
        this.conditionSave.is_purchase_percent = false
        this.conditionSave.isTotal = false
      }
    },
    loopTotalSurplus () { // 计算总计/合计/剩余
      let loopTotal = {
        type: '',
        season: 7, // 合计
        spu_num: 0,
        sku_num: 0,
        order_quantity: 0,
        order_amount: 0,
        expected_saleroom: this.overallData.expected_saleroom / 10000,
        expected_saleroom_total: 0,
        purchase_percent: 100,
        purchase_percent_total: 0,
        digestibility: 0,
        annual_cumulative_discount: 0
      }
      let loopSurplus = {
        type: '',
        surplus: '',
        season: 6, // 剩余
        expected_saleroom: 0,
        purchase_percent: 0
      }
      if (this.quarter_content[this.quarter_content.length - 1].hasOwnProperty('name')) {
        this.quarter_content.pop() // 删除统计行
      }
      if (this.quarter_content.length === 1) { // 只有一个列表数据时
        for (let i = 0; i < this.quarter_content[0].seasons.length; i++) {
          loopTotal.spu_num += this.quarter_content[0].seasons[i].spu_num
          loopTotal.sku_num += this.quarter_content[0].seasons[i].sku_num
          loopTotal.order_quantity += this.quarter_content[0].seasons[i].order_quantity
          loopTotal.order_amount += this.quarter_content[0].seasons[i].order_amount
          loopTotal.purchase_percent_total += this.quarter_content[0].seasons[i].expected_saleroom
          loopTotal.purchase_percent_total += this.quarter_content[0].seasons[i].purchase_percent
          loopTotal.digestibility += this.quarter_content[0].seasons[i].digestibility
          loopTotal.annual_cumulative_discount += this.quarter_content[0].seasons[i].annual_cumulative_discount
        }
        loopSurplus.expected_saleroom = loopTotal.expected_saleroom - loopTotal.expected_saleroom_total
        loopSurplus.purchase_percent = loopTotal.purchase_percent - loopTotal.purchase_percent_total
        this.quarter_content.push(loopSurplus, loopTotal)
      } else { // 为旧货并且有多个列表数据时
        for (let i = 0; i < this.quarter_content.length; i++) {
          this.quarter_content[i].seasons.pop()
          let Total = {
            type: '',
            season: 5, // 总计
            spu_num: 0,
            sku_num: 0,
            order_quantity: 0,
            order_amount: 0,
            expected_saleroom: 0,
            purchase_percent: 0,
            digestibility: 0,
            annual_cumulative_discount: 0
          }
          for (let j = 0; j < this.quarter_content[i].seasons.length; j++) {
            Total.spu_num += this.quarter_content[i].seasons[j].spu_num
            Total.sku_num += this.quarter_content[i].seasons[j].sku_num
            Total.order_quantity += this.quarter_content[i].seasons[j].order_quantity
            Total.order_amount += this.quarter_content[i].seasons[j].order_amount
            Total.expected_saleroom += this.quarter_content[i].seasons[j].expected_saleroom
            Total.purchase_percent += this.quarter_content[i].seasons[j].purchase_percent
            Total.digestibility += this.quarter_content[i].seasons[j].digestibility
            Total.annual_cumulative_discount += this.quarter_content[i].seasons[j].annual_cumulative_discount
          }
          this.quarter_content[i].seasons.push(Total)

          loopTotal.spu_num += Total.spu_num
          loopTotal.sku_num += Total.sku_num
          loopTotal.order_quantity += Total.order_quantity
          loopTotal.order_amount += Total.order_amount
          loopTotal.expected_saleroom_total += Total.expected_saleroom_total
          loopTotal.purchase_percent_total += Total.purchase_percent_total
          loopTotal.digestibility += Total.digestibility
          loopTotal.annual_cumulative_discount += Total.annual_cumulative_discount
        }
        loopSurplus.expected_saleroom = loopTotal.expected_saleroom - loopTotal.expected_saleroom_total
        loopSurplus.purchase_percent = loopTotal.purchase_percent - loopTotal.purchase_percent_total
        this.quarter_content.push(loopSurplus, loopTotal)
      }
    },
    goOverallFunc () {
      this.$router.push({
        name: 'plan.purchase.overall',
        params: {
          id: this.overallData.brand_target_id,
          type: this.$route.params.type
        }
      })
    },
    goCateGoryFunc (item, row) {
      this.$router.push({
        name: 'plan.purchase.category',
        params: {
          id: this.$route.params.id,
          type: this.$route.params.type,
          goods_type: this.goods_type,
          year: this.$route.params.year,
          target_saleroom: row.expected_saleroom,
          target_year: item.year,
          annual_cumulative_discount: row.annual_cumulative_discount
        }
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang='scss' scoped>
#quarter{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width:100%;
    padding-bottom:30px;
    .quarter-steps{
        padding:33px 226px 32px 226px;
    }
    .quarter-header{
        border-top:1px solid rgba(226,226,226,1);
        border-bottom: 1px solid rgba(226,226,226,1);
        min-height:104px;
        display:flex;
        align-items:center;
        .quarter-header-btn{
            height:100%;
            flex:1;
            text-align:right;
            .header-btn{
                width:100px;
                background:rgba(100,188,255,1);
                border-radius:6px;
                border-color: rgba(100,188,255,1);
                margin-top:5px;
                margin-bottom:5px;
                margin-right:10px;
            }
            .save-btn-disabled{
                color: #606266;
                background: #cccccc;
                border: none;
            }
        }
        .form-confirm-btn{
            width:80px;
            height:32px;
            border-radius:6px;
            background:rgba(100,188,255,1);
            border-color: rgba(100,188,255,1);
        }
    }
    /deep/.el-form-item__label{
        font-size:14px;
        font-weight:400;
        color:rgba(150,150,150,1);
    }
    .title-con{
        font-size:18px;
        font-weight:bold;
        color:rgba(50,50,50,1);
        margin-right:40px;
    }
    /deep/ .el-form-item{
        margin-bottom:5px;
        margin-left:24px;
    }
    /deep/ .el-input__inner{
        text-align: center;
    }
    .quarter-content{
        .content-header{
            height:50px;
            position: relative;
            .header_con{
                width:12px;
                display:inline-block;
                height:50px;
                background:rgba(100,188,255,1);
            }
            .header_con1{
                line-height:50px;
                position: absolute;
                font-size:18px;
                font-weight:500;
                margin-left:10px;
            }
            .header-from{
                display:inline-block;
                position: absolute;
                .header-form-item{
                    height:50px;
                    line-height:50px;
                    margin-left: 10px;
                    margin-right: 56px;
                }
                .header-title-con{
                    font-size:18px;
                    font-weight:500;
                    color:rgba(50,50,50,1);
                    height: 50px;
                    line-height: 50px;
                }
            }
        }
        .table-col-con{
            font-size:12px;
            font-weight:400;
            color:rgba(150,150,150,1);
            .table-col-text{
                font-size:14px;
                font-weight:400;
                color:rgba(50,50,50,1);
            }
        }
    }
    /deep/ .el-table__footer{
        height:56px;
        font-size:14px;
        font-weight:500;
        color:rgba(50,50,50,1);
    }
}
</style>

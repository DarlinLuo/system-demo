<template>
  <div id="category">
      <div class="category-steps">
            <el-steps :active="2" align-center>
                <el-step @click.native="_onClickGocategory('plan.purchase.overall')" title="买货总规划"></el-step>
                <el-step @click.native="_onClickGocategory('plan.purchase.quarter')" title="季度买货规划"></el-step>
                <el-step title="品类买货规划"></el-step>
            </el-steps>
        </div>
        <div class="category-header">
            <el-form :inline="true">
                <!-- <el-form-item  label="品牌:">
                    <span class="header-form-item">达衣岩</span>
                </el-form-item> -->
                <el-form-item label="目标年份:">
                    <span class="header-form-item">{{$route.params.year}}</span>
                </el-form-item>
                <el-form-item label="货品类型:">
                    <span class="header-form-item" v-if="$route.params.goods_type === 0">新货</span>
                    <span class="header-form-item" v-if="$route.params.goods_type === 1">旧货</span>
                    <span class="header-form-item" v-if="$route.params.goods_type === 2">特供</span>
                    <span class="header-form-item" v-if="$route.params.goods_type === 3">加单</span>
                </el-form-item>
                <el-form-item label="货品年份:">
                    <span class="header-form-item">{{$route.params.target_year}}</span>
                </el-form-item>
                <el-form-item label="预计销售金额:">
                    <span class="header-form-item">{{$route.params.target_saleroom|toThousands}}万元</span>
                </el-form-item>
            </el-form>
            <div class="header-btn">
                <el-button style="color:rgba(200,200,200,1);" class="btn-item btn-close" size="small" @click="_onClickGocategory('plan.purchase.quarter')">返回</el-button>
                <el-button @click="_onClickImport" :disabled="!isEdit" class="btn-item" size="small" type="primary">导入</el-button>
                <el-button @click=_onClickExportCateGory class="btn-item" size="small" type="primary">导出</el-button>
                <el-button :disabled="!isEdit ||conditionSave.isTotal" :class="conditionSave.isTotal?'btn-item btn-item-disabled':'btn-item'" size="small" type="primary" @click="_onClickSave">保存</el-button>
            </div>
        </div>
        <div class="category-content">
            <span class="content-title">品类卖货规划</span>
            <el-table border class="table" :header-cell-style='headerCellStyleFunc' :row-style='rowStyleFunc' :data="tableList" :span-method="arraySpanMethod" :cell-style="cellStyleFunc">
                <el-table-column>
                    <el-table-column prop="sales_season" label="季节" align="center"></el-table-column>
                    <el-table-column prop="sales_category_name" label="类目" align="center"></el-table-column>
                </el-table-column>
                <el-table-column :label="years.two_year_data_name" align="center">
                    <el-table-column width="100" prop="standard_amount" label="吊牌额(元)" align="center">
                        <template slot-scope="scope">
                            <PriceInput :disabled="!isEdit" @change="_onChange(scope,1)" v-if="!scope.row.hasOwnProperty('type')" type="0" v-model="scope.row.standard_amount"></PriceInput>
                            <span v-else-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.standard_amount|toThousands}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" prop="standard_amount_percent" label="预计销售金额占比" align="center">
                        <template slot-scope="scope">
                            <PriceInput :disabled="!isEdit" @change="_onChange(scope,2)" v-if="!scope.row.hasOwnProperty('type')" type='2' v-model="scope.row.standard_amount_percent">
                            </PriceInput>
                            <span v-else>{{scope.row.standard_amount_percent + '%'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" prop="purchase_num" label="买货件数" align="center">
                        <template slot-scope="scope">
                            <PriceInput :disabled="!isEdit" @change="_onChange(scope,3)" v-if="!scope.row.hasOwnProperty('type')" type="1" v-model="scope.row.purchase_num"></PriceInput>
                            <span v-else>{{scope.row.purchase_num}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales_saleroom" label="销售金额(元)" align="center">
                        <template slot-scope="scope">
                            <div >{{scope.row.sales_saleroom|toThousands}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="expected_purchase_depth" label="预计买货深度" align="center"></el-table-column>
                    <el-table-column prop="expected_avg_depth" label="预估均深度" align="center"></el-table-column>
                </el-table-column>
                <el-table-column :label="years.one_year_data_name" align="center">
                    <el-table-column prop="sales_spu_num" label="款数" align="center"></el-table-column>
                    <el-table-column prop="sales_sales_num" label="数量" align="center"></el-table-column>
                    <el-table-column prop="sales_sales_depth_avg" label="平均销售深度" align="center"></el-table-column>
                    <el-table-column prop="sales_saleroom" label="销售金额" align="center">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.sales_saleroom|toThousands}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales_sales_percent" label="销售金额占比" align="center">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.sales_saleroom+'%'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales_sales_discount" label="销售折扣" align="center">
                         <template slot-scope="scope">
                            <div v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.sales_sales_discount+'%'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales_sales_amount_avg" label="销售均价" align="center">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.sales_sales_amount_avg|toThousands}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales_standard_amount" label="吊牌额" align="center">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.sales_standard_amount|toThousands}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales_standard_price_avg" label="吊牌均价" align="center">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.hasOwnProperty('surplus')">{{scope.row.sales_standard_price_avg|toThousands}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="卖货级别定义" align="center">
                    <el-table-column width="80" prop="purchase_level_a" label="A" align="center">
                        <template slot-scope="scope">
                            <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" v-model="scope.row.purchase_level_a"></PriceInput>
                            <span v-else>{{scope.row.purchase_level_a}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80" prop="purchase_level_b" label="B" align="center">
                        <template slot-scope="scope">
                            <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" v-model="scope.row.purchase_level_b"></PriceInput>
                            <span v-else>{{scope.row.purchase_level_b}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80" prop="purchase_level_c" label="C" align="center">
                        <template slot-scope="scope">
                            <PriceInput :disabled="!isEdit" v-if="!scope.row.hasOwnProperty('type')" v-model="scope.row.purchase_level_c"></PriceInput>
                            <span v-else>{{scope.row.purchase_level_c}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog width="761px" :visible.sync="isImportDialog" title="导入" :before-close="beforeClose">
            <div class="dialog-box">
                <el-upload
                    style="text-align:center"
                    class="upload"
                    drag
                    action=""
                    :before-upload="beforeUpload"
                    ref="upload"
                    :http-request="httpRequest"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div class="template_url">点击下载Excel模板</div>
                <div class="upload-tips">每次只能上传一个Excel文件</div>
            </div>
            <div class="dialog-btn">
                <el-button size="small" class="btn-addOrder" @click="isImportDialog = false">取 消</el-button>
                <el-button size="small" style="width:90px;" type="primary" @click="_onClickConfirm">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import PriceInput from '../../../components/PriceInput'
import toThousands from '../../../utils/index'
// import Decimal from 'decimal.js'
// import brandMixins from '../../../mixins/brandMixins'
export default {
  // name: 'category',
  components: {
    PriceInput
  },
  // mixins: [brandMixins],
  data () {
    return {
      tableList: [],
      years: {
        one_year_data_name: '',
        two_year_data_name: ''
      },
      totalMap: {}, //
      isSave: false, // 是否保存 ,
      conditionSave: { // 是否满足保存条件
        is_sales_saleroom: false,
        is_sales_saleroom_percent: false,
        isTotal: false
      },
      isEdit: false,
      isImportDialog: false,
      file: {},
      test: 342
    }
  },
  methods: {
    headerCellStyleFunc () {
      return { 'background-color': '#E1F1FDFF', 'height': '56px', 'font-size': '14px', 'color': '#323232FF', 'text-align': 'center' }
    },
    _onClickExportCateGory () {
      window.open(`/api/aggregation/plan/category_purchases/export?season_purchase_id=${Number(this.$route.params.id)}`)
    },
    beforeClose () {
      this.$refs.upload.clearFiles()
      this.isImportDialog = false
    },
    beforeUpload (file) { // 文件上传前的检验
      this.file = {}
      let msg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (msg !== 'xls' && msg !== 'xlsx') {
        this.$notify({
          title: '提示',
          message: '文件格式不正确',
          type: 'warning',
          duration: 5000
        })
        return null
      }
      this.file = file
    },
    httpRequest () { // 文件上传

    },
    _onClickImport () {
      this.isImportDialog = true
    },
    _onClickConfirm () {
      this.$refs.upload.submit() // 假提交
      this.isImportDialog = false
    },
    setNavTitleOfEnable () { // 设置导航栏或启用编辑
      this.$route.meta.breadcrumb[2].name = this.$store.state.brand.selectBrand.name + this.$route.params.year + '年品类买货规划'
      if (this.$route.params.type === 'view') {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
      this.years.one_year_data_name = this.$route.params.year - 1 + '年类目销售'
      this.years.two_year_data_name = this.$route.params.year + '年商品计划'
    },
    _onClickSave (link, params) {
      const data = {
        _method: 'PUT',
        id: this.$route.params.id,
        category_purchases: this.tableList.map((item) => {
          return {
            category_id: item.category_id,
            standard_amount: item.standard_amount,
            standard_amount_percent: item.standard_amount_percent,
            purchase_num: item.purchase_num,
            expected_purchase_depth: item.expected_purchase_depth,
            expected_avg_depth: item.expected_avg_depth,
            purchase_level_a: item.purchase_level_a,
            purchase_level_b: item.purchase_level_b,
            purchase_level_c: item.purchase_level_c
          }
        })
      }
      this.$api.purchase.updateCateGory().then((res) => {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '保存成功'
        })
        this.isSave = false
        if (link !== '') {
          this.$router.push({
            name: link,
            params: params
          })
        }
      })
    },
    getCategory () { // 获取列表数据
      // const data={
      //     id:this.$route.params.id,
      //     with:['goods_purchase','category_purchases']
      // }
      // this.$api.purchase.getCategoryData(data).then((res)=>{
      // })
      this.tableList = [
        { expected_avg_depth: 433,
          expected_purchase_depth: 34,
          purchase_level_a: null,
          purchase_level_b: null,
          purchase_level_c: null,
          purchase_num: 32,
          sales_category_name: 'T恤类',
          sales_saleroom: 4323,
          sales_sales_amount_avg: 65,
          sales_sales_depth_avg: 34,
          sales_sales_discount: 65,
          sales_sales_num: 4323,
          sales_sales_percent: 65,
          sales_season: '秋',
          sales_sku_num: 32,
          sales_spu_num: 32,
          sales_standard_amount: 32,
          sales_standard_price_avg: 32,
          sales_year: '',
          standard_amount: 21,
          standard_amount_percent: 32
        },
        { expected_avg_depth: 43,
          expected_purchase_depth: 34,
          purchase_level_a: null,
          purchase_level_b: null,
          purchase_level_c: null,
          purchase_num: 32,
          sales_category_name: 'T恤类',
          sales_saleroom: 43,
          sales_sales_amount_avg: 65,
          sales_sales_depth_avg: 34,
          sales_sales_discount: 65,
          sales_sales_num: 43,
          sales_sales_percent: 65,
          sales_season: '夏',
          sales_sku_num: 32,
          sales_spu_num: 32,
          sales_standard_amount: 32,
          sales_standard_price_avg: 32,
          sales_year: '',
          standard_amount: 21,
          standard_amount_percent: 45
        }
      ]
      this.loopTotalSurplus()
    },
    _onClickGocategory (link) {
      let params = {}
      if (link === 'plan.purchase.overall') {
        params = {
          id: this.$route.params.id,
          type: this.$route.params.type
        }
      } else if (link === 'plan.purchase.quarter') {
        params = {
          id: this.$route.params.id,
          type: this.$route.params.type,
          name: this.$route.params.name
        }
      }
      if (this.isSave) {
        this.$confirm('当前数据发生改变,是否保存', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._onClickSave(link, params)
        }).catch(() => {
          this.$router.push({
            name: link,
            params: params
          })
        })
      } else {
        this.$router.push({
          name: link,
          params: params
        })
      }
    },
    loopTotalSurplus () { // 获取总计/剩余行数据
      if (this.tableList[this.tableList.length - 1].hasOwnProperty('type')) {
        this.tableList.splice(this.tableList.length - 2, 2)
      }
      let loopTotal = {
        type: '',
        name: '合计',
        sales_season: '合计',
        standard_amount: 0,
        standard_amount_percent: 100,
        standard_amount_percent_total: 0,
        purchase_num: 0,
        sales_saleroom: this.$route.params.target_saleroom,
        sales_saleroom_total: 0,
        expected_purchase_depth: 0,
        sales_spu_num: 0,
        sales_saleroom: 0,
        sales_sales_discount: 0,
        sales_sales_amount_avg: 0,
        sales_standard_amount: 0,
        sales_standard_price_avg: 0
      }
      for (let i = 0; i < this.tableList.length; i++) {
        loopTotal.standard_amount += this.tableList[i].standard_amount
        loopTotal.standard_amount_percent_total += this.tableList[i].standard_amount_percent
        loopTotal.purchase_num += this.tableList[i].purchase_num
        loopTotal.sales_saleroom_total += this.tableList[i].sales_saleroom
        loopTotal.expected_purchase_depth += this.tableList[i].expected_purchase_depth
        loopTotal.sales_spu_num += this.tableList[i].sales_spu_num
        loopTotal.sales_saleroom += this.tableList[i].sales_saleroom
        loopTotal.sales_sales_discount += this.tableList[i].sales_sales_discount
        loopTotal.sales_sales_amount_avg += this.tableList[i].sales_sales_amount_avg
        loopTotal.sales_standard_amount += this.tableList[i].sales_standard_amount
        loopTotal.sales_standard_price_avg += this.tableList[i].sales_standard_price_avg
      }
      let loopSurplus = {
        surplus: '',
        type: '',
        sales_category_name: '剩余',
        sales_season: '剩余',
        standard_amount_percent: (100 - loopTotal.standard_amount_percent_total).toFixed(1),
        sales_saleroom: this.$route.params.target_saleroom - loopTotal.target_saleroom_total
      }
      this.tableList.push(loopSurplus, loopTotal)
    },
    beforeConditionSave (data) { // 判断是否满足保存条件
      if (this.totalMap.standard_amount_total !== this.$route.params.target_saleroom) {
        this.conditionSave.is_sales_saleroom = true
        this.conditionSave.isTotal = true
      } else {
        this.conditionSave.is_sales_saleroom = false
        this.conditionSave.isTotal = false
      }
      if (this.totalMap.standard_amount_percent_total !== 100) {
        this.conditionSave.is_sales_saleroom_percent = true
        this.conditionSave.isTotal = true
      } else {
        this.conditionSave.is_sales_saleroom_percent = false
        this.conditionSave.isTotal = false
      }
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) { // 合并行
      if (row.sales_season === '合计' || row.sales_season === '剩余') {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    cellStyleFunc ({ row, column, rowIndex, columnIndex }) { // 单元格样式
      if (row.sales_season === '剩余') {
        if (this.conditionSave.is_sales_saleroom && column.property === 'sales_saleroom') {
          return {
            'color': 'red',
            'font-weight': 'bold'
          }
        } else if (this.conditionSave.is_sales_saleroom_percent && column.property === 'standard_amount_percent') {
          return {
            'color': 'red',
            'font-weight': 'bold'
          }
        }
      }
    },
    rowStyleFunc ({ row, rowIndex }) { // 行样式
      if (row.sales_season === '合计' || row.sales_season === '剩余') {
        return { 'font-size': '14px', 'font-weight': 400, 'height': '56px', 'color': 'rgba(50,50,50,1)', 'background-color': 'rgba(225,241,253,1)' }
      } else {
        return { 'font-size': '14px', 'font-weight': 400, 'height': '56px', 'color': 'rgba(50,50,50,1)' }
      }
    },
    _onChange (scope, type) { // 各行计数相关计算
      this.isSave = true
      switch (type) {
        case 1:this.changeStandardAmount(scope); break
        case 2:this.changeStandardAmountPercent(scope); break
        case 3:this.changePurchaseNum(scope); break
      }
      this.loopTotalSurplus()
    },
    changeStandardAmount (scope) { // 吊牌额
      this.purchaseNumFormula(scope.row)
      this.salesSaleroomFormula(scope.row)
      this.standardAmountPercentFormula(scope.row)
    },

    changeStandardAmountPercent (scope) { // 销售金额占比
      this.salesSaleroomFormula(scope.row)
      this.standardAmountFormula(scope.row)
      this.purchaseNumFormula(scope.row)
    },
    changePurchaseNum (scope) { // 买货件数
      this.standardAmountFormula(scope.row)
      this.salesSaleroomFormula(scope.row)
      this.standardAmountPercentFormula(scope.row)
    },
    standardAmountFormula (row) { // 吊牌额计算公式

    },
    standardAmountPercentFormula (row) { // 销售金额占比计算公式

    },
    purchaseNumFormula (row) { // 买货件数计算公式

    },
    salesSaleroomFormula (row) { // 销售金额计算公式
    },
    objectToArray (array) {
      this.totalMap
      for (let k of Object.keys(array)) {
        this.totalMap.set(k, array[k])
      }
    }
  },
  created () {
    this.setNavTitleOfEnable()
    this.getCategory()
  }
}
</script>

<style lang='scss' scoped>
    #category{
        width:100%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .category-steps{
            padding:33px 226px 0 226px;
        }
        .category-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-top:30px;
            border-top:1px solid rgba(226,226,226,1);
            border-bottom:1px solid rgba(226,226,226,1);
            .header-btn{
                text-align:right;
                .btn-item{
                    width:100px;
                    height:32px;
                    margin:9px 10px 9px 0;
                    background:rgba(100,188,255,1);
                    border-radius:6px;
                    border-color: rgba(100,188,255,1);
                }
                .btn-item-disabled{
                    color: #606266;
                    background: #cccccc;
                    border: none;
                }
                .btn-close{
                    background:rgba(255,255,255,1);
                    border-color:#E2E2E2FF
                }
            }
            .el-form{
                display:inline-block;
                margin-left:24px;
                /deep/ .el-form-item{
                    margin:0;
                }
                /deep/ .el-form-item__label{
                    font-size:14px;
                    font-weight:400;
                    color:rgba(150,150,150,1);
                }
                .header-form-item{
                    font-size:18px;
                    font-weight:bold;
                    color:rgba(50,50,50,1);
                    margin-right:72px;
                }
            }
        }
        .category-content{
            display:flex;
            flex-direction:column;
            .content-title{
                display:inline-block;
                border-left:12px solid rgba(100,188,255,1);
                height:50px;
                line-height:50px;
                padding-left: 13px;
                font-size:18px;
                font-weight:bold;
                color:rgba(50,50,50,1);
            }
            .table{
                flex:1;
            }
        }
        .dialog-box{
            width:380px;
            position: relative;
            left:50%;
            margin-left:-190px;
            .template_url{
                display:inline-block;
                font-size:14px;
                font-family:Source Han Sans CN;
                font-weight:400;
                color:rgba(100,188,255,1);
            }
            .template_url:hover{
                cursor: pointer;
            }
            .upload-tips{
                display:inline-block;
                position: absolute;;
                right:0;
                font-size:14px;
                font-weight:400;
                color:rgba(150,150,150,1);
            }
        }
        .dialog-btn{
            margin-top:71px;
            text-align:center;
            .btn-addOrder{
                width:90px;
                height:32px;
                border:1px solid rgba(226,226,226,1);
                border-radius:6px;
                background:#FFFFFFFF;
            }
        }
    }
</style>

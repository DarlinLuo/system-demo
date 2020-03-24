<template>
  <div id="goods-pricing-box">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item>
        <el-button type="lightBlue" @click="import_pricing" style="margin-left:40px">导入定价</el-button>
      </el-form-item>
    </el-form>
    <ul class="list-data">
      <li style="background:rgba(225,241,253,1);">
        <span style="font-weight:500">序号</span>
        <span style="font-weight:500">品牌</span>
        <span style=" disply:inline-block;width:100px;font-weight:500">商品数</span>
        <span style=" disply:inline-block;width:100px;font-weight:500">锁定价格</span>
        <span style="font-weight:500">调整</span>
        <span style="font-weight:500">调整</span>
      </li>
      <li
        v-for="(item,index) in tableData"
        :key="item.id"
        :class="{list_item_on:index%2==0,list_item_off:index%2!=0}"
      >
        <span>{{index + 1}}</span>
        <span>{{item.name}}</span>
        <span style=" disply:inline-block;width:100px;">{{item.num}}</span>
        <span style=" disply:inline-block;width:100px;color:rgba(100,188,255,1);font-size:14px;">
          <span v-if="item.lock_status == '0'" @click="lockprice(item.id)">锁定</span>
          <span v-if="item.lock_status == 1" @click="unlock(item.id)">解锁</span>
        </span>
        <span style=" color:rgba(100,188,255,1);font-size:14px;" @click="decline(item.id)">活动折扣降幅</span>
        <span
          style=" color:rgba(100,188,255,1);font-size:14px;"
          @click="details(item)"
        >详情</span>
      </li>
    </ul>

    <br />
    <el-row>
      <el-col :span="13" :offset="11">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,20,30]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
        ></el-pagination>
      </el-col>
    </el-row>
    <br />
    <el-dialog :visible.sync="addNewDialog" width="35%">
      <div class="googfon">
        <p>导入定价</p>
      </div>
      <el-form ref="newform" :model="newform" class="s">
        <el-form-item label="品牌" prop="groupName" style="margin-left:-40px">
          <el-select
            v-model="newform.groupName"
            placeholder
            style="width: 65%"
            @change="newSelectGroup($event)"
          >
            <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="expvmFiles">
          <el-upload
            class="upload-demo"
            drag
            ref="uploadfile"
            :action="upload_url"
            :auto-upload="false"
            :before-upload="newFiles"
            :multiple="false"
            :limit = 1
            :on-exceed="handleExceed"
            :http-request="_httpRequest"
          >
            <div class="el-upload__text">
              <p style="color:rgba(200,200,200,1)">将文件拖到此处</p>
              <p style="color:rgba(200,200,200,1)">或</p>
              <em style="color:rgba(100,188,255,1)">点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              <el-button type="text" @click="downloadTemplate">点击下载Excel模板</el-button>
              <p>每次只能传一个Excel文件</p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item style="text-align:left">
          <el-button @click="cancelPricing" style="margin-left:60px">取消</el-button>
          <el-button
            type="lightBlue"
            @click="newSubmitForm()"
            class="yes-btn"
            style="margin-left:80px"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <br />
    <el-dialog :visible.sync="declineDialog" width="35%">
      <el-form class="ss">
        <el-form-item label style="text-align:center">
          A：
          <el-input
            style="width:200px"
            size="small"
            placeholder
            v-model="inputA"
            oninput="value=value.replace(/[^\d.]/g,'')"
            clearable
          ></el-input>%
        </el-form-item>
        <el-form-item label style="text-align:center">
          B：
          <el-input
            style="width:200px"
            size="small"
            placeholder
            v-model="inputB"
            oninput="value=value.replace(/[^\d.]/g,'')"
            clearable
          ></el-input>%
        </el-form-item>
        <el-form-item label style="text-align:center">
          C：
          <el-input
            style="width:200px"
            size="small"
            placeholder
            v-model="inputC"
            oninput="value=value.replace(/[^\d.]/g,'')"
            clearable
          ></el-input>%
        </el-form-item>
        <el-form-item label style="text-align:center">
          D：
          <el-input
            style="width:200px"
            size="small"
            placeholder
            v-model="inputD"
            oninput="value=value.replace(/[^\d.]/g,'')"
            clearable
          ></el-input>%
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button @click="cancelDecline">取消</el-button>
          <el-button type="primary" @click="saveDecline()" class="yes-btn">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="lockingPriceDialog"
      width="30%"
      center
      style="margin-top:140px"
    >
      <span v-if="lockingPriceStatus">您确定要解锁吗？</span>
      <span v-if="lockingPriceStatus == false">您确定要锁定吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLockingPriceDialog">取 消</el-button>
        <el-button type="lightBlue" @click="ensureOperate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    // 获取导入定价选择品牌列表
    this.$api.goods.getBrandList().then((res) => {
      if (res.code === 0) {
        res.data.data.forEach(item => {
          if (item.enable === 1) {
            this.brand.push({
              id: item.id,
              name: item.name
            })
          }
        })
      }
    })
    this.getList()
  },
  data () {
    return {
      brand: [],
      totalItems: 1, // 商品总个数
      newform: {
        groupName: ''
      },
      upload_url: 'aaa', // 上传的时候要用到
      addNewDialog: false,
      declineDialog: false, // 显示折扣降幅弹窗
      lockingPriceDialog: false, // 显示价格锁定弹窗
      lockingPriceStatus: false, // 解锁还是锁定提示
      brandId: '', // 解锁或锁定的商品id
      tableData: [], // 商品列表信息
      // 分页信息
      form: {
        page: 1,
        pageSize: 10
      },
      brand_id: '', // 选择上传文件的品牌id
      fileList: {}, // 选择文件序列
      // 活动折扣降幅
      inputA: '',
      inputB: '',
      inputC: '',
      inputD: ''
    }
  },
  methods: {
    // 请求定价列表
    getList () {
      this.$api.goods.getPriceList({ page: this.form.page, per_page: this.form.pageSize, is_paginate: 1 }).then(res => {
        if (res.data.data.length !== 0) {
          this.tableData.length = 0
          res.data.data.forEach(item => {
            this.tableData.push(item)
          })
        }
        this.totalItems = res.data.total
      })
    },
    // 导入定价
    import_pricing () {
      this.addNewDialog = true
    },
    handleSizeChange (size) {
      this.form.pageSize = size
      this.getList()
    },
    handleCurrentChange (page) {
      this.form.page = page
      this.getList()
    },
    // 确定上传文件
    newSubmitForm () {
      this.$refs.uploadfile.submit() // 假提交
    },
    // 打开文件选择窗口
    newFiles (file) {
      this.fileList = {}
      this.fileList = file
    },
    // 获取选中导入的品牌id
    newSelectGroup (ev) {
      this.brand_id = ev
    },
    // 判断文件上传的个数，限制一条
    handleExceed (files, fileList) {
      this.$notify({
        title: '提示',
        message: '每次只能选择一个文件进行上传',
        type: 'warning',
        duration: 5000
      })
    },
    // 确认导入定价列表
    _httpRequest () {
      let msg = this.fileList.name.substring(this.fileList.name.lastIndexOf('.') + 1)
      if (msg !== 'xls' && msg !== 'xlsx') {
        this.$notify({
          title: '提示',
          message: '文件格式不正确',
          type: 'warning',
          duration: 5000
        })
        return null
      }
      let formData = new FormData()
      formData.append('brand_id', this.brandId)
      formData.append('file', this.fileList)
      formData.append('type', 'pricing_use_record')
      this.$api.importManage.createImportLog(formData).then((res) => {
        this.$notify({
          type: 'success',
          title: '成功',
          message: '导入定价成功'
        })
        this.$refs.uploadfile.clearFiles()// 清空上传的文件列表
        this.newform.groupName = ''
      })
    },
    // 取消价格导入弹窗
    cancelPricing () {
      this.addNewDialog = false
      this.$refs.uploadfile.clearFiles()// 清空上传的文件列表
      this.newform.groupName = ''
    },
    // 详情
    details (se) {
      this.$router.push({
        path: `/goods/pricingdetails/${se.id}`
      })
    },
    // 锁定价格
    lockprice (value) {
      this.lockingPriceStatus = false
      this.lockingPriceDialog = true
      this.brandId = value
    },
    // 取消锁定价格
    unlock (value) {
      this.lockingPriceStatus = true
      this.lockingPriceDialog = true
      this.brandId = value
    },
    // 折扣降幅
    decline (row) {
      this.declineDialog = true
      this.brandId = row
      // 获取折扣降幅
      this.$api.goods.getReduction({ brand_id: row }).then(res => {
        if (res.data.length !== 0) {
          this.inputA = res.data.discounts.A
          this.inputB = res.data.discounts.B
          this.inputC = res.data.discounts.C
          this.inputD = res.data.discounts.D
        } else if (res.data.length === 0) {
          this.inputA = 0
          this.inputB = 0
          this.inputC = 0
          this.inputD = 0
        }
      })
    },
    // 取消折扣降幅
    cancelDecline () {
      this.declineDialog = false
    },
    // 保存折扣降幅
    saveDecline () {
      let discount = {}
      discount.A = (this.inputA * 1).toFixed(2)
      discount.B = (this.inputB * 1).toFixed(2)
      discount.C = (this.inputC * 1).toFixed(2)
      discount.D = (this.inputD * 1).toFixed(2)
      this.$api.goods.saveReduction({
        brand_id: this.brandId,
        discounts: JSON.stringify(discount)
      })
        .then(res => {
          this.inputA = res.data.discounts.A
          this.inputB = res.data.discounts.B
          this.inputC = res.data.discounts.C
          this.inputD = res.data.discounts.D
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          })
        })
    },
    // 下载模板
    downloadTemplate () {
      window.open('/api/api/aggregation/import/template/?type=pricing_use_record')
    },
    // 取消锁定价格
    cancelLockingPriceDialog () {
      this.lockingPriceDialog = false
    },
    // 确定价格锁定或解锁
    ensureOperate () {
      this.lockingPriceDialog = false
      // 解锁
      if (this.lockingPriceStatus) {
        this.$api.goods.unLock({ brand_id: this.brandId }).then(res => {
          this.tableData.forEach(item => {
            if (item.id === this.brandId) {
              item.lock_status = 0
            }
          })
          this.$notify({
            title: '成功',
            message: '解锁成功',
            type: 'success'
          })
        })
      } else {
        // 锁定
        this.$api.goods.LockPricing({ brand_id: this.brandId }).then(res => {
          this.tableData.forEach(item => {
            if (item.id === this.brandId) {
              item.lock_status = 1
            }
          })
          this.$notify({
            title: '成功',
            message: '锁定成功',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scope>
#goods-pricing-box {
  padding-top: 20px;
  height: 760px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  .el-row {
    position: absolute;
    right: 300px;
    bottom: 10px;
  }
  .list-data {
    width: 1654px;
    margin-left: -40px;
    margin-top: -10px;
    max-height: 640px;
    overflow: auto;
  }
  .list-data li {
    width: 100%;
    height: 56px;
    font-size: 14px;
    color: #323232;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      display: inline-block;
      width: 120px;
      text-align: left;
      cursor: pointer;
    }
    &:hover {
      background: #eef6fd;
    }
  }
  .list_item_on {
    background: #fff;
  }
  .list_item_off {
    background: #f7fafe;
  }
  .el-upload__tip {
    width: 70%;
    display: flex;
    justify-content: space-between;
  }
  .s {
    margin-left: 20%;
  }
  .googfon {
    width: 100px;
    height: 50px;
    border-bottom: solid rgba(100, 188, 255, 1) 4px;
    text-align: center;
    margin-bottom: 40px;
    p {
      line-height: 50px;
      font-size: 20px;
      color: rgba(50, 50, 50, 1);
      font-weight: 400;
      margin-top: -60px;
    }
  }
  .el-upload__text {
    margin-top: 40px;
  }
  .el-dialog .el-dialog__header .el-dialog__title {
    display: none;
  }
}
</style>

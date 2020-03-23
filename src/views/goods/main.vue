<template>
    <div id="mainbox">
        <el-form inline class="brand-header" >
            <el-form-item label="品牌" style="height:32px">
                <el-input v-model="select_brand" ></el-input>
            </el-form-item>
            <el-button class="btn-query" type="primary" @click="queryBrand">查询</el-button>
            <el-button class="btn-add" type="primary"  @click="_onClickAddBrand">新增品牌</el-button>
        </el-form>
        <el-table class="brand-box" height="560" :row-style='{"font-size":"14px","font-weight":400,"height":"96px"}' :data="brandData" :header-cell-style='{"background-color":"rgba(225,241,253,1)","height":"46px","font-size":"14px","color":"#323232FF"}' style="width:100%" :row-class-name="tableRowClassName">
            <el-table-column prop="id" label="ID" min-width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="品牌" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="logo" label="品牌logo" min-width="150" align="center">
                <template slot-scope="scope">

                    <img v-if="scope.row.logo !== null" style="height:96px;width:100%;border:none;" :src="scope.row.logo">
                </template>
            </el-table-column>
            <el-table-column prop="enable" min-width="120" label="启用/禁用" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.enable" @change="_onChangeIsEnable(scope.row)" :active-value="1"
                      :inactive-value="0" active-color="#56DD9CFF" inactive-color="#C8C8C8FF">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                    <span class="box-column-right" @click="_onClickEditBrand(scope.row)">编辑</span>
                    <span v-if="scope.row.is_default" style="color:#C8C8C8FF">当前默认品牌</span>
                    <span v-else-if='scope.row.enable === 0' style="color:#C8C8C8FF">设为默认品牌</span>
                    <span v-else style="cursor: pointer;color:#64BCFFFF" @click="_onClickDefault(scope)">设为默认品牌</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- <div class="import-pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
       </div> -->
       <el-dialog :title="!isUpdateBrand?'新增品牌':'修改品牌'" :visible.sync="isAddBrand" width="761px" @close="_onCloseDialog">
               <div class="brand-dialog-from">
                    <div class="from-lable">
                        <div class="lable-item-box">
                            <span>品</span>
                            <span>牌</span>
                            <span>名</span>
                            <span>称</span>
                        </div>
                    </div>
                    <el-input v-model="addBrandFrom.name" style="width:380px"></el-input>
               </div>
               <div class="brand-dialog-from">
                   <el-upload
                        ref="upload"
                        action=""
                        :multiple="false"
                        list-type="picture"
                        :before-upload="_beforeUpload"
                        :auto-upload="false"
                        :on-change="_onChangeUpload"
                        >
                            <span >品牌LOGO</span>
                                <el-button class="form-upload-btn" style="" type="primary">点击上传</el-button>
                                <div slot="tip" class="form-upload-tips">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
               </div>
               <span slot="footer" class="brand-dialog-footer">
                    <el-button class="btn-close"  @click="isAddBrand = false">取 消</el-button>
                    <el-button class="btn-confirm" type="primary" @click="_onConfirmAddBrand">确 定</el-button>
                </span>
       </el-dialog>
        <el-dialog width="740px" title="图片剪裁" :visible.sync="dialogVisible" append-to-body @close="_onCloseCropperDialog">
          <div class="cropper-content">
            <div id='cropper' class="cropper" style="text-align:center">
              <VueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
                @realTime="realTime"
              >
              </VueCropper>
            </div>
          </div>
          <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}">
              <div :style="previews.div">
                <img :src="option.img" :style="previews.img">
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class='btn-close' @click="dialogVisible = false">取 消</el-button>
              <el-button class="btn-confirm" type="primary" @click="picUpload(option.file)">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { numberRandom, clone } from '@/utils/index'
import axios from 'axios'
import VueCropper from './vue-cropper'
export default {
  name: 'brand',
  components: {
    VueCropper
  },
  data () {
    return {
      select_brand: '',
      brandData: [],
      page: {
        pageSize: 10, // 当前显示页数
        total: 10, // 总数
        currentPage: 1 // 当前页数
      },
      isAddBrand: false, // 是否新增
      addBrandFrom: {
        name: '',
        logo: '',
        id: ''
      },
      isUpdateBrand: false, // 是否修改品牌名
      dialogVisible: false,
      option: {
        img: '', // 裁剪图片的地址
        file: '', // 文件信息
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        // scalable: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [5, 2], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      previews: '',
      isConfirm: false // 预览是否确认关闭
    }
  },
  methods: {
    _onCloseCropperDialog () {
      if (!this.isConfirm) {
        this.$refs.upload.clearFiles()
      }
    },
    realTime (data) {
      this.previews = data
    },
    _onChangeUpload (file, fileList) {
      if (fileList.length === 2) {
        this.$refs.upload.$data.uploadFiles.shift()
      }
      let msg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (msg !== 'jpg' && msg !== 'png' && msg !== 'jpeg') {
        this.addBrandFrom.logo = ''
        this.$refs.upload.$data.uploadFiles = []
        this.$notify({
          title: '提示',
          message: 'LOGO只能是jpg/png格式',
          type: 'warning',
          duration: 5000
        })
        return false
      } else if (file.size > 500 * 1024) {
        this.addBrandFrom.logo = ''
        this.$refs.upload.$data.uploadFiles = []
        this.$notify({
          title: '提示',
          message: '文件大小不合适',
          type: 'warning',
          duration: 5000
        })
        return false
      }
      this.$nextTick(() => {
        this.option.img = file.url
        this.dialogVisible = true
        this.isConfirm = false
        this.option.file = file
      })
    },
    picUpload (file) {
      this.$refs.cropper.getCropBlob((data) => {
        this.$api.scheme.getSchemeOss().then(res => {
          if (res.code === 0) {
            let filename = `${Date.now()}_${numberRandom(10000, 99999)}.${file.raw.name.split('.')[file.raw.name.split('.').length - 1]}`
            let keyValue = 'saas' + (res.data.dir ? `/${res.data.dir}` : '') + '/' + filename
            let ossData = new FormData()
            ossData.append('name', filename)
            ossData.append('key', keyValue)
            ossData.append('policy', res.data.policy)
            ossData.append('OSSAccessKeyId', res.data.accessid)
            ossData.append('success_action_status', 201)
            ossData.append('signature', res.data.signature)
            ossData.append('file', data, filename)
            axios.post(res.data.host, ossData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: false
            }).then(result => {
              this.addBrandFrom.logo = res.data.host + '/' + keyValue
              this.isConfirm = true
              this.dialogVisible = false
            })
          } else {
            this.$refs.upload.$data.uploadFiles = []
          }
        })
      })
    },
    _onChangeIsEnable (row) { // 启用/禁用事件
      if (!row.enable) {
        if (row.is_default === 1) {
          this.$notify({
            title: '提示',
            message: '默认品牌不能禁用',
            type: 'warning',
            duration: 5000
          })
          row.enable = 1
          return null
        }
        if (this.$store.state.brand.brandCount === 1) {
          this.$notify({
            title: '提示',
            message: '最少保留一个启用品牌',
            type: 'warning',
            duration: 5000
          })
          row.enable = 1
          return null
        }
        this.$api.brand.disableBrand({ brand_id: row.id }).then((res) => {
          if (res.code === 0) {
            this.$notify({
              type: 'success',
              message: '禁用成功',
              title: '成功'
            })
            this.getBrand()
            this.updateStoreState(row)
          } else {
            row.enable = 0
            return null
          }
        })
      } else {
        this.$api.brand.enableBrand({ brand_id: row.id }).then((res) => {
          if (res.code === 0) {
            this.$notify({
              type: 'success',
              message: '启用成功',
              title: '成功'
            })
            this.getBrand()
            this.updateStoreState(row)
          } else {
            row.enable = 0
          }
        })
      }
    },
    _onClickDefault (scope) {
      this.$api.brand.defaultBrand({ brand_id: scope.row.id }).then((res) => {
        if (res.code === 0) {
          this.$notify({
            type: 'success',
            message: '默认设置成功',
            title: '成功'
          })
          this.getBrand()
        }
      })
    },
    _onClickEditBrand (row) {
      this.isAddBrand = true
      this.isUpdateBrand = true
      this.addBrandFrom.name = row.name
      this.addBrandFrom.id = row.id
      this.addBrandFrom.logo = row.logo
    },
    _onCloseDialog () {
      this.addBrandFrom.name = ''
      this.addBrandFrom.logo = ''
      this.addBrandFrom.id = '',
      this.isUpdateBrand = false
      this.$refs.upload.$data.uploadFiles = []
    },
    _beforeUpload (file) {
    },
    _onConfirmAddBrand () { // 创建品牌保存事件
      if (!this.addBrandFrom.name) {
        this.$notify({
          title: '错误',
          message: '品牌名不能为空',
          type: 'warning',
          duration: 5000
        })
        return null
      }
      if (this.isUpdateBrand) {
        let data = {
          _method: 'PUT',
          name: this.addBrandFrom.name,
          logo: this.addBrandFrom.logo,
          id: this.addBrandFrom.id
        }
        this.$api.brand.updateBrand(data).then((res) => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: '品牌修改成功',
              type: 'success',
              duration: 5000
            })
            this.getBrand()
          }
        })
      } else {
        let data = {
          name: this.addBrandFrom.name, // 品牌名字
          logo: this.addBrandFrom.logo
        }
        this.$api.brand.createBrand(data).then((res) => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: '品牌创建成功',
              type: 'success',
              duration: 5000
            })
            this.getBrand()
            this.updateStoreState()
          }
        })
      }
      this.isAddBrand = false
      this.addBrandFrom.name = ''
      this.addBrandFrom.id = ''
      this.isUpdateBrand = false
      this.addBrandFrom.logo = ''
    },
    _onClickAddBrand () { // 创建品牌Dialog显示
      this.isAddBrand = true
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'row-table-color-class'
      }
    },
    queryBrand () {
      this.getBrand(this.select_brand)
    },
    getBrand (name) { // 获取品牌列表
      let data = {
        is_paginate: 0, // 是否分页
        name: name
      }
      if (name === undefined) {
        this.select_brand = ''
      }
      this.$api.brand.getBrandList(data).then((res) => {
        if (res.code === 0) {
          this.brandData = []
          res.data.forEach((item, key) => {
            if (item.enable === 1) {
              this.brandData.push(item)
            }
          })
          res.data.forEach((item, key) => {
            if (item.enable === 0) {
              this.brandData.push(item)
            }
          })
        }
      })
    },
    handleSizeChange (page) {
      this.page.pageSize = page
      this.getBrand()
    },
    handleCurrentChange (page) {
      this.page.currentPage = page
      this.getBrand()
    },
    updateStoreState (row) {
      let brandData = []; let selectBrand = {}; let brandCount; let index
      if (!row.enable) { // 禁用品牌
        if (row.id === this.$store.state.brand.selectBrand.id) { // 禁用品牌与选中品牌相同时，选中品牌默认选中下一个启用品牌
          this.brandData.forEach((item, key) => {
            if (item.id === row.id) {
              index = key
            }
          })
          for (let i = index + 1; i < this.brandData.length; i++) {
            if (this.brandData[i].enable === 1) {
              selectBrand = this.brandData[i]
            }
          }
          if (selectBrand.id === undefined) {
            for (let i = 0; i < index; i++) {
              if (this.brandData[i].enable === 1) {
                selectBrand = this.brandData[i]
              }
            }
          }
        } else {
          selectBrand = this.$store.state.brand.selectBrand
        }
      } else {
        selectBrand = this.$store.state.brand.selectBrand
      }
      brandData = this.brandData.filter((item) => {
        if (item.enable === 1) {
          return item
        }
      })
      let brand = {
        brandData: brandData,
        brandCount: brandData.length,
        selectBrand: selectBrand
      }
      this.$store.commit('brand/brandDataFunc', brand)
    }
  },
  created () {
    this.getBrand()
  }
}
</script>
<style scoped lang = "scss">
#mainbox{
    color: red;
    font-size: 24px;
    font-weight: 500;
    margin: auto;
}
 .brand-header{
            margin:16px 0 0 40px;
            /deep/ .el-input__inner{
                height:32px;
            }
            .btn-query{
                width:86px;
                height:32px;

            }
            .btn-add{
                width:114px;
                height:32px;
            }
        }
        .brand-box{
            flex:1;
            .box-column-right{
                color: #64BCFFFF;
                margin-right:10px;
                cursor: pointer;
            }
        }
        .import-pagination{
            height:53px;
            display:flex;
            justify-content:flex-end;
            align-items:center;
            margin-right:17px;
        }
        .brand-dialog-from{
            position: relative;
            width:460px;
            left:50%;
            margin-left:-230px;
            margin-bottom:10px;
            .from-lable{
                margin-right:10px;
                text-align:justify;
                display:inline-block;
                width:70px;
                height:100%;
                .lable-item-box{
                    display:flex;
                    height:100%;
                    justify-content:space-around
                }
            }
            .el-input__inner{
                height:32px;
            }
            .form-upload-btn{
                margin-left:10px;
                height:32px;
                position:relative;
                left:0px;
                width:90px;
            }
            .form-upload-tips{
                margin-left:80px;
                margin-top:10px;
                font-size:14px;
                font-weight:400;
                color:rgba(200,200,200,1);
            }
            .el-upload-list{
                width: 380px;
                position: relative;
                left: 78px;
            }
        }
        .brand-dialog-footer{
            .btn-close{
                width:90px;
                height:32px;
                background:rgba(255,255,255,1);
            }
            .btn-confirm{
                width:90px;
                height:32px;
            }
        }
         .el-button{
        background:rgba(100,188,255,1);
        border-radius:6px;
        border-color: rgba(100,188,255,1);
    }
    .cropper-content {
      display:inline-block;

      .cropper {
        touch-action: none;
          width:350px;
          height: 300px;
      }
      .dialog-footer{
        text-align:center;
        margin-top:10px;
      }
    }
    .show-preview{
      display:inline-block;
      position:absolute;
      top:50%;
      transform:translate(0,-50%);
      margin:0 10px;
      border:1px solid rgba(200,200,200,1);
    }
    .el-button{
        background:rgba(100,188,255,1);
        border-radius:6px;
        border-color: rgba(100,188,255,1);
      }
      .btn-confirm{
        width:90px;
        height:32px;
      }
      .btn-close{
        width:90px;
        height:32px;
        background:rgba(255,255,255,1);
      }
</style>
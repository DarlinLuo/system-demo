<template>
  <div id="goods-discountlimit-box">
    <el-form :inline="true" :model="form" size="small" style="margin-left: 40px;">
      <el-form-item label="时间">
        <el-date-picker
          v-model="form.create_start_time"
          type="date"
          clearable
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>-
        <el-date-picker
          v-model="form.create_end_time"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="form.brand_id" filterable clearable placeholder="选择品牌">
          <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in status"
            :key="item.status"
            :label="item.label"
            :value="item.status"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="lightBlue" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="lightBlue" @click="insert">导入价格上下限</el-button>
      </el-form-item>
    </el-form>
    <div>
      <ul class="list-data">
        <li style="background:rgba(225,241,253,1);">
          <span>ID</span>
          <span>品牌</span>
          <span style=" disply:inline-block;width:300px">名称</span>
          <span style=" disply:inline-block;width:200px">导入时间</span>
          <span>导入状态</span>
          <span>失败信息</span>
          <span>操作</span>
        </li>
        <li
          v-for="(item,index) in tableData"
          :key="item.id"
          :class="{list_item_on:index%2==0,list_item_off:index%2!=0}"
        >
          <span>{{item.id}}</span>
          <span>{{item.brand_name}}</span>
          <span style=" disply:inline-block;width:300px">{{item.name}}</span>
          <span style=" disply:inline-block;width:200px">{{item.created_at}}</span>
          <span>
            <span v-if="item.status == '3'" style="color:rgba(143,195,31,1);">导入成功</span>
            <span v-if="item.status == '2' || item.status == '1'" style="color:gray">导入中</span>
            <span v-if="item.status == '4'" style="color:rgba(250,70,89,1);">导入失败</span>
          </span>
          <span>
            <button v-if="item.status == '4'" class="hint" title="这是提示">提示</button>
          </span>
          <span>
            <button v-if="item.status == '4'" class="remove-btn" @click="handleDelete(item.id)">删除</button>
          </span>
        </li>
      </ul>
    </div>
    <br />
    <el-row>
      <el-col :span="13" :offset="11">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
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
        <p>导入折扣上下限</p>
      </div>
      <el-form ref="newform" :model="newform" class="s">
        <el-form-item label="品牌" prop="groupName" style="margin-left:-40px">
          <el-select
            v-model="newform.groupName"
            placeholder
            style="width: 66%"
            @change="newSelectGroup($event)"
          >
            <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="expName" label="名称" style="margin-left:-40px">
          <el-input v-model="newform.expName" placeholder style="width: 66%"></el-input>
        </el-form-item>
        <el-form-item label prop="expvmFiles">
          <el-upload
            :on-change="changes"
            class="upload-demo"
            drag
            ref="uploadfile"
            :http-request="_httpRequest"
            :action="upload_url"
            :auto-upload="false"
            :before-upload="newFiles"
            :multiple="false"
            :limit = 1
            :on-exceed="handleExceed"
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
          <el-button @click="qxdr" style="margin-left:60px">取消</el-button>
          <el-button
            type="lightBlue"
            @click="newSubmitForm()"
            class="yes-btn"
            style="margin-left:80px"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created () {
    // 获取品牌列表
    this.$api.goods.getBrandList().then((res) => {
      if (res.data.data.length !== 0) {
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
      status: [
        {
          status: '3',
          label: '导入成功'
        },
        {
          status: '4',
          label: '导入失败'
        },
        {
          status: '1',
          label: '导入中'
        }
      ],
      tableData: [
        {
          id: 12,
          brand_name: '安踏',
          name: '导入价格上下限工作表.xlsx',
          created_at: '2020-03-05 10:31:15',
          status: '4'
        }, {
          id: 4,
          brand_name: 'cxk',
          name: '导入价格上下限工作表.xlsx',
          created_at: '2020-03-05 10:31:15',
          status: '2'
        }
      ],
      form: { // 查询信息搜集
        page: 1,
        pageSize: 10,
        brand_id: '',
        create_start_time: '',
        create_end_time: '',
        status: ''
      },
      totalItems: 2,
      brand: [{
        id: 12,
        name: '安踏'
      }, {
        id: 4,
        name: 'cxk'
      }],
      addNewDialog: false,
      upload_url: 'aaa', // 随便填一个，但一定要有
      newform: { // 导入折扣上下线信息
        expName: '',
        groupName: ''
      },
      stylecolor: {
        color: 'red'
      },
      brandId: '', // 选择上传文件的品牌id
      fileList: {}// 选择文件序列
    }
  },
  methods: {
    // 文件名自动赋值
    changes (file, fileList) {
      this.newform.expName = file.name
    },
    // 查询
    onSearch () {
      this.$api.importManage.getImportLog({
        type: 'goods_discount_restriction',
        status: this.form.status,
        brand_id: this.form.brand_id,
        start_at: this.form.create_start_time,
        end_at: this.form.create_end_time
      }).then(res => {
        if (res.data.data.length !== 0) {
          this.tableData.length = 0
          res.data.data.forEach(item => {
            this.tableData.push({
              id: item.id,
              brand_name: item.brand.name,
              name: item.request_params.filename,
              created_at: item.created_at,
              status: item.status
            })
          })
          this.$notify({
            title: '查询结果',
            message: `共查找到${res.data.data.length}条结果`,
            type: 'success'
          })
        } else {
          this.$notify.info({
            title: '提示',
            message: '没有查找到符合要求的日志'
          })
        }
      })
    },
    // 获取导入日志列表
    getList () {
      this.$api.importManage.getImportLog({
        type: 'goods_discount_restriction',
        page: this.form.page,
        per_page: this.form.pageSize
      }).then(res => {
        if (res.data.data.length !== 0) {
          this.tableData.length = 0
          res.data.data.forEach(item => {
            this.tableData.push({
              id: item.id,
              brand_name: item.brand.name,
              name: item.request_params.filename,
              created_at: item.created_at,
              status: item.status
            })
          })
        }
        this.totalItems = res.data.total
      })
    },
    handleSizeChange (size) {
      this.form.pageSize = size
      this.getList()
    },
    handleCurrentChange (page) {
      this.form.page = page
      this.getList()
    },
    // 获取选中导入的品牌id
    newSelectGroup (ev) {
      this.brandId = ev
    },
    // 删除导入一条数据
    handleDelete (e) {
      this.$confirm('此操作将会删除该条日志', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.importManage.DeleteLog({
          _method: 'DELETE',
          id: e
        }).then(res => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify.info({
          title: '提示',
          message: '已取消删除'
        })
      })
    },
    // 导入数据
    insert () {
      this.addNewDialog = true
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
    // 自定义上传事件
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
      formData.append('type', 'goods_discount_restriction')
      this.$api.importManage.createImportLog(formData).then((res) => {
        this.$notify({
          type: 'success',
          title: '成功',
          message: '文件上传成功'
        })
        this.getList()
        this.$refs.uploadfile.clearFiles()// 清空上传的文件列表
        this.newform.expName = ''// 清空品牌名称
        this.newform.groupName = ''// 清空上传文件名称
      })
    },
    // 确认上传事件
    newSubmitForm () {
      this.$refs.uploadfile.submit() // 假提交
    },
    // 文件上传前的钩子函数
    newFiles (file) {
      this.fileList = {}
      this.fileList = file
    },
    qxdr () {
      this.addNewDialog = false
      this.$refs.uploadfile.clearFiles()// 清空上传的文件列表
      this.newform.expName = ''// 清空品牌名称
      this.newform.groupName = ''// 清空上传文件名称
    },
    downloadTemplate () {
      // 下载模板
      window.open('/api/api/aggregation/import/template/?type=goods_discount_restriction')
    }
  }
}
</script>
<style lang="scss" scope>
#goods-discountlimit-box {
  padding-top: 20px;
  width: 100%;
  height: 93%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  .el-row {
    position: absolute;
    right: 220px;
    bottom: 10px;
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
    width: 150px;
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
  .list-data {
    margin-left: -40px;
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
  .el-upload__text {
    margin-top: 40px;
  }
  .hint {
    border: none;
    outline: none;
    width: 56px;
    height: 26px;
    color: rgba(255, 103, 128, 1);
    background: rgba(255, 234, 234, 1);
    border-radius: 6px 6px 6px 6px;
    font-size: 14px;
    cursor: pointer;
  }
  .remove-btn {
    border: none;
    outline: none;
    width: 56px;
    height: 26px;
    background: none;
    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 6px 6px 6px 6px;
    color: rgba(200, 200, 200, 1);
    cursor: pointer;
  }
  .el-dialog .el-dialog__header .el-dialog__title {
    display: none;
  }
}
</style>

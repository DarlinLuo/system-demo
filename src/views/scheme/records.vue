/**
* @name: 策划页面记录列表页
* @description: 策划页面的记录列表。 记录是多个策划页面的集合，分为 pc 端跟手机端，每种设备下又有主页跟多个二级页
*/
<template>
<div>
  <p>这是策划列表页面</p>
   <div class="records">

    <div class="recordsBtnBox" v-if="$Power.checkPower('add_record_button')">
      <el-button class="recordsBtn" @click="addSchemeTitle = '新增记录_' + $dateFormat(new Date(), 'yyyymmddHHMMss'), addTitleVisible = true" size="medium" :type="$environment.pageType === 1 ? 'lightBlue' : $environment.pageType === 2 ? 'primaryBlue' : 'lightBlue'">新增</el-button>
    </div>
    <el-table height="560px;" ref="table" :data="dataList" style="width:100%;" :header-cell-style="{'backgroundColor':'rgba(225,241,253,1)','font-weight':400,'color':'rgba(50,50,50,1)','height':'56px'}" :row-style="{'height':'48px','font-size':'14px'}" :cell-style="{padding:'0px'}" :row-class-name="tableRowClassName">
      <el-table-column width="50px" align="center" prop="id" label="ID"></el-table-column>
      <el-table-column min-width="200px" align="center" label="记录名称">
        <template slot-scope="scope">
          <span class="gestureOperable" @click="_onOpenSchemeName(scope.row.id,scope.row.name,scope.$index)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" prop="statusName" label="记录生成状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="info">等待中</el-tag>
          <el-tag type="success" v-if="scope.row.status==1" class="waiting">未生成</el-tag>
          <el-tag type="primary" v-if="scope.row.status==2" class="success">创建中</el-tag>
          <el-tag type="success" v-if="scope.row.status==3" class="waiting">已完成</el-tag>
          <el-tag type="danger" v-if="scope.row.status==4" class="error">创建失败</el-tag>
          <el-tag type="danger" v-if="scope.row.status==5" class="error">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" prop="created_at" label="创建时间"></el-table-column>
      <el-table-column width="200px" align="center" prop="updated_at" label="最后修改时间"></el-table-column>
      <el-table-column width="200px" align="center" prop="goods_used_at" label="最新使用商品数据时间"></el-table-column>
      <el-table-column label="操作" align="center" width="600px">
        <template slot-scope="scope">
          <div class="operationBox">
            <template v-for="(item,key) in scope.row.operating">
              <div @click="_onOperation(item,scope.row.id,scope.$index,scope.row.name,scope.row.operating)" :class="item.status===1 ?'gestureOperable tableOperation':'tableOperation btnNoEnable'" :key="key" v-if="$Power.checkPowerForEnums(item.name) && item.slug && item.name">
                <i :class="`iconfont ${iconList[item.slug]}`"></i>
                <span>{{item.name}}</span>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="修改页面" :visible.sync="editTitleVisible" width="761px">
      <el-form label-width="100px">
        <el-form-item label="页面标题">
          <el-input v-model="selectedRow.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button class="dialogBtn" @click="editTitleVisible = false">取 消</el-button>
        <el-button :disabled="!selectedRow.name.trim()" class="dialogBtn" type="lightBlue" @click="_onUpdateSchemeName">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传文件" :visible.sync="uploadVisible" :before-close="uploadBeforeClose" width="400px">
      <el-upload class="upload-demo" ref="upload" action :data="uploadFile" :file-list="fileList" :before-upload="handleBeforeUpload" drag multiple :auto-upload="false" :http-request="importExcel" :limit="1">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip upload-tip" slot="tip"><div>数据表导入，每次只能传一个Excel文件</div><div class="down-load-template" @click="downLoadTemplate">模板下载</div></div>
      </el-upload>
      <el-button style="margin-top: 10px;" size="small" type="success" @click="_onConfirmOfImportExcelModal">上传到服务器</el-button>
    </el-dialog>
    <el-dialog title="新增记录" :visible.sync="addTitleVisible" width="761px">
      <el-form label-width="100px">
        <el-form-item label="记录名称">
          <el-input v-model="addSchemeTitle"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button class="dialogBtn" @click="addTitleVisible = false">取 消</el-button>
        <el-button :disabled="!addSchemeTitle.trim()" class="dialogBtn" type="lightBlue" @click="_onAddSchemeName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
// import axios from 'axios'
import { clone } from '@/utils/index'
// import template3 from './json/template3'
export default {
  data () {
    return {
      userType: 0, // 0:策划人员 1：设计人员
      dataList: [],
      currentPage: 1,
      total: 0,
      pageSize: 15,
      editTitleVisible: false, // 控制编辑框是否显示
      uploadVisible: false,
      addTitleVisible: false,
      selectedRow: { id: null, name: '', index: null }, // 编辑时需要传入的数据
      fileList: [],
      uploadFile: {},
      upload: {},
      addSchemeTitle: '',
      iconList: {
        pc: 'iconmaintain_pc',
        mobile: 'iconmaintain_cellphone',
        'import-goods': 'iconmaintain_leadingin',
        'export-goods': 'iconmaintain_leadingout',
        sync: 'iconmaintain_synchronization',
        copy: 'iconmaintain_copy',
        archive: 'iconmaintain_file'
      }
    }
  },
  created () {
    this.getSchemeList()
  },
  methods: {

    getSchemeList () {
      this.$api.scheme.getAggregationScheme({
        page: this.currentPage,
        per_page: this.pageSize
      }).then(res => {
        this.dataList = res.data.data
        this.total = res.data.total
      })
    },
    uploadBeforeClose () {
      this.fileList = []
      this.uploadVisible = false
    },
    _onAddSchemeName () {
      this.$api.scheme.addScheme({
        name: this.addSchemeTitle,
        platform: this.$environment.pageType === 2 ? 1 : 2,
        data: template3(this.$environment.pageType)
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 5000
        })
        this.getSchemeList()
        this.addTitleVisible = false
      })
    },
    handleSizeChange (val) {
      // 重新选择分页数目
      this.pageSize = val
      this.getSchemeList()
    },
    handleCurrentChange (val) {
      // 跳转分页数
      this.currentPage = val
      this.getSchemeList()
    },
    _onOpenSchemeName (id, name, index) {
      // 打开编辑标题
      this.editTitleVisible = true
      this.selectedRow = { id: id, name: name, index: index }
    },
    _onUpdateSchemeName () {
      // 提交保存
      this.$api.scheme.getAggregationSchemeArchive({
        id: this.selectedRow.id,
        name: this.selectedRow.name
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 5000
        })
        this.editTitleVisible = false
        this.getSchemeList()
      })
    },
    pc (id, type, recordName) {
      // PC跳转
      this.$router.push({
        path: `/scheme/page`,
        query: {
          record: id,
          device: 1,
          type: type,
          name: recordName
        }
      })
    },
    mobile (id, type, recordName) {
      // 移动端跳转
      this.$router.push({
        path: `/scheme/page`,
        query: {
          record: id,
          device: 2,
          type: type,
          name: recordName
        }
      })
    },
    exportExcel (id) {
      // TODO 待测试 下载Scheme
      window.open('aggregation/scheme/' + id + '/export')
    },
    copyScheme (id, index) {
      this.$api.scheme.copyScheme({ id: id }).then(res => {
        this.$notify({
          title: '成功',
          message: '复制成功',
          type: 'success',
          duration: 5000
        })
        this.getSchemeList()
      })
      // this.dataList.pop();
      // this.dataList.unshift(this.$refs.table.data[index])
    },
    ShowUpload (id, recordName) {
      // 显示上传
      this.uploadVisible = true
      this.upload = {
        id: id,
        name: recordName
      }
    },
    _onConfirmOfImportExcelModal () {
      this.$nextTick(() => {
        this.$refs.upload.submit() // 假提交
      })
    },
    _onOperation (item, id, index, recordName, operating) {
      // 操作控制
      let operationList = ['PC端', '移动端', '导入商品价格', '导出', '同步', '复制', '归档', '已归档']
      let isArchive = operating.find(x => { return x.slug === 'archive' })
      switch (item.name) {
        case operationList[0]:
          if (isArchive && isArchive.status === 0) {
            this.pc(id, 2, recordName)
            break
          }
          if (this.$Power.checkPowerForEnums(item.name, true)) {
            this.pc(id, 1, recordName)
          } else {
            this.pc(id, 0, recordName)
          }
          break
        case operationList[1]:
          if (isArchive && isArchive.status === 0) {
            this.mobile(id, 2, recordName)
            break
          }
          if (this.$Power.checkPowerForEnums(item.name, true)) {
            this.mobile(id, 1, recordName)
          } else {
            this.mobile(id, 0, recordName)
          }
          break
        case operationList[2]:
          this.ShowUpload(id, recordName)
          break
        case operationList[3]:
          this.exportExcel(id)
          break
        case operationList[5]:
          this.copyScheme(id, index)
          break
        case operationList[6]:
          this.$confirm('此进行归档操作后，页面数据将不得编辑修改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.scheme.getAggregationSchemeArchive({
              id,
              is_archive: 1
            }).then(res => {
              let list = clone(this.dataList)
              for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                  list[i] = res.data
                  break
                }
              }
              this.dataList = list
              this.$message({
                type: 'success',
                message: '归档成功'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消归档'
            })
          })
          break
        case operationList[7]:
          this.mobile(id, 2, recordName)
          break
        default:
          break
      }
    },
    handleBeforeUpload (file) {
      // 上传前
      let msg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (msg !== 'xls' && msg !== 'xlsx') {
        this.$notify({
          title: '错误',
          message: '文件类型错误',
          type: 'warning',
          duration: 5000
        })
        return null
      }
      this.uploadFile = {
        id: this.upload.id,
        file: file,
        name: this.upload.name
      }
      // this.importExcel();
    },
    importExcel () {
      // 上传
      let formData = new window.FormData()
      formData.append('file', this.uploadFile.file)
      formData.append('id', this.uploadFile.id)
      formData.append('name', this.uploadFile.name)
      this.$api.scheme.uploadScheme(formData, { isGetFormDataId: true }).then(res => {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 5000
        })
        this.getSchemeList()
        this.uploadVisible = false
      })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'row-table-color-class'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.records {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  margin-left: 5px;
  margin-right: 21px;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  .recordsBtnBox {
    height: 81px;
    line-height: 81px;
    padding-left: 13px;
    .recordsBtn {
      width: 86px;
      height: 32px;
      padding: 0;
      span {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
      }
    }
  }
  .gestureOperable {
    cursor: pointer;
    > span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
    }
  }
  .operationBox {
    display: flex;
    justify-content: space-around;
    .tableOperation {
      display: inline-block;
      padding-left: 0;
      padding-right: 10px;
      color: #64bcff;
      > span {
        word-break: normal;
      }
    }
    .btnNoEnable {
      pointer-events: none;
      opacity: 0.5;
    }
    .iconfont {
      margin-right: 5px;
    }
  }
  .upload {
    text-align: center;
    .uploadDrag {
      width: 300px;
      height: 80px;
      margin: auto;
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .el-icon-upload {
        font-size: 40px;
        margin-bottom: 10px;
      }
    }
  }
  .block {
    .el-pagination {
      margin: 10px auto;
      display: flex;
      justify-content: flex-end;
    }
  }
  .dialogBtn {
    width: 90px;
    height: 32px;
    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 6px;
    text-align: center;
    padding: 0;
    span {
      line-height: 32px;
      height: 32px;
      display: inline-block;
      font-size: 14px;
    }
  }
}
.upload-tip {
  display: flex;
  justify-content: space-between;
  .down-load-template {
    cursor: pointer;
    transition: all .5s;
    &:hover {
      color: #3C92FF;
    }
  }
}
</style>

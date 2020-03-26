<template>
    <div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            prop="date"
            label="入驻日期"
            width="180">
            </el-table-column>
            <el-table-column
            prop="name"
            label="店名"
            width="180">
            </el-table-column>
            <el-table-column
            prop="address"
            label="地址"
            width="240">
            </el-table-column>
            <el-table-column
            label="操作">
            </el-table-column>
         </el-table>
        <el-row class="pagesize">
            <el-col :span="13" :offset="11" >
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
    </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '安踏',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '贵人鸟',
        address: '北京市朝阳区鑫海路 157 号'
      }, {
        date: '2016-05-01',
        name: 'Nike',
        address: '广州市天河区天河广场三楼405号店铺'
      }, {
        date: '2016-05-03',
        name: '李宁',
        address: '青岛市万海区北京路1682号'
      }],
      form: {
        page: 1,
        pageSize: 10,
        create_start_time: '',
        create_end_time: '',
        brand_id: '',
        status: ''
      },
      totalItems: 4
    }
  },
  methods: {
    handleSizeChange (size) {
      this.form.pageSize = size
    },
    handleCurrentChange (page) {
      this.form.page = page
    }
  }
}
</script>
<style lang="scss" scoped>
.pagesize{
    position: absolute;
    bottom: 50px;
    right: 300px;
}
</style>

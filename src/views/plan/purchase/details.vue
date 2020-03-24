<template>
    <div id="details">
        <div class="detail-header">
            目标年份:<span class="header-con">{{this.$route.params.year}}年</span>
            目标金额:<span class="header-con">{{this.$route.params.target_saleroom/10000}}万元</span>
            <div class="header-btn">
                <el-button @click="_onClickGoOverall" size="small" style="width:120px;border:1px solid rgba(226,226,226,1);border-radius:6px;">返回</el-button>
            </div>
        </div>
        <el-divider class="detail-divider" style="margin-bottom:12px"></el-divider>
        <div class="detail-content">
            <div class="content-title">
                <span class="title-tips"></span>
                <span class="title">销售计划——买货详细规划</span>
            </div>
            <el-table height="560" class="content-table" border :header-cell-style='headerCellStyleFunc'>
                <el-table-column align="center" label="年份"></el-table-column>
                <el-table-column align="center" label="季节"></el-table-column>
                <el-table-column align="center" label="所以仓库库存合计">
                    <el-table-column align="center" label="库存数量"></el-table-column>
                    <el-table-column align="center" label="库存吊牌金额"></el-table-column>
                    <el-table-column align="center" label="均价"></el-table-column>
                    <el-table-column align="center" label="库存货值"></el-table-column>
                    <el-table-column align="center" label="库存货值比例"></el-table-column>
                    <el-table-column align="center" label="预计消化率"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="我方库存可支持销量">
                    <el-table-column align="center" label="预计折扣"></el-table-column>
                    <el-table-column align="center" label="预计销售数量"></el-table-column>
                    <el-table-column align="center" label="预计销售额"></el-table-column>
                    <el-table-column align="center" label="销售比例"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="2019年销售计划">
                     <el-table-column align="center" label="销量"></el-table-column>
                    <el-table-column align="center" label="吊牌额"></el-table-column>
                    <el-table-column align="center" label="回款均价(年度)"></el-table-column>
                    <el-table-column align="center" label="销售额"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="库存需求">
                    <el-table-column align="center" label="销售占比"></el-table-column>
                    <el-table-column align="center" label="消化率"></el-table-column>
                    <el-table-column align="center" label="库存量"></el-table-column>
                    <el-table-column align="center" label="库存吊牌额"></el-table-column>
                    <el-table-column align="center" label="库存货值"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="吊牌均价"></el-table-column>
                <el-table-column align="center" label="库存吊牌额缺"></el-table-column>
                <el-table-column align="center" label="总部仓库库存可配吊牌额"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    headerCellStyleFunc () {
      return { 'background-color': 'rgba(225,241,253,1)', 'height': '56px', 'font-size': '14px', 'color': '#323232FF', 'text-align': 'center' }
    },
    _onClickGoOverall () {
      this.$router.push({
        name: 'plan.purchase.overall',
        params: {
          type: this.$route.params.type,
          id: this.$route.params.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#details{
    width:100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height:95%;
    display:flex;
    flex-direction:column;
    .detail-header{
        font-size:14px;
        font-weight:400;
        color:rgba(150,150,150,1);
        position: relative;
        height:52px;
        line-height:52px;
        margin-left:22px;
        .header-con{
            font-size:18px;
            font-weight:bold;
            color:rgba(50,50,50,1);
            margin:0 40px 0 5px;
        }
        .header-btn{
            position: absolute;
            right:60px;
            top:0;
        }
    }
    .detail-content{
        flex:1;
        display:flex;
        flex-direction:column;
        .content-title{
            height:50px;
            line-height:50px;
            font-size:18px;
            font-weight:bold;
            color:rgba(50,50,50,1);
            position: relative;
            .title-tips{
                width:12px;
                height:50px;
                display:inline-block;
                background:rgba(100,188,255,1);
            }
            .title{
                height:50px;
                line-height:50px;
                position: absolute;
                margin-left:12px;
            }
        }
        .content-table{
            flex:1;
        }
    }
    .detail-divider{
        margin:0;
    }
}
</style>

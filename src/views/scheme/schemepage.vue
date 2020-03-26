<template>
    <div>
        <div class="mianstuats">
            <p>首页数据图表展示</p>
            <ve-bar :data="chartData" :settings="chartSettings"></ve-bar>
        </div>
        <div class="leida">
          <p style="text-align:center">数据雷达图展示</p>
          <ve-radar :data="chartDatas" :settings="chartSetting"></ve-radar>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      chartSettings: {
        stack: {
          'xxx': ['访问用户', '下单用户']
        }
      },
      chartData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      chartSetting: {
        dimension: ['日期'],
        metrics: ['访问用户', '下单用户', '下单率'],
        dataType: { '下单率': 'percent' }
      },
      chartDatas: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mianstuats{
    border-bottom: 1px solid #ccc;
}
.leida{
  width: 400px;
  height: 400px;
  margin-top: 100px;
}
</style>

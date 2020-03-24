<template>
  <div id="brandtarget" :style="schedule == 1?'padding-bottom:0;':'padding-bottom:20px;'">
    <el-steps :active="schedule" align-center>
      <el-step title="设置店铺目标" @click.native="storegoal"></el-step>
      <el-step title="设置月份目标"></el-step>
    </el-steps>
      <!-- 设置店铺目标 -->
      <storeTarget v-if="schedule == 0" @pre_next="nextones" />
      <!-- 设置月份目标 -->
      <monthTarget v-if="schedule == 1" @pre_step="prestep" ref="monthTarget"/>
  </div>
</template>
<script>
import storeTarget from './components/storeTarget.vue'
import monthTarget from './components/monthTarget.vue'
import brandMixins from '../../../mixins/brandMixins'
export default {
  components: {
    storeTarget,
    monthTarget
  },
  name: 'target-index',
  mixins: [brandMixins],
  data () {
    return {
      schedule: 0,
      monthtepy: '', // 月份设置类型
      storeid: '' // 目标店铺id
    }
  },
  methods: {
    // 步骤条下一步
    nextones (a) {
      this.schedule = a.num
      this.monthtepy = a.tepy
      this.storeid = a.storeid
    },
    // 步骤条上一步
    prestep (i) {
      this.schedule = i.num
    },
    storegoal () {
      if (this.schedule === 1) {
        this.$refs.monthTarget.goback()
      }
    }
  },
  created () {}
}
</script>
<style lang="less" scope>
#brandtarget {
  padding-top: 20px;
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  flex: 1;
  .el-steps {
    width: 900px;
    margin: 0 auto;
  }

  .is-process {
    color: rgba(47, 163, 253, 1);
    border-color: rgba(47, 163, 253, 1);
  }
  .is-success {
    color: rgba(142, 206, 255, 1);
    border-color: rgba(142, 206, 255, 1);
  }

  input.el-input__inner {
    padding: 0px 6px !important;
  }

  .el-form-item {
    margin: 0;
  }
  .overstepToDot {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 80%;
  }
  .radioStyle {
    color: #606266;
  }
  .el-form-item__error {
    display: none;
  }
}
</style>

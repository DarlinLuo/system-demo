<template>
  <div class="breadcrumb" v-if="show">
    <el-breadcrumb separator="/">
      <template v-for="(item, index) in breadcrumb">
        <el-breadcrumb-item :to="{ name: breadcrumb.href }" :key="index" v-if="item.href">{{item.name}}</el-breadcrumb-item>
        <el-breadcrumb-item :key="index" v-else>{{item.name}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  
  data () {
    return {
      breadcrumb: [],
      show: false
    }
  },
  created () {
    this.checkRoute(this.$route)
  },
  watch: {
    $route: {
      handler (val) {
        this.checkRoute(val)
      }
    }
  },
  methods: {
    checkRoute (route) {
      if (route.meta.breadcrumb && route.meta.breadcrumb.length) {
        this.breadcrumb = route.meta.breadcrumb
        this.show = true
        this.$emit('hasBreadcrumb', true)
      } else {
        this.show = false
        this.$emit('hasBreadcrumb', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-left: 5px;
  margin-right: 21px;
  margin-bottom: 8px;
  height: 30px;
  display: flex;
  width: 100%;
  padding-left: 20px;
  align-items: center;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10%;
    bottom: 10%;
    width: 4px;
    background: rgba(100, 188, 255, 1);
    border-radius: 2px;
  }
  /deep/ .el-breadcrumb__item {
    height: 100%;
    .el-breadcrumb__inner,
    .el-breadcrumb__separator {
      font-size: 16px;
      font-weight: 400;
      color: #606266;
      cursor: text;
    }
  }
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    font-weight: 700;
    text-decoration: none;
    color: #303133;
  }
}
</style>

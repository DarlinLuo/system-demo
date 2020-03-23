<template>
    <div id="leftnav">
        <el-col :span="24">
            <el-menu
                unique-opened = true
                default-active="2"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title" >
                    <i class="el-icon-location"></i>
                    <span>商品管理</span>
                    </template>
                    <el-menu-item index="1-1">商品信息</el-menu-item>
                    <el-menu-item index="1-2">价格保护</el-menu-item>
                    <el-menu-item index="1-3">折扣上下线</el-menu-item>
                    <el-menu-item index="1-4">定价列表</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>计划管理</span>
                    </template>
                    <el-menu-item index="2-1">计划列表</el-menu-item>
                    <el-menu-item index="2-2">目标设置</el-menu-item>
                    <el-menu-item index="2-3">买货规划</el-menu-item>
                    <el-menu-item index="2-4">追单管理</el-menu-item>
                </el-submenu>
                 <el-submenu index="3">
                    <template slot="title">
                    <i class="el-icon-document"></i>
                    <span>策划列表</span>
                    </template>
                    <el-menu-item index="3-1">首页</el-menu-item>
                    <el-menu-item index="3-2">商铺页面</el-menu-item>
                    <el-menu-item index="3-3">测试品牌</el-menu-item>
                    <el-menu-item index="3-4">策划页面</el-menu-item>
                </el-submenu>
                 <el-submenu index="4">
                    <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>系统设置</span>
                    </template>
                    <el-menu-item index="4-1">用户设置</el-menu-item>
                    <el-menu-item index="4-2">基础设置</el-menu-item>
                </el-submenu>
        </el-menu>
        </el-col>
    </div>
</template>
<script>
export default {
     methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>
<style lang="scss" scoped>
#leftnav{
    width: 190px;
    height: 89%;
    background: #545c64;
    overflow: hidden;
}
</style>
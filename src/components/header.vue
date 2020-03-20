<template>
    <div id="header">
        <div class="title-name">
            <p class="logo"></p>
            <!-- <img src="" alt="" class="logo"> -->
            <p>XXX后台管理系统</p>
        </div>
        <div class="right-user">
        <el-col :span="12">
            <div class="demo-basic--circle">
                <div class="block"><el-avatar :size="50" :src="circleUrl"></el-avatar></div>
            </div>
        </el-col>  
            <el-button @click="btntestapi">登录</el-button>
        </div>
    </div>
</template>
<script>
export default {
     data () {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      }
     }, 
    methods:{
        btntestapi(){
            this.$notify({
                title: '成功',
                message: '登录成功',
                type: 'success'
            });
            //接口调用示例
            // this.$api.goods.getBrandList().then(res=>{
            //     console.log(res)
            // })
        }
    }
}
</script>
<style lang="scss" scoped>
#header{
    height: 80px;
    width: 100%;
    background: lightskyblue;
    display: flex;
    justify-content: space-between;
    .title-name{
        width: 300px;
        height: 100%;
        margin-left: 20px;
        font-weight: 600;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .logo{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: chocolate;
        }
    }
    .right-user{
        width: 500px;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
}
</style>
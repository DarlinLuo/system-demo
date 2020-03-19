<template>
    <div id="header">
        <div class="title-name">
            <p class="logo"></p>
            <!-- <img src="" alt="" class="logo"> -->
            <p>XXX后台管理系统</p>
        </div>
        <div class="right-user">

        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
#header{
    height: 80px;
    width: 100%;
    background: lightskyblue;
    display: flex;
    justify-content: space-between;
    // align-items: center;
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
    }
}
</style>
<template>
    <div id="right-content">
        <breadcrumb></breadcrumb>
        <div class="content">
            <router-view ></router-view>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/breadcrumb'

export default {
  components: {
    breadcrumb
  }

}
</script>
<style scoped lang = "scss">
#right-content{
    width: 90%;
    height: 87%;
    margin-left: 15px;
    margin-top: 10px;
    .content{
    width: 100%;
    height: 96%;
    margin-top: 10px;
    /* box-shadow: 2px 2px 2px 2px lightgray; */
    }
}
</style>

<template>
    <div id="right-content">
        <breadcrumb @hasBreadcrumb="hasBreadcrumb"></breadcrumb>
        <div class="content">
            <router-view :style="{minHeight: `${maxHeight - (hasBreadcrumbBol ? 156 : 123)}px`}"></router-view>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/breadcrumb'

export default {
    components: {
        breadcrumb
    },
    data (){
        return{
             hasBreadcrumbBol: false,
        }
    },
    methods:{
        hasBreadcrumb (bol) {
            this.hasBreadcrumbBol = bol
        },
    },
    
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
    box-shadow: 2px 2px 2px 2px lightgray;
    }
}
</style>
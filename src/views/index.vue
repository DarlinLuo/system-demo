<template>
    <div id="index">
        <Header/>
        <div class="contents">
            <Leftnav/>
            <Rightcontent />
        </div>
    </div>
</template>
<script>
import Header from '@/components/header'
import Leftnav from '@/components/leftnav'
import Rightcontent from '@/components/rightcontent'


export default {
    components:{
        Header,
        Leftnav,
        Rightcontent
    },
}
</script>
<style lang="scss" scoped>
#index{
    height: 920px;
    width: 99%;
    .contents{
        height: 840px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
}
</style>
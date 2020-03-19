<template>
    <div id="index">
        <Header/>
        <Leftnav/>
    </div>
</template>
<script>
import Header from '@/components/header'
import Leftnav from '@/components/leftnav'


export default {
    components:{
        Header,
        Leftnav
    }
}
</script>
<style lang="scss" scoped>
#index{
    height: 920px;
    width: 100%;
}
</style>
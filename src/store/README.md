# store

## vuex
```
状态管理工具

状态
    state => 基本数据 
    mutations => 提交更改数据的方法，同步！ 
    actions => 像一个装饰器，包裹mutations，使之可以异步。 
    modules => 模块化Vuex

页面引入方法:
        index.js:
            main.js中import store from '@/store'
            new Vue({
                store
            })

页面使用方法:
        1、this.$store.state.***

        2、
            import { mapState, mapMutations, mapActions } from 'vuex'

            computed: {
                ...mapState(['***'，'***'])
            },
            methods: {
                ...mapMutations(['***'， '***']),
                ...mapActions(['***'， '***'])
            }

```

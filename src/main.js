import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import {server} from '@/plugins/axios/index'

//定义全局变量
Vue.prototype.$server=server;

Vue.config.productionTip = false

new Vue({
  router,
  // beforeCreate () {
  //   Vue.prototype.$admin = this
  // },
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/plugins/dll'

Vue.config.productionTip = false

new Vue({
  router,
  // beforeCreate () {
  //   Vue.prototype.$admin = this
  // },
  render: h => h(App),
}).$mount('#app')

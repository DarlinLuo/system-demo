import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import '@/plugins/dll'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  // beforeCreate () {
  //   Vue.prototype.$admin = this
  // },
  render: h => h(App)
}).$mount('#app')

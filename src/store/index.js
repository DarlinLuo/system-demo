import Vue from 'vue'
import Vuex from 'vuex'
import schemePage from './schemePage'
import brand from './brand'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    initUserState (state, data) {
      state.userInfo = data
    }
  },
  actions: {
  },
  modules: {
    schemePage,
    brand
  }
})

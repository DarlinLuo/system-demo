const brand = {
  namespaced: true,
  state: {
    brandData: [], // 所有启用品牌
    selectBrand: {}, // 选中的品牌
    brandCount: 0 // 启用品牌个数
  },
  mutations: {
    brandDataFunc (state, data) {
      state.brandData = data.brandData
      state.selectBrand = data.selectBrand
      state.brandCount = data.brandCount
    }
  }
}
export default brand

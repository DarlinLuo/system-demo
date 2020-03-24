export default {
  watch: {
    '$store.state.brand.selectBrand.name': function () {
      if (this.$route.name === 'add-order.seasonal') {
        this.getSeasonList()
      } else if (this.$route.name === 'add-order.anti.seasonal') {
        this.getSeasonList()
      } else if (this.$route.name === 'add-order.record') {
        this.getRecordData()
      } else if (this.$route.name === 'add-order.record-goods') {
        this.getRecordGoodData()
      } else {
        this.$router.push({
          path: '/plan/plan-list'
        })
      }
    }
  }
}

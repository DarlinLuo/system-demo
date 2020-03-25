<template>
  <div id="planlist">
    <el-row class="targetyear">
      <span class="explain">目标年份：</span>
      <el-select
        v-model="value"
        placeholder="请选择"
        style="width: 128px;"
        class="explainse"
      >
        <el-option
          v-for="(_year,index) in years"
          :key="index"
          :label="_year.year"
          :value="_year"
          style="margin-bottom:10px"
        ></el-option>
      </el-select>
      <el-button type="lightBlue" style="margin-left:20px" @click="search_targetyear">搜索</el-button>
      <el-button
        type="lightBlue"
        style="margin-left:40px"
        @click="show_setyear"
        v-text="setyear?'返回':'显示所有已设年份'"
      ></el-button>
    </el-row>
    <p class="remark">
      <span class="explain">注：请先进行</span>
      <span style="margin-left:20px">目标设置</span>
      <span class="explain" style="margin-left:20px">，再设置</span>
      <span style="margin-left:28px">买货规划</span>
    </p>
    <ul class="showyears" v-if="isshow_setyear === 0">
      <li
        v-for="(item,index) in planyears"
        :key="index"
        :style="(item == year)?'background: #d5f3ff;font-size:24px':''"
        :class="(item >= year)?'borderyea':''"
      >
        <p class="planyear">{{item}}</p>
        <div>
          <p v-if="(item < year)" @click="viewTarget(item)">查看目标设置</p>
          <p v-else-if="(item == year || item == year+1)" @click="editTarget(item)">编辑目标设置</p>
          <p v-else @click="targetSet(item)">目标设置</p>
        </div>
        <div>
          <p v-if="(item < year)" @click="viewPlanBuyGoods(item)">查看买货规划</p>
          <p v-else-if="item == year" @click="editPlanBuyGoods(item)">编辑买货规划</p>
          <p
            v-else
            :style="item > year + 1?'color:#C8C8C8':'color:#64BCFF'"
            @click="setPlanBuyGoods(item)"
          >买货规划</p>
        </div>
        <p
          :style="item > year + 1?'color:#C8C8C8':'color:#64BCFF'"
          @click="viewBuyGoodsDetails(item)"
        >查看买货详情</p>
      </li>
    </ul>
    <div v-if="isshow_setyear === 1" class="twolines">
      <ul class="showyears" v-for="(i,index) in setyears" :key="index">
        <li
          v-for="item in i"
          :key="item"
          :style="(item == year)?'background: #d5f3ff':''"
          :class="(item >= year)?'borderyea':''"
        >
          <p class="planyear">{{item}}</p>
          <p @click="viewTarget(item)">查看目标设置</p>
          <p>
            <span v-if="item <= year" @click="viewPlanBuyGoods(item)">查看买货规划</span>
          </p>
          <p>
            <span v-if="item <= year" @click="viewBuyGoodsDetails(item)">查看目标详情</span>
          </p>
        </li>
      </ul>
    </div>
    <ul class="showyears" v-if="isshow_searchyear">
      <li
        v-for="item in search_setyear"
        :key="item"
        :style="(item == year)?'background: #d5f3ff':''"
        :class="(item >= year)?'borderyea':''"
      >
        <div v-if="isshow_setyear === 2" class="isshowli">
          <p class="planyear">{{item}}</p>
          <div>
            <p v-if="(item < year)" @click="viewTarget(item)">查看目标设置</p>
            <p
              v-else-if="(item == year || item == year+1)"
              @click="editTarget(item)"
            >编辑目标设置</p>
            <p v-else @click="targetSet(item)">目标设置</p>
          </div>
          <div>
            <p v-if="(item < year)" @click="viewPlanBuyGoods(item)">查看买货规划</p>
            <p v-else-if="item == year" @click="editPlanBuyGoods(item)">编辑买货规划</p>
            <p
              v-else
              :style="item > year + 1?'color:#C8C8C8':'color:#64BCFF'"
              @click="setPlanBuyGoods(item)"
            >买货规划</p>
          </div>
          <p
            :style="item > year + 1?'color:#C8C8C8':'color:#64BCFF'"
            @click="viewBuyGoodsDetails(item)"
          >查看买货详情</p>
        </div>
        <div v-if="isshow_setyear === 3" class="isshowli">
          <p class="planyear">{{item}}</p>
          <p @click="viewTarget(item)">查看目标设置</p>
          <p>
            <span v-if="item <= year" @click="viewPlanBuyGoods(item)">查看买货规划</span>
          </p>
          <p>
            <span v-if="item <= year" @click="viewBuyGoodsDetails(item)">查看目标详情</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '', // 目标年份
      year: new Date().getFullYear(), // 默认年份 取现在年
      start_year: 2019, // 起始年份 默认2018
      year_threshold: 3, // 年阈值  可以定义今年到 n 年的销售目标
      years: [], // 年份列表
      selectyear: [], // 选择搜索年份
      planyears: [], // 计划列表
      setyears: [[]], // 已设置的年份列表
      edit: true, // 目标设置是否可编辑
      goodedit: true, // 买货规划是否可编辑和高亮
      gooddetails: false, // 买货详情状态
      isshow_setyear: 0, // 是否显示已设置年份
      setyear: false, // 判断显示已设置年份
      isshow_searchyear: false, // 显示搜索已经设置的年份列表
      search_setyear: [], // 搜索已经修改的年份
      isgoldset: false, // 是否已经目标设置
      target_id: '', // 目标id
      planyearslist: [], // 品牌年份目标id列表
      brandID: '', // 目标品牌id
      ishaveid: 0
    }
  },
  methods: {
    // 显示已设置年份
    show_setyear () {
      this.setyear = !this.setyear
      if (this.setyear) {
        this.isshow_setyear = 1
        this.isshow_searchyear = false
        this.value = ''
        this.search_setyear.length = 0
        this.planyearslist.forEach((item, index) => {
          if (index < 9) {
            this.setyears[0].push(item.year)
          } else {
            this.setyears[1].push(item.year)
          }
        })
      } else {
        this.isshow_setyear = 0
        this.isshow_searchyear = false
        this.value = ''
        this.search_setyear.length = 0
        if (this.setyears.length < 2) {
          this.setyears[0].length = 0
        } else {
          this.setyears[0].length = 0
          this.setyears[1].length = 0
        }
      }
    },
    // 搜索目标年份
    search_targetyear () {
      if (this.isshow_setyear === 0 || this.isshow_searchyear === true) {
        if (this.value.year && this.planyears.indexOf(this.value.year) !== -1) {
          this.isshow_searchyear = true
          this.isshow_setyear = 2
          this.search_setyear.length = 0
          this.search_setyear.push(
            this.planyears[this.planyears.indexOf(this.value.year)]
          )
        }
      } else if (this.isshow_setyear === 1 || this.isshow_searchyear === true) {
        if (this.value && this.setyears.length === 0) {
          if (
            (this.setyears[0].indexOf(this.value.year) !== -1) ||
          this.setyears[1].indexOf(this.value.year) !== -1
          ) {
            this.isshow_searchyear = true
            this.isshow_setyear = 3
            this.search_setyear.length = 0
            let a = this.setyears[0][this.setyears[0].indexOf(this.value.year)]
            if (this.setyears.length === 2) {
              a = this.setyears[1][this.setyears[1].indexOf(this.value.year)]
            }
            this.search_setyear.push(a)
          }
        } else {
          this.$notify({
            title: '提示',
            message: '当前品牌没有已设置目标的年份',
            type: 'warning'
          })
        }
      }
    },
    // 拿到对应品牌id函数
    idset (id) {
      this.planyearslist.forEach(item => {
        if (item.year === id) {
          this.target_id = item.id
        }
      })
    },
    // 查看目标设置
    async viewTarget (value) {
      if (this.planyearslist.length >= 0) {
        this.planyearslist.forEach(item => {
          if (item.year === value) {
            this.ishaveid = 1
          }
        })
      }

      if (this.ishaveid === 1) {
        this.idset(value)
        this.$router.push({
          name: 'plan.target.index',
          params: {
            year: value,
            type: 'view',
            id: this.target_id
          }
        })
      } else if (this.ishaveid === 0 || this.planyearslist.length === 0) {
        let isgoto = await this.setyearid(this.brandID, value)
        if (isgoto === 1) {
          this.idset(value)
          this.$router.push({
            name: 'plan.target.index',
            params: {
              year: value,
              type: 'view',
              id: this.target_id
            }
          })
        } else {
          this.$message({
            message: '查看失败，稍后尝试',
            type: 'error'
          })
        }
      }
    },
    // 编辑目标设置
    async editTarget (value) {
      if (this.planyearslist.length >= 0) {
        this.planyearslist.forEach(item => {
          if (item.year === value) {
            this.ishaveid = 1
          }
        })
      }
      if (this.ishaveid === 1) {
        this.idset(value)
        this.$router.push({
          name: 'plan.target.index',
          params: {
            year: value,
            type: 'edit',
            id: this.target_id
          }
        })
      } else if (this.ishaveid === 0 || this.planyearslist.length === 0) {
        let isgoto = await this.setyearid(this.brandID, value)
        if (isgoto === 1) {
          this.idset(value)
          this.$router.push({
            name: 'plan.target.index',
            params: {
              year: value,
              type: 'edit',
              id: this.target_id
            }
          })
        } else {
          this.$message({
            message: '编辑失败，稍后尝试',
            type: 'error'
          })
        }
      }
    },
    // 目标设置
    async targetSet (value) {
      if (this.planyearslist.length >= 0) {
        this.planyearslist.forEach(item => {
          if (item.year === value) {
            this.ishaveid = 1
          }
        })
      }
      if (this.ishaveid === 1) {
        this.idset(value)
        this.$router.push({
          name: 'plan.target.index',
          params: {
            year: value,
            type: 'edit',
            id: this.target_id
          }
        })
      } else if (this.ishaveid === 0 || this.planyearslist.length === 0) {
        let isgoto = await this.setyearid(this.brandID, value)
        if (isgoto === 1) {
          this.idset(value)
          this.$router.push({
            name: 'plan.target.index',
            params: {
              year: value,
              type: 'edit',
              id: this.target_id
            }
          })
        } else {
          this.$message({
            message: '设置失败，稍后尝试',
            type: 'error'
          })
        }
      }
    },
    // 查看买货规划
    async viewPlanBuyGoods (value) {
      if (this.planyearslist.length >= 0) {
        this.planyearslist.forEach(item => {
          if (item.year === value) {
            this.ishaveid = 1
          }
        })
      }
      if (this.ishaveid === 1) {
        this.idset(value)
        this.$router.push({
          name: 'plan.purchase.overall',
          params: {
            year: value,
            type: 'view',
            id: this.target_id
          }
        })
      } else if (this.ishaveid === 0 || this.planyearslist.length === 0) {
        let isgoto = await this.setyearid(this.brandID, value)
        if (isgoto === 1) {
          this.idset(value)
          this.$router.push({
            name: 'plan.purchase.overall',
            params: {
              year: value,
              type: 'view',
              id: this.target_id
            }
          })
        } else {
          this.$message({
            message: '查看失败，稍后尝试',
            type: 'error'
          })
        }
      }
    },
    // 编辑买货规划
    async editPlanBuyGoods (value) {
      if (this.planyearslist.length >= 0) {
        this.planyearslist.forEach(item => {
          if (item.year === value) {
            this.ishaveid = 1
          }
        })
      }
      if (this.ishaveid === 1) {
        this.idset(value)
        this.$router.push({
          name: 'plan.purchase.overall',
          params: {
            year: value,
            type: 'edit',
            id: this.target_id
          }
        })
      } else if (this.ishaveid === 0 || this.planyearslist.length === 0) {
        let isgoto = await this.setyearid(this.brandID, value)
        if (isgoto === 1) {
          this.idset(value)
          this.$router.push({
            name: 'plan.purchase.overall',
            params: {
              year: value,
              type: 'edit',
              id: this.target_id
            }
          })
        } else {
          this.$message({
            message: '编辑失败，稍后尝试',
            type: 'error'
          })
        }
      }
    },
    // 买货规划
    setPlanBuyGoods (value) {
      this.idset(value)
      if (this.isgoldset) {
        this.$router.push({
          name: 'plan.purchase.overall',
          params: {
            year: value,
            type: 'edit',
            id: this.target_id
          }
        })
      } else {
        this.$alert('请先进行目标设置，再设置目标规划', {
          confirmButtonText: '确定'
        })
      }
    },
    // 查看买货详情
    async viewBuyGoodsDetails (value) {
      if (value <= this.year || value === this.year + 1) {
        if (this.planyearslist.length >= 0) {
          this.planyearslist.forEach(item => {
            if (item.year === value) {
              this.ishaveid = 1
            }
          })
        }
        if (this.ishaveid === 1) {
          this.idset(value)
          this.$router.push({
            name: 'plan.purchase.details',
            params: {
              year: value,
              type: 'view',
              id: this.target_id
            }
          })
        } else if (this.ishaveid === 0 || this.planyearslist.length === 0) {
          let isgoto = await this.setyearid(this.brandID, value)
          if (isgoto === 1) {
            this.idset(value)
            this.$router.push({
              name: 'plan.purchase.details',
              params: {
                year: value,
                type: 'view',
                id: this.target_id
              }
            })
          } else {
            this.$message({
              message: '查看失败，稍后尝试',
              type: 'error'
            })
          }
        }
      } else {
        this.$alert('请先进行目标设置', {
          confirmButtonText: '确定'
        })
      }
    },
    // 保存品牌目标
    setyearid (brandid, nowyear) {
      return this.$api.planList.saveBrandTargets({ brand_id: brandid, year: nowyear }).then(res => {
        if (res.code === 0) {
          this.planyearslist.push({
            year: res.data.year,
            id: res.data.id
          })
          return 1
        }
      })
    },
    // 获取品牌目标列表
    getbrandyearid (value) {
      this.planyearslist.length = 0 // 清空数组，只保留当前品牌下的id列表
      this.$api.planList.getplanlist({ is_paginate: 0, brand_id: this.brandID }).then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            if (this.planyears.indexOf(item.year) != -1) {
              this.planyearslist.push({
                year: item.year,
                id: item.id
              })
            }
          })
        }
      })
    }
  },
  computed: {
    // 实时获取相对应的当前品牌id
    listData () {
      return this.$store.state.brand.selectBrand.id.toString()
    }
  },
  // 监听执行获取品牌id
  watch: {
    listData (val) {
      this.brandID = val
      this.getbrandyearid(this.brandID)
    }
  },
  created () {
    // 获取年份列表
    let starYear = this.year - this.year_threshold
    let endYear = this.year + this.year_threshold
    this.brandID = this.$store.state.brand.selectBrand.id.toString()
    // this.getbrandyearid(this.brandID)
    for (let i = starYear; i <= endYear; i++) {
      this.planyears.push(i)
    }
    for (let i = this.start_year; i <= endYear; i++) {
      this.years.push({
        year: i,
        value: i,
        status: false
      })
    }
    // 显示已设置年份页面的显示方式
    if (this.setyears[0].length > 10) {
      this.setyears.push(this.setyears[0].slice(10))
      this.setyears[0] = this.setyears[0].slice(0, 10)
    }
  }
}
</script>
<style lang="less" scope>
#planlist {
  padding-top: 20px;
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .explain {
    color: #646464;
    font-size: 14px;
  }
  .explainse {
    color: rgba(50, 50, 50, 1);
    font-size: 18px;
    font-weight: 500;
  }
  .targetyear {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #ccc;
  }
  .remark {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 30px;
    background: #f4f4f5;
    font-size: 14px;
    padding-left: 20px;
  }
  .twolines {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
  }
  .showyears {
    width: 680px;
    height: 660px;
    margin: 20px auto;
    list-style: none;
    li {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 56px;
      width: 100%;
      border-left: 6px solid #5297cc;
      border-radius: 6px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      &:hover {
        background: #e1f1fd;
      }

      .planyear {
        font-size: 20px;
        color: #323232;
      }
      p {
        width: 120px;
        text-align: center;
        font-size: 14px;
        color: #64bcff;
        cursor: pointer;
      }
      .isshowli {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .borderyea {
      border-left: 6px solid #64bcff;
    }
  }
}
</style>

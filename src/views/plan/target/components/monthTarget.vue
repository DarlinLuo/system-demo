/**
* @name: 计划管理设置月份目标
*/
<template>
  <div>
    <div class="boxone">
      <span>
        <span class="explain">品牌：</span>
        <span class="explainse">{{brand}}</span>
      </span>
      <span style="margin-top:4px;margin-left:45px;">
        <span class="explain">目标年份：</span>
        <span class="explainse">{{goal_year}}</span>
      </span>
      <span style="margin-left:45px;">
        <span class="explain">目标金额：</span>
        <span class="explainse">{{target_money}}</span>
      </span>
    </div>
    <div v-if="tablietype === 'one'" >
      <div class="boxtow">
        <p class="boxtow-left">
          <span class="explain">{{shopname}}目标月份总金额:</span>
          <span class="explainse" style="margin-left:10px">{{mothe_money}}</span>
        </p>
        <div class="boxtow-right">
          <p>
            <span class="explain">表格单位：</span>
            <span class="explainse">万元</span>
          </p>
          <el-row >
            <el-button style="width:100px" @click="goback">返回</el-button>
            <el-button type="primary" style="width:100px" @click="exportExcel">导出</el-button>
            <button  style="width:100px;height:28px;font-size:12px;margin-left:10px" @click="save_file" :class="issave? 'hassaves': 'notsave'">保存</button>
          </el-row>
        </div>
      </div>
      <div class="hidden-data">
        <div class="hidden-p">
          <span class="explain">隐藏数据:</span>
            <transition name="el-zoom-in-center" v-for="(item,index) in hidden_data" :key="index">
                <p class="hidden-content">
                    <span>
                      {{item.operationname}}
                      <i class="el-icon-close" @click="deleHidden(item,index)"></i>
                    </span>
                </p>
             </transition>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;text-align: center;margin-top:-10px"
        border
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        :header-cell-style="{background:'#E1F1FD',color:'#323232',textAlign:'center'}"
      >
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <p
              class="cz"
              v-text="scope.row.type"
              @click="hiddenclows(scope.row, scope.$index)"
            >
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="projectname" label="项目" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.field=== 'optional_default_target_saleroom_percent'">
              <el-radio
                v-model="targetPercentType"
                :disabled="!isEdit"
                :label="1"
                @change="handleEvalTypeChange()"
              >{{scope.row.name}}</el-radio>
              <p :class="targetPercentType == 1? 'pitch-on' : ''">(默认)</p>
            </div>
            <div v-else-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'">
              <el-radio
                v-model="targetPercentType"
                :disabled="!isEdit"
                :label="2"
                @change="handleEvalTypeChange()"
              >{{scope.row.name}}</el-radio>
              <p :class="targetPercentType == 2? 'pitch-on' : ''">(推算)</p>
            </div>
            <div v-else>{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="1月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[0]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[0]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[0]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[0]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[0]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[0]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[0]" @input="tableChange(scope.row,0,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[0]"
                @input="tableChange(scope.row,0,scope.$index)"
                @blur="targetsaleroompercent(scope.row,0,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[0]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[0]"
                @input="tableChange(scope.row,0,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[0]"
                @input="tableChange(scope.row,0,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[0]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[0]" @input="tableChange(scope.row,0,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="2月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[1]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[1]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[1]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[1]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[1]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[1]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[1]" @input="tableChange(scope.row,1,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[1]"
                @input="tableChange(scope.row,1,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[1]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[1]"
                @input="tableChange(scope.row,1,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[1]"
                @input="tableChange(scope.row,1,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[1]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[1]" @input="tableChange(scope.row,1,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="3月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[2]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[2]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[2]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[2]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[2]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[2]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[2]" @input="tableChange(scope.row,2,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[2]"
                @input="tableChange(scope.row,2,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[2]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[2]"
                @input="tableChange(scope.row,2,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[2]"
                @input="tableChange(scope.row,2,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[2]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[2]" @input="tableChange(scope.row,2,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="4月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[3]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[3]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[3]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[3]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[3]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[3]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[3]" @input="tableChange(scope.row,3,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[3]"
                @input="tableChange(scope.row,3,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[3]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[3]"
                @input="tableChange(scope.row,3,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[3]"
                @input="tableChange(scope.row,3,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[3]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[3]" @input="tableChange(scope.row,3,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="5月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[4]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[4]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[4]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[4]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[4]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[4]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[4]" @input="tableChange(scope.row,4,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[4]"
                @input="tableChange(scope.row,4,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[4]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[4]"
                @input="tableChange(scope.row,4,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[4]"
                @input="tableChange(scope.row,4,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[4]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[4]" @input="tableChange(scope.row,4,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="6月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[5]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[5]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[5]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[5]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[5]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[5]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[5]" @input="tableChange(scope.row,5,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[5]"
                @input="tableChange(scope.row,5,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[5]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[5]"
                @input="tableChange(scope.row,5,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[5]"
                @input="tableChange(scope.row,5,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[5]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[5]" @input="tableChange(scope.row,5,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="7月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[6]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[6]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[6]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[6]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[6]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[6]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[6]" @input="tableChange(scope.row,6,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[6]"
                @input="tableChange(scope.row,6,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[6]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[6]"
                @input="tableChange(scope.row,6,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[6]"
                @input="tableChange(scope.row,6,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[6]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[6]" @input="tableChange(scope.row,6,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="8月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[7]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[7]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[7]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[7]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[7]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[7]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[7]" @input="tableChange(scope.row,7,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[7]"
                @input="tableChange(scope.row,7,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[7]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[7]"
                @input="tableChange(scope.row,7,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[7]"
                @input="tableChange(scope.row,7,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[7]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[7]" @input="tableChange(scope.row,7,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="9月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[8]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[8]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[8]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[8]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[8]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[8]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[8]" @input="tableChange(scope.row,8,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[8]"
                @input="tableChange(scope.row,8,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[8]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[8]"
                @input="tableChange(scope.row,8,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[8]"
                @input="tableChange(scope.row,8,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[8]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[8]" @input="tableChange(scope.row,8,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="10月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[9]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[9]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[9]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[9]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[9]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[9]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[9]" @input="tableChange(scope.row,9,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[9]"
                @input="tableChange(scope.row,9,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[9]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[9]"
                @input="tableChange(scope.row,9,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[9]"
                @input="tableChange(scope.row,9,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[9]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[9]" @input="tableChange(scope.row,9,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="11月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[10]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[10]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[10]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[10]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[10]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[10]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[10]" @input="tableChange(scope.row,10,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[10]"
                @input="tableChange(scope.row,10,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[10]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[10]"
                @input="tableChange(scope.row,10,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[10]"
                @input="tableChange(scope.row,10,scope.$index)"

              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[10]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[10]" @input="tableChange(scope.row,10,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="12月" width="82">
          <template slot-scope="scope">
            <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[11]}}</p>
            <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[11]}}</p>
            <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[11]}}</p>
            <p
              v-if="scope.row.field === 'real_saleroom_percent'"
            >{{scope.row.value[11]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[11]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[11]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              <el-input v-model="scope.row.value[11]" @input="tableChange(scope.row,11,scope.$index)" :disabled="isinputval"></el-input>
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              <el-input
                v-model="scope.row.value[11]"
                @input="tableChange(scope.row,11,scope.$index)"
                :disabled="isinputval"
              ><span slot="suffix">%</span></el-input>
            </p>
            <p
              v-if="scope.row.field=== 'target_real_increase'"
            >{{scope.row.value[11]}}%</p>
            <p v-if="scope.row.field=== 'target_account_saleroom'">
              <el-input
                v-model="scope.row.value[11]"
                @input="tableChange(scope.row,11,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'target_real_saleroom'">
              <el-input
                v-model="scope.row.value[11]"
                @input="tableChange(scope.row,11,scope.$index)"
                :disabled="isinputval"
              ></el-input>
            </p>
            <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[11]}}%</p>
            <p v-if="scope.row.field=== 'return_rate'">
              <el-input v-model="scope.row.value[11]" @input="tableChange(scope.row,11,scope.$index)" :disabled="isinputval"><span slot="suffix">%</span></el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="上半年" width="156">
          <template slot-scope="scope">
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[12]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[12]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
              {{scope.row.value[12]}}
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
              {{scope.row.value[12]}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="下半年" width="156">
          <template slot-scope="scope">
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[13]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[13]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'">
             {{scope.row.value[13]}}
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'">
            {{scope.row.value[13]}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="年度合计" width="162">
          <template slot-scope="scope">
            <p
              v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
              :class="targetPercentType==1? 'pitch-on' : ''"
            >{{scope.row.value[14]}}%</p>
            <p
              v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
              :class="targetPercentType==2? 'pitch-on' : ''"
            >{{scope.row.value[14]}}%</p>
            <p v-if="scope.row.field === 'target_saleroom'" :style="issave?'':'color:red'">
             {{scope.row.value[14]}}
            </p>
            <p v-if="scope.row.field === 'target_saleroom_percent'" :style="issave?'':'color:red'">
              {{scope.row.value[14]}}
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="tablietype === 'all'" >
      <div v-for="(item,index) in alltableData" :key="index">
         <div class="boxtow">
          <p class="boxtow-left">
            <span class="explain">{{item.shopname}}目标月份总金额:</span>
            <span class="explainse" style="margin-left:10px">{{item.target_saleroom}}万元</span>
          </p>
          <div class="boxtow-right">
            <p>
              <span class="explain">表格单位：</span>
              <span class="explainse">万元</span>
            </p>
            <el-row v-if="index === 0">
              <el-button style="width:100px" @click="goback">返回</el-button>
              <button style="width:100px;height:28px;font-size:12px;margin-left:10px" class="notsave" >导出</button>
              <button  style="width:100px;height:28px;font-size:12px;margin-left:10px" @click="save_file" :class="issave? 'hassaves': 'notsave'">保存</button>
            </el-row>
          </div>
        </div>
        <div class="hidden-data">
          <div class="hidden-p">
            <span class="explain">隐藏数据:</span>
          </div>
        </div>
        <el-table
          :data="item.data"
          style="width: 100%;text-align: center;margin-top:-10px"
          border
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
          :header-cell-style="{background:'#E1F1FD',color:'#323232',textAlign:'center'}"
        >
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <p
                class="cz"
                v-text="scope.row.type"
              >
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="projectname" label="项目" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.field=== 'optional_default_target_saleroom_percent'">
                <el-radio
                  v-model="targetPercentType"
                  :disabled="isEdit"
                  :label="1"
                >{{scope.row.name}}</el-radio>
                <p :class="targetPercentType == 1? 'pitch-on' : ''">(默认)</p>
              </div>
              <div v-else-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'">
                <el-radio
                  v-model="targetPercentType"
                  :disabled="isEdit"
                  :label="2"
                >{{scope.row.name}}</el-radio>
                <p :class="targetPercentType == 2? 'pitch-on' : ''">(推算)</p>
              </div>
              <div v-else>{{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="1月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[0]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[0]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[0]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[0]}}%</p>
              <p v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[0]}}%</p>
              <p v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''">{{scope.row.value[0]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[0]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[0]}}%</p>
              <p v-if="scope.row.field=== 'target_real_increase'">{{scope.row.value[0]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[0]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[0]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[0]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[0]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="2月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[1]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[1]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[1]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[1]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[1]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[1]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[1]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[1]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[1]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[1]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[1]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[1]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[1]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="3月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[2]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[2]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[2]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[2]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[2]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[2]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[2]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[2]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[2]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[2]}}%</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[2]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[2]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[2]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="4月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[3]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[3]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[3]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[3]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[3]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[3]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[3]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[3]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[3]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[3]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[3]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[3]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[3]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="5月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[4]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[4]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[4]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[4]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[4]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[4]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[4]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[4]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[4]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[4]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[4]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[4]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[4]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="6月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[5]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[5]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[5]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[5]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[5]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[5]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[5]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[5]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[5]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[5]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[5]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[5]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[5]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="7月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[6]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[6]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[6]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[6]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[6]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[6]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[6]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[6]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[6]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[6]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[6]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[6]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[6]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="8月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[7]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[7]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[7]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[7]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[7]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[7]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[7]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[7]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[7]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[7]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[7]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[7]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[7]}}% </p>
            </template>
          </el-table-column>
          <el-table-column label="9月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[8]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[8]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[8]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[8]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[8]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[8]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[8]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[8]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[8]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[8]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[8]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[8]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[8]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="10月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[9]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[9]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[9]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[9]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[9]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[9]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[9]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[9]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[9]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[9]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[9]}} </p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[9]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[9]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="11月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[10]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[10]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[10]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[10]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[10]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[10]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[10]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[10]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[10]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[10]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[10]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[10]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[10]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="12月" width="82">
            <template slot-scope="scope">
              <p v-if="scope.row.field === 'official_activity'">{{scope.row.value[11]}}</p>
              <p v-if="scope.row.field === 'account_saleroom'">{{scope.row.value[11]}}</p>
              <p v-if="scope.row.field === 'real_saleroom'">{{scope.row.value[11]}}</p>
              <p
                v-if="scope.row.field === 'real_saleroom_percent'"
              >{{scope.row.value[11]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[11]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[11]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">{{scope.row.value[11]}}</p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">{{scope.row.value[11]}}%</p>
              <p
                v-if="scope.row.field=== 'target_real_increase'"
              >{{scope.row.value[11]}}%</p>
              <p v-if="scope.row.field=== 'target_account_saleroom'">{{scope.row.value[11]}}</p>
              <p v-if="scope.row.field=== 'target_real_saleroom'">{{scope.row.value[11]}}</p>
              <p v-if="scope.row.field=== 'completion_rate'">{{scope.row.value[11]}}%</p>
              <p v-if="scope.row.field=== 'return_rate'">{{scope.row.value[11]}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="上半年" width="156">
            <template slot-scope="scope">
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[12]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[12]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">
                {{scope.row.value[12]}}
              </p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">
                {{scope.row.value[12]}}%
              </p>
            </template>
          </el-table-column>
          <el-table-column label="下半年" width="156">
            <template slot-scope="scope">
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[13]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[13]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'">
              {{scope.row.value[13]}}
              </p>
              <p v-if="scope.row.field === 'target_saleroom_percent'">
              {{scope.row.value[13]}}%
              </p>
            </template>
          </el-table-column>
          <el-table-column label="年度合计" width="162">
            <template slot-scope="scope">
              <p
                v-if="scope.row.field=== 'optional_default_target_saleroom_percent'"
                :class="targetPercentType==1? 'pitch-on' : ''"
              >{{scope.row.value[14]}}%</p>
              <p
                v-if="scope.row.field=== 'optional_calculate_target_saleroom_percent'"
                :class="targetPercentType==2? 'pitch-on' : ''"
              >{{scope.row.value[14]}}%</p>
              <p v-if="scope.row.field === 'target_saleroom'" :style="issave?'':'color:red'">
              {{scope.row.value[14]}}
              </p>
              <p v-if="scope.row.field === 'target_saleroom_percent'" :style="issave?'':'color:red'">
                {{scope.row.value[14]}}%
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
// import { format } from 'path'
import { toThousands, thousandToNumber } from '../../../../utils/index'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      tablietype: '', // 月份目标类型
      brand: '', // 品牌
      goal_year: '', // 目标年份
      money: '', // 目标金额
      mothemoney: '', // 月份总金额
      isinputval: false, // 是否禁止输入
      hidden_data: [], // 隐藏数据列表
      isEdit: true, // 是否可编辑
      requestType: null, // 请求类型 brand /  store
      targetPercentType: 1, // 算法类型规则
      issave: false, // 是否高亮保存按钮
      id: '', // 目标店铺id查询详情
      tableData: [], // 单月表格数据
      alltableData: [], // 全部月份表格数据
      shopname: '', // 店铺名称
      targetID: '', // 目标id
      isSetsave: false // 是否已经保存
    }
  },
  computed: {
    target_money: function () {
      return this.money + '万元'
    },
    mothe_money: function () {
      return toThousands(this.mothemoney) + '万元'
    }
  },
  methods: {
    // 删除隐藏数据信息
    deleHidden (tatil, index) {
      this.hidden_data.splice(index, 1)
      this.tableData[tatil.operationindex].name = tatil.operationname
      this.tableData[tatil.operationindex].field = tatil.operationfield
      this.tableData[tatil.operationindex].type = `︿`
      tatil.status = 1
    },
    // 隐藏表格列表信息
    hiddenclows (row, i) {
      this.hidden_data.push({
        operationname: row.name,
        operationfield: row.field,
        operationindex: i,
        status: 0
      })
      this.tableData[i].name = ''
      this.tableData[i].field = ''
      this.tableData[i].type = ''
    },
    // 文本居中
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    // 按要求高亮
    tableRowClassName ({ row, rowIndex }) {
      if (
        row.field === 'account_saleroom' ||
        row.field === 'target_account_saleroom'
      ) {
        return 'warning-row'
      } else if (
        row.field === 'target_real_saleroom' ||
        row.field === 'real_saleroom'
      ) {
        return 'success-row'
      } else if (row.name === '') {
        return 'add'
      }
      return ''
    },
    // 计算上半年，下半年，年度合计联动
    gitlist () {
      this.tableData.forEach((item, indx) => {
        if (item.field === 'optional_default_target_saleroom_percent') {
          // 目标销售占比（默认）
          this.tableData[indx].value[12] = 0 // 上半年销售
          this.tableData[indx].value[13] = 0 // 下班年销售
          this.tableData[indx].value[14] = 0 // 年度合计
          this.tableData[indx].value.forEach((item, index) => {
            item = item * 1
            if (index < 6) {
              this.tableData[indx].value[12] += item / 6
            } else if (index > 5 && index < 12) {
              this.tableData[indx].value[13] += item / 6
            }
            if (index < 12) {
              this.tableData[indx].value[14] += item / 12
            }
          })
          this.tableData[indx].value[12] = this.tableData[indx].value[12].toFixed(1)
          this.tableData[indx].value[13] = this.tableData[indx].value[13].toFixed(1)
          this.tableData[indx].value[14] = this.tableData[indx].value[14].toFixed(1)
        } else if (item.field === 'optional_calculate_target_saleroom_percent') {
          // 目标销售占比(推算)
          this.tableData[indx].value[12] = 0 // 上半年销售
          this.tableData[indx].value[13] = 0 // 下班年销售
          this.tableData[indx].value[14] = 0 // 年度合计
          this.tableData[indx].value.forEach((item, index) => {
            item = item * 1
            if (index < 6) {
              this.tableData[indx].value[12] += item / 6
            } else if (index > 5 && index < 12) {
              this.tableData[indx].value[13] += item / 6
            }
            if (index < 12) {
              this.tableData[indx].value[14] += item / 12
            }
          })
          this.tableData[indx].value[12] = this.tableData[indx].value[12].toFixed(1)
          this.tableData[indx].value[13] = this.tableData[indx].value[13].toFixed(1)
          this.tableData[indx].value[14] = this.tableData[indx].value[14].toFixed(1)
        } else if (item.field === 'target_saleroom') {
          // 2020目标销售金额
          this.tableData[indx].value[12] = 0 // 上半年销售
          this.tableData[indx].value[13] = 0 // 下班年销售
          this.tableData[indx].value[14] = 0 // 年度合计
          this.tableData[indx].value.forEach((item, index) => {
            item = item * 1
            if (index < 6) {
              this.tableData[indx].value[12] += item
            } else if (index > 5 && index < 12) {
              this.tableData[indx].value[13] += item
            }
            if (index < 12) {
              this.tableData[indx].value[14] += item
            }
          })
        } else if (item.field === 'target_saleroom_percent') {
          // 2020目标销售金额占比
          this.tableData[indx].value[12] = 0 // 上半年销售
          this.tableData[indx].value[13] = 0 // 下班年销售
          this.tableData[indx].value[14] = 0 // 年度合计
          this.tableData[indx].value.forEach((item, index) => {
            item = item * 1
            if (index < 6) {
              this.tableData[indx].value[12] += item / 6
            } else if (index > 5 && index < 12) {
              this.tableData[indx].value[13] += item / 6
            }
            if (index < 12) {
              this.tableData[indx].value[14] = (this.tableData[indx - 1].value[14] / this.money) * 100
            }
          })
          this.tableData[indx].value[12] = this.tableData[indx].value[12].toFixed(1) + '%'
          this.tableData[indx].value[13] = this.tableData[indx].value[13].toFixed(1) + '%'
          this.tableData[indx].value[14] = this.tableData[indx].value[14].toFixed(1) + '%'
        }
      })
      this.isSetsave = false
    },

    // 联动事件事件
    completionRate (index) {
      // 完成率 = 实际销售 / 目标销售
      if (this.tableData[10].value[index] * 1 > 0 && this.tableData[6].value[index] * 1 > 0) {
        this.tableData[11].value[index] = (this.tableData[10].value[index] * 1) / (this.tableData[6].value[index] * 1) * 100
        this.tableData[11].value[index] = this.tableData[11].value[index].toFixed(1)
      } else {
        this.tableData[11].value[index] = 0
      }
    },
    // 保留一位小数
    targetsaleroompercent (val, index) {
      if (val.value[index].indexOf('.') != -1) {
        this.tableData[7].value[index] = val.value[index] * 1
        this.tableData[7].value[index] = this.tableData[7].value[index].toFixed(1)
      }
    },
    // 输入框事件
    tableChange (value, i, key) {
      if (value.field === 'target_saleroom') {
        this.tableData[key].value.forEach((item, index) => {
          if (i === index) {
            this.tableData[key].value[index] = item.replace(
              /[^\d]/g,
              ''
            )
          }
          if (this.tableData[key].value[index] === '') {
            this.tableData[key].value[index] = 0
          }
        })
        // 目标销售金额占比 = 目标月份销售金额 / 总金额
        this.tableData[key + 1].value[i] = (value.value[i] * 1 / this.mothemoney) * 100
        this.tableData[key + 1].value[i] = this.tableData[key + 1].value[i].toFixed(1)
      } else if (value.field === 'target_saleroom_percent') {
        // 要求保留一位小数
        this.tableData[key].value.forEach((item, index) => {
          if (i === index) {
            this.tableData[key].value[index] = item.toString().match(/^\d*(\.?\d{0,1})/g)[0]
          }
          if (this.tableData[key].value[index] === '') {
            this.tableData[key].value[index] = 0
          }
        })
        // 目标月份销售金额 = 总金额 * 目标销售金额占比
        this.tableData[key - 1].value[i] = this.mothemoney * (value.value[i] / 100)
        this.tableData[key - 1].value[i] = this.tableData[key - 1].value[i]
      } else if (value.field === 'target_account_saleroom') {
        this.tableData[key].value.forEach((item, index) => {
          if (i === index) {
            this.tableData[key].value[index] = item.replace(
              /[^\d]/g,
              ''
            )
          }
          if (this.tableData[key].value[index] === '') {
            this.tableData[key].value[index] = 0
          }
        })
      } else if (value.field === 'target_real_saleroom') {
        this.tableData[key].value.forEach((item, index) => {
          if (i === index) {
            this.tableData[key].value[index] = item.replace(
              /[^\d]/g,
              ''
            )
          }
          if (this.tableData[key].value[index] === '') {
            this.tableData[key].value[index] = 0
          }
        })
      } else if (value.field === 'return_rate') {
        this.tableData[key].value.forEach((item, index) => {
          if (i === index) {
            this.tableData[key].value[index] = item.toString().match(/^\d*(\.?\d{0,1})/g)[0]
          }
          if (this.tableData[key].value[index] === '') {
            this.tableData[key].value[index] = 0
          }
        })
      }
      this.completionRate(i)
      this.gitlist()
      this.issetsave()
    },
    // 返回上一页
    goback () {
      if (this.isinputval) {
        this.$emit('pre_step', {
          num: 0
        })
      } else {
        if (this.isSetsave === false) {
          this.$confirm('是否保存', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            // 调用保存事件回调提示保存成功返回上一级
            if (this.mothemoney === this.tableData[6].value[14]) {
              this.save_file()
            } else {
              this.$confirm('请检查年度合计金额与目标总金额是否相等', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.$notify({
                  title: '提示',
                  message: '已取消保存',
                  type: 'warning'
                })
                this.isSetsave = false
              }).catch(() => {
                this.$notify({
                  title: '提示',
                  message: '已取消保存',
                  type: 'warning'
                })
                this.isSetsave = false
              })
            }
          }).catch(() => {
            this.$notify({
              title: '提示',
              message: '已取消保存',
              type: 'warning'
            })
            this.isSetsave = false
            this.$emit('pre_step', {
              num: 0
            })
          })
        } else if (this.isSetsave === true) {
          this.$emit('pre_step', {
            num: 0
          })
        }
      }
    },
    // 算法：默认或者推算
    handleEvalTypeChange () {
      this.isSetsave = false
      console.log(this.targetPercentType)
    },
    // 导出Excel文件
    exportExcel () {
      // 表格table节点
      let wb = XLSX.utils.table_to_book(document.querySelector('.el-table'))
      let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${this.brand}${this.shopname}目标月份总金额.xlsx`)// 文件名
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // 保存
    save_file () {
      let store_month_targets = []// 提交保存的数组
      if (this.issave === true) {
        if (this.isSetsave === false) {
          // 保存操作
          this.tableData[0].value.forEach((item, index) => {
            store_month_targets.push({
              month: index + 1,
              official_activity: item,
              account_saleroom: this.tableData[1].value[index] * 10000,
              real_saleroom: this.tableData[2].value[index] * 10000,
              real_saleroom_percent: this.tableData[3].value[index],
              target_saleroom: this.tableData[6].value[index] * 10000,
              target_saleroom_percent: this.tableData[7].value[index],
              target_account_saleroom: this.tableData[9].value[index] * 10000,
              target_real_saleroom: this.tableData[10].value[index] * 10000,
              target_real_increase: this.tableData[8].value[index],
              completion_rate: this.tableData[11].value[index],
              return_rate: this.tableData[12].value[index]
            })
          })
          this.$api.planList.savestoreTarget({ _method: 'PUT', id: this.id, month_calculate_type: this.targetPercentType, store_month_targets: store_month_targets }).then(res => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            })
            this.isSetsave = true
          })
        } else if (this.isSetsave === true) {
          this.$notify({
            title: '提示',
            message: '已经保存过了',
            type: 'warning'
          })
        }
      }
    },
    // 监听是否保存按钮高亮
    issetsave () {
      if (this.mothemoney === this.tableData[6].value[14] && this.$route.params.type === 'edit') {
        this.issave = true
      } else {
        this.issave = false
      }
    },
    // 获取店铺目标详情接口函数
    getTableData () {
      this.$api.planList.getstoreTargetDetails({ id: this.id, with: ['brand_target', 'store_month_targets', 'platform'], store_month_targets_sort: 'spread_by_fields' }).then(async res => {
        this.mothemoney = res.data.target_saleroom / 10000
        this.goal_year = res.data.brand_target.year // 获取当前目标年份
        this.money = res.data.brand_target.target_saleroom / 10000 // 获取当前目标金额
        this.brand = this.$store.state.brand.selectBrand.name // 获取当前品牌
        this.shopname = res.data.name
        res.data.store_month_targets.forEach((item, index) => {
          if (index === 4 || index === 5) {
            item.name = item.name.substring(0, 6)
          }
          if (index > 0) {
            item.value = item.value.map(a => {
              return (a * 1).toFixed(1)
            })
          }
          if (index === 6 || index === 9 || index === 10 || index === 1 || index === 2) {
            item.value = item.value.map(a => {
              return (a / 10000).toFixed(0)
            })
          }
          this.tableData.push({
            field: item.field,
            name: item.name,
            type: `︿`,
            value: item.value
          })
        })
        await this.tableChange(this.tableData[6], 1, 6)
        this.isSetsave = true
      })
    },
    // 获取店铺目标列表关联月份目标详情
    getstoreModthData (valid) {
      this.$api.planList.getstoreTargetList({
        brand_target_id: this.$route.params.id,
        is_paginate: 0,
        store_month_targets_sort: 'spread_by_fields',
        with: ['brand_target', 'store_month_targets']
      }).then(res => {
        this.goal_year = res.data[0].brand_target.year // 获取当前目标年份
        this.money = (res.data[0].brand_target.target_saleroom / 10000).toFixed(0) // 获取当前目标金额
        this.brand = this.$store.state.brand.selectBrand.name // 获取当前品牌
        res.data.forEach((item, index) => {
          item.store_month_targets.forEach((its, i) => {
            if (i === 4 || i === 5) {
              its.value[12] = 0
              its.value[13] = 0
              its.value[14] = 0
              its.name = its.name.substring(0, 6)
              its.value.forEach((y, indx) => {
                if (indx < 6) {
                  its.value[12] += (y * 1)
                } else if (indx > 5 && indx < 12) {
                  its.value[13] += (y * 1)
                }
                if (indx >= 0 && indx < 12) {
                  its.value[14] += (y * 1)
                }
              })
            }
            if (i > 0) {
              its.value = its.value.map(a => {
                return (a * 1).toFixed(1)
              })
            }
            if (i === 6 || i === 9 || i === 10 || i === 1 || i === 2) {
              its.value = its.value.map(a => {
                return (a / 10000).toFixed(0)
              })
            }
            if (i === 6) {
              its.value[12] = 0
              its.value[13] = 0
              its.value[14] = 0
              its.value.forEach((y, indx) => {
                if (indx < 6) {
                  its.value[12] += (y * 1)
                } else if (indx > 5 && indx < 12) {
                  its.value[13] += (y * 1)
                }
                if (indx >= 0 && indx < 12) {
                  its.value[14] += (y * 1)
                }
              })
            }
            if (i === 7) {
              its.value[12] = 0
              its.value[13] = 0
              its.value[14] = 0
              its.value.forEach((y, indx) => {
                if (indx < 6) {
                  its.value[12] += (y * 1)
                } else if (indx > 5 && indx < 12) {
                  its.value[13] += (y * 1)
                }
              })
            }
            its.type = `︿`
          })
          this.alltableData.push({
            shopname: item.name,
            target_saleroom: (item.target_saleroom / 10000).toFixed(0),
            data: item.store_month_targets
          })
        })
        this.alltableData.forEach((item, index) => {
          item.data.forEach((its, indx) => {
            if (indx === 4 || indx === 5) {
              its.value[12] = (its.value[12] / 6).toFixed(1)
              its.value[13] = (its.value[13] / 6).toFixed(1)
              its.value[14] = (its.value[14] / 12).toFixed(1)
            } else if (indx === 7) {
              its.value[12] = (its.value[12] / 6).toFixed(1)
              its.value[13] = (its.value[13] / 6).toFixed(1)
              its.value[14] = ((item.data[indx - 1].value[14] / this.money) * 100).toFixed(1)
            }
          })
        })
      })
    }
  },
  created () {
    this.tableData.length = 0
    this.alltableData.length = 0
    this.id = this.$parent.storeid
    this.tablietype = this.$parent.monthtepy
    if (this.tablietype === 'one') {
      if (this.$route.params.type === 'view') {
        this.isinputval = true
      } else if (this.$route.params.type === 'edit') {
        this.isinputval = false
      }
      this.getTableData()
    } else if (this.tablietype === 'all') {
      this.getstoreModthData(this.id)
      this.isinputval = true
    }
  }
}
</script>
<style lang="less" scope>
.el-table .isshowheight{
  height:0 !important;
}
.explain {
  color: rgba(150, 150, 150, 1);
  font-size: 14px;
}
.explainse {
  color: rgba(50, 50, 50, 1);
  font-size: 18px;
  font-weight: 500;
}
.arrow_box {
  color: rgba(50, 50, 50, 1);
  font-size: 18px;
  font-weight: 500;
}

.boxone {
  width: 99%;
  padding-left: 20px;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #ccc;
}
.boxtow {
  width: 98%;
  padding-left: 20px;
  height: 40px;
  border-top: 1px solid #ccc;
  border-left: 12px solid #64bcff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .boxtow-left {
    width: 40%;
    img {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
  }
  .boxtow-right {
    width: 35%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.hidden-data {
  width: 99%;
  padding-left: 20px;
  line-height: 34px;
  border-top: 1px solid #ccc;
  margin-bottom:12px;
  .hidden-p {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .hidden-content {
      margin-left: 6px;
      font-size: 14px;
      span {
        padding: 6px 4px;
        background: rgba(225, 241, 253, 1);
        border-radius: 4px;
        color: #64bcff;
        cursor: pointer;
      }
    }
  }
}
.add td {
    padding: 0 0;
}
.cz {
  cursor: pointer;
}
//账面销售
.el-table .warning-row {
  background: rgba(221, 245, 249, 1);
}
//账面销售
.el-table .success-row {
  background: rgba(245, 248, 221, 1);
}
//选中的字体高亮
.pitch-on {
  color: #40acff;
}
.el-input__inner {
  text-align: center;
}
.el-input__suffix{
  margin-top : 3px;
}
</style>

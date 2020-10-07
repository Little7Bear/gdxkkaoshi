<template>
  <div class="answer-wrapper">
    <div class="header">
      <h2 class="title">期末考试-数据库理论</h2>
    </div>

    <div class="main">
      <!-- 左侧题目导航 -->
      <aside class="aside">
        <el-card>
          <div slot="header">单选题</div>

          <ul class="card-wrapper">
            <li
              v-for="(item, index) in singleData"
              :key="index"
              class="card-item"
              :class="{selected:item.selected,active:active === index+1}"
              @click="onChoice(index+1)"
            >{{index+1}}</li>
          </ul>
        </el-card>

        <el-card style="margin-top:20px;">
          <div slot="header">多选题</div>

          <ul class="card-wrapper">
            <li
              v-for="(item, index) in multipleData"
              :key="index"
              class="card-item"
              :class="{selected:item.selected,active:active === singleData.length+index+1}"
              @click="onChoice(singleData.length+index+1)"
            >{{singleData.length+index+1}}</li>
          </ul>
        </el-card>

        <el-button
          type="primary"
          style="width:100%;margin-top:20px;"
          @click="dialogVisible = true"
        >结束考试</el-button>
      </aside>

      <!-- 右侧答题区域 -->
      <section class="content">
        <div class="content-header">
          <span>请选择正确的选项</span>
          <span>倒计时：{{time}}</span>
        </div>

        <div class="content-body">
          <div>
            <span style="margin-right:5px;">{{listData[active-1].index}}.</span>
            <span>{{listData[active-1].text}}</span>
          </div>

          <div style="margin-top:20px;margin-left:20px;" v-show="type==='单选'">
            <el-radio-group v-model="listData[active-1].answer" @change="changeRadio">
              <el-radio
                v-for="(item, index) in listData[active-1].answers"
                :key="index"
                :label="item.label"
              >{{item.text}}</el-radio>
            </el-radio-group>
          </div>

          <div style="margin-top:20px;margin-left:20px;" v-show="type==='多选'">
            <el-checkbox-group v-model="listData[active-1].answerList" @change="changeCheckbox">
              <el-checkbox
                v-for="(item, index) in listData[active-1].answers"
                :key="index"
                :label="item.label"
              >{{item.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class="content-footer">
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            style="margin-right:20px;"
            @click="onPre"
            :disabled="minDisabled"
          >上一题</el-button>
          <el-button type="primary" @click="onNext" :disabled="maxDisabled">
            下一题
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </section>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <i class="el-icon-warning"></i>
      <span>确定提交试卷吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">再检查一下</el-button>
        <el-button type="primary" @click="onComplete">立即交卷</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showDialogEnd" width="30%">
      <i class="el-icon-warning"></i>
      <span>考试结束，试卷已提交！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogEnd = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      id: 0,
      dialogVisible: false,
      showDialogEnd: false,
      time: '',
      type: '单选',

      listData: [
        {
          index: 1,
          type: 'single',
          selected: false,
          text:
            '以太网采用的CSMA/CD协议，当冲突发生时要通过二进制指数后退算法计算后退延时， 关于这个算法，以下论述中错误的是（）',
          answer: '',
          answerList: [],
          answers: [
            {
              label: 1,
              text: '备选项1',
            },
            {
              label: 2,
              text: '备选项2',
            },
          ],
        },
        {
          index: 2,
          type: 'single',
          selected: false,
          text: '1000BASE-T标准支持的传输介质是（）',
          answer: '',
          answerList: [],
          answers: [
            {
              label: 1,
              text: '双绞线',
            },
            {
              label: 2,
              text: '同轴电缆',
            },
          ],
        },
        {
          index: 3,
          type: 'multiple',
          selected: false,
          text:
            '在TCP/IP协议中，序号小于（ ）的端口称为熟知端口(well-known port)。',
          answer: '',
          answerList: [],
          answers: [
            {
              label: 1,
              text: '1024',
            },
            {
              label: 2,
              text: '64',
            },
          ],
        },
        {
          index: 4,
          type: 'multiple',
          selected: false,
          text: 'DHCP通常可以为客户端自动配置哪些网络参数（）',
          answer: '',
          answerList: [],
          answers: [
            {
              label: 1,
              text: 'IP',
            },
            {
              label: 2,
              text: 'DNS',
            },
            {
              label: 3,
              text: '网关',
            },
            {
              label: 4,
              text: '掩码',
            },
          ],
        },
      ],

      active: 1,
      singleData: [],
      multipleData: [],
    }
  },

  created() {
    this.id = this.$route.query.id
    this.startTimeout()
    this.getHistory()
    this.splitData()
  },

  computed: {
    maxLength() {
      return this.singleData.length + this.multipleData.length
    },

    minDisabled() {
      return this.active === 1
    },

    maxDisabled() {
      return this.active === this.maxLength
    },
  },

  watch: {
    active(val) {
      this.getData()
    },

    listData: {
      deep: true,
      handler(val) {
        sessionStorage.setItem('answers', JSON.stringify(val))
      },
    },
  },

  methods: {
    startTimeout() {
      // let time = 3 * 1000
      let time = 1 * 60 * 60 * 1000
      let timer = window.setInterval(() => {
        if (time <= 0) {
          window.clearInterval(timer)
          this.onComplete()
        } else {
          time -= 1000
          let d = moment.duration(time)
          this.time = `${d.hours()}:${d.minutes()}:${d.seconds()}`
        }
      }, 1000)

      this.$once('hook:beforeDestroy', () => {
        window.clearInterval(timer)
      })
    },

    getHistory() {
      let answers = sessionStorage.getItem('answers')
      if (answers) {
        this.listData = JSON.parse(answers)
      }
    },

    splitData() {
      this.singleData = this.listData.filter((v) => v.type === 'single')
      this.multipleData = this.listData.filter((v) => v.type === 'multiple')
    },

    getData() {
      if (this.active <= this.singleData.length) {
        this.type = '单选'
      } else {
        this.type = '多选'
      }
    },

    onChoice(i) {
      this.active = i
    },

    onPre() {
      this.active = this.active - 1
    },

    onNext() {
      this.active = this.active + 1
    },

    changeRadio() {
      this.listData[this.active - 1].selected = true
    },

    changeCheckbox(val) {
      if (val.length) {
        this.listData[this.active - 1].selected = true
      } else {
        this.listData[this.active - 1].selected = false
      }
    },

    onComplete() {
      console.log('提交')
      this.showDialogEnd = true
    },
  },
}
</script>

<style lang="scss" scoped>
.answer-wrapper {
  background: #eee;
  height: 100%;
}

.header {
  height: 66px;
  display: flex;
  align-items: center;
  background-color: #2776df;
  padding-left: 10px;
  color: #fff;

  .title {
    font-size: 20px;
    font-weight: normal;
  }
}

.main {
  display: flex;
}

.aside {
  width: 260px;
  margin: 10px 10px 0;

  .card-wrapper {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px 15px;
  }

  .card-item {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid #e4e7ed;
    cursor: pointer;
    user-select: none;
  }

  .selected {
    background: #2776df;
    color: #fff;
  }

  .active {
    border: 1px solid orange;
  }
}

.el-icon-warning {
  font-size: 18px;
  margin-right: 5px;
  position: relative;
  top: 2px;
  color: orange;
}

.content {
  margin-top: 10px;
  margin-right: 10px;
  flex: 1;
  width: 0;

  .content-header {
    height: 50px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
  }

  .content-body {
    height: 470px;
    margin-top: 10px;
    background: #fff;
    padding: 20px 20px 0 20px;
  }

  .content-footer {
    margin-top: 10px;
    background: #fff;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

/deep/.el-radio-group {
  .el-radio {
    display: block;
    margin-bottom: 15px;
  }
}

/deep/.el-checkbox-group {
  .el-checkbox {
    display: block;
    margin-bottom: 15px;
  }
}
</style>

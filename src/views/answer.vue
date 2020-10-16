<template>
  <div class="answer-wrapper" v-loading="loading">
    <div class="header">
      <h2 class="title">{{ name }}</h2>
    </div>

    <div class="main">
      <!-- 左侧题目导航 -->
      <!-- <sticky> -->
      <aside class="aside">
        <el-card>
          <div slot="header">选择题</div>
          <ul class="card-wrapper">
            <li
              v-for="(item, index) in listData"
              :key="index"
              class="card-item"
              :class="{
                  selected: item.selected,
                  active: active === index,
                }"
              @click="onChoice(index)"
            >{{ index + 1 }}</li>
          </ul>
        </el-card>
        <el-button
          type="primary"
          style="width:100%;margin-top:20px;"
          @click="dialogVisible = true"
        >结束考试</el-button>
      </aside>
      <!-- </sticky> -->

      <!-- 右侧答题区域 -->
      <section class="content">
        <div class="content-header">
          <span>请选择正确的选项</span>
          <span>倒计时：{{ time }}</span>
        </div>

        <div class="content-body">
          <div>
            <span style="margin-right:5px;">{{ listData[active].index }}.</span>
            <span>{{ listData[active].text }}</span>
          </div>

          <div style="margin-top:20px;margin-left:20px;" v-show="listData[active].type === 1">
            <el-radio-group v-model="listData[active].answer" @change="changeRadio">
              <el-radio
                v-for="(item, index) in listData[active].answers"
                :key="index"
                :label="item.id"
              >{{ item.mc }}</el-radio>
            </el-radio-group>
          </div>

          <div style="margin-top:20px;margin-left:20px;" v-show="listData[active].type === 2">
            <el-checkbox-group v-model="listData[active].answerList" @change="changeCheckbox">
              <el-checkbox
                v-for="(item, index) in listData[active].answers"
                :key="index"
                :label="item.id"
              >{{ item.mc }}</el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="img-wrapper" v-show="listData[active].img">
            <img class="img" :src="listData[active].img" alt="图片" />
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
        <el-button :loading="submitLoading" type="primary" @click="onComplete">立即交卷</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showDialogEnd" width="30%" @close="onEndConfirm">
      <i class="el-icon-warning"></i>
      <span>考试结束，试卷已提交！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onEndConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showLeave" width="30%">
      <i class="el-icon-warning"></i>
      <span>离开此页面数据不会保存，确定离开吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLeave = false">取 消</el-button>
        <el-button type="danger" @click="onLeave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import KaoShi from '@/api/kaoshi'

export default {
  data() {
    return {
      id: 0,
      userId: 0,
      loading: false,
      time: '',
      duration: 0,
      timer: null,
      targetPath: '',
      active: 0,
      type: '单选',
      isHistory: false,
      dialogVisible: false,
      showDialogEnd: false,
      showLeave: false,
      isLeave: false,
      submitLoading: false,
      name: '',

      listData: [
        {
          // index: 1,
          // type: 1,
          // selected: false,
          // text: "",
          // answer: "",
          // answerList: [],
          // answers: [
          //   {
          //     label: 1,
          //     text: "",
          //   },
          //   {
          //     label: 2,
          //     text: "",
          //   },
          // ],
          // img: "",
        },
      ],
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.isLeave) {
      this.showLeave = false
      next()
    } else {
      this.targetPath = to.path // 提示框点击确认后跳转的 路由
      this.showLeave = true
      next(false)
    }
  },

  created() {
    this.id = this.$route.query.id
    let user = JSON.parse(localStorage.getItem('user'))
    this.userId = user.id
    this.setTimeout()
    this.isHistory = this.getHistory()
    this.getData()
  },

  computed: {
    maxLength() {
      return this.listData.length
    },

    minDisabled() {
      return this.active === 0
    },

    maxDisabled() {
      return this.active === this.maxLength - 1
    },
  },

  watch: {
    listData: {
      deep: true,
      handler(val) {
        sessionStorage.setItem('answers', JSON.stringify(val))
      },
    },
  },

  methods: {
    async getData() {
      try {
        this.loading = true
        const { data } = await KaoShi.queryById({
          sjId: this.id,
          userId: this.userId,
        })
        console.log(data)
        this.name = data.sjMc
        let now = moment()
        // let start = "2020-10-11 18:00:00";
        let start = moment(data.kssj)
        let time = now.diff(start, 'minute')
        let duration = data.kssc
        let d = duration - time
        if (d <= 0) {
          this.showDialogEnd = true
        } else {
          window.clearInterval(this.timer)
          this.duration = d * 60 * 1000
          this.setTimeout()
        }

        if (this.isHistory === false) {
          let arr = []
          data.sjXzt.forEach((item) => {
            let obj = {
              index: item.index,
              type: item.type,
              selected: false,
              text: item.tmmc,
              answer: '',
              answerList: [],
              answers: item.options,
              img: '',
            }
            if (item.img) {
              obj.img = 'http://glsite.cn:1002' + item.img
            }
            arr.push(obj)
          })
          this.listData = arr
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    setTimeout() {
      this.timer = window.setInterval(() => {
        if (this.duration <= 0) {
          window.clearInterval(this.timer)
          this.showDialogEnd = true
        } else {
          this.duration -= 1000
          let d = moment.duration(this.duration)
          this.time = `${d.hours() > 9 ? d.hours() : '0' + d.hours()}:${
            d.minutes() > 9 ? d.minutes() : '0' + d.minutes()
          }:${d.seconds() > 9 ? d.seconds() : '0' + d.seconds()}`
        }
      }, 1000)

      this.$once('hook:beforeDestroy', () => {
        window.clearInterval(this.timer)
      })
    },

    getHistory() {
      let answers = sessionStorage.getItem('answers')
      if (answers) {
        this.listData = JSON.parse(answers)
        return true
      } else {
        return false
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
      this.listData[this.active].selected = true
    },

    changeCheckbox(val) {
      if (val.length) {
        this.listData[this.active].selected = true
      } else {
        this.listData[this.active].selected = false
      }
    },

    async onComplete() {
      this.submitLoading = true
      let data = []
      this.listData.forEach((item) => {
        let obj = { xztId: item.id, ops: [] }
        if (item.type === 1) {
          if (item.answer) {
            obj.ops.push(item.answer)
          }
        } else {
          item.answerList.forEach((aTtem) => {
            if (aTtem) {
              obj.ops.push(aTtem)
            }
          })
        }
        data.push(obj)
      })
      try {
        await KaoShi.submit({
          sjId: Number(this.id),
          userId: this.userId,
          dtkXzt: data,
        })
        this.onLeave()
      } catch (error) {
        console.log(error)
      } finally {
        this.submitLoading = false
      }
    },

    onLeave() {
      this.isLeave = true
      sessionStorage.clear()
      this.$router.replace(this.targetPath || '/')
    },

    onEndConfirm() {
      this.showDialogEnd = false
      this.onLeave()
    },
  },
}
</script>

<style lang="scss" scoped>
.answer-wrapper {
  background: #eee;
  min-height: 100%;
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
  position: relative;
}

.aside {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 350px;

  .card-wrapper {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
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
  width: 100%;
  margin-left:370px;
  margin-top: 10px;
  margin-right: 10px;

  .content-header {
    height: 50px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
  }

  .content-body {
    min-height: 470px;
    margin-top: 10px;
    background: #fff;
    padding: 10px 10px 0 10px;
  }

  .content-footer {
    margin: 10px 0;
    background: #fff;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img-wrapper {
    .img {
      width: 600px;
      height: auto;
    }
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

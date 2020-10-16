<template>
  <div v-loading="loading">
    <el-card shadow="never">
      <ul class="list-wrapper">
        <li
          class="list-item-container"
          v-for="(item, index) in listData"
          :key="index"
          @click="onJump(item)"
        >
          <el-card shadow="hover">
            <h3>{{ item.mc }}</h3>
            <p class="row">
              {{ item.gksj | longDate }}&nbsp;至&nbsp;{{ item.jssj | longDate }}
            </p>
            <div class="row row2">
              <div class="row-item">
                <i class="el-icon-alarm-clock"></i>
                <span>限时{{ item.kssc }}分钟</span>
              </div>
              
              <div class="row-item">
                <i class="el-icon-tickets"></i>
                <span>满分{{ item.zf }}分</span>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
        <span v-if="!listData">无测评信息！</span>
    </el-card>

    <el-dialog title="提示" :visible.sync="showStart" width="30%">
      <i class="el-icon-warning"></i>
      <span>确定开始考试吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showStart = false">取 消</el-button>
        <el-button type="primary" @click="onStart()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ShiJuan from "@/api/shijuan";
import moment from "moment";

export default {
  filters: {
    longDate(value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD HH:ss:mm");
    },
  },

  data() {
    return {
      loading: false,
      showStart: false,
      userId: 0,
      currentPaper: null,
      listData: [],
    };
  },

  created() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userId = user.id;
    this.getData();
  },

  methods: {
    onJump(item) {
      let { gksj, jssj } = item;
      let now = moment();
      if (now <= moment(jssj) && now >= moment(gksj)) {
        if (item.sfjs == 0) {
          this.showStart = true;
          this.currentPaper = item;
        } else {
          this.$message.warning("考试已结束");
        }
      } else {
        this.$message.warning("当前时间不在考试时间范围内");
      }
    },

    async getData() {
      try {
        this.loading = true;
        const { data } = await ShiJuan.queryByUserId({ userId: this.userId });
        console.log(data);
        this.listData = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    onStart() {
      this.showStart = false;
      this.$router.push({
        path: "/answer",
        query: { id: this.currentPaper.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-wrapper {
  padding: 20px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px 30px;
}

.list-item-container {
  cursor: pointer;

  .row {
    margin-top: 10px;
    color: #88949b;
  }

  .row2 {
    display: flex;
  }

  .row-item {
    margin-right: 10px;
  }
}
</style>


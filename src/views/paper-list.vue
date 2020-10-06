<template>
  <div>
    <el-card shadow="never">
      <ul class="list-wrapper">
        <li
          class="list-item-container"
          v-for="(item, index) in listData"
          :key="index"
          @click="onJump(item.id)"
        >
          <el-card shadow="hover">
            <h3>{{item.title}}</h3>
            <p class="row">{{item.subTitle}}</p>
            <div class="row row2">
              <div class="row-item">
                <i class="el-icon-time"></i>
                <span>{{item.date}}</span>
              </div>

              <div class="row-item">
                <i class="el-icon-alarm-clock"></i>
                <span>限时{{item.time}}分钟</span>
              </div>

              <div class="row-item">
                <i class="el-icon-tickets"></i>
                <span>满分{{item.fullMark}}分</span>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [
        {
          id: 1,
          title: '数据库理论',
          subTitle: '数据库理论-2019年上学期期末考试',
          date: '2019-03-07',
          time: 90,
          fullMark: 100,
        },
        {
          id: 2,
          title: '数据库理论',
          subTitle: '数据库理论-2019年上学期期末考试',
          date: '2019-03-07',
          time: 90,
          fullMark: 100,
        },
        {
          id: 3,
          title: '数据库理论',
          subTitle: '数据库理论-2019年上学期期末考试',
          date: '2019-03-07',
          time: 90,
          fullMark: 100,
        },
      ],
    }
  },

  methods: {
    onJump(id) {
      this.$router.push({ path: '/answer', query: { id } })
    },
  },
}
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

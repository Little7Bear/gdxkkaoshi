<template>
  <div class="app-wrapper">
    <header class="header">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        router
      >
        <el-menu-item index="paper-list">我的试卷</el-menu-item>
        <el-menu-item index="my-score">我的分数</el-menu-item>
      </el-menu>
    </header>

    <main class="main-wrapper">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      activeIndex: 'paper-list',
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    },
  },
}
</script>
<style lang="scss" scoped>
@mixin main-layout {
  width: 980px;
  margin: 0 auto;
}

.app-wrapper {
  .main-wrapper {
    @include main-layout;
    padding-top: 20px;
  }
}

/deep/ .el-menu {
  @include main-layout;
}
</style>

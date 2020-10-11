<template>
  <div class="app-wrapper">
    <header class="header">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">我的试卷</el-menu-item>
        <el-menu-item index="2">退出登录</el-menu-item>
        <span class="user-name">{{ username }}</span>
      </el-menu>
    </header>

    <main class="main-wrapper">
      <router-view />
    </main>
  </div>
</template>

<script>
import User from "@/api/user";

export default {
  name: "Home",

  data() {
    return {
      activeIndex: "1",
      username: "",
    };
  },

  created() {
    this.username = JSON.parse(localStorage.getItem("user")).name;
  },

  methods: {
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.$router.push("paper-list");
          break;
        case "2":
          this.$router.push("my-score");
          break;
        case "3":
          User.logout();
          break;
      }
    },
  },
};
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

.user-name {
  position: absolute;
  right: 0;
  top: 30px;
}
</style>

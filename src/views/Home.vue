<template>
  <div class="app-wrapper" style="color:#fff">
    <header class="header" style="background: #2f4b69;">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#2f4b69"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item style="color:#fff" index="1">我的测评</el-menu-item>
        <el-menu-item style="color:#fff" index="2">退出登录</el-menu-item>
        <span class="user-name">用户名：{{ username }}</span>
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
      username: ""
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
        case "3":
          this.$router.push("my-score");
          break;
        case "2":
          User.logout();
          break;
      }
    }
  }
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
  right: 10px;
  top: 20px;
}
</style>

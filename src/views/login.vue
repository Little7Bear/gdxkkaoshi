<template>
  <div class="login-container">
    <div class="form">
      <h2 class="title">考试系统登录</h2>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="userName">
          <el-input
            name="userName"
            tabindex="1"
            v-model="form.userName"
            placeholder="请输入账号"
            autocomplete="on"
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            tabindex="2"
            v-model="form.password"
            placeholder="请输入密码"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
            prefix-icon="el-icon-lock"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            @click="handleLogin"
            style="width:100%;"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import User from "@/api/user";

export default {
  data() {
    return {
      form: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
      capsTooltip: false,
    };
  },

  methods: {
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const { data } = await User.login(this.form);
            localStorage.setItem("token", data.token);
            localStorage.setItem(
              "user",
              JSON.stringify({
                id: data.id,
                name: data.userName,
                mc: data.mc,
                role: data.role,
              })
            );
            this.$router.replace("/");
          } catch (error) {
            console.log(error);
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login-container {
  overflow: hidden;
}

.title {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.form {
  width: 448px;
  margin: 0 auto;
  margin-top: 150px;
}
</style>

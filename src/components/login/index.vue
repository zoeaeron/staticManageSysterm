<template>
  <div class="login-bg">
    <div class="login-box">
      <h1 class="title">Static Source Manage Systerm</h1>
      <el-form :model="form" class="form-box">
        <h1 class="form-title">Login</h1>
        <el-form-item label="account" label-width="50px">
          <el-input v-model="form.userName" autocomplete="" />
        </el-form-item>
        <el-form-item label="password" label-width="50px">
          <el-input v-model="form.userPwd" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button class="confirm-button" @click="onSubmit" >submit</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { login } from "@/api/user";
import { ElMessage } from "element-plus";
import { setToken } from "@/utils/auth";
import { useRouter } from "vue-router";

const form = reactive({
  userName: "",
  userPwd: "",
});

const router = useRouter();
const onSubmit = () => {
  const formJson = JSON.parse(JSON.stringify(form));
  login(formJson)
    .then(function (res) {
      if (res.data.code === 1) {
        const resp = res.data.data;
        setToken(resp.token);
        router.push({
          name: "Home",
        });
      } else {
        ElMessage.error("login failed:" + res.data.msg);
      }
    })
    .catch((err) => ElMessage.error("login failed:" + err));
};
</script>

<style scoped>
.login-bg{
  width: 100vw;
  height: 100vh;
  background-color: #fcebd3;
}
.login-box {
  width: 1382px;
  height: 829px;
  background: url("../../assets/img/bg.png") no-repeat;
  background-size: 100% 100%;
  border-radius: 50px;
  position: fixed;
  box-shadow: var(--el-box-shadow);
  top: calc(50% - 415px);
  left: calc(50% - 691px);
}
.title {
  position: relative;
  top: 2%;
  right: -50%;
  font-size: xxx-large;
  color: #feb104;
}
.form-title {
  margin-top: 40px;
  margin-bottom: 40px;
}
.el-form-item {
  margin-bottom: 40px;
}
.el-form-item__label {
  color: #fff;
}
</style>

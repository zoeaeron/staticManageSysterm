<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-box">
        <h1 class="title">Static Source Manage System</h1>
        <div class="logout ">
          <el-button round disabled color="#626aef">{{store.userName}}</el-button>
          <el-button type="warning" @click="handleLogout" round>Logout</el-button>
        </div>
      
        <el-menu
          :default-active="route.path"
          class="el-menu-demo navbar"
          mode="horizontal"
          router
        >
          <el-menu-item
            v-for="(item, i) in routerInfo"
            :key="item.name"
            :index="item.path"
          >
            <template v-slot:title>
              <span> {{ item.name }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-header>

      <el-main class="flex-row-center">
        <div class="main-box">
          <main class="content">
            <router-view :key="route.fullPath" v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </main>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getToken, removeToken } from "@/utils/auth";
import { logout } from "@/api/user";
import { store } from "@/store.js";

const router = useRouter();
const route = useRoute();

//获取路由信息
const routerInfo = reactive([]);
const getRouters = () => {
  let routes = router.options.routes[2].children;
  if (store.auth == 0) {
    routes.forEach((el) => {
      if (el.name == "user") {
        routerInfo.push(el);
      }
    });
  } else {
    routes.forEach((el) => {
      if (el.hasOwnProperty("name") && el.name !== "user") {
        routerInfo.push(el);
      }
    });
  }
};

function init() {
  getRouters();
}

init();

//登出
const handleLogout = () => {
  const token = getToken();
  removeToken();
  store.navList = {};
  logout(token);
  router.push({
    name: "Login",
  });
};
</script>

<style scoped>
.header-box {
  width: 100vw;
  height: 225px;
  background-color: #7b62ff;
  border-radius: 0 0 20% 20%;
  padding: 40px 40px 0 40px;
  color: #fff;
}
.title {
  font-size: xx-large;
}

.logout {
  position: fixed;
  right: 1vw;
  top: 0.5vw;
}


.global-search-input {
  width: 400px;
}

/* 菜单栏样式 */
.navbar {
  width: 60vw;
  position: absolute;
  bottom: 0;
  left: calc(50% - 30vw);
}

.navbar li {
  padding: 0 40px;
}

.el-menu--horizontal {
  border-bottom: none;
}

.el-menu {
  background-color: transparent;
}

.el-menu-item {
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 5px 5px 0 0;
  color: #fff;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #fab6b6;
  color: #fab6b6 !important;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  outline: 0;
  color: #7b62ff;
  background-color: #f8f7ff;
}
</style>

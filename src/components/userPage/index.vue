<template>
  <!-- 搜索栏 -->
  <div>
    <el-input
      v-model="searchInput"
      placeholder="please input user name"
      class="pic-search-input"
      size="large"
    >
      <template #append>
        <el-button icon="Search" />
      </template>
    </el-input>

    <el-button
      icon="Edit"
      size="large"
      circle
      @click="isEdit = !isEdit"
      type="warning"
    ></el-button>
  </div>

  <el-container class="main-box">
    <el-aside width="200px">
      <div
        class="scrollbar-demo-item addgroup-button"
        v-if="!store.auth"
        @click="addGroup"
      >
        + add Group
      </div>
      <el-scrollbar max-height="400px">
        <div
          v-for="item in groupList"
          :key="item.id"
          class="scrollbar-demo-item"
          :class="{ 'scrollbar-item-active': groupSelect == item.id }"
          @click="selGroup(item.id)"
        >
          {{ item.name }}
          <div class="file-operation" v-show="isEdit">
            <el-button
              icon="CloseBold"
              size="small"
              type="danger"
              @click="delGroup(item)"
              circle
            ></el-button>
          </div>
        </div>
      </el-scrollbar>
    </el-aside>

    <el-main>
      <el-button @click="addUser">add</el-button>
      <el-table :data="userList.classify(groupSelect)" style="width: 80%">
        <el-table-column label="ID" width="120">
          <template #default="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" width="180">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Group" width="150">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>GroupName: {{ scope.row.groupName }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.groupName }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteUser(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <!-- 弹窗 -->
  <AddPopups v-if="popupsVisible == 'addGroup'" @handleClose="handleClose"></AddPopups>
  <DelPopups
    v-if="popupsVisible == 'delGroup'"
    :groupInfo="groupInfo"
    @handleClose="handleClose"
  ></DelPopups>
  <EditMenPopups
    v-if="popupsVisible == 'editUser'"
    :libraryId="groupSelect"
    :userId="userId"
    @handleClose="handleClose"
  >
  </EditMenPopups>
  <AddMenPopups
    v-if="popupsVisible == 'addUser'"
    :libraryId="groupSelect"
    @receiveUser="receiveUser"
    @handleClose="handleClose"
  >
  </AddMenPopups>
</template>

<script setup>
import { ref, reactive, computed, inject } from "vue";
import AddPopups from "./addPopups.vue";
import AddMenPopups from "./addMenPopups.vue";
import DelPopups from "./delPopups.vue";
import EditMenPopups from "./editMenPopups.vue";
import { listUsers, delUser } from "@/api/user";
import { getSonFile } from "@/api/file";
import { store } from "@/store.js";
import { ElMessage } from "element-plus";

//是否编辑
const isEdit = ref(false);

//搜索框
const searchInput = ref("");

//小组选择
const groupSelect = ref(0);

//弹窗控制
const popupsVisible = ref("");

//用来传递的组信息
const groupInfo = reactive({});

//用来传递的用户id
const userId = ref(0);

//关闭弹窗
const handleClose = (visibleValue) => {
  popupsVisible.value = "";
  if (visibleValue == "update") {
    init();
  }
};

//用户列表
const userList = reactive([]);
//获取用户列表
const getAllUser = () => {
  userList.length = 0;
  return groupList.forEach((element) => {
    let param = {
      libraryId: element.id,
      pageNum: 1,
      pageSize: 10,
    };
    let groupName = element.name;
    listUsers(param).then((res) => {
      let list = res.data.data.list;
      list.forEach((element) => {
        let listItem = {
          id: element.id,
          name: element.userName,
          groupId: param.libraryId,
          groupName: groupName,
        };
        userList.push(listItem);
      });
    });
  });
};

//用戶分类
userList.classify = computed(() => {
  return function (groupSelect) {
    if (searchInput.value == "") {
      return userList.filter((el) => el.groupId == groupSelect);
    } else {
      groupSelect = -1;
      return userList.filter((el) => el.name.includes(searchInput.value));
    }
  };
});
//添加成员
const addUser = () => {
  popupsVisible.value = "addUser";
};
//接收添加了的成员
const receiveUser = (men) => {
  popupsVisible.value = "";
  let listItem = {
    id: men.userId,
    name: men.account,
    groupId: men.libraryId,
  };
  groupList.forEach((el) => {
    if ((el.id == listItem.groupId)) {
      listItem.groupName = el.name;
    }
  });
  userList.push(listItem);
};
//修改成员密码
const editUser = (index, row) => {
  userId.value = row.id;
  popupsVisible.value = "editUser";
};
//删除成员
const deleteUser = (index, row) => {
  let param = {
    userId: row.id,
  };
  delUser(param)
    .then((res) => {
      ElMessage.success("delete success");
      userList.forEach( (element,index) => {
        if( element.id == row.id){
          userList.splice(index,1);
        }
      })
    })
    .catch((err) => ElMessage.success("delete failed:" + err));
};

//组信息
const groupList = reactive([]);
//超级管理员获取全部组
const getAllGroup = () => {
  groupList.length = 0;
  let params = {
    parentId: store.libraryId,
    pageNum: 1,
    pageSize: 50,
  };
  return getSonFile(params).then((res) => {
    let data = res.data.data.list;
    data.forEach((el, index) => {
      if (index == 0) {
        groupSelect.value = el.id;
      }
      let groupItem = {
        id: el.id,
        name: el.fileName,
      };
      groupList.push(groupItem);
    });
  });
};
//添加小组
const addGroup = () => {
  popupsVisible.value = "addGroup";
};
//选择小组
const selGroup = (id) => {
  groupSelect.value = id;
};
//删除小组
const delGroup = (group) => {
  const groupJson = JSON.parse(JSON.stringify(group));
  groupInfo.id = groupJson.id;
  groupInfo.name = groupJson.name;
  popupsVisible.value = "delGroup";
};

//初始化操作
async function init() {
  const v1 = await getAllGroup();
  const v2 = await getAllUser();
}
init();
</script>

<style scoped>
.el-aside {
  overflow: hidden;
  margin-top: 20px;
}

.table-title {
  font-size: xx-large;
}

.el-aside {
  margin-top: 10px;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 5px;
  background: #edeaff;
  color: #7b62ff;
}

.scrollbar-demo-item:hover {
  cursor: pointer;
}

.scrollbar-item-active {
  background-color: #7b62ff;
  color: #fff;
}

.addgroup-button {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  border: 1px dashed var(--el-color-danger);
}

.el-table--border .el-table__inner-wrapper::after,
.el-table--border::after,
.el-table--border::before,
.el-table__inner-wrapper::before {
  z-index: 1;
}
.file-operation {
  position: absolute;
  right: -9px;
  top: -10px;
}
</style>

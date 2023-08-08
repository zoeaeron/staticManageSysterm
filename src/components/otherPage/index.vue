<template>
  <!-- 搜索栏 -->
  <div class="flex-col-center">
    <el-input
      v-model="searchInput"
      placeholder="Please input"
      class="input-with-select pic-search-input"
      size="large"
      clearable
    >
      <template #append>
        <el-button icon="Search" />
      </template>
    </el-input>

    <el-button
      icon="Plus"
      size="large"
      circle
      type="success"
      @click="handleOpen('addDir')"
    ></el-button>

    <el-popover placement="top" :width="250">
      <div class="upload-button">
        <el-button  @click="handleOpen('upFile')">upload files </el-button>
        <el-button  type="primary" @click="handleOpen('upFolder')"
          >upload folder</el-button
        >
      </div>
      <template #reference>
        <el-button icon="UploadFilled" size="large" circle type="primary"></el-button>
      </template>
    </el-popover>

    <el-button
      icon="Edit"
      size="large"
      circle
      @click="isEdit = !isEdit"
      type="warning"
    ></el-button>

    <AddDirPopups
      v-if="popupsVisible == 'addDir'"
      :currDirId="currDirId"
      @handleClose="handleClose"
    ></AddDirPopups>
    <UploadFolderPopups
      v-if="popupsVisible == 'upFolder'"
      :currDirId="currDirId"
      @handleClose="handleClose"
    ></UploadFolderPopups>
    <UploadFilePopups
      v-if="popupsVisible == 'upFile'"
      :currDirId="currDirId"
      @handleClose="handleClose"
    ></UploadFilePopups>
  </div>

  <!-- 面包屑导航 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="(file, index) in breadcrumb"
        :key="file.id"
        @click="goBack(index, file.id)"
        >{{ file.fileName }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>

  <!-- 文件展示 -->
  <div class="wrap-layout main-box" v-if="fileList">
    <div
      class="file-box border-with-radius"
      v-for="file in fileList"
      :key="file.id"
      @click="getSubFile(file)"
    >
      <a class="file-icon" :href="file.fileLink">
        <svg-icon class="svg-icon" :icon-class="file.iconClass"></svg-icon>
      </a>

      <div class="file-operation" v-show="isEdit" @click.stop="">
        <el-button
          icon="CloseBold"
          type="danger"
          @click="deltFile(file)"
          circle
        ></el-button>
      </div>
      <el-popover trigger="hover" :content="file.fileName" :width="230">
        <template #reference>
          <div class="file-desp">
            <div class="file-name">{{ file.fileName }}</div>
          </div>
        </template>
        <div class="file-desp">
            <div class="file-name">name: {{ file.fileName }}</div>
            <div class="file-name">description: {{ file.fileDesc }}</div>
            <div class="file-name">createTime: {{ file.gmtCreate }}</div>
        </div>
      </el-popover>
    </div>
  </div>

  <!-- 分页器 -->
  <div class="flex-row-center">
    <el-pagination
      background
      v-model:current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      layout="prev, pager, next"
      :total="pageInfo.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { getSonFile, delFile, listByName } from "@/api/file";
import { ElMessage, ElMessageBox } from "element-plus";
import { store } from "@/store.js";
import AddDirPopups from "../shared/addDirPopups.vue";
import UploadFolderPopups from "../shared/uploadFolderPopups.vue";
import UploadFilePopups from "../shared/uploadFilePopups.vue";

//是否编辑
const isEdit = ref("");
//搜索输入
const searchInput = ref("");
//监听搜索框
watch(searchInput, (newValue, oldValue) => {
  if (newValue !== "") {
    getFilesByName(newValue);
  } else {
    getFiles(currDirId.value);
  }
});
//弹窗控制
const popupsVisible = ref("");
//关闭弹窗
const handleClose = (value) => {
  popupsVisible.value = "";
  if (value == "update") {
    getFiles(currDirId.value);
  }
};
//打开弹窗
const handleOpen = (visibleValue) => {
  popupsVisible.value = visibleValue;
};
//目录id
const catalogId = store.navList["uiFrame"];
//当前目录的id
const currDirId = ref(catalogId);
//文件信息
const fileList = reactive([]);
//文件层级信息
const breadcrumb = reactive([]);
//分页查询信息
const pageInfo = reactive({
  total: 10,
  pageNum: 1,
  pageSize: 32,
});
//翻页
const handleCurrentChange = (value) => {
  pageInfo.pageNum = value;
  if (searchInput.value == "") {
    getFiles(currDirId.value);
  } else {
    getFilesByName(searchInput.value);
  }
};

//删除文件
const deltFile = (file) => {
    ElMessageBox.confirm("proxy will permanently delete the file. Continue?", "Warning", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    })
      .then(() => {
        let param = { id: file.id };
        delFile(param)
          .then((res) => {
            if (res.data.code == 1) {
              ElMessage.success("delete completed");
            }else{
              ElMessage.error("systerm error,please try again later...")
            }
            getFiles(currDirId.value);
          })
          .catch((err) => ElMessage.error("delete failed:" + err));
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "Delete canceled",
        });
      });

};
//获取文件
const getFiles = (parentId) => {
  let params = {
    parentId: parentId,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    orderBy: 'gmtCreate'
  };
  return getSonFile(params)
    .then((res) => {
      fileList.length = 0;
      let data = res.data.data.list;
      pageInfo.total = res.data.data.total;
      handleFiles(data);
    })
    .catch((err) => console.log("Faild to get files:" + err));
};
//模糊查询文件
const getFilesByName = (key) => {
  fileList.length = 0;
  let params = {
    fileName: key,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    parentId: currDirId.value,
  };
  listByName(params)
    .then((res) => {
      let data = res.data.data.list;
      handleFiles(data);
    })
    .catch((err) => console.log("search error:" + err));
};
//处理获取的文件
const handleFiles = (data) => {
  if (data.length == 0) {
    return;
  }
  data.forEach((element) => {
    let fileItem = element;
    if (fileItem.fileLink == null || fileItem.fileLink == "") {
      delete fileItem.fileLink;
    }

    if (fileItem.fileType == null || fileItem.fileType == 3) {
      fileItem.iconClass = "folder";
    }
    if (fileItem.fileType == 4) {
      switch (fileItem.fileSuffix) {
        case ".js":
          fileItem.iconClass = "JS";
          break;
        case ".css":
          fileItem.iconClass = "CSS";
          break;
        case ".html":
          fileItem.iconClass = "HTML";
          break;
        default:
          fileItem.iconClass = "file";
          break;
      }
    }
    fileList.push(fileItem);
  });
};
//点击进入文件
const getSubFile = (file) => {
  if (file.fileType == 4) {
    return;
  }
  //往面包屑增加
  breadcrumb.push(file);
  //当前文件夹id
  currDirId.value = file.id;
  getFiles(file.id);
  return false;
};
//点击面包屑回退文件
const goBack = (index, fileId) => {
  breadcrumb.splice(index + 1, breadcrumb.length - index - 1);
  //当前文件夹id
  currDirId.value = fileId;
  getFiles(fileId);
};

//初始化
const init = () => {
  let rootFile = {
    id: catalogId,
    fileName: "root",
  };
  breadcrumb.push(rootFile);
  getFiles(catalogId);
};

init();
</script>

<style>
span.el-breadcrumb__inner {
  cursor: pointer !important;
}
</style>

<style scoped>
.upload-button {
  display: flex;
}
a {
  text-decoration: none;
}
.file-name {
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.file-operation {
  position: absolute;
  top: -8px;
  right: -8px;
}
.border-with-radius {
  border: none;
}
.svg-icon {
  width: 5em;
  height: 5em;
}
.breadcrumb {
  margin: 10px 20px;
}
.page-box {
  position: fixed;
  display: fix;
  bottom: 10px;
  left: calc(50% - 50px);
}
</style>

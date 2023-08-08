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
      icon="UploadFilled"
      size="large"
      circle
      type="primary"
      @click="upFile"
    ></el-button>
    <el-button
      icon="Edit"
      size="large"
      circle
      @click="isEdit = !isEdit"
      type="warning"
    ></el-button>

    <uploadPopups
      v-if="popupsVisible == 'upload'"
      :catalogId="catalogId"
      @handleClose="handleClose"
    ></uploadPopups>
  </div>

  <!-- 文件展示 -->
  <div class="wrap-layout main-box" v-if="files">
    <div
      class="font-box border-with-radius"
      v-for="file in files"
      :key="file.id"
    >
      <a :href="file.fileLink" class="file-icon">
        <svg-icon class="svg-icon" :icon-class="file.iconClass"></svg-icon>
        <div class="file-desp">
          <div class="file-name">{{ file.fileName }}</div>
        </div>
      </a>
      <div class="file-operation" v-show="isEdit" @click.stop="">
        <el-button
          icon="CloseBold"
          type="danger"
          @click.stop="deleteFile(file.id)"
          circle
        ></el-button>
      </div>
      <div class="file-display">
        <h1 :style="{ fontFamily: file.fontStyle }">
          字体样式<br />aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ<br />0123456789
        </h1>
      </div>
    </div>
  </div>

  <!-- 分页器 -->
  <div class="flex-row-center page-box">
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
import { ElMessage } from "element-plus";
import { store } from "@/store.js";
import uploadPopups from "./uploadPopups.vue";

//是否编辑
const isEdit = ref("");
//搜索框
const searchInput = ref("");
//监听搜索框
watch(searchInput, (newValue, oldValue) => {
  init();
});
//弹窗控制
const popupsVisible = ref("");
//关闭弹窗
const handleClose = () => {
  popupsVisible.value = "";
  getFiles(catalogId);
};
//目录id
const catalogId = store.navList["font"];

//分页查询信息
const pageInfo = reactive({
  total: 10,
  pageNum: 1,
  pageSize: 9,
});
//翻页
const handleCurrentChange = (value) => {
  pageInfo.pageNum = value;
  if (searchInput.value == "") {
    getFiles();
  } else {
    getFilesByName(searchInput.value);
  }
};

//文件信息
const files = reactive([]);
//上传文件
const upFile = () => {
  popupsVisible.value = "upload";
};
//删除文件
const deleteFile = (id) => {
  let param = { id: id };
  delFile(param)
    .then(() => {
      ElMessage.success("delete success");
      handleClose();
    })
    .catch((err) => ElMessage.error("delete failed:" + err));
};
//获取文件
const getFiles = () => {
  files.length = 0;
  let params = {
    parentId: catalogId,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
  };
  return getSonFile(params)
    .then((res) => {
      let data = res.data.data.list;
      pageInfo.total = res.data.data.total;
      handleFiles(data);
    })
    .catch((err) => console.log("fail to get files" + err));
};
//处理获取的文件
const handleFiles = (data) => {
  if (data.length == 0) {
    return;
  }
  data.forEach((element) => {
    let fileItem = element;
    fileItem.iconClass = "file";

    //截取字体名称
    let fontName = fileItem.fileName;
    let index = fontName.indexOf(".");
    fontName = fontName.slice(0, index);
    fileItem.fontStyle = fontName;

    //加入字体规则font-face
    let styleSheets = document.styleSheets;
    let styleSheet = styleSheets[styleSheets.length - 1];
    styleSheet.insertRule(`@font-face{
            font-family: ${fontName} ;
            src: url('${fileItem.fileLink}');
        }`);
    files.push(fileItem);
  });
};
//模糊查询文件
const getFilesByName = (key) => {
  files.length = 0;
  let params = {
    fileName: key,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    parentId: catalogId,
  };
  listByName(params)
    .then((res) => {
      let data = res.data.data.list;
      console.log(data);
      handleFiles(data);
    })
    .catch((err) => console.log("search error" + err));
};

//初始化
const init = () => {
  if (searchInput.value !== "") {
    getFilesByName(searchInput.value);
  } else {
    getFiles();
  }
};

init();
</script>

<style scoped>
a {
  text-decoration: none;
}
.file-operation {
  position: absolute;
  top: 10px;
  right: 10px;
}
.file-name {
  color: black;
}
.file-icon {
  width: 150px;
  text-align: center;
}
.svg-icon {
  width: 5em;
  height: 5em;
}
.file-display {
  color: black;
  margin: 0 20px;
  padding: 0 20px;
  border-left: 1px dashed #c7c7c7;
}
</style>

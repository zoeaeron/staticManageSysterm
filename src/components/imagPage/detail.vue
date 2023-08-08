<template>
  <!-- 搜索栏 -->
  <div class="flex-col-center">
    <el-icon class="return-icon" :size="25" @click="goBack">
      <Back />
    </el-icon>
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
      type="primary"
      size="large"
      circle
      @click="handleOpen('upload')"
    ></el-button>
    <el-button
      icon="Edit"
      size="large"
      circle
      @click="isEdit = !isEdit"
      type="warning"
    ></el-button>
  </div>

  <!-- 图片集展示 -->
  <el-tag class="ml-2 collection-name" size="large">{{ colName }}</el-tag>
  <div class="main-box waterFall">
    <div class="column" v-for="(picol, i) in showPicList.classify(searchInput)" :key="i">
      <div class="image-box border-with-radius" v-for="image in picol" :key="image.id">
        <div class="file-operation" v-show="isEdit" @click.stop="">
          <el-button
            icon="Edit"
            @click="handleOpen('edit', image)"
            type="success"
            circle
          ></el-button>
          <el-button
            icon="Switch"
            type="warning"
            @click="handleOpen('move', image)"
            circle
          ></el-button>
          <el-button
            icon="CloseBold"
            type="danger"
            @click="delImage(image.id)"
            circle
          ></el-button>
        </div>
        <div class="image-show" @click="showPic(image)">
          <img v-if="image.type == 'image'" :src="image.url" alt="" />
          <video
            class="video-box"
            v-if="image.type == 'video'"
            controls="controls"
            x-webkit-airplay="true"
            webkit-playsinline="true"
            muted=""
          >
            <source :src="image.url" type="video/mp4" />
          </video>
        </div>
        <div class="image-desp">
          <div class="image-name">{{ image.name }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 点击图片弹窗 -->
  <el-dialog
    class="pic-dialog"
    style="text-align: center; background-color: #404040"
    v-model="dialogVisible"
    :before-close="handleClose"
  >
    <img v-if="picInfo.type == 'image'" :src="picInfo.url" alt="" />
    <video
      class="video-box"
      v-if="picInfo.type == 'video'"
      controls="controls"
      x-webkit-airplay="true"
      webkit-playsinline="true"
      muted=""
    >
      <source :src="picInfo.url" />
    </video>
  </el-dialog>

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

  <!-- 弹窗 -->
  <uploadPopus
    v-if="popupsVisible == 'upload'"
    :currDirId="parseInt(colId)"
    @handleClose="handleClose"
  ></uploadPopus>
  <EditPopups
    v-if="popupsVisible == 'edit'"
    :picInfo="picInfo"
    @handleClose="handleClose"
  ></EditPopups>
  <MovePopups
    v-if="popupsVisible == 'move'"
    :picInfo="picInfo"
    @handleClose="handleClose"
  >
  </MovePopups>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSonFile, delFile } from "@/api/file";
import { ElMessage } from "element-plus";
import { store } from "@/store.js";
import uploadPopus from "../shared/uploadFilePopups.vue";
import EditPopups from "./editPopups.vue";
import MovePopups from "./movePopups.vue";

//是否编辑
const isEdit = ref(false);
//搜索框
const searchInput = ref("");
//弹窗控制
const popupsVisible = ref("");
const dialogVisible = ref(false);
const showPic = (pic) => {
  dialogVisible.value = true;
  picInfo.url = pic.url;
  picInfo.type = pic.type;
};
//关闭弹窗
const handleClose = (value) => {
  popupsVisible.value = "";
  dialogVisible.value = false;
  if (value == "update") {
    getPicList();
  }
};
//弹窗打开
const handleOpen = (visibleValue, image) => {
  if (image !== undefined) {
    picInfo.id = image.id;
    picInfo.name = image.name;
  }
  popupsVisible.value = visibleValue;
};

//获取路由参数
const route = useRoute();
const colId = route.query.colId; //图片集id
const colName = route.query.colName; //图片集名字
const catalogId = store.navList["image"]; //目录id

//分页查询信息
const pageInfo = reactive({
  total: 10,
  pageNum: 1,
  pageSize: 12,
});
//翻页
const handleCurrentChange = (value) => {
  pageInfo.pageNum = value;
  getPicList();
};

//返回上一页
const router = useRouter();
const goBack = () => {
  router.go(-1);
};

// 图片信息
const picList = reactive([]);
const getPicList = () => {
  picList.length = 0;
  let params = {
    parentId: colId,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    orderBy: "fileName",
  };
  getSonFile(params).then(function (res) {
    //加载图片
    let data = res.data.data.list;
    pageInfo.total = res.data.data.total;
    data.forEach((element) => {
      let picItem = {
        id: element.id,
        name: element.fileName,
        url: element.fileLink,
      };
      if (
        element.fileSuffix.includes("avi") ||
        element.fileSuffix.includes("AVI") ||
        element.fileSuffix.includes("mp4") ||
        element.fileSuffix.includes("MP4") ||
        element.fileSuffix.includes("flv") ||
        element.fileSuffix.includes("FLV") ||
        element.fileSuffix.includes("mov") ||
        element.fileSuffix.includes("MOV") ||
        element.fileSuffix.includes("mpg") ||
        element.fileSuffix.includes("MPG") ||
        element.fileSuffix.includes("mpeg") ||
        element.fileSuffix.includes("MPEG") ||
        element.fileSuffix.includes("rm") ||
        element.fileSuffix.includes("RM") ||
        element.fileSuffix.includes("rmvb") ||
        element.fileSuffix.includes("RMBV") ||
        element.fileSuffix.includes("wma") ||
        element.fileSuffix.includes("WMA")
      ) {
        picItem.type = "video";
        
      } else {
        picItem.type = "image";
      }
      picList.push(picItem);
    });
    handlePicList(picList);
  });
};

//瀑布流排序
let showPicList = reactive([]);
const handlePicList = (data) => {
  showPicList.length = 0;
  let columnCount = 3;
  //每列
  for (let i = 0; i < columnCount; i++) {
    showPicList.push([]);
  }
  //每行
  for (let i = 0; i < data.length; i++) {
    showPicList[i % 3].push(data[i]);
  }
};

//图片的相关信息
const picInfo = reactive({
  id: 0,
  name: "",
  colId: colId,
  url: "",
  type: "", // video or image or other
  catalogId: catalogId,
});

//图片搜索
showPicList.classify = computed(() => {
  return function (key) {
    if (key == undefined) {
      return showPicList;
    } else {
      let picListTemp = JSON.parse(JSON.stringify(showPicList));
      for (let i = 0; i < 3; i++) {
        let piCol = picListTemp[i];
        if (piCol) {
          let picSel = piCol.filter((el) => el.name.includes(key));
          picListTemp[i] = picSel;
        }
      }
      return picListTemp;
    }
  };
});

//删除图片
const delImage = (fileId) => {
  let param = { id: fileId };
  delFile(param)
    .then((res) => {
      ElMessage.success("delete success");
      getPicList();
    })
    .catch((err) => ElMessage.error("delete failed:" + err));
};

const init = () => {
  //加载图片
  getPicList();
};

init();
</script>

<style scoped>
.svg-icon {
  width: 5em;
  height: 5em;
}
.file-icon {
  width: 150px;
  text-align: center;
}
a {
  text-decoration: none;
  color: black;
}
.image-show {
  max-width: 300px;
  height: fit-content;
}
.el-dialog__body {
  text-align: center !important;
}
.pic-dialog img {
  max-width: 100%;
  max-height: 100%;
  background-position: 0 0, 5px 5px !important;
  background-size: 10px 10px !important;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%) !important;
}
.collection-name {
  margin: 0 20px;
}
.image-show img {
  width: 100%;
  height: 100%;
  background-position: 0 0, 5px 5px !important;
  background-size: 10px 10px !important;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%) !important;
}
video {
  width: 100%;
  height: 100%;
}
.return-icon:hover {
  cursor: pointer;
}
</style>

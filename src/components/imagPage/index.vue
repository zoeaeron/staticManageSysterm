<template>
  <!-- 搜索栏 -->
  <div>
    <el-input
      v-model="searchInput"
      placeholder="Please input"
      class="input-with-select pic-search-input"
      size="large"
      clearable
    >
      <template #prepend>
        <el-select
          v-model="typeSelect"
          placeholder="all"
          style="width: 100px"
          size="large"
        >
          <el-option label="all" value="all" />
          <el-option label="public" value="public" />
          <el-option label="project" value="project" />
        </el-select>
      </template>
      <template #append>
        <el-button icon="Search" />
      </template>
    </el-input>

    <el-button
      icon="Plus"
      type="success"
      size="large"
      circle
      @click="handleOpen('addDir')"
    ></el-button>
    <el-button
      icon="Edit"
      size="large"
      circle
      @click="isEdit = !isEdit"
      type="warning"
    ></el-button>

    <AddPopups v-if="popupsVisible == 'addDir'" @handleClose="handleClose"></AddPopups>
  </div>

  <!-- 图片集展示 -->
  <div class="wrap-layout main-box">
    <div
      class="collection-box border-with-radius"
      v-for="collection in collectionList.classify(typeSelect)"
      :key="collection.id"
      @click="goDetail(collection.id, collection.name)"
    >
      <div class="file-operation" v-show="isEdit" @click.stop="">
        <el-button
          icon="CloseBold"
          type="danger"
          @click="handleOpen('del',collection)"
          circle
        ></el-button>
        <DelPopups
          v-if="popupsVisible == 'del'"
          :coInfo="coInfo"
          @handleClose="handleClose"
        ></DelPopups>
      </div>
      <ul class="wrap-layout" v-if="collection.pictures">
        <li
          class="collection-item"
          v-for="picture in collection.pictures"
          :key="picture.id"
        >
          <img :src="picture.imgUrl" alt="" />
        </li>
      </ul>
      <div class="collection-desp">
        <div class="collection-name">name: {{ collection.name }}</div>
        <div class="collection-name">type: {{ collection.type }}</div>
        <div class="collection-name">createTime: {{ collection.time }}</div>
      </div>
    </div>
  </div>

  <!-- 分页器 -->
  <div class="flex-row-center page-box">
    <el-pagination
      background
      v-model:current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      :total="pageInfo.total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getSonFile, listByName } from "@/api/file";
import { store } from "@/store.js";
import DelPopups from "./delPopups.vue";
import AddPopups from "./addPopups.vue";

//获取目录id
const catalogId = store.navList["image"];
//弹窗控制
const popupsVisible = ref("");
//是否编辑
const isEdit = ref(false);
//关闭弹窗
const handleClose = (visibleValue) => {
  popupsVisible.value = "";
  if (visibleValue == "update") {
    init();
  }
};
//弹窗打开
const handleOpen = (visibleValue, collection) => {
  if (visibleValue == "del") {
    const coJson = JSON.parse(JSON.stringify(collection));
    coInfo.id = coJson.id;
    coInfo.name = coJson.name;
    coInfo.type = coJson.type;
  }
  if (visibleValue == "addDir") {
    coInfo.type = 3;
  }
  popupsVisible.value = visibleValue;
  
};

//集合列表
const collectionList = reactive([]);
//集合信息
const coInfo = reactive({
  id: 0,
  name: "",
  type: "",
});
//分页信息
const pageInfo = reactive({
  total: 10,
  pageNum: 1,
  pageSize: 9,
});
//翻页
const handleCurrentChange = (value) => {
  pageInfo.pageNum = value;
  init();
};
//获取集合列表
const getCollection = () => {
  collectionList.length = 0;
  let params = {
    parentId: catalogId,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
  };
  return getSonFile(params)
    .then(function (res) {
      let data = res.data.data.list;
      pageInfo.total = res.data.data.total;
      for (let i = 0; i < data.length; i++) {
        let collectionItem = {
          id: data[i].id,
          name: data[i].fileName,
          type: data[i].fileDesc,
          time: data[i].gmtCreate
        };
        collectionList.push(collectionItem);
      }
    })
    .catch((err) => console.log("loading collection error:" + err));
};
//获取图片信息
const getPicture = (index, coId) => {
  let params = {
    parentId: coId,
    pageNum: 1,
    pageSize: 6,
  };
  return getSonFile(params)
    .then(function (res) {
      let data = res.data.data.list;
      if (data.length == 0) {
        return;
      }
      let picturesInfo = [];
      for (let i = 0; i < 6; i++) {
        const element = data[i];
        if (!element) continue;
        let picItem = {
          id: element.id,
          name: element.fileName,
          imgUrl: element.fileLink,
        };
        picturesInfo.unshift(picItem);
      }
      collectionList[index].pictures = picturesInfo;
    })
    .catch((err) => console.log("loading pictures error:" + err));
};


//搜索输入
const typeSelect = ref("");
const searchInput = ref("");
//监听搜索框
watch(searchInput, (newValue, oldValue) => {
  init();
});
//集合按名字查询
const getColByName = (key) => {
  collectionList.length = 0;
  let params = {
    fileName: key,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    parentId: catalogId,
  };
  return listByName(params)
    .then((res) => {
      let data = res.data.data.list;
      pageInfo.total = res.data.data.total;
      for (let i = 0; i < data.length; i++) {
        let collectionItem = {
          id: data[i].id,
          name: data[i].fileName,
          type: data[i].fileDesc,
        };
        collectionList.unshift(collectionItem);
      }
    })
    .catch((err) => console.log("search error:" + err));
};
//集合按分类查询
collectionList.classify = computed(() => {
  return function (typeSelect) {
    if (typeSelect == "project") {
      return collectionList.filter((el) => el.type == "project");
    } else if (typeSelect == "public") {
      return collectionList.filter((el) => el.type == "public");
    } else {
      return collectionList;
    }
  };
});


//跳转到集合详情页
let router = useRouter();
const goDetail = (colId, colName) => {
  router.push({
    path: "/imagDetail",
    query: {
      colId: colId,
      colName: colName,
    },
  });
};

//初始化函数
async function init() {
  if (searchInput.value !== "") {
    const v1 = await getColByName(searchInput.value);
  } else {
    const v1 = await getCollection();
  }
  //proxy对象转object对象
  const colJson = JSON.parse(JSON.stringify(collectionList));
  for (let i = 0; i < colJson.length; i++) {
    const col = colJson[i];
    getPicture(i, col.id);
  }
}

//初始化函数执行
init();
</script>

<style scoped>
.collection-item {
  width: 84px;
  height: 84px;
  list-style-type: none;
  margin: 12.5px;
  border: 1px solid #e8e7e8;
  overflow: hidden;
}

.collection-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collection-desp {
  position: absolute;
  bottom: 15px;
  left: 12.5px;
}
</style>

<template>
  <el-dialog
    :model-value="true"
    title="Edit file information"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="move to">
        <el-select v-model="form.parentId" class="m-2" placeholder="Select">
          <el-option
            v-for="item in collections"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button class="confirm-button" @click="handleConfirm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="EditPopups">
import { reactive } from "vue";
import { moveFile, getSonFile, updateFile } from "@/api/file";
import { ElMessage } from "element-plus";

const emits = defineEmits(["handleClose"]);
const handleClose = (value) => {
  emits("handleClose", value);
};
//接受图库的基本信息
const props = defineProps({
  picInfo: Object,
});
//表单信息
const form = reactive({
  fileId: props.picInfo.id,
  parentId: null,
});

//获取集合列表
const collections = reactive([]);
const getCollection = (catalogId) => {
  let params = {
    parentId: catalogId,
    pageNum: 1,
    pageSize: 50,
  };
  return getSonFile(params)
    .then(function (res) {
      let data = res.data.data.list;
      for (let i = 0; i < data.length; i++) {
        if( data[i].id == props.picInfo.colId){
          continue;
        }
        let collectionItem = {
          id: data[i].id,
          name: data[i].fileName,
        };
        collections.unshift(collectionItem);
      }
    })
    .catch((err) => console.log("fail to load collection:" + err));
};
getCollection(props.picInfo.catalogId);

//提交操作
const handleConfirm = () => {
  if( form.parentId ){
    ElMessage.error("The information is incomplete！");
    return;
  }
  let param = JSON.parse(JSON.stringify(form));
  if (param.parentId !== null) {
    moveFile(param)
      .then(function (res) {
        ElMessage.success("move success");
        handleClose("update");
      })
      .catch((err) => ElMessage.error("move failed:" + err));
  }
};
</script>

<style></style>

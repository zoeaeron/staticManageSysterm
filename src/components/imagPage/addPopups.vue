<template>
  <!-- 添加图库 -->
  <el-dialog :model-value="true" title="Create collection" width="30%" :before-close="handleClose">
    <el-form :model="form">
      <el-form-item label="collection name">
        <el-input v-model="form.dirName" />
      </el-form-item>
      <el-form-item label="collection type">
        <el-select v-model="form.fileDesc" placeholder="please select type">
          <el-option label="public" value="public" />
          <el-option label="project" value="project" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button class="confirm-button" @click="handleAdd"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup name="AddPopups">
import { reactive } from "vue";
import { createDir } from "@/api/file";
import { ElMessage } from "element-plus";
import { store } from "@/store.js"

const emits = defineEmits(["handleClose"]);
const handleClose = (value) => {
  emits("handleClose", value);
};

//目录id
const catalogId = store.navList['image'];

//添加图库
const handleAdd = () => {
  if( form.dirName == "" || form.fileDesc == ""){
    ElMessage.error("The information is incomplete！");
    return;
  }
  const params = JSON.parse(JSON.stringify(form));
  createDir(params).then( (res) => {
    if( res.data.code == 1){
      ElMessage.success("create success");
      handleClose('update');
    }else{
      ElMessage.error("create failed:"+res.data.msg);
    }
  }).catch( (err) => ElMessage.error("create failed:"+err))
}

const form = reactive({
  dirName: "",
  fileDesc: "",
  parentId: parseInt(catalogId),
  type: 3
});
</script>

<style>

</style>
<template>
  <!-- 添加文件夹 -->
  <el-dialog
    :model-value="true"
    title="Create folder"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="folder name">
        <el-input v-model="form.dirName" />
      </el-form-item>
      <el-form-item label="folder description">
      <el-input v-model="form.fileDesc" type="textarea" />
    </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button class="confirm-button" @click="handleSubmit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="AddDirPopups">
import { reactive } from "vue";
import { createDir } from "@/api/file";
import { ElMessage } from "element-plus";

const emits = defineEmits(["handleClose"]);
const handleClose = (value) => {
  emits("handleClose", value);
};

//目录id
const props = defineProps({
    currDirId:Number
})

//提交表单
const handleSubmit = () => {
  if( form.dirName == "" || form.fileDesc == ""){
    ElMessage.error("The information is incomplete！");
    return;
  }
  const params = JSON.parse(JSON.stringify(form));
  createDir(params)
    .then((res) => {
      if( res.data.code == 1){
        ElMessage.success("create success");
        handleClose('update');
      }else{
        ElMessage.error("folder already exist!")
      }
    })
    .catch((err) => ElMessage.error("create failed:" + err));
};

//表单信息
const form = reactive({
  dirName: "",
  fileDesc: "",
  parentId: props.currDirId,
  type: 3,
});
</script>

<style></style>

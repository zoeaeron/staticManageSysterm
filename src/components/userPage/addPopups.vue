<template>
  <!-- 添加组库 -->
  <el-dialog :model-value="true" title="Add Group" width="30%" :before-close="handleClose">
    <el-form :model="form">
      <el-form-item label="group name">
        <el-input v-model="form.dirName" />
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

<script setup name="AddPopups">
import { reactive } from "vue";
import { createDir } from "@/api/file";
import { ElMessage } from "element-plus";

const emits = defineEmits(["handleClose"]);
const handleClose = (value) => {
  emits("handleClose", value);
};

//添加小组
const handleConfirm = () => {
  const params = JSON.parse(JSON.stringify(form));
  if (params.dirName == "") {
    ElMessage.error("Invalid input");
    return;
  }
  createDir(params).then( (res) => {
    ElMessage.success("add success");
    handleClose('update');
  }).catch( (err) => ElMessage.error("add failed"+err))
}

const form = reactive({
  dirName: "",
  fileDesc: "",
  parentId: 1,
  type: 1
});


</script>

<style>

</style>
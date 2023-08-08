<template>
  <el-dialog
    :model-value="true"
    title="Edit file information"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="new name:">
        <el-input v-model="form.fileName" placeholder="form.fileName" />
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
import { updateFile } from "@/api/file";
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
  oldFileName: props.picInfo.name,
  fileName: props.picInfo.name,
});

//提交操作
const handleConfirm = () => {
  let param = JSON.parse(JSON.stringify(form));
  if (param.fileName == param.oldFileName || param.fileName == "") {
    ElMessage.error("Invalid input");
  } else {
    updateFile(param)
      .then(function (res) {
        if (res.data.code == 1) {
          ElMessage.success("edit success");
          handleClose("update");
        } else {
          ElMessage.error("edit failed:" + res.data.msg);
        }
      })
      .catch((err) => {
        ElMessage.error("edit failed:" + err);
      });
  }
};
</script>

<style></style>

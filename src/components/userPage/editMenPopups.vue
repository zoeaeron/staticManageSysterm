<template>
  <el-dialog
    :model-value="true"
    title="Edit user password"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="new password:">
        <el-input v-model="form.pwd" placeholder="please input new password" />
      </el-form-item>
      <el-form-item label="confirm password:">
        <el-input v-model="form.pwdAgain" placeholder="please input new password again" />
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

<script setup name="DelPopups">
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { updPwd } from "@/api/user";

const emits = defineEmits(["handleClose"]);
const handleClose = () => {
  emits("handleClose", "");
};

//接受用户id
const props = defineProps({
  userId: Number,
});

const form = reactive({
  pwd: "",
  pwdAgain: "",
});

const handleConfirm = () => {
  if (form.pwd !== form.pwdAgain || form.pwd == "" || form.pwdAgain == "") {
    ElMessage.error("Invalid input");
  } else {
    let param = {
      newPwd: form.pwd,
      userId: props.userId,
    };
    updPwd(param)
      .then(() => {
        ElMessage.success("edit success");
        handleClose();
      })
      .catch((err) => ElMessage.error("edit failed:" + err));
  }
};
</script>

<style></style>

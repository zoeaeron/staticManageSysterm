<template>
  <!-- 添加成员 -->
  <el-dialog
    :model-value="true"
    title="Add member"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="user name">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="user password">
        <el-input v-model="form.userPwd" />
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

<script setup name="AddMenPopups">
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { addUser } from "@/api/user";

const emits = defineEmits(["handleClose", "receiveUser"]);
const handleClose = (value) => {
  emits("handleClose", value);
};

const props = defineProps({
  libraryId: Number,
  receiveMen: Function,
});

const receiveMen = (men) => {
  emits("receiveUser", men);
};

//添加小组成员
const handleConfirm = () => {
  const params = JSON.parse(JSON.stringify(form));
  if (params.userName == "" || params.userPwd == "") {
    ElMessage.error("Invalid input");
    return;
  }
  addUser(params)
    .then((res) => {
      if (res.data.code == 1) {
        ElMessage.success("add success");
        receiveMen(res.data.data);
        handleClose();
      }else{
        ElMessage.error("add failed:" + res.data.msg)
      }
    })
    .catch((err) => ElMessage.error("add failed" + err));
};

const form = reactive({
  libraryId: props.libraryId,
  userName: "",
  userPwd: "",
});
</script>

<style></style>

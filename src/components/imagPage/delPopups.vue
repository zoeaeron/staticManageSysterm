<template>
  <el-dialog :model-value="true" title="Confirm delete?" width="30%" :before-close="handleClose">
    <el-form :model="form">
      <el-form-item label="collection name">
        <el-input v-model="form.name" placeholder="please input the collection name" />
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
import { reactive,ref } from "vue";
import { delFile } from "@/api/file";
import { ElMessage } from "element-plus";

const emits = defineEmits(["handleClose"]);
const handleClose = (value) => {
  emits("handleClose", value);
};

//接受图库的基本信息
const props = defineProps({
  coInfo: Object
})

const form = reactive({
  fileId: props.coInfo.id,
  fileName: props.coInfo.name,
  name:'' //用户输入的图库名
})

const handleConfirm = () => {
  if ( form.name == form.fileName ){
    let param = { id:form.fileId};
    delFile(param).then( () => {
      ElMessage.success("delete success");
      handleClose('update');
    }).catch( err => ElMessage.error("delete failed:"+err));
  }else{
    ElMessage.error("Invalid input")
  }
}
</script>
  
<style>

</style>
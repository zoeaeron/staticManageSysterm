<template>
  <el-dialog
    :model-value="true"
    title="Upload font type files"
    width="30%"
    :before-close="handleClose"
  >
    <el-upload
      class="upload-demo"
      drag
      :auto-upload="false"
      :on-change="onChange"
      :on-remove="onRemove"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip">ttf/woff/woff2/eot/svg files with a size less than 1GB</div>
      </template>
    </el-upload>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button class="confirm-button" @click="upFile"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { uploadFolder } from "@/api/file";

const emits = defineEmits(["handleClose"]);
const handleClose = () => {
  emits("handleClose", "");
};

const props = defineProps({
  catalogId: Number,
});

let files = reactive([]);

const onChange = (file, fileList) => {
  let fileRaw = file.raw;
  let name = fileRaw.name;
  let index = name.indexOf(".");
  let type = name.slice(index + 1);
  if (
    type.toLowerCase() != "eot" &&
    type.toLowerCase() != "svg" &&
    type.toLowerCase() != "woff" &&
    type.toLowerCase() != "woff2" &&
    type.toLowerCase() != "ttf" &&
    type.toUpperCase() != "EOT" &&
    type.toUpperCase() != "SVG" &&
    type.toUpperCase() != "WOFF" &&
    type.toUpperCase() != "WOFF2" &&
    type.toUpperCase() != "TTF"
  ) {
    ElMessage.error("only allow font type files");
    fileList.pop();
  }
  files = fileList;
};

const onRemove = (file, fileList) => {
  files = fileList;
};

const upFile = () => {
  if( files.length == 0){
    ElMessage.error("file is empty");
    return;
  }
  const formData = new FormData();
  formData.append("fileDesc", "");
  formData.append("parentId", props.catalogId);
  for (let i = 0; i < files.length; i++) {
    formData.append("folder", files[i].raw);
  }
  const openMessage = 
  ElMessage({
      message:'uploading...please wait patiently',
      type: 'warning',
      duration: 0      
  })
  return uploadFolder(formData)
    .then(function (res) {
      openMessage.close();
      if (res.data.code === 1) {
        ElMessage.success("upload success");
        handleClose();
      } else {
        ElMessage.error("upload failed:"+res.data.msg);
        return Promise.reject(res.data.msg);
      }
    })
    .catch(function (err) {
      openMessage.close();
      ElMessage.error("upload failed:"+err);
    });
};

</script>

<style>
</style>

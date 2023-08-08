<template>
  <!-- 上传文件 -->
  <el-dialog :model-value="true" title="Upload files" width="30%" :before-close="handleClose">
    <el-upload
      class="upload-demo"
      drag
      :multiple="true"
      :auto-upload="false"
      :on-change="onChange"
      :on-remove="onRemove"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip">files with a size less than 1GB</div>
      </template>
    </el-upload>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button class="confirm-button" @click="handleSubmit"> Submit </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="UploadFilePopups">
import { uploadFolder } from "@/api/file";
import { ElMessage } from "element-plus";
import { reactive } from "vue";

const emits = defineEmits(["handleClose"]);
const handleClose = (value) => {
  emits("handleClose", value);
};

//目录id
const props = defineProps({
  currDirId: Number,
});

let files = reactive([]);

const onChange = (file, fileList) => {
  files = fileList;
};

const onRemove = (file, fileList) => {
  files = fileList;
};

const handleSubmit = () => {
  if( files.length == 0){
    ElMessage.error("file is empty");
    return;
  }
  const formData = new FormData();
  formData.append("fileDesc", "");
  formData.append("parentId", props.currDirId);
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
        handleClose('update');
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

<style></style>

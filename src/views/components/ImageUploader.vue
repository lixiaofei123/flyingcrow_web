<template>
  <div>
    <CRow form class="form-group">
      <CCol tag="label" sm="3" class="col-form-label">
        {{ title }}
      </CCol>
      <CCol sm="9">
        <CRow>
          <CCol sm="12">
            <div class="c-Image" style="width:80px;height:80px;">
              <img :height="50" :src="imageUrl" />
            </div>
            <el-upload
              ref="upload"
              class="upload-Image"
              :action="uploadUrl"
              name="file"
              multiple
              :limit="1"
              :show-file-list="false"
              :on-success="uploadImageSuccess"
              :before-upload="beforeImageUpload"
              :on-error="uploadImageError"
              :headers="headers"
              accept="image/png,image/jpeg"
            >
              <CButton class="btn" size="sm" color="primary">更换图片</CButton>
              <span v-if="tipText" v-bind:style="{ color: tipColor }"
                >&nbsp;&nbsp;{{ tipText }}</span
              >
            </el-upload>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  </div>
</template>

<script>
var cookies = require("vue-cookie");
import { fileInfoById } from "../../api/api";

export default {
  name: "ImageUploader",
  props: {
    title: String,
    label: String,
    uploadUrl: String,
    imageUrl: String,
    maxFilesize: {
      type: Number,
      default: 400,
    },
  },
  components: {},
  created() {},
  data() {
    return {
      tipColor: "green",
      tipText: "",
      headers: {},
    };
  },
  watch: {},
  methods: {
    beforeImageUpload(file) {
      const isImage = file.type === "image/jpeg" || file.type === "image/png";
      const isLtMaxFileSize = file.size / 1024 / 1024 / 1024 < this.maxFilesize;

      if (!isImage) {
        this.uploadErrorInfo(`${this.label}只能是 JPG/PNG 格式!`);
      }
      if (!isLtMaxFileSize) {
        this.uploadErrorInfo(
          `${this.label}的大小不能超过 ${this.maxFilesize}KB!`
        );
      }

      this.headers["authorization"] = cookies.get("authorization");

      return isImage && isLtMaxFileSize;
    },
    uploadSuccessInfo(msg) {
      this.tipColor = "green";
      this.tipText = msg;
    },
    uploadErrorInfo(msg) {
      this.tipColor = "red";
      this.tipText = msg;
    },
    uploadImageError() {
      this.uploadErrorInfo(`上传${this.label}失败`);
      this.$emit("uploadImageError");
    },
    uploadImageSuccess(response) {
      this.$refs.upload.clearFiles();
      fileInfoById(response.data.fileId, (data) => {
        this.uploadSuccessInfo(`${this.label}上传成功，设置将在保存后生效`);
        this.$emit("uploadImageSuccess", {
          fileId: response.data.fileId,
          data: data.data,
        });
      });
    },
  },
  computed: {},
};
</script>

<style scoped></style>

<template>
  <div>
    <CRow>
      <CCol sm="12" md="12">
        <CCard>
          <CCardHeader>本地上传 </CCardHeader>
          <CCardBody class="localuploader">
            <el-upload
              drag
              :action="uploadAction"
              name="file"
              multiple
              :limit="20"
              :show-file-list="false"
              :headers="headers"
              :on-change="fileChanged"
              :on-progress="fileUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="setHeader"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                {{
                  "只允许上传" +
                    allowFileExtension +
                    "后缀的文件，且文件的大小不能超过" +
                    maxFileSize +
                    "MB"
                }}
              </div>
            </el-upload>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCard
        class="imagecard"
        v-for="item in uploads"
        v-bind:key="item.uid"
        @click="showFileDrawer(item.uid)"
      >
        <CCardHeader>
          <div class="imagetitle">{{ item.name }}</div>
        </CCardHeader>
        <CCardBody>
          <img class="thumb" :src="item.url" @error="loadThumbError(item)" />
        </CCardBody>
        <CCardFooter>
          <el-progress
            v-if="item.status !== ''"
            :percentage="item.percentage"
            :status="item.status"
          ></el-progress>
          <el-progress
            v-if="item.status === ''"
            :percentage="item.percentage"
          ></el-progress>
        </CCardFooter>
      </CCard>
    </CRow>
    <FileDetailDrawer
      @closeDrawer="closeDrawer"
      :drawer.sync="showDrawer"
      :path="path"
    ></FileDetailDrawer>
  </div>
</template>

<script>
import { siteInfo, myInfo } from "../../api/api";
var cookies = require("vue-cookie");
import FileDetailDrawer from "../components/FileDetailDrawer";

export default {
  name: "LocalUpload",
  components: {
    FileDetailDrawer,
  },
  data() {
    return {
      showDrawer: false,
      path: "",
      allowFileExtension: "",
      maxFileSize: 0,
      uploads: [],
      headers: {},
      modalTitle: "",
      showLink: false,
      links: [],
      uploadAction: "",
    };
  },
  created() {
    this.uploadAction = `${window.globalConfig.url}/file/upload`;
    siteInfo(
      (data) => {
        if (data.code === 200) {
          this.allowFileExtension = data.data.upload.allowFileExtension;
          this.maxFileSize = data.data.upload.maxFileSize;
          myInfo(
            (data) => {
              if (data.code === 200) {
                if (data.data.group) {
                  this.maxFileSize = data.data.group.maxFileSize;
                  this.allowFileExtension = data.data.group.allowFileExtension;
                }
              }
            },
            () => {
            }
          );
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载上传配置出错，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    setHeader: function() {
      this.headers["authorization"] = cookies.get("authorization");
    },
    fileChanged: function(file) {
      let uid = file.uid;
      let index = this.uploads.findIndex((u) => u.uid === uid);
      if (index === -1) {
        this.uploads.unshift({
          name: file.name,
          percentage: file.percentage,
          url: URL.createObjectURL(file.raw),
          size: file.size,
          status: "",
          uid: file.uid,
        });
      }
    },
    fileUpload(event, file) {
      let uid = file.uid;
      let index = this.uploads.findIndex((u) => u.uid === uid);
      if (index !== -1) {
        this.uploads[index].percentage = parseInt(file.percentage);
        this.$set(this.uploads, index, this.uploads[index]);
      }
    },
    uploadSuccess(response, file) {
      if (response.code === 200) {
        let uid = file.uid;
        let index = this.uploads.findIndex((u) => u.uid === uid);
        if (index !== -1) {
          this.uploads[index].percentage = parseInt(file.percentage);
          this.uploads[index].status = "success";
          this.uploads[index].urls = response.data.urls;
          this.uploads[index].path = response.data.filePath;
          this.uploads[index].name = response.data.fileName;
          this.$set(this.uploads, index, this.uploads[index]);
        }
      } else {
        this.uploadError("上传失败", file);
      }
    },
    uploadError(error, file) {
      let uid = file.uid;
      let index = this.uploads.findIndex((u) => u.uid === uid);
      if (index !== -1) {
        this.uploads[index].status = "exception";
        this.$set(this.uploads, index, this.uploads[index]);
      }
      this.$notify.error({
        title: "错误",
        message: `上传失败，原因${JSON.parse(error.message).reason}`,
      });
    },
    loadThumbError(file) {
      let uid = file.uid;
      let index = this.uploads.findIndex((u) => u.uid === uid);
      if (index !== -1) {
        this.uploads[index].url = require("@/assets/image/fileicon.png");
        this.$set(this.uploads, index, this.uploads[index]);
      }
    },
    showFileDrawer(uid) {
      let index = this.uploads.findIndex((u) => u.uid === uid);
      if (index !== -1) {
        this.path = this.uploads[index].path + "/" + this.uploads[index].name;
        this.showDrawer = true;
      }
    },
    closeDrawer() {
      this.showDrawer = false;
    },
  },
  computed: {},
};
</script>

<style scoped>
.imagecard {
  width: 200px;
  margin: 20px;
  cursor: pointer;
}
.imagecard .imagetitle {
  height: 20px;
  overflow: hidden;
}
.imagecard .thumb {
  width: 100%;
  height: 150px;
}
</style>

<style>
.localuploader .el-upload {
  width: 100%;
}
.localuploader .el-upload-dragger {
  height: 220px;
  width: 100%;
}
.localuploader .el-icon-upload {
  margin: 60px 0 16px;
}
</style>

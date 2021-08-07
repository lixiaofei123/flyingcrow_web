<template>
  <div class="fullscreen">
    <CHeader>
      <CHeaderBrand class="mx-auto" to="/">
        <img name="logo" height="40" alt="Logo" src="img/logo_main.png" />
      </CHeaderBrand>
      <CHeaderNav class="mr-4">
        <CHeaderNavItem class="d-md-down-none mx-2">
          <CHeaderNavLink to="/admin" v-if="loginSuccess">
            控制台
          </CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem
          class="d-md-down-none mx-2"
          v-if="!loginSuccess && allowRegister"
        >
          <CHeaderNavLink to="/register">
            注册
          </CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem class="mx-2" v-if="!loginSuccess">
          <CHeaderNavLink to="/login">
            请登录
          </CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem class="d-md-down-none mx-2" v-show="loginSuccess">
          <CHeaderNavLink>
            {{ user.nickName || user.name }}
          </CHeaderNavLink>
        </CHeaderNavItem>
        <TheHeaderDropdownAccnt
          :user="user"
          :stat="stat"
          @logout="logout"
          v-show="loginSuccess"
        />
      </CHeaderNav>
    </CHeader>
    <div class="container">
      <CAlert show color="primary" v-html="welcomeText"></CAlert>
      <CAlert show color="danger" v-if="!loginSuccess && !allowAnonymousUpload"
        >当前站点已经禁止匿名用户上传</CAlert
      >
      <CAlert show color="danger" v-if="!loginSuccess && !allowRegister"
        >当前站点已经关闭了注册功能</CAlert
      >
      <CAlert show color="success" v-if="loginSuccess && this.user.mood">{{
        this.user.mood
      }}</CAlert>
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
                :disabled="!loginSuccess && !allowAnonymousUpload"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>，或者直接试试CTRL+V粘贴吧
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
    </div>

    <div style="height: 80px;"></div>

    <CFooter :fixed="true">
      <div>
        <a href="https://www.lixf.io" target="_blank">飞鸦</a>
        <span class="ml-1">&copy; {{ new Date().getFullYear() }}</span>
      </div>
      <div class="mfs-auto" v-if="ipc">
        <a href="https://beian.miit.gov.cn/" target="_blank">{{ ipc }}</a>
      </div>
      <div class="mfs-auto">
        <span class="mr-1">由</span>
        <a href="https://www.lixf.io">飞鸦</a>
        <span class="mr-1">驱动</span>
      </div>
    </CFooter>
    <FileDetailDrawer
      @closeDrawer="closeDrawer"
      :drawer.sync="showDrawer"
      :path="path"
    ></FileDetailDrawer>
  </div>
</template>

<script>
import { siteInfo, myInfo, uploadNoNameFile } from "../../api/api";
var cookies = require("vue-cookie");
import FileDetailDrawer from "../components/FileDetailDrawer";
import TheHeaderDropdownAccnt from "../../containers/TheHeaderDropdownAccnt";

export default {
  name: "Index1",
  components: {
    FileDetailDrawer,
    TheHeaderDropdownAccnt,
  },
  data() {
    return {
      showDrawer: false,
      allowRegister: true,
      loginSuccess: false,
      allowAnonymousUpload: true,
      path: "",
      allowFileExtension: "",
      maxFileSize: 0,
      uploads: [],
      headers: {},
      modalTitle: "",
      showLink: false,
      links: [],
      ipc: "",
      welcomeText: "",
      user: {},
      stat: {},
      uploadAction: "",
    };
  },
  created() {
    this.uploadAction = `${window.globalConfig.url}/file/upload`;
    this.loadInfo();
    this.pasteListener = (event) => {
      var items = event.clipboardData && event.clipboardData.items;
      var file = null;
      if (items && items.length) {
        // 检索剪切板items
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            file = items[i].getAsFile();

            let reader = new FileReader();
            reader.onload = (event) => {
              let base64Str = event.target.result;
              let uid = new Date().getTime();
              let fileName = uid;
              let fileItem = {
                uid: uid,
                name: fileName,
                base64: base64Str,
                size: file.size,
                percentage: 0,
              };
              this.fileChanged(fileItem);
              uploadNoNameFile(
                file,
                (progress) => {
                  fileItem.percentage = progress;
                  this.fileUpload("", fileItem);
                },
                (data) => {
                  fileItem.percentage = 100;
                  this.uploadSuccess(data, fileItem);
                },
                (data) => {
                  let error = {
                    message: JSON.stringify(data),
                  };
                  this.uploadError(error, fileItem);
                }
              );
            };
            reader.readAsDataURL(file);

            break;
          }
        }
      }
    };
    document.addEventListener("paste", this.pasteListener);
  },
  destroyed() {
    document.removeEventListener("paste", this.pasteListener);
  },
  methods: {
    loadInfo() {
      siteInfo(
        (data) => {
          if (data.code === 200) {
            this.allowFileExtension = data.data.upload.allowFileExtension;
            this.maxFileSize = data.data.upload.maxFileSize;
            this.ipc = data.data.site.ipc;
            this.welcomeText = data.data.site.welcomeText;
            myInfo(
              (data) => {
                if (data.code === 200) {
                  this.loginSuccess = true;
                  this.user = data.data.user;
                  this.stat = data.data.stat;
                  if (data.data.group) {
                    this.maxFileSize = data.data.group.maxFileSize;
                    this.allowFileExtension =
                      data.data.group.allowFileExtension;
                  }
                }
              },
              () => {
                this.allowRegister = data.data.site.allowRegister;
                this.allowAnonymousUpload =
                  data.data.upload.allowAnonymousUpload;
              }
            );
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `加载站点配置出错，原因${data.reason}`,
          });
        }
      );
    },
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
          url: file.raw ? URL.createObjectURL(file.raw) : file.base64,
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
        this.uploads[index].url = "img/fileicon.png";
        this.$set(this.uploads, index, this.uploads[index]);
      }
    },
    showFileDrawer(uid) {
      let index = this.uploads.findIndex((u) => u.uid === uid);
      if (
        index !== -1 &&
        this.uploads[index].path &&
        this.uploads[index].name
      ) {
        this.path = this.uploads[index].path + "/" + this.uploads[index].name;
        this.showDrawer = true;
      }
    },
    closeDrawer() {
      this.showDrawer = false;
    },
    logout() {
      cookies.set("authorization", "");
      this.loginSuccess = false;
      this.user = {};
      this.stat = {};
    },
  },
  computed: {},
};
</script>

<style scoped>
.container {
  padding-top: 100px;
}
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

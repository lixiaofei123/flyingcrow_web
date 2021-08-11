<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <ol class="breadcrumb filecrumb">
              <li
                class="breadcrumb-item"
                v-for="(item, index) in filecrumb"
                v-bind:key="index"
              >
                <CLink
                  @click="openDir(item.path)"
                  v-if="index !== filecrumb.length - 1"
                  >{{ item.text }}</CLink
                >
                <span v-else>{{ item.text }}</span>
              </li>
            </ol>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <div style="flex:1"></div>
              <div class="searchFile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  role="img"
                  class="c-icon c-icon-custom-size"
                  height="30"
                  width="30"
                >
                  <path
                    fill="var(--ci-primary-color, currentColor)"
                    d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"
                    class="ci-primary"
                  ></path>
                </svg>
              </div>
              <div class="newFile">
                <CDropdown color="primary" toggler-text="新增" size="sm">
                  <CDropdownItem @click="newDirectory"
                    >新建文件夹</CDropdownItem
                  >
                  <CDropdownItem @click="uploadFile">上传文件</CDropdownItem>
                </CDropdown>
              </div>
            </CRow>
            <FileTable
              :items="files"
              @openDir="openDir"
              @openImage="openImage"
              @openVideo="openVideo"
              @fileInfo="fileInfo"
              @deleteFile="deleteFile0"
            ></FileTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <FileDetailDrawer
      @closeDrawer="closeDrawer"
      :drawer.sync="showDrawer"
      :path="path"
    ></FileDetailDrawer>

    <el-image-viewer
      v-if="visiableImg"
      :on-close="()=>{ visiableImg = false }"
      :url-list="sourceList"
    />
    <Video v-if="visiableVideo" :videoSrc="videoSrc" :mimeType="mimeType" style="z-index:9999" @closeVideo="closeVideo" />

    <div class="uploadProgressBox" v-if="showUploadProgressBox">
      上传文件
      <el-progress
        v-if="upload.status !== ''"
        :percentage="upload.percentage"
        :status="upload.status"
      ></el-progress>
      <el-progress
        v-if="upload.status === ''"
        :percentage="upload.percentage"
      ></el-progress>
    </div>
  </div>
</template>

<script>
import FileTable from "./FileTable.vue";
import { fileList, mkDir, uploadFile, deleteFile } from "../../api/api.js";
import moment from "moment";
import { wellSize } from "../../utils/utils";
import FileDetailDrawer from "../components/FileDetailDrawer";
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import Video from '../components/Video.vue'
var cookies = require("vue-cookie");


export default {
  name: "File",
  components: {
    FileTable,
    FileDetailDrawer,
    ElImageViewer,
    Video
  },
  data() {
    return {
      authorization: "",
      visiableVideo: false,
      videoSrc: '',
      mimeType: 'video/mp4',
      visiableImg: false,
      showDrawer: false,
      path: "",
      showUploadProgressBox: false,
      upload: {
        status: "",
        percentage: 0,
      },
      filecrumb: [
        {
          text: "主目录",
          path: "/",
        },
      ],
      files: [],
      currentPath: "",
      sourceList: []
    };
  },
  created: function() {
    this.authorization = cookies.get("authorization")
    let path = this.$route.query.path;
    if (path) {
      this.loadFiles(path);
    } else {
      this.loadFiles("/");
    }
  },
  methods: {
    resetFilecrumb(path) {
      let splits = path.split("/");
      this.filecrumb = [{ text: "主目录", path: "/" }];
      let currentPaths = [];
      for (let split of splits) {
        currentPaths.push(split);
        if (split !== "") {
          this.filecrumb.push({
            text: split,
            path: currentPaths.join("/"),
          });
        }
      }
    },
    uploadFile() {
      let that = this;
      let fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("style", "visibility:hidden");
      fileInput.addEventListener("change", function() {
        if (this.files.length > 0) {
          let file = this.files[0];
          that.showUploadProgressBox = true;
          that.upload.percentage = 0;
          that.upload.status = "";
          uploadFile(
            file,
            that.currentPath,
            (progress) => {
              that.upload.percentage = progress;
            },
            (data) => {
              if (data.code === 200) {
                that.upload.status = "success";
                that.loadFiles(that.currentPath);
              } else {
                that.upload.status = "exception";
              }
              setTimeout(() => {
                that.showUploadProgressBox = false;
              }, 3000);

            },
            data => {
              console.log(data)
              that.upload.status = "exception";
              setTimeout(() => {
                that.showUploadProgressBox = false;
              }, 3000);
            }
          );
        }
      });
      fileInput.click();
    },
    loadFiles(path) {
      fileList(
        path,
        (data) => {
          if (data.code === 200) {
            this.currentPath = path;
            this.resetFilecrumb(path);
            this.$router.push({ path: "files", query: { path: path } });
            this.files = [];
            this.sourceList = [];
            for (let item of data.data) {
              this.files.push({
                id: item.id,
                name: item.name,
                modifytime: moment(item.lastModifyTime * 1000).format(
                  "YYYY-MM-DD HH:mm"
                ),
                size: wellSize(item.fileZise),
                isDict: item.isDict,
                type: item.fileType,
                fullPath: item.absolutePath + "/" + item.name,
                iconUrl: item.fileType === "image" ?   item.iconUrls.length > 0 ? (item.iconUrls[0] + "?authorization=" + this.authorization) : "" : "",
                url: item.urls[item.urls.length - 1],
                mimeType: item.mimeType
              });

              if(item.fileType === "image" && item.urls.length > 0){
                this.sourceList.push(item.urls[item.urls.length - 1])
              }
            }
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `读取目录${path}失败，原因${data.reason}`,
          });
        }
      );
    },
    openImage(imgUrl){
      let index = this.sourceList.findIndex(url => url === imgUrl)
      if(index !== -1){
        let temp =  this.sourceList.splice(0,index)
        this.sourceList = this.sourceList.concat(temp)
      }
      this.visiableImg = true;
    },
    openVideo(url,mimeType){
      this.videoSrc = url
      this.mimeType = mimeType
      this.visiableVideo = true
    },
    closeVideo(){
      this.visiableVideo = false
      this.videoSrc = ""
    },
    openDir(path) {
      this.loadFiles(path);
    },
    fileInfo(path) {
      this.path = path;
      this.showDrawer = true;
    },
    deleteFile0(fid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteFile(
            fid,
            (data) => {
              if (data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: `删除文件成功`,
                  type: "success",
                });
                this.loadFiles(this.currentPath);
              }
            },
            (data) => {
              this.$notify.error({
                title: "错误",
                message: `删除文件失败，原因${data.reason}`,
              });
            }
          );
        })
        .catch(() => {});
    },
    closeDrawer() {
      this.showDrawer = false;
    },
    newDirectory() {
      this.$prompt("请输入文件夹名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (value !== "") {
            let newPath = this.currentPath + "/" + value;
            mkDir(
              newPath,
              (data) => {
                if (data.code === 200) {
                  this.loadFiles(this.currentPath);
                }
              },
              (data) => {
                this.$notify.error({
                  title: "错误",
                  message: `创建${newPath}失败，原因${data.reason}`,
                });
              }
            );
          }
        })
        .catch(() => {});
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped>
.container {
  height: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.filecrumb {
  border-bottom: none;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.newFile {
  padding: 5px;
  margin-left: 10px;
  margin-right: 10px;
}
.searchFile {
  padding: 5px;
}
.uploadProgressBox {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 330px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  position: fixed;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  padding: 14px 26px 14px 13px;
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s,
    bottom 0.3s;
}
</style>

<style>
.filecrumb .breadcrumb-item:not(:first-child)::before {
  content: ">";
  padding: 0px 4px;
}
</style>

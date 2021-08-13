<template>
  <div class="wrapper">
    <CRow>
      <CCol col="12" lg="8">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="4">
                远程下载管理
              </CCol>
              <CCol md="6"></CCol>
              <CCol md="2">
                <CButton
                  block
                  color="primary"
                  size="sm"
                  @click="newDownloadTask"
                  >新建离线任务</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <DownloadTaskTable :items="tasks" @taskDetail="taskDetail0">
            </DownloadTaskTable>
            <CPagination
              :active-page.sync="current"
              :pages="total"
            ></CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal :title="modalTitle" :show="showModal" :no-close-on-backdrop="true">
      <CRow class="form-group">
        <CCol tag="label" sm="3" md="3">
          任务ID
        </CCol>
        <CCol tag="label" sm="9" md="9">
          {{ task.uuid }}
        </CCol>
      </CRow>
      <CRow class="form-group">
        <CCol tag="label" sm="3" md="3">
          文件名称
        </CCol>
        <CCol tag="label" sm="9" md="9">
          {{ task.fileName }}
        </CCol>
      </CRow>
      <CRow class="form-group">
        <CCol tag="label" sm="3" md="3">
          文件大小
        </CCol>
        <CCol tag="label" sm="9" md="9">
          {{ task.size }}
        </CCol>
      </CRow>
      <CRow class="form-group">
        <CCol tag="label" sm="3" md="3">
          创建时间
        </CCol>
        <CCol tag="label" sm="9" md="9">
          {{ task.time }}
        </CCol>
      </CRow>
      <CRow class="form-group">
        <CCol tag="label" sm="3" md="3">
          下载状态
        </CCol>
        <CCol tag="label" sm="9" md="9">
          {{ task.status }}
        </CCol>
      </CRow>
      <CRow class="form-group" v-if="task.status === '运行中'">
        <CCol tag="label" sm="3" md="3">
          下载进度
        </CCol>
        <CCol tag="label" sm="9" md="9">
          <el-progress
            style="width:80%"
            :percentage="task.progress"
            :show-text="false"
            :stroke-width="10"
          ></el-progress>
        </CCol>
      </CRow>
      <CRow class="form-group" v-if="task.status === '失败'">
        <CCol tag="label" sm="3" md="3">
          失败原因
        </CCol>
        <CCol tag="label" sm="9" md="9">
          {{ task.errReason }}
        </CCol>
      </CRow>

      <CRow class="form-group" v-if="task.status === '成功'">
        <CCol tag="label" sm="3" md="3">
          直链
        </CCol>
        <CCol tag="label" sm="9" md="9">
          <CRow v-for="url in task.urls" v-bind:key="url">
            <CCol md="12">
              <CInput :readonly="true" :value="url">
                <template #append>
                  <CButton color="primary" @click="copyUrl(url)">复制</CButton>
                </template>
              </CInput>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow class="form-group">
        <CCol tag="label" sm="3" md="3">
          原始链接
        </CCol>
        <CCol tag="label" sm="9" md="9">
          <CTextarea
            v-model="task.srcUrl"
            :readonly="true"
            type="text"
            horizontal
            rows="3"
          />
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="showModal = false">关闭</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import DownloadTaskTable from "./DownloadTaskTable.vue";
import { wellSize } from "../../utils/utils";
import moment from "moment";

import {
  downloadTaskList,
  submitDownloadTask,
  getDownloadTaskByUUID,
} from "../../api/api";
export default {
  name: "RemoteDownload",
  components: {
    DownloadTaskTable,
  },
  data() {
    return {
      tasks: [],
      current: 1,
      limit: 5,
      total: 0,
      modalTitle: "任务详情",
      showModal: false,
      timer: 0,
      task: {
        uuid: "",
      },
      statusMap: {
        start: "开始",
        running: "运行中",
        success: "成功",
        error: "失败",
      },
    };
  },
  watch: {},
  created: function() {
    this.loadTasks(1);
  },
  destroyed: function() {
    clearInterval(this.timer);
  },
  methods: {
    wellTime(time) {
      return moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm");
    },
    copyUrl(link) {
      this.$copyText(link).then(
        () => {
          this.$notify({
            title: "成功",
            message: `复制成功，现在您可以开始粘贴了`,
            type: "success",
          });
        },
        () => {
          this.$notify.error({
            title: "错误",
            message: `复制失败，请手动复制`,
          });
        }
      );
    },
    taskDetail0(taskId) {
      getDownloadTaskByUUID(
        taskId,
        (data) => {
          if (data.code === 200) {
            let item = data.data;
            this.task = {
              uuid: item.uuid,
              fileName: item.fileName,
              size: wellSize(item.size),
              time: this.wellTime(item.time),
              status: this.statusMap[item.status],
              errReason: item.errReason,
              urls: item.fileinfo.urls,
              srcUrl: item.srcUrl,
              progress: item.progress,
            };
            this.showModal = true;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取任务信息失败，原因${data.reason}`,
          });
        }
      );
    },
    newDownloadTask() {
      this.$prompt("新建下载任务", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          submitDownloadTask(
            value,
            () => {
              this.$notify({
                title: "成功",
                message: `创建任务成功`,
                type: "success",
              });
            },
            (data) => {
              this.$notify.error({
                title: "错误",
                message: `创建任务失败，原因${data.reason}`,
              });
            }
          );
        })
        .catch(() => {});
    },
    loadTasks0(page) {
      downloadTaskList(page, this.limit, (data) => {
        if (data.code === 200) {
          this.limit = data.data.pageCount;
          this.current = data.data.pageIndex;
          this.total = data.data.totalPage;
          this.tasks = [];
          for (let item of data.data.list) {
            let task = {
              uuid: item.uuid,
              fileName: item.fileName,
              size: wellSize(item.size),
              receiveSize: wellSize((item.size * item.progress) / 100),
              progress: item.progress,
              status: this.statusMap[item.status],
            };
            this.tasks.push(task);
          }
        }
      });
    },
    loadTasks(page) {
      clearInterval(this.timer);
      this.loadTasks0(page);
      this.timer = setInterval(() => {
        this.loadTasks0(page);
      }, 5000);
    },
  },
  watch: {
    current(newVal) {
      this.loadTasks(newVal);
    },
  },
};
</script>

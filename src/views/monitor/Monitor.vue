<template>
  <div>
    <CRow>
      <CCol md="12">
        <CButton color="primary" class="float-right" @click="addNewMonitor"
          >添加新的监控</CButton
        >
        <div style="width:100%;height:60px"></div>
      </CCol>
      <CCol md="4" v-for="item in monitorList" v-bind:key="item.id">
        <MonitorPanel
          :ref="'monitor_'+item.id"
          @editMonitor="editMonitor"
          @deleteMonitor="deleteMonitor0"
          :title="item.name"
          :monitorId="item.id"
          :active="item.active"
        />
      </CCol>
    </CRow>
    <MonitorEditor
      :show="showMonitorEditor"
      :monitorId="monitorId"
      @cancel="cancleEditor"
      @success="addMonitorSuccess"
      @error="addMonitorError"
      @updateSuccess="updateMonitorSuccess"
      @updateError="updateMonitorError"
    />
  </div>
</template>

<script>
import { monitorList, deleteMonitor } from "../../api/adminapi";
import MonitorEditor from "./MonitorEditor.vue";
import MonitorPanel from "./MonitorPanel.vue";

export default {
  name: "Monitor",
  components: {
    MonitorEditor,
    MonitorPanel,
  },
  data() {
    return {
      showMonitorEditor: false,
      monitorList: [],
      monitorId: -1,
    };
  },
  created: function() {
    this.loadMonitors();
  },
  methods: {
    deleteMonitor0(mid) {
      let index = this.monitorList.findIndex((m) => m.id === mid);
      if (index !== -1) {
        let monitor = this.monitorList[index];
        this.$confirm(
          `此操作将永久删除【${monitor.name}】, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteMonitor(
              mid,
              (data) => {
                if (data.code === 200) {
                  this.$notify({
                    title: "成功",
                    message: `删除【${data.data.name}】成功`,
                    type: "success",
                  });
                  let index = this.monitorList.findIndex(
                    (u) => u.id === data.data.id
                  );
                  this.monitorList.splice(index, 1);
                }
              },
              (data) => {
                this.$notify.error({
                  title: "错误",
                  message: `删除【${monitor.name}】失败，原因${data.reason}`,
                });
              }
            );
          })
          .catch(() => {});
      }
    },
    editMonitor(mid) {
      let index = this.monitorList.findIndex((m) => m.id === mid);
      if (index !== -1) {
        this.monitorId = this.monitorList[index].id;
        this.showMonitorEditor = true;
      }
    },
    loadMonitors() {
      monitorList(
        (data) => {
          if (data.code === 200) {
            this.monitorList = data.data;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `加载监控列表失败，原因${data.reason}`,
          });
        }
      );
    },
    addNewMonitor() {
      this.monitorId = -1
      this.showMonitorEditor = true;
    },
    cancleEditor() {
      this.showMonitorEditor = false;
    },
    addMonitorSuccess(data) {
      this.monitorList.unshift(data)
      this.showMonitorEditor = false;
    },
    updateMonitorSuccess(data) {
      let index = this.monitorList.findIndex((m) => m.id === data.id);
      if(index !== -1){
        this.$set(this.monitorList,index,data);
        this.$refs['monitor_'+data.id][0].forceUpdate();
      }else{
        this.monitorList.unshift(data)
      }
      this.showMonitorEditor = false;
    },
    addMonitorError(reason) {
      this.$notify.error({
        title: "错误",
        message: `添加监控失败，原因是${reason}`,
      });
      this.showMonitorEditor = false;
    },
    updateMonitorError(reason) {
      this.$notify.error({
        title: "错误",
        message: `更新监控信息失败，原因是${reason}`,
      });
      this.showMonitorEditor = false;
    },
  },
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
</style>

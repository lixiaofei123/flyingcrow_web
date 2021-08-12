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
          :title="item.name"
          :monitorId="item.id"
          :active="item.active"
        />
      </CCol>
    </CRow>
    <MonitorEditor
      :show="showMonitorEditor"
      :monitor="monitor"
      @cancel="cancleEditor"
      @success="addMonitorSuccess"
      @error="addMonitorError"
    />
  </div>
</template>

<script>
import { monitorList } from "../../api/adminapi";
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
      monitor: {
        id: -1,
        name: "",
        active: true,
        type: "lighthouseTrafficPackage",
        config: {},
      },
      monitorList: [],
    };
  },
  created: function() {
    this.loadMonitors();
  },
  methods: {
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
      this.monitor = {
        id: -1,
        name: "",
        active: true,
        type: "lighthouseTrafficPackage",
        config: {},
      };
      this.showMonitorEditor = true;
    },
    cancleEditor() {
      this.showMonitorEditor = false;
    },
    addMonitorSuccess(data) {
      console.log(data);

      this.showMonitorEditor = false;
    },
    addMonitorError() {
      this.$notify.error({
        title: "错误",
        message: `添加监控失败，原因是${data.reason}`,
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

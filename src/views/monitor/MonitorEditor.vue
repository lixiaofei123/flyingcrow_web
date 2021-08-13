<template>
  <CModal :title="title" :show="show" :no-close-on-backdrop="true">
    <CForm>
      <CInput label="名称" horizontal v-model="monitor.name" />
      <CRow form class="form-group">
        <CCol tag="label" sm="3" class="col-form-label">
          是否激活
        </CCol>
        <CCol sm="9">
          <CSwitch
            class="mr-1"
            color="primary"
            :checked.sync="monitor.active"
          />
        </CCol>
      </CRow>
      <CRow form class="form-group">
        <CCol sm="3">
          监控类型
        </CCol>
        <CCol sm="9">
          <CRow>
            <CCol sm="12">
              <select
                class="form-control"
                v-model="monitor.type"
                style="width:100%"
              >
                <option
                  v-for="(value, key) in monitorTypes"
                  v-bind:key="key"
                  :value="key"
                  >{{ value }}</option
                >
              </select>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CForm v-show="monitor.type">
        <CInput
          v-for="item in properties"
          v-bind:key="item.name"
          :label="item.showName"
          v-model="monitor.config[item.name]"
          horizontal
        />
      </CForm>
    </CForm>
    <template #footer>
      <CButton @click="$emit('cancel')" color="info">关闭</CButton>
      <CButton @click="submitMonitor()" color="success">确认</CButton>
    </template>
  </CModal>
</template>

<script>
import { allMonitorTypes, newMonitor,updateMonitor } from "../../api/adminapi";
import { deepCopy } from "../../utils/utils";

export default {
  name: "MonitorEditor",
  props: {
    show: Boolean,
    monitor: Object,
  },
  components: {},
  data() {
    return {
      title: "新增监视器",
      monitorTypes: {},
      monitorProps: {},
    };
  },
  created: function() {
    allMonitorTypes(
      (data) => {
        if (data.code === 200) {
          for (let stype in data.data) {
            this.monitorTypes[stype] = data.data[stype].name;
          }
          this.monitorProps = data.data;
        }
      },
      () => {
        this.$notify.error({
          title: "错误",
          message: `加载监控类型失败，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    submitMonitor() {
      if (this.monitor.id === -1) {
        newMonitor(
          deepCopy(this.monitor),
          (data) => {
            if (data.code === 200) {
              this.$emit("success", data.data);
            }
          },
          (data) => {
            this.$emit("error", data.readon);
          }
        );
      } else {
        updateMonitor(
          this.monitor.id,
          deepCopy(this.monitor),
          (data) => {
            if (data.code === 200) {
              this.$emit("updateSuccess", data.data);
            }
          },
          (data) => {
            this.$emit("updateError", data.readon);
          }
        );
      }
    },
  },
  computed: {
    properties: function() {
      return this.monitorProps[this.monitor.type] === undefined
        ? []
        : this.monitorProps[this.monitor.type].properties;
    },
  },
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

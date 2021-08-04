<template>
  <div>
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="primary"
          :header="stat.fileCount + '个'"
          text="总文件数量"
        >
          <template #default> </template>
          <template #footer>
            <CChartLineSimple
              pointed
              class="mt-3 mx-3"
              style="height:70px"
              :data-points="[65, 59, 84, 84, 51, 55, 40]"
              point-hover-background-color="primary"
              label="Members"
              labels="months"
            />
          </template>
        </CWidgetDropdown>
      </CCol>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="info"
          :header="wellSize0(stat.usedStorage)"
          text="空间使用情况"
        >
          <template #footer>
            <CChartLineSimple
              pointed
              class="mt-3 mx-3"
              style="height:70px"
              :data-points="[1, 18, 9, 17, 34, 22, 11]"
              point-hover-background-color="info"
              :options="{ elements: { line: { tension: 0.00001 } } }"
              label="Members"
              labels="months"
            />
          </template>
        </CWidgetDropdown>
      </CCol>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="warning"
          :header="wellSize0(stat.usedTraffic)"
          text="本月使用流量"
        >
          <template #default> </template>
          <template #footer>
            <CChartLineSimple
              class="mt-3"
              style="height:70px"
              background-color="rgba(255,255,255,.2)"
              :data-points="[78, 81, 80, 45, 34, 12, 40]"
              :options="{ elements: { line: { borderWidth: 2.5 } } }"
              point-hover-background-color="warning"
              label="Members"
              labels="months"
            />
          </template>
        </CWidgetDropdown>
      </CCol>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="danger"
          :header="stat.requestTimes + '次'"
          text="本月请求次数"
        >
          <template #default> </template>
          <template #footer>
            <CChartBarSimple
              class="mt-3 mx-3"
              style="height:70px"
              background-color="rgb(250, 152, 152)"
              label="Members"
              labels="months"
            />
          </template>
        </CWidgetDropdown>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CChartLineSimple, CChartBarSimple } from "./charts/index.js";
import { totalStatinfo } from "../api/adminapi";
import { myStatinfo } from "../api/api";

import { wellSize } from "../utils/utils";

export default {
  name: "Dashboard",
  components: { CChartLineSimple, CChartBarSimple },
  data() {
    return {
      stat: {
        usedStorage: 0,
        fileCount: 0,
        usedTraffic: 0,
        requestTimes: 0,
      },
    };
  },
  created() {
      this.loadStat();
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    },
  },
  watch:{
    user:function(){
      this.loadStat();
    }
  },
  methods: {
    wellSize0(size) {
      return wellSize(size);
    },
    loadStat() {
      if (this.user.role === "admin" || this.user.role === "superadmin") {
        totalStatinfo(
          "month",
          "",
          "",
          (data) => {
            if (data.code === 200) {
              this.stat = data.data;
            } else {
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `获取统计信息失败，原因${data.reason}`,
            });
          }
        );
      } else {
        myStatinfo(
          "month",
          "",
          "",
          (data) => {
            if (data.code === 200) {
              this.stat = data.data;
            } else {
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `获取统计信息失败，原因${data.reason}`,
            });
          }
        );
      }
    },
  },
};
</script>

<style scoped></style>

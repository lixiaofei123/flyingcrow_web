<template>
  <CCard>
    <CCardHeader>
      {{ title }}
    </CCardHeader>
    <CCardBody>
      <CRow v-if="data.resourceData.length === 1">
        <CCol md="6" style="text-align:center">
          <el-progress
            type="circle"
            :stroke-width="15"
            :percentage="percentage"
            :status="status"
          ></el-progress>
        </CCol>
        <CCol md="6">
            <p>{{formatText}}</p>
            <p>{{tips}}</p>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import { monitorData } from "../../api/adminapi";
import { CChartBar } from "@coreui/vue-chartjs";

export default {
  name: "MonitorPanel",
  components: {
    CChartBar,
  },
  props: {
    monitorId: Number,
    active: Boolean,
    title: String,
  },
  data() {
    return {
      data: {
        resourceData: [
          {
            createTime: 1624305597,
            description: "",
            expireTime: 1655838000,
            name: "流量",
            total: 0,
            used: 0,
            wellTotal: "0",
            wellUsed: "0",
          },
        ],
      },
    };
  },
  created: function() {
    if (this.active) {
      monitorData(
        this.monitorId,
        (data) => {
          if (data.code === 200) {
            this.data = data.data;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `加载监控信息失败，原因${data.reason}`,
          });
        }
      );
    }
  },
  methods: {},
  computed: {
    formatText() {
      return `${this.data.resourceData[0].wellUsed} / ${this.data.resourceData[0].wellTotal} `;
    },
    percentage() {
      return this.data.resourceData[0].used / this.data.resourceData[0].total;
    },
    tips() {
      if (this.percentage <= 50) {
        return `目前${this.data.resourceData[0].name}充裕`;
      } else if (this.percentage <= 80) {
        return `${this.data.resourceData[0].name}告急`;
      } else if (this.percentage < 100) {
        return `${this.data.resourceData[0].name}即将用尽`;
      } else {
        return `${this.data.resourceData[0].name}已经用尽`;
      }
    },
    status() {
      if (this.percentage <= 50) {
        return "success";
      } else if (this.percentage <= 80) {
        return "warning";
      } else {
        return "exception";
      }
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

button {
  border-radius: 2px;
  border: none;
  margin-left: 2px;
  margin-right: 2px;
  font-size: 12px;
  outline: none;
}
</style>

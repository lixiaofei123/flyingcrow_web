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
              :data-points="dayFileCount"
              point-hover-background-color="primary"
              label="今日文件"
              :labels="days"
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
              :data-points="dayStorageSize"
              point-hover-background-color="info"
              label="今日使用(M)"
              :labels="days"
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
              pointed
              class="mt-3 mx-3"
              style="height:70px"
              :data-points="dayTrafficSize"
              point-hover-background-color="warning"
              label="今日流量(M)"
              :labels="days"
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
            <CChartLineSimple
              pointed
              class="mt-3 mx-3"
              style="height:70px"
              :data-points="dayRequestTimes"
              point-hover-background-color="danger"
              label="今日请求"
              :labels="days"
            />
          </template>
        </CWidgetDropdown>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12" md="12" lg="6" xl="6">
        <CCard class="d-md-down-none">
          <CCardHeader>
            来源地域统计
          </CCardHeader>
          <CCardBody>
            <ChinaMapChart :statData="regionStat" />
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            本月访问数据分析
          </CCardHeader>
          <CCardBody class="d-md-down-none"  style="height:460px">
            <CTabs>
              <CTab title="浏览器" active>
                <div class="piechar">
                  <CChartBar
                    :datasets="browserDatasets"
                    :options="options"
                    :labels="browserLabels"
                  />
                </div>
              </CTab>
              <CTab title="操作系统">
                <div class="piechar">
                  <CChartBar
                    :options="options"
                    :datasets="osDatasets"
                    :labels="osLabels"
                  />
                </div>
              </CTab>
              <CTab title="来源IP">
                <div class="piechar">
                  <CChartBar
                    :options="options"
                    :datasets="ipDatasets"
                    :labels="ipLabels"
                  />
                </div>
              </CTab>
              <CTab title="来源Referer">
                <div class="piechar">
                  <CChartBar
                    :options="options"
                    :datasets="refererDatasets"
                    :labels="refererLabels"
                  />
                </div>
              </CTab>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" md="12" lg="6" xl="6">
        <CRow>
          <CCol md="12">
            <CCol md="12">
              <CCard>
                <CCardHeader>
                  本月访问次数最多文件
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    :border="false"
                    :small="true"
                    :items="visit_file_data"
                    :fields="visit_file_fields"
                  >
                  </CDataTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import ChinaMapChart from "../components/ChinaMapChart.vue"
import { CChartLineSimple } from "../charts/index.js";
import { CChartBar } from "@coreui/vue-chartjs";

import {
  myStatinfo,
  visitDataStatinfo,
  dayStatinfo,
  topStatinfo,
  regionStatinfo
} from "../../api/api";

import { wellSize } from "../../utils/utils";

export default {
  name: "UserDashboard",
  components: { CChartLineSimple, CChartBar ,ChinaMapChart},
  data() {
    return {
      options: {
        legend: {
          display: false,
        },
      },
      stat: {
        usedStorage: 0,
        fileCount: 0,
        usedTraffic: 0,
        requestTimes: 0,
        userCount: 0,
      },
      visit_file_fields: [
        { key: "fileName", label: "文件名" },
        { key: "visitCount", label: "访问次数" },
      ],
      visit_file_data: [],
      dayFileCount: [0, 0, 0, 0, 0, 0, 0],
      dayStorageSize: [0, 0, 0, 0, 0, 0, 0],
      dayTrafficSize: [0, 0, 0, 0, 0, 0, 0],
      dayRequestTimes: [0, 0, 0, 0, 0, 0, 0],
      dayUserCount: [0, 0, 0, 0, 0, 0, 0],
      dayBadFileCount: [0, 0, 0, 0, 0, 0, 0],
      osLabels: [],
      osDatasets: [],
      browserLabels: [],
      browserDatasets: [],
      ipLabels: [],
      ipDatasets: [],
      refererLabels: [],
      refererDatasets: [],
      regionStat: [],
      colors: [
        "#DFFF00",
        "#FFBF00",
        "#FF7F50",
        "#DE3163",
        "#9FE2BF",
        "#40E0D0",
        "#6495ED",
        "#CCCCFF",
        "#1B2631",
        "#641E16",
      ],
    };
  },
  created() {
    this.loadStat();
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    },
    days: function() {
      let labels = [];
      let now = new Date().getTime();
      for (let i = 0; i < 7; i++) {
        let time = new Date(now - (6 - i) * (1000 * 60 * 60 * 24));
        labels.push(time.getMonth() + 1 + "月" + time.getDate() + "日");
      }
      return labels;
    },
  },
  watch: {},
  methods: {
    wellSize0(size) {
      return wellSize(size);
    },
    loadDayInfo() {
      dayStatinfo(
        (data) => {
          if (data.code === 200) {
            let info = data.data;
            let now = new Date().getTime();
            for (let i = 0; i < 7; i++) {
              let time = new Date(now - (6 - i) * (1000 * 60 * 60 * 24));
              time =
                time.getFullYear() +
                "-" +
                (time.getMonth() + 1) +
                "-" +
                time.getDate();
              if (info[time]) {
                this.$set(this.dayFileCount, i, info[time].fileCount);
                this.$set(
                  this.dayStorageSize,
                  i,
                  (info[time].fileSize / (1024 * 1024)).toFixed(2)
                );
                this.$set(
                  this.dayTrafficSize,
                  i,
                  (info[time].trafficSize / (1024 * 1024)).toFixed(2)
                );
                this.$set(this.dayRequestTimes, i, info[time].visitCount);
                this.$set(this.dayUserCount, i, info[time].userCount);
              }
            }
          }
        },
        () => {}
      );
    },
    loadVisitData() {
      visitDataStatinfo(
        "",
        "",
        (data) => {
          if (data.code === 200) {
            let browers = data.data.browser;
            let browserDatasets = {
              backgroundColor: this.colors.slice(0, browers.length),
              data: [],
            };
            for (let i = 0; i < browers.length; i++) {
              this.$set(this.browserLabels, i, browers[i].browser);
              browserDatasets.data.push(browers[i].count);
            }
            this.browserDatasets = [];
            this.browserDatasets.push(browserDatasets);

            let oss = data.data.os;
            let osDatasets = {
              backgroundColor: this.colors.slice(0, oss.length),
              data: [],
            };

            for (let i = 0; i < oss.length; i++) {
              this.$set(this.osLabels, i, oss[i].os);
              osDatasets.data.push(oss[i].count);
            }
            this.osDatasets = [];
            this.osDatasets.push(osDatasets);

            let ips = data.data.ip;
            let ipDatasets = {
              backgroundColor: this.colors.slice(0, ips.length),
              data: [],
            };

            for (let i = 0; i < ips.length; i++) {
              this.$set(this.ipLabels, i, ips[i].ip);
              ipDatasets.data.push(ips[i].count);
            }
            this.ipDatasets = [];
            this.ipDatasets.push(ipDatasets);

            let referers = data.data.referer;
            let refererDatasets = {
              backgroundColor: this.colors.slice(0, referers.length),
              data: [],
            };

            for (let i = 0; i < referers.length; i++) {
              this.$set(this.refererLabels, i, referers[i].referer);
              refererDatasets.data.push(referers[i].count);
            }
            this.refererDatasets = [];
            this.refererDatasets.push(refererDatasets);
          }
        },
        () => {}
      );
    },
    loadRegionStatinfo(){
      regionStatinfo("","",data=>{
        if(data.code === 200){
          this.regionStat = data.data
        }
      },()=>{})
    },
    loadTopUsedInfo() {
      topStatinfo("", "", (data) => {
        if (data.code === 200) {
          let visitFiles = data.data.file;
          this.visit_file_data = [];
          for (let visitFile of visitFiles) {
            this.visit_file_data.push({
              fileName: visitFile.fileName,
              visitCount: visitFile.visitCount,
            });
          }
        }
      });
    },
    loadStat() {
      myStatinfo(
        "month",
        "",
        "",
        (data) => {
          if (data.code === 200) {
            this.stat = data.data;
            this.loadRegionStatinfo()
            this.loadDayInfo();
            this.loadVisitData();
            this.loadTopUsedInfo();
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
    },
  },
};
</script>

<style scoped>
.piechar {
  padding: 30px 20px;
}
.title {
  padding-bottom: 20px;
  text-align: center;
}
</style>

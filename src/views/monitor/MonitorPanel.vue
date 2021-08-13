<template>
  <CCard>
    <CCardHeader>
      <div style="display:flex">
        <div style="flex:1;margin-top:9px;height:20px;">{{ title }}</div>
        <CDropdown :caret="false" style="width:40px;flex-shark:0">
          <template #toggler-content>
            <CIcon :height="25" :content="$options.freeSet.cilOptions" />
          </template>
          <CDropdownItem @click="$emit('editMonitor', monitorId)"
            ><span>编辑</span></CDropdownItem
          >
          <CDropdownItem @click="$emit('deleteMonitor', monitorId)"
            ><span style="color:red">删除</span></CDropdownItem
          >
        </CDropdown>
      </div>
    </CCardHeader>
    <CCardBody>
      <CRow
        v-if="
          data.type === 'resource' &&
            data.resourceData &&
            data.resourceData.length === 1
        "
      >
        <CCol md="6" style="text-align:center">
          <el-progress
            type="circle"
            :stroke-width="15"
            :percentage="percentage"
            :status="status"
          ></el-progress>
        </CCol>
        <CCol md="6">
          <p>{{ formatText }}</p>
          <p>{{ tips }}</p>
          <p>
            {{ wellTime(data.resourceData[0].createTime) }} 到
            {{ wellTime(data.resourceData[0].expireTime) }}
          </p>
        </CCol>
      </CRow>
      <CRow
        v-if="
          data.type === 'resource' &&
            data.resourceData &&
            data.resourceData.length > 1
        "
      >
        <CCol md="12" v-for="item in data.resourceData" v-bind:key="item.id">
          <CRow>
            <CCol md="4">{{ item.name }}</CCol>
            <CCol md="8">
              <el-progress
                :percentage="item.used / item.total"
                :stroke-width="10"
                :show-text="false"
              ></el-progress>
              <span class="p">{{item.wellUsed + '/' + item.wellTotal}}</span>
              <span class="p">有效日期 {{ wellTime(item.createTime) }} 到
            {{ wellTime(item.expireTime) }}</span>
            </CCol>
          </CRow>
           <div style="height:10px"></div>
        </CCol>
        
      </CRow>
      <CRow v-if="data.type === 'static' && data.staticData">
        <CCol md="6" v-for="item in data.staticData" v-bind:key="item.name">
          <CRow>
            <CCol md="6"
              ><b>{{ item.name }}</b></CCol
            >
            <CCol md="6">{{ item.wellValue }}</CCol>
          </CRow>
          <div style="height:10pxr"></div>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import { monitorData } from "../../api/adminapi";
import { CChartBar } from "@coreui/vue-chartjs";
import { freeSet } from "@coreui/icons";
import moment from "moment";

export default {
  name: "MonitorPanel",
  components: {
    CChartBar,
  },
  freeSet,
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
    this.loadData();
  },
  methods: {
    wellTime(time) {
      return moment(new Date(time * 1000)).format("YYYY-MM-DD");
    },
    forceUpdate() {
      this.loadData();
    },
    loadData() {
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
  },
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

.p{
  display: block;
  font-size: 12px;
  margin: 2px ;
}
</style>

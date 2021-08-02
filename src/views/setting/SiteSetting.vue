<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="10" xl="6">
        <CCard>
          <CCardHeader>
            站点设置
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  允许注册
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    :checked.sync="setting.allowRegister"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <div v-if="setting.allowRegister">
                <CInput
                  label="默认存储"
                  type="number"
                  append="MB"
                  horizontal
                  v-model="setting.registerConfig.storageSize"
                  description="新用户默认存储配额"
                />
                <CInput
                  label="默认月流量"
                  type="number"
                  append="MB"
                  horizontal
                  v-model="setting.registerConfig.trafficPerMonth"
                  description="新用户默认每月流量"
                />
                <CRow form class="form-group">
          <CCol sm="3">
            用户组
          </CCol>
          <CCol sm="9">
            <CRow>
              <CCol sm="12">
                <select
                  class="form-control"
                  v-model="setting.registerConfig.groupId"
                  style="width:100%"
                >
                  <option :value="-1">不设置组</option>

                  <option
                    v-for="group in groups"
                    v-bind:key="group.id"
                    :value="group.id"
                    >{{ group.name }}</option
                  >
                </select>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
              </div>
              <CTextarea
                label="上传页欢迎语"
                type="text"
                v-model="setting.welcomeText"
                horizontal
                rows="3"
              />
              <CInput
                label="备案号"
                type="text"
                v-model="setting.ipc"
                horizontal
              />
            </CForm>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> </CCol>
              <CCol sm="6" md="4">
                <CButton block color="primary" size="sm" @click="saveSetting"
                  >保存配置</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { getGlobalSetting, setGlobalSetting,groupAll } from "../../api/adminapi";

export default {
  name: "SiteSetting",
  components: {},
  data() {
    return {
      setting: {
        allowRegister: false,
        welcomeText: "",
        ipc: "",
      },
      groups:[]
    };
  },
  created: function() {
    this.loadAllGroups();
    getGlobalSetting(
      "site",
      (data) => {
        if (data.code === 200) {
          this.setting = data.data;
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
  methods: {
    loadAllGroups() {
      groupAll(
        (data) => {
          if (data.code === 200) {
            this.groups = data.data;
          } else {
            console.error("加载组信息失败");
          }
        },
        () => {}
      );
    },
    saveSetting() {
      this.setting.registerConfig.storageSize = parseInt(this.setting.registerConfig.storageSize)
      this.setting.registerConfig.trafficPerMonth = parseInt(this.setting.registerConfig.trafficPerMonth)
      setGlobalSetting(
        "site",
        this.setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存站点配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存站点配置出错，原因${data.reason}`,
          });
        }
      );
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

button {
  border-radius: 2px;
  border: none;
  margin-left: 2px;
  margin-right: 2px;
  font-size: 12px;
  outline: none;
}
</style>

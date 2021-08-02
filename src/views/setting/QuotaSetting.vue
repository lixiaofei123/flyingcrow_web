<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="10" xl="6">
        <CCard>
          <CCardHeader>
            新用户默认配额管理
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                label="存储"
                type="number"
                append="MB"
                horizontal
                v-model="setting.defaultStorageSize"
                description="新用户默认存储配额"
                :disabled="readonly"
              />
              <CInput
                label="月流量"
                type="number"
                append="MB"
                horizontal
                v-model="setting.defaultTrafficPerMonth"
                description="新用户默认每月流量"
                :disabled="readonly"
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
import { getSetting, setSetting } from "../../api/api";

export default {
  name: "OtherSetting",
  components: {},
  data() {
    return {
      setting: {
        defaultStorageSize: 0,
        defaultTrafficPerMonth: 0,
      },
    };
  },
  created: function() {
    getSetting(
      "quota",
      (data) => {
        if (data.code === 200) {
          this.setting = data.data;
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载配额配置出错，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    saveSetting() {
      this.setting.defaultStorageSize = parseInt(
        this.setting.defaultStorageSize
      );
      this.setting.defaultTrafficPerMonth = parseInt(
        this.setting.defaultTrafficPerMonth
      );
      setSetting(
        "quota",
        this.setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存配额配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存配额配置出错，原因${data.reason}`,
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

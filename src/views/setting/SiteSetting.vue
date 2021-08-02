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
import { getGlobalSetting, setGlobalSetting } from "../../api/adminapi";

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
    };
  },
  created: function() {
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
    saveSetting() {
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

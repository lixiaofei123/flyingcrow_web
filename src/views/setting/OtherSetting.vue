<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="10" xl="6">
        <CCard>
          <CCardHeader>
            其它设置
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  启用在线作图
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    :checked.sync="setting.enableDrawio"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <CInput
                v-if="setting.enableDrawio"
                label="DrawIO地址"
                v-model="setting.drawioUrl"
                description="填写drawIO服务的地址，不填默认官网地址"
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
import { getSetting, setSetting } from "../../api/api";

export default {
  name: "OtherSetting",
  components: {},
  data() {
    return {
      setting: {
        enableDrawio: false,
        drawioUrl: "",
      },
    };
  },
  created: function() {
    getSetting(
      "other",
      (data) => {
        if (data.code === 200) {
          this.setting = data.data;
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载其它配置出错，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    saveSetting() {
      setSetting(
        "other",
        this.setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存其它配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存其它配置出错，原因${data.reason}`,
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

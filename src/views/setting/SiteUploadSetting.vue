<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="10" xl="8">
        <CCard>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  允许匿名上传
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    :checked.sync="setting.allowAnonymousUpload"
                    class="mr-1"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  启用图片压缩
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    :checked.sync="setting.enableCompress"
                    class="mr-1"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <CInput
                label="单个文件大小"
                type="number"
                append="MB"
                v-model="setting.maxFileSize"
                horizontal
              />
              <CInput
                label="允许文件后缀"
                type="text"
                horizontal
                v-model="setting.allowFileExtension"
                description="不同后缀用逗号隔开，例如jpg,png"
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  上传目录<HelpTips
                    tips="通过变量来指定上传后的存储路径，目前支持的变量有 YYYY、MM、DD、HH、UUID、TIMESTAMP、RANDOM、FILENAME"
                  ></HelpTips>
                </CCol>
                <CCol sm="9">
                  <CInput
                    type="text"
                    v-model="setting.pathRole"
                    description="配置默认上传路径，例如/YYYY/MM/DD"
                  />
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  逻辑文件名<HelpTips
                    tips="通过变量来指定上传后的逻辑文件名，目前支持的变量有 YYYY、MM、DD、HH、UUID、TIMESTAMP、RANDOM、FILENAME,文件名越随机越好"
                  ></HelpTips>
                </CCol>
                <CCol sm="9">
                  <CInput
                    type="text"
                    v-model="setting.nameRole"
                    description="配置逻辑文件名，例如UUID-FILENAME"
                  />
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  物理文件名<HelpTips
                    tips="通过变量来指定上传后的物理文件名，外部链接使用此文件名，与逻辑文件名不一致可以防止别人猜测出外部链接地址，目前支持的变量有 YYYY、MM、DD、HH、UUID、TIMESTAMP、RANDOM、FILENAME,文件名越随机越好"
                  ></HelpTips>
                </CCol>
                <CCol sm="9">
                  <CInput
                    type="text"
                    v-model="setting.saveNameRole"
                    description="配置物理文件名，例如UUID-FILENAME"
                  />
                </CCol>
              </CRow>
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
import HelpTips from "../base/HelpTips.vue";
import { getGlobalSetting, setGlobalSetting } from "../../api/adminapi";

export default {
  name: "SiteUploadSetting",
  components: {
    HelpTips,
  },
  data() {
    return {
      setting: {
        allowAnonymousUpload: true,
        enableCompress: false,
        maxFileSize: 0,
        allowFileExtension: "",
        nameRole: "",
        saveNameRole: "",
        pathRole: "",
      },
    };
  },
  created: function() {
    getGlobalSetting(
      "siteupload",
      (data) => {
        if (data.code === 200) {
          this.setting = data.data;
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载上传配置出错，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    saveSetting() {
      this.setting.maxFileSize = parseInt(this.setting.maxFileSize);
      setGlobalSetting(
        "siteupload",
        this.setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存上传配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存上传配置出错，原因${data.reason}`,
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
.tab-pane {
  padding-top: 40px;
}
</style>

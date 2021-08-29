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
              <CInput
                label="站点标题"
                type="text"
                v-model="setting.siteTitle"
                horizontal
              />
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
                label="法律声明"
                type="text"
                v-model="setting.legalStatement"
                description="此句话会在底部左侧显示"
                horizontal
              />
              <CInput
                label="备案号"
                type="text"
                v-model="setting.icp"
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
      <CCol sm="12" md="12" lg="10" xl="6">
        <CCard>
          <CCardHeader>
            页面UI设计
          </CCardHeader>
          <CCardBody>
            <CForm>
              <ImageUploader
                :imageUrl="setting.logo"
                @uploadImageSuccess="uploadLogoImageSuccess"
                :uploadUrl="uploadAction"
                :maxFilesize="500"
                label="LOGO"
                title="站点LOGO"
              ></ImageUploader>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  背景为图片
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    :checked.sync="setting.bgIsImage"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <ImageUploader
                v-if="setting.bgIsImage"
                :imageUrl="setting.bgImage"
                @uploadImageSuccess="uploadBgImageSuccess"
                :uploadUrl="uploadAction"
                :maxFilesize="2000"
                label="背景图片"
                title="背景图片"
              ></ImageUploader>
              <CRow form class="form-group" v-if="!setting.bgIsImage">
                <CCol sm="3">
                  背景颜色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.bgColor"
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  导航栏背景色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.navBarBgColor"
                         show-alpha
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  导航栏文字颜色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.navBarTextColor"
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  欢迎框背景色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.welcomeTextBGColor"
                         show-alpha
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  欢迎框文字颜色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.welcomeTextColor"
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  上传框背景色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.uploadBoxBgColor"
                         show-alpha
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  上传框文字颜色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.uploadBoxTextColor"
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  脚部框背景色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.footBarBGColor"
                         show-alpha
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  脚部框文字颜色
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <el-color-picker
                        v-model="setting.footBarTextColor"
                      ></el-color-picker>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  getGlobalSetting,
  setGlobalSetting,
  groupAll,
} from "../../api/adminapi";

import ImageUploader from "../components/ImageUploader.vue";

export default {
  name: "SiteSetting",
  components: {
    ImageUploader,
  },
  data() {
    return {
      uploadAction: "",
      setting: {
        allowRegister: false,
        welcomeText: "",
        icp: "",
        allowRegister: false,
        bgColor: "",
        bgImage: "",
        bgIsImage: false,
        footBarTextColor: "",
        footBarBGColor: "",
        logo: "",
        navBarBgColor: "",
        navBarTextColor: "",
        uploadBoxBgColor: "",
        uploadBoxTextColor: "",
        welcomeTextBGColor: "",
        welcomeTextColor: "",
      },
      groups: [],
    };
  },
  created: function() {
    this.uploadAction = `${window.globalConfig.url}/file/upload`;

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
    uploadLogoImageSuccess(resp) {
      this.setting.logo = resp.data.urls[resp.data.urls.length - 1];
    },
    uploadBgImageSuccess(resp) {
      this.setting.bgImage = resp.data.urls[resp.data.urls.length - 1];
    },
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
      this.setting.registerConfig.storageSize = parseInt(
        this.setting.registerConfig.storageSize
      );
      this.setting.registerConfig.trafficPerMonth = parseInt(
        this.setting.registerConfig.trafficPerMonth
      );
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

<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="6" xl="6">
        <CCard>
          <CCardHeader>
            访问控制
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  允许匿名访问
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    :checked.sync="setting.allowAnonymousRead"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <CRow form class="form-group" v-if="!setting.allowAnonymousRead">
                <CCol tag="label" sm="3" class="col-form-label">
                  允许他人访问
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    :checked.sync="setting.allowOtherRead"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <div v-if="setting.allowAnonymousRead">
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    允许空referer
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      :checked.sync="setting.allowEmptyReferer"
                      color="primary"
                    />
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    启用referer控制
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      :checked.sync="setting.enableRefererList"
                      color="primary"
                    />
                  </CCol>
                </CRow>
                <div v-if="setting.enableRefererList">
                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Referer白名单模式
                    </CCol>
                    <CCol sm="9">
                      <CSwitch
                        class="mr-1"
                        :checked.sync="setting.isRefererWhiteList"
                        color="primary"
                      />
                    </CCol>
                  </CRow>
                  <CTextarea
                    v-if="setting.isRefererWhiteList"
                    v-model="setting.refererWhiteListStr"
                    label="白名单"
                    type="text"
                    description="每个referer一行，支持*通配符"
                    horizontal
                    rows="3"
                  />
                  <CTextarea
                    v-if="!setting.isRefererWhiteList"
                    v-model="setting.refererBlackListStr"
                    label="黑名单"
                    type="text"
                    description="每个referer一行，支持*通配符"
                    horizontal
                    rows="3"
                  />
                </div>
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    启用IP控制
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      :checked.sync="setting.enableIPList"
                      color="primary"
                    />
                  </CCol>
                </CRow>
                <div v-if="setting.enableIPList">
                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      IP白名单模式
                    </CCol>
                    <CCol sm="9">
                      <CSwitch
                        class="mr-1"
                        :checked.sync="setting.isIPWhiteList"
                        color="primary"
                      />
                    </CCol>
                  </CRow>
                  <CTextarea
                    v-if="setting.isIPWhiteList"
                    v-model="setting.ipWhiteListStr"
                    label="白名单"
                    type="text"
                    horizontal
                    rows="3"
                  />
                  <CTextarea
                    v-if="!setting.isIPWhiteList"
                    v-model="setting.ipBlackListStr"
                    label="黑名单"
                    type="text"
                    horizontal
                    rows="3"
                  />
                </div>
                <CInput
                  label="每IP每日流量"
                  type="number"
                  append="MB"
                  horizontal
                  v-model="setting.trafficPerDayPerIP"
                /><CRow form class="form-group">
                  <CCol sm="3">
                    超限策略
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <select
                          class="form-control"
                          style="width:100%"
                          v-model="setting.beyondStrategy"
                        >
                          <option
                            v-for="(value, key) in beyondStrategy"
                            v-bind:key="key"
                            :value="key"
                            >{{ value }}</option
                          >
                        </select>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
            </CForm>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> </CCol>
              <CCol sm="6" md="4">
                <CButton block color="primary" size="sm" @click="saveSetting"
                  >保存访问配置</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" md="12" lg="6" xl="6">
        <CCard>
          <CCardHeader>
            缓存控制
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  开启缓存控制
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    :checked.sync="ccsettings.clientCacheEnable"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <CRow form class="form-group" v-if="ccsettings.clientCacheEnable">
                <CCol sm="12">
                  配置后缀以及缓存时间
                  <CButton
                    color="info"
                    size="sm"
                    class="float-right"
                    style="width:120px"
                    @click="addNewCCSetting"
                    >新增</CButton
                  >
                  <div style="height:20px"></div>
                </CCol>
                <CCol
                  sm="12"
                  v-for="item in ccsettings.list"
                  v-bind:key="item.index"
                >
                  <CRow>
                    <CCol md="6">
                      <CInput
                        type="text"
                        placeholder="后缀，用,号隔开"
                        v-model="item.extensions"
                      />
                    </CCol>
                    <CCol md="3">
                      <CInput
                        type="number"
                        append="秒"
                        v-model="item.expireTime"
                      />
                    </CCol>
                    <CCol md="3">
                      <CButton
                        color="danger"
                        style="width:100%"
                        size="sm"
                        @click="deleteCCSetting(item.index)"
                        >删除</CButton
                      >
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> </CCol>
              <CCol sm="6" md="4">
                <CButton block color="primary" size="sm" @click="saveCCSetting"
                  >保存缓存配置</CButton
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
  name: "ACSetting",
  components: {},
  data() {
    return {
      setting: {
        allowAnonymousRead: false,
        allowEmptyReferer: false,
        enableRefererList: false,
        isRefererWhiteList: false,
        refererWhiteListStr: "",
        refererBlackListStr: "",
        refererWhiteList: [],
        refererBlackList: [],
        enableIPList: false,
        isIPWhiteList: false,
        ipWhiteListStr: "",
        ipBlackListStr: "",
        ipWhiteList: [],
        ipBlackList: [],
        trafficPerDayPerIP: 0,
        beyondStrategy: "",
      },
      ccsettings: {
        clientCacheEnable: false,
        list: [],
      },
      beyondStrategy: {
        blacklist: "拉入黑名单",
        layAside: "不处理",
      },
    };
  },
  created: function() {
    getSetting(
      "ac",
      (data) => {
        if (data.code === 200) {
          this.setting = data.data;
          this.setting.refererWhiteListStr = this.setting.refererWhiteList.join(
            "\n"
          );
          this.setting.refererBlackListStr = this.setting.refererBlackList.join(
            "\n"
          );
          this.setting.ipWhiteListStr = this.setting.ipWhiteList.join("\n");
          this.setting.ipBlackListStr = this.setting.ipBlackList.join("\n");
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载访问控制配置出错，原因${data.reason}`,
        });
      }
    );

    getSetting(
      "cc",
      (data) => {
        if (data.code === 200) {
          this.ccsettings = {
            clientCacheEnable: data.data.clientCacheEnable,
            list: [],
          };
          if (data.data.list) {
            for (let item of data.data.list) {
              if (item.extensions !== "") {
                this.ccsettings.list.push({
                  extensions: item.extensions,
                  expireTime: parseInt(item.expireTime),
                });
              }
            }
          }
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载缓存控制配置出错，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    saveCCSetting() {
      let setting = {
        clientCacheEnable: this.ccsettings.clientCacheEnable,
        list: [],
      };
      for (let item of this.ccsettings.list) {
        if (item.extensions !== "") {
          setting.list.push({
            extensions: item.extensions,
            expireTime: parseInt(item.expireTime),
          });
        }
      }
      setSetting(
        "cc",
        setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存缓存控制配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存缓存控制配置出错，原因${data.reason}`,
          });
        }
      );
    },
    findListMaxIndex() {
      let maxIndex = 0;
      for (let item of this.ccsettings.list) {
        if (item.index > maxIndex) {
          maxIndex = item.index;
        }
      }
      return maxIndex;
    },
    deleteCCSetting(index) {
      let itemIndex = this.ccsettings.list.findIndex((i) => i.index === index);
      if (itemIndex !== -1) {
        this.ccsettings.list.splice(itemIndex, 1);
      }
    },
    addNewCCSetting() {
      let maxIndex = this.findListMaxIndex();
      this.ccsettings.list.unshift({
        index: maxIndex + 1,
        extensions: "",
        expireTime: 3600,
      });
    },
    saveSetting() {
      this.setting.trafficPerDayPerIP = parseInt(
        this.setting.trafficPerDayPerIP
      );
      this.setting.refererWhiteList = this.setting.refererWhiteListStr.split(
        "\n"
      );
      this.setting.refererBlackList = this.setting.refererBlackListStr.split(
        "\n"
      );
      this.setting.ipWhiteList = this.setting.ipWhiteListStr.split("\n");
      this.setting.ipBlackList = this.setting.ipBlackListStr.split("\n");
      setSetting(
        "ac",
        this.setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存访问控制配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存访问控制配置出错，原因${data.reason}`,
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

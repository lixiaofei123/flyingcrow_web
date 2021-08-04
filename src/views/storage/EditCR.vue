<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="10" xl="6">
        <CCard>
          <CCardHeader>
            {{ title }}
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                label="名称"
                horizontal
                :disabled="readonly"
                v-model="cr.name"
              />
              <CRow form class="form-group">
                <CCol sm="3">
                  内容审核策略类型
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <select
                        class="form-control"
                        v-model="cr.type"
                        style="width:100%"
                        :disabled="readonly"
                      >
                        <option
                          v-for="(value, key) in crTypes"
                          v-bind:key="key"
                          :value="key"
                          >{{ value }}</option
                        >
                      </select>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>

              <CRow form class="form-group">
                <CCol sm="3">
                  审核类型
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <div class="select-box">
                        <div
                          class="select-item"
                          @click="changeDetectTypes('porn')"
                          v-bind:class="{
                            'select-item-active': hasPorn,
                          }"
                        >
                          涉黄
                        </div>
                        <div
                          class="select-item"
                          @click="changeDetectTypes('terrorist')"
                          v-bind:class="{
                            'select-item-active': hasTerrorist,
                          }"
                        >
                          涉恐暴
                        </div>
                        <div
                          class="select-item"
                          @click="changeDetectTypes('politics')"
                          v-bind:class="{
                            'select-item-active': hasPolitics,
                          }"
                        >
                          涉政
                        </div>
                        <div
                          class="select-item"
                          @click="changeDetectTypes('ads')"
                          v-bind:class="{
                            'select-item-active': hasAds,
                          }"
                        >
                          广告
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">
                  允许通过最小级别
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <select
                        class="form-control"
                        v-model="cr.minLevel"
                        style="width:100%"
                        :disabled="readonly"
                      >
                        <option
                          v-for="(value, key) in levels"
                          v-bind:key="key"
                          :value="key"
                          >{{ value }}</option
                        >
                      </select>
                      <span style="color:red" v-if="cr.minLevel !== 'normal'"
                        >允许【敏感/疑似敏感】级别通过可能会有法律风险，请谨慎选择</span
                      >
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label">
                <CButton class="btn" color="info" size="sm" @click="goBack"
                  >返回上一级</CButton
                >
              </CCol>
              <CCol sm="6" md="4">
                <CButton
                  v-if="!readonly"
                  block
                  color="primary"
                  size="sm"
                  @click="submitCR"
                  >提交</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" md="12" lg="10" xl="6" v-if="cr.type">
        <CCard>
          <CCardHeader>
            {{ crtitle }}
          </CCardHeader>
          <CCardBody>
            <CForm v-if="cr.type === 'aliyun'">
              <CInput
                label="Endpoint"
                horizontal
                v-model="cr.config.endpoint"
                :disabled="readonly"
              />
              <CInput
                label="accessKeyId"
                horizontal
                v-model="cr.config.accessKeyId"
                :disabled="readonly"
              />
              <CInput
                label="accessKeySecret"
                horizontal
                v-model="cr.config.accessKeySecret"
                :disabled="readonly"
              />
            </CForm>
            <CForm v-if="cr.type === 'qqcloud'">
              <CInput
                label="BucketName"
                horizontal
                v-model="cr.config.bucketName"
                :disabled="readonly"
              />
              <CInput
                label="Region"
                horizontal
                v-model="cr.config.region"
                :disabled="readonly"
              />
              <CInput
                label="secretID"
                horizontal
                v-model="cr.config.secretID"
                :disabled="readonly"
              />
              <CInput
                label="secretKey"
                horizontal
                v-model="cr.config.secretKey"
                :disabled="readonly"
              />
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { findCRById, newCR, updateCR } from "../../api/adminapi";
import { deepCopy } from "../../utils/utils";

export default {
  name: "EditCR",
  components: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath.includes("crs");
    });
  },
  data() {
    return {
      crTypes: {
        aliyun: "阿里云盾-内容安全",
        qqcloud: "腾讯数据万象-图片审核",
      },
      readonly: false,
      cr: {
        name: "",
        type: "aliyun",
        default: false,
        minLevel: "normal",
        detectTypes: [],
        config: {},
      },
      levels: {
        block: "敏感",
        Suspected: "疑似敏感",
        normal: "正常",
      },
    };
  },
  created: function() {
    this.sid = this.$route.params.id;
    let path = this.$route.path;
    if (path.indexOf("/crs/show/") !== -1) {
      this.readonly = true;
    }
    if (this.sid > 0) {
      this.resetCR();
    }
  },
  methods: {
    resetCR() {
      findCRById(
        this.sid,
        (data) => {
          if (data.code === 200) {
            this.cr = data.data;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取内容审核策略信息，原因${data.reason}`,
          });
        }
      );
    },
    changeDetectTypes(detectType) {
      if (!this.readonly) {
        let index = this.cr.detectTypes.findIndex((t) => t === detectType);
        if (index !== -1) {
          this.cr.detectTypes.splice(index, 1);
        } else {
          this.cr.detectTypes.push(detectType);
        }
      }
    },
    goBack() {
      this.usersOpened
        ? this.$router.go(-1)
        : this.$router.push({ path: "/admin/crs" });
    },
    submitCR() {
      this.cr.capacity = parseInt(this.cr.capacity);

      if (this.sid <= 0) {
        newCR(
          deepCopy(this.cr),
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `新增内容审核策略【${data.data.name}】成功`,
                type: "success",
              });
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `新增内容审核策略【${this.cr.name}】失败，原因${data.reason}`,
            });
          }
        );
      } else {
        updateCR(
          this.sid,
          deepCopy(this.cr),
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `更新内容审核策略【${data.data.name}】成功`,
                type: "success",
              });
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `更新内容审核策略【${this.cr.name}】失败，原因${data.reason}`,
            });
          }
        );
      }
    },
  },
  computed: {
    hasPorn: function() {
      return this.cr.detectTypes.findIndex((t) => t === "porn") !== -1;
    },
    hasTerrorist: function() {
      return this.cr.detectTypes.findIndex((t) => t === "terrorist") !== -1;
    },
    hasPolitics: function() {
      return this.cr.detectTypes.findIndex((t) => t === "politics") !== -1;
    },
    hasAds: function() {
      return this.cr.detectTypes.findIndex((t) => t === "ads") !== -1;
    },
    crtitle: function() {
      if (this.cr.type === "aliyun") {
        return "配置阿里云盾";
      }
      if (this.cr.type === "qqcloud") {
        return "配置腾讯云数据万象";
      }
    },
    title: function() {
      if (this.sid <= 0) {
        return "添加新的内容审核策略";
      } else {
        return "编辑数据内容审核策略";
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
.select-box {
  display: flex;
}
.select-item {
  padding: 5px 15px;
  border: 1px solid #737373;
  background-color: #fff;
  color: #555;
  transition: all 0.3s ease 0s;
  margin-right: 15px;
  cursor: pointer;
  font-size: 12px;
}
.select-item:hover {
  border: 1px solid #000;
  color: #111;
}
.select-item-active {
  border: 1px solid rgb(50, 31, 219);
  color: white;
  background: rgb(50, 31, 219);
}
</style>

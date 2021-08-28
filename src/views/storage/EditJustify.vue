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
                v-model="justify.name"
              />
              <CRow form class="form-group">
                <CCol sm="3">
                  CDN厂商
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <select
                        class="form-control"
                        v-model="justify.type"
                        style="width:100%"
                         :disabled="readonly"
                      >
                        <option
                          v-for="(value, key) in justifyTypes"
                          v-bind:key="key"
                          :value="key"
                          >{{ value }}</option
                        >
                      </select>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CInput
                label="访问频次限制"
                append="每IP每秒"
                description="每个IP每秒最大访问次数，小于0则不限制"
                type="number"
                horizontal
                :disabled="readonly"
                v-model="justify.acConfig.maxRequestPerIPSec"
              />
              <CRow form class="form-group" v-if="justify.acConfig.maxRequestPerIPSec > 0">
                <CCol sm="3">
                  超限策略
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <select
                        class="form-control"
                        v-model="justify.acConfig.beyondStrategy"
                        style="width:100%"
                         :disabled="readonly"
                      >
                        <option value="layAside">不处理</option>
                        <option value="blacklist">拉黑</option>
                        <option value="limitRequest">限制访问</option>
                        >
                      </select>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>

              <CInput
              v-if="justify.acConfig.maxRequestPerIPSec > 0 && justify.acConfig.beyondStrategy == 'limitRequest'"
                label="限制时间"
                append="秒"
                description="被限制访问的IP多久后解封，小于0则永不解封"
                type="number"
                horizontal
                :disabled="readonly"
                v-model="justify.acConfig.limitTime"
              />
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
                  @click="submitJustify"
                  >提交</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" md="12" lg="10" xl="6" v-if="justify.type">
        <CCard>
          <CCardHeader>
            {{ justifytitle }}
          </CCardHeader>
          <CCardBody>
            <CForm v-show="justify.type">
              <div v-for="item in properties" v-bind:key="item.name">
                <CInput
                  v-if="item.type === 'string'"
                  :label="item.showName"
                  v-model="justify.config[item.name]"
                   :description="item.description + (item.secret ? '(此为机密参数，数据已加密)' : '') "
                  :disabled="readonly"
                  horizontal
                />
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  findJustifyById,
  newJustify,
  updateJustify,
  allJustifyTypes,
} from "../../api/adminapi";

export default {
  name: "EditJustify",
  components: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath.includes("justifys");
    });
  },
  data() {
    return {
      justifyTypes: {},
      readonly: false,
      justify: {
        id: -1,
        type: "qqcdn",
        name: "",
        config: {},
        acConfig: {},
      },
      justifyProps: {},
      justifys: {},
    };
  },
  created: function() {
    this.sid = this.$route.params.id;
    let path = this.$route.path;
    if (path.indexOf("/justifys/show/") !== -1) {
      this.readonly = true;
    }

    allJustifyTypes(
      (data) => {
        for (let stype in data.data) {
          this.justifyTypes[stype] = data.data[stype].name;
        }

        this.justifyProps = data.data;
        if (this.sid > 0) {
          this.resetJustify();
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载鉴权类型失败，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    resetJustify() {
      findJustifyById(
        this.sid,
        (data) => {
          if (data.code === 200) {
            this.justify = data.data;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取鉴权信息失败，原因${data.reason}`,
          });
        }
      );
    },
    goBack() {
      this.usersOpened
        ? this.$router.go(-1)
        : this.$router.push({ path: "/admin/justifys" });
    },
    submitJustify() {
      if (this.justify.id === -1) {
        newJustify(
          this.justify,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `创建新鉴权策略【${this.justify.name}】成功`,
                type: "success",
              });
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `创建鉴权策略【${this.justify.name}】失败，原因${data.reason}`,
            });
          }
        );
      } else {
        updateJustify(
          this.justify.id,
          this.justify,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `更新鉴权策略【${data.data.name}】成功`,
                type: "success",
              });
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `更新鉴权策略失败，原因${data.reason}`,
            });
          }
        );
      }
    },
  },
  computed: {
    justifytitle: function() {
      return this.justifyTypes[this.justify.type];
    },
    title: function() {
      if (this.sid <= 0) {
        return "添加新的鉴权策略";
      } else {
        return "编辑鉴权策略";
      }
    },
    properties: function() {
      return this.justifyProps[this.justify.type] === undefined
        ? []
        : this.justifyProps[this.justify.type].properties;
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

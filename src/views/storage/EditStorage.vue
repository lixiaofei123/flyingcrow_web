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
                v-model="storage.name"
              />
              <CRow form class="form-group">
                <CCol sm="3">
                  存储类型
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <select
                        class="form-control"
                        v-model="storage.type"
                        style="width:100%"
                        :disabled="readonly"
                      >
                        <option
                          v-for="(value, key) in storageTypes"
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
                  读写权限
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <div class="select-box">
                        <div
                          class="select-item"
                          @click="changePermission('private')"
                          v-bind:class="{
                            'select-item-active':
                              storage.storagePermission === 'private',
                          }"
                        >
                          私有
                        </div>
                        <div
                          class="select-item"
                          @click="changePermission('public_read')"
                          v-bind:class="{
                            'select-item-active':
                              storage.storagePermission === 'public_read',
                          }"
                        >
                          公共读
                        </div>
                        <div
                          class="select-item"
                          @click="changePermission('public_write_read')"
                          v-bind:class="{
                            'select-item-active':
                              storage.storagePermission === 'public_write_read',
                          }"
                        >
                          公共读写
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  是否激活
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    color="primary"
                    :checked.sync="storage.active"
                    :disabled="readonly"
                  />
                </CCol>
              </CRow>
              <CInput
                label="总容量"
                type="number"
                append="MB"
                horizontal
                v-model="storage.capacity"
                :disabled="readonly"
              />
              <CRow form class="form-group">
                <CCol sm="3">
                  关联内容审核策略
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <select
                        class="form-control"
                        v-model="storage.crStrategy"
                        style="width:100%"
                      >
                        <option :value="0">不关联策略</option>
                        <option
                          v-for="item in crs"
                          v-bind:key="item.name"
                          :value="item.id"
                          >{{ item.name }}</option
                        >
                      </select>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  关联鉴权策略
                </CCol>
                <CCol sm="9" class="form-inline">
                  <CInputCheckbox
                    v-for="(v,k) in justifys"
                    :key="k"
                    :label="v.name"
                    :value="k"
                    :checked.sync="v.checked"
                    :inline="true"
                  />
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  外部访问链接
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol
                      sm="12"
                      v-for="(item, index) in storage.externUrls"
                      v-bind:key="index"
                    >
                      <CInput
                        :value="item"
                        :disabled="readonly"
                        @input="updateExternUrls($event, index)"
                      >
                        <template #append>
                          <CButton
                            v-if="!readonly"
                            color="danger"
                            @click="removeExternUrl(index)"
                            >移除</CButton
                          >
                        </template>
                      </CInput>
                    </CCol>
                    <CCol sm="12">
                      <CButton
                        v-if="!readonly"
                        size="sm"
                        color="info"
                        @click="addExternUrl"
                        >增加</CButton
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
                  @click="submitStorage"
                  >提交</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" md="12" lg="10" xl="6" v-if="storage.type">
        <CCard>
          <CCardHeader>
            {{ storagetitle }}
          </CCardHeader>
          <CCardBody>
            <CForm v-show="storage.type">
              <div v-for="item in properties" v-bind:key="item.name">
                <CInput
                  v-if="item.type === 'string'"
                  :label="item.showName"
                  v-model="storage.config[item.name]"
                  :description="item.description + (item.secret ? '(此为机密参数，数据已加密)' : '') "
                  horizontal
                  :disabled="readonly"
                />
                <CRow form class="form-group" v-if="item.type === 'bool'">
                  <CCol tag="label" sm="3" class="col-form-label">
                    {{ item.showName }}
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      :checked.sync="storage.config[item.name]"
                      color="primary"
                    /><br />
                    <span v-if="item.description" style="font-size:12px">{{
                      item.description
                    }}</span>
                  </CCol>
                </CRow>
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
  findStorageById,
  newStorage,
  updateStorage,
  allCRList,
  allStorageTypes,
  allJustifyList,
} from "../../api/adminapi";
import { deepCopy } from "../../utils/utils";

export default {
  name: "EditStorage",
  components: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath.includes("storages");
    });
  },
  data() {
    return {
      storageTypes: {
        alioss: "阿里云OSS",
        fs: "文件系统",
        qqcos: "腾讯云COS",
      },
      readonly: false,
      storage: {
        name: "",
        type: "fs",
        active: true,
        default: false,
        externUrls: [],
        capacity: 0,
        storagePermission: "private",
        config: {},
        justifys: [],
      },
      storageProps: {},
      crs: [],
      justifys: {},
    };
  },
  created: function() {
    this.sid = this.$route.params.id;
    let path = this.$route.path;
    if (path.indexOf("/storages/show/") !== -1) {
      this.readonly = true;
    }

    allStorageTypes(
      (data) => {
        for (let stype in data.data) {
          this.storageTypes[stype] = data.data[stype].name;
        }

        this.storageProps = data.data;

        allCRList(
          (data) => {
            if (data.code === 200) {
              this.crs = data.data;
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `获取存储策略列表失败，原因${data.reason}`,
            });
          }
        );
        allJustifyList(
          (data) => {
            if (data.code === 200) {
              for(let item of data.data){
                this.justifys[item.id] = {
                  name: item.name,
                  checked: false
                }
              }
            }

            if (this.sid > 0) {
              this.resetStorage();
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `获取CDN鉴权策略列表失败，原因${data.reason}`,
            });
          }
        );
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载存储策略类型失败，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    resetStorage() {
      findStorageById(
        this.sid,
        (data) => {
          if (data.code === 200) {
            this.storage = data.data;
            if(this.storage.justifys){
              for(let jid of this.storage.justifys){
                this.justifys[jid].checked = true
              }
            }
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取存储信息失败，原因${data.reason}`,
          });
        }
      );
    },
    changePermission: function(permission) {
      if (!this.readonly) {
        this.storage.storagePermission = permission;
      }
    },
    addExternUrl: function() {
      this.storage.externUrls = this.storage.externUrls || [];
      this.storage.externUrls.push("");
    },
    removeExternUrl: function(index) {
      this.storage.externUrls.splice(index, 1);
    },
    updateExternUrls: function(event, index) {
      this.storage.externUrls[index] = event;
    },
    goBack() {
      this.usersOpened
        ? this.$router.go(-1)
        : this.$router.push({ path: "/admin/storages" });
    },
    submitStorage() {
      this.storage.capacity = parseInt(this.storage.capacity);
      this.storage.justifys = []
      for(let key of Object.keys(this.justifys)){
        if(this.justifys[key].checked){
          this.storage.justifys.push(parseInt(key))
        }
      }
      

      if (this.sid <= 0) {
        newStorage(
          deepCopy(this.storage),
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `新增存储策略【${data.data.name}】成功`,
                type: "success",
              });
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `新增存储策略【${this.storage.name}】失败，原因${data.reason}`,
            });
          }
        );
      } else {
        updateStorage(
          this.sid,
          deepCopy(this.storage),
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `更新存储策略【${data.data.name}】成功`,
                type: "success",
              });
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `更新存储策略【${this.storage.name}】失败，原因${data.reason}`,
            });
          }
        );
      }
    },
  },
  computed: {
    storagetitle: function() {
      return this.storageTypes[this.storage.type];
    },
    title: function() {
      if (this.sid <= 0) {
        return "添加新的存储策略";
      } else {
        return "编辑数据存储策略";
      }
    },
    properties: function() {
      return this.storageProps[this.storage.type] === undefined
        ? []
        : this.storageProps[this.storage.type].properties;
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

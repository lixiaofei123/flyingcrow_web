<template>
  <CRow>
    <CCol col="12" lg="6">
      <CCard>
        <CCardHeader> {{ user.name }} 信息 </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow form class="form-group">
              <CCol sm="3">
                头像
              </CCol>
              <CCol sm="9">
                <CRow>
                  <CCol sm="12">
                    <div class="c-avatar" style="width:80px;height:80px;">
                      <img
                        :src="user.avatar"
                        class="c-avatar-img "
                        onerror="this.src='img/default_avatar.png'"
                      />
                    </div>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CInput
              label="登录账号"
              horizontal
              :disabled="readonly"
              v-model="user.name"
            /><CInput
              label="昵称"
              horizontal
              :disabled="true"
              v-model="user.nickName"
            />
            <CTextarea label="心情"  v-model="user.mood" :disabled="true" horizontal rows="3" />
            <CInput
              label="用户组"
              horizontal
              :disabled="readonly"
              v-model="user.groupName"
            />
            <CInput
              label="邮箱"
              horizontal
              :disabled="readonly"
              v-model="user.email"
            />
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label">
                是否禁用
              </CCol>
              <CCol sm="9">
                <CSwitch
                  class="mr-1"
                  color="primary"
                  :checked.sync="user.enable"
                  :disabled="readonly"
                />
              </CCol>
            </CRow>
            <CRow form class="form-group">
              <CCol sm="3">
                角色
              </CCol>
              <CCol sm="9">
                <CRow>
                  <CCol sm="12">
                    <select
                      class="form-control"
                      v-model="user.role"
                      style="width:100%"
                      :disabled="readonly"
                    >
                      <option
                        v-for="(value, key) in roleTypes"
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
              label="存储配额"
              type="number"
              append="MB"
              horizontal
              v-model="user.storageQuota"
              :disabled="readonly"
            />
            <CInput
              label="流量配额"
              type="number"
              append="MB"
              horizontal
              v-model="user.trafficQuota"
              :disabled="readonly"
            />
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton class="btn" color="info" @click="goBack">返回上一级</CButton>
          <CButton
            class="btn"
            color="primary"
            :hidden="!readonly"
            @click="editUser"
            >编辑用户</CButton
          >
          <CButton
            class="btn"
            color="secondary"
            :hidden="readonly"
            @click="cancelEditUser"
            >取消编辑</CButton
          >
          <CButton
            class="btn"
            color="primary"
            :hidden="readonly"
            @click="saveUser"
            >保存用户</CButton
          >
          <CButton class="btn" color="danger" @click="deleteUser"
            >删除此用户</CButton
          >
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol col="12" lg="6">
      <CRow>
        <CCol md="6">
          <CWidgetProgress
            :header="usedStorageQuotaText"
            text="已使用存储"
            :footer="usedStorageQuotaTip"
            :color="usedStorageQuotaColor"
            inverse
            :value="usedStorageQuotaProgress"
          />
        </CCol>
        <CCol md="6">
          <CWidgetProgress
            :header="usedTrafficQuotaText"
            text="本月使用流量"
            :footer="usedTrafficQuotaTip"
            :color="usedTrafficQuotaColor"
            inverse
            :value="usedTrafficQuotaProgress"
          />
        </CCol>
      </CRow>
    </CCol>
  </CRow>
</template>

<script>
import { findUserById, userStatinfo } from "../../api/adminapi";
import { wellSize } from "../../utils/utils";
export default {
  name: "User",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath.includes("users/list");
    });
  },
  data() {
    return {
      readonly: true,
      roleTypes: {
        user: "普通用户",
        admin: "管理员",
        superadmin: "超级管理员",
      },
      user: {},
      stat: {
        usedStorage: 0,
        usedTraffic: 0,
      },
    };
  },
  created() {
    let userId = this.$route.params.id;
    this.resetUser(userId);
  },
  computed: {
    usedStorageQuotaText() {
      return wellSize(this.stat.usedStorage);
    },
    usedTrafficQuotaText() {
      return wellSize(this.stat.usedTraffic);
    },
    usedStorageQuotaColor() {
      if (this.usedStorageQuotaProgress <= 50) {
        return "gradient-info";
      } else if (this.usedStorageQuotaProgress <= 80) {
        return "gradient-warning";
      } else {
        return "gradient-danger";
      }
    },
    usedTrafficQuotaColor() {
      if (this.usedTrafficQuotaProgress <= 50) {
        return "gradient-info";
      } else if (this.usedTrafficQuotaProgress <= 80) {
        return "gradient-warning";
      } else {
        return "gradient-danger";
      }
    },
    usedStorageQuotaTip() {
      if (this.usedStorageQuotaProgress <= 50) {
        return "目前存储空间充裕";
      } else if (this.usedStorageQuotaProgress <= 80) {
        return "存储空间告急";
      } else if (this.usedStorageQuotaProgress < 100) {
        return "存储即将用尽";
      } else {
        return "存储已经用尽";
      }
    },
    usedTrafficQuotaTip() {
      if (this.usedTrafficQuotaProgress <= 50) {
        return "目前流量充裕";
      } else if (this.usedTrafficQuotaProgress <= 80) {
        return "流量告急";
      } else if (this.usedTrafficQuotaProgress < 100) {
        return "流量即将用尽";
      } else {
        return "流量已经用尽";
      }
    },
    usedStorageQuotaProgress() {
      return (
        (this.stat.usedStorage / 1024 / 1024 / this.user.storageQuota) * 100
      );
    },
    usedTrafficQuotaProgress() {
      return (
        (this.stat.usedTraffic / 1024 / 1024 / this.user.trafficQuota) * 100
      );
    },
  },
  methods: {
    resetUser(userId) {
      findUserById(
        userId,
        (data) => {
          if (data.code === 200) {
            this.user = data.data;
            userStatinfo(
              userId,
              "month",
              "",
              "",
              (data) => {
                if (data.code === 200) {
                  this.stat = data.data;
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: `获取用户统计信息失败，原因${data.reason}`,
                  });
                }
              },
              () => {}
            );
          } 
        },
        data => {
          this.$notify.error({
              title: "错误",
              message: `获取用户信息失败，原因${data.reason}`,
            });
        }
      );
    },
    goBack() {
      this.usersOpened
        ? this.$router.go(-1)
        : this.$router.push({ path: "/admin/users/list" });
    },
    editUser() {
      this.readonly = false;
    },
    deleteUser() {},
    saveUser() {},
    cancelEditUser() {
      this.readonly = true;
      let userId = this.$route.params.id;
      this.resetUser(userId);
    },
  },
};
</script>
<style scoped>
.btn {
  margin-right: 20px;
}
.usedQuota {
  text-align: center;
}
</style>

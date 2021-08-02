<template>
  <div class="wrapper">
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="4" lg="8">
                用户管理
              </CCol>
              <CCol md="3" lg="2">
                <CInput
                  size="sm"
                  placeholder="请输入关键字"
                  v-model="searchWords"
                ></CInput>
              </CCol>
              <CCol md="2" lg="1">
                <CButton block color="primary" size="sm" @click="searchUser"
                  >搜索用户</CButton
                >
              </CCol>
              <CCol md="2" lg="1">
                <CButton block color="primary" size="sm" @click="newUser"
                  >添加用户</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <UserTable
              :items="users"
              @editUser="editUser"
              @deleteUser="deleteUser0"
              @enableUser="enableUser0"
              @userDetail="userDetail0"
            >
            </UserTable>
            <CPagination
              :active-page.sync="current"
              :pages="total"
            ></CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal :title="modalTitle" :show.sync="showEditUser">
      <CForm>
        <CInput
          label="用户名"
          :disabled="user.id !== -1"
          horizontal
          v-model="user.name"
        />
        <CInput label="邮箱" horizontal v-model="user.email" />
        <CInput
          label="密码"
          type="password"
          horizontal
          v-model="user.password"
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
                  v-model="user.groupId"
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
        />
        <CInput
          label="流量配额"
          type="number"
          append="MB"
          horizontal
          v-model="user.trafficQuota"
        />
      </CForm>
      <template #footer>
        <CButton @click="showEditUser = false">取消</CButton>
        <CButton @click="createOrUpdateUser" color="success">确认</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import UserTable from "./UserTable.vue";
import { wellSize } from "../../utils/utils";

import {
  userList,
  findUserById,
  newUser,
  updateUser,
  deleteUser,
  enableUser,
  getGlobalSetting,
  groupAll,
} from "../../api/adminapi";
export default {
  name: "Users",
  components: {
    UserTable,
  },
  data() {
    return {
      users: [],
      current: 1,
      limit: 5,
      total: 0,
      searchWords: "",
      query: "",
      modalTitle: "新增用户",
      showEditUser: false,
      defaultStorageSize: 10240,
      defaultTrafficPerMonth: 102400,
      groups: [],
      user: {
        id: -1,
        name: "",
        email: "",
        role: "admin",
        password: "",
        groupId: -1,
      },
      roleTypes: {
        user: "普通用户",
        admin: "管理员",
        superadmin: "超级管理员",
      },
    };
  },
  watch: {},
  created: function() {
    this.loadUsers(1);
    this.loadAllGroups();
    getGlobalSetting(
      "quota",
      (data) => {
        if (data.code === 200) {
          this.defaultStorageSize = data.data.defaultStorageSize;
          this.defaultTrafficPerMonth = data.data.defaultTrafficPerMonth;
        } else {
        }
      },
      () => {}
    );
  },
  methods: {
    loadAllGroups() {
      groupAll(
        (data) => {
          if (data.code === 200) {
            this.groups = data.data;
          } else {
            console.log("加载组信息失败");
          }
        },
        () => {}
      );
    },
    enableUser0(uid, enable) {
      enableUser(
        uid,
        enable,
        (data) => {
          if (data.code !== 200) {
            // 更新失败
          }
        },
        () => {}
      );
    },
    createOrUpdateUser() {
      if (this.user.id === -1) {
        // 新增
        newUser(
          this.user,
          (data) => {
            // 成功
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `创建新用户【${this.user.name}】成功`,
                type: "success",
              });
              this.loadUsers(1);
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `创建用户【${this.user.name}】失败，原因${data.reason}`,
            });
          }
        );
      } else {
        // 修改
        updateUser(
          this.user.id,
          this.user,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `更新新用户【${data.data.name}】成功`,
                type: "success",
              });

              this.loadUsers(this.current);
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `更新用户信息失败，原因${data.reason}`,
            });
          }
        );
      }

      this.showEditUser = false;
    },
    editUser(userId) {
      findUserById(
        userId,
        (data) => {
          if (data.code == 200) {
            this.user = data.data;
            this.user.groupId = this.user.groupId || -1;
            this.modalTitle = `编辑用户【${data.data.name}】`;
            this.showEditUser = true;
          }
        },
        () => {}
      );
    },
    userDetail0(userId) {
      this.$router.push({ path: `user/${userId}` });
    },
    deleteUser0(userId) {
      findUserById(
        userId,
        (data) => {
          if (data.code == 200) {
            this.$confirm(
              `此操作将永久删除用户【${data.data.name}】, 是否继续?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                deleteUser(
                  userId,
                  (data) => {
                    if (data.code === 200) {
                      this.$notify({
                        title: "成功",
                        message: `删除用户【${data.data.name}】成功`,
                        type: "success",
                      });
                      let index = this.users.findIndex(
                        (u) => u.id === data.data.id
                      );
                      this.users.splice(index, 1);
                    }
                  },
                  (data) => {
                    this.$notify.error({
                      title: "错误",
                      message: `删除用户失败，原因${data.reason}`,
                    });
                  }
                );
              })
              .catch(() => {});
          }
        },
        () => {}
      );
    },
    newUser() {
      this.user = {
        id: -1,
        name: "",
        email: "",
        role: "admin",
        enable: true,
        storageQuota: this.defaultStorageSize,
        trafficQuota: this.defaultTrafficPerMonth,
        groupId: -1,
      };
      this.modalTitle = "新增用户";
      this.showEditUser = true;
    },
    searchUser() {
      this.query = this.searchWords;
      this.loadUsers(1);
    },
    loadUsers(page) {
      userList(this.query, page, this.limit, (data) => {
        if (data.code == 200) {
          this.users = [];
          let list = data.data.list;
          this.limit = data.data.pageCount;
          this.current = data.data.pageIndex;
          this.total = data.data.totalPage;
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let user = {
              id: item.id,
              name: item.name,
              nickName: item.nickName,
              email: item.email,
              role: this.roleTypes[item.role],
              enable: item.enable,
              storageQuota: wellSize(item.storageQuota * 1024 * 1024),
              trafficQuota: wellSize(item.trafficQuota * 1024 * 1024),
              groupName: item.groupName,
            };
            this.users.push(user);
          }
        }
      });
    },
  },
  watch: {
    current(newVal) {
      this.loadUsers(newVal);
    },
  },
};
</script>

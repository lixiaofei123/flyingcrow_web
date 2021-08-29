<template>
  <div>
    <CRow>
      <CCol col="12" lg="6">
        <CCard>
          <CCardHeader> {{ group.name }} 信息 </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                label="组名"
                horizontal
                :disabled="readonly"
                v-model="group.name"
              />
              <CInput
                label="存储配额"
                type="number"
                append="MB"
                horizontal
                v-model="group.storageQuota"
                :disabled="readonly"
              />
              <CInput
                label="流量配额"
                type="number"
                append="MB"
                horizontal
                v-model="group.trafficQuota"
                :disabled="readonly"
              />
              <CInput
                label="成员数"
                type="number"
                horizontal
                v-model="group.count"
                :disabled="readonly"
              />

              <CInput
                label="关联存储"
                horizontal
                v-model="group.storageName"
                :disabled="readonly"
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  允许使用外部链接
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    color="primary"
                    :checked.sync="group.allowUseExternUrl"
                    :disabled="readonly"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton class="btn" color="info" @click="goBack"
              >返回上一级</CButton
            >
            <CButton class="btn" color="info" @click="addUser"
              >添加组成员</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol col="12" lg="6">
        <CCard>
          <CCardHeader> 组内成员 </CCardHeader>
          <CCardBody>
            <GroupUserTable
              :items="users"
              @removeUserFromGroup="removeUserFromGroup"
            ></GroupUserTable>
            <CPagination
              :active-page.sync="current"
              :pages="total"
            ></CPagination>
          </CCardBody>
          <CCardFooter> </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CModal title="添加组成员" :show="showModal" :no-close-on-backdrop="true">
      <div style="text-align:center">
        <el-autocomplete
          class="inline-input"
          v-model="selectName"
          :fetch-suggestions="querySearch"
          placeholder="请输入用户名"
          :trigger-on-focus="false"
          @select="handleSelect"
          size="medium"
        ></el-autocomplete>
      </div>

      <template #footer>
        <CButton @click="showModal = false">取消</CButton>
        <CButton @click="addUserToGroup0" color="success">添加</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import {
  findGroupById,
  groupUserList,
  deleteUserFromGroup,
  findFreeUser,
  addUserToGroup,
} from "../../api/adminapi";
import GroupUserTable from "./GroupUserTable.vue";

export default {
  name: "Group",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath.includes("users/groups");
    });
  },
  components: { GroupUserTable },
  data() {
    return {
      showModal: false,
      selectUser: -1,
      selectName: "",
      current: 1,
      limit: 5,
      total: 0,
      searchWords: "",
      query: "",
      readonly: true,
      group: {},
      users: [],
      groupId: -1,
      roleTypes: {
        user: "普通用户",
        admin: "管理员",
        superadmin: "超级管理员",
      },
    };
  },
  created() {
    this.groupId = this.$route.params.id;
    this.resetGroup();
    this.queryUsers(1);
  },
  computed: {},
  methods: {
    addUserToGroup0() {
      if (this.selectUser !== -1) {
        addUserToGroup(
          this.groupId,
          this.selectUser,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `用户添加成功`,
                type: "success",
              });
              this.queryUsers(1);
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `用户添加失败，原因${data.reason}`,
            });
          }
        );
      }
      this.selectUser = -1;
      this.selectName = "";
      this.showModal = false;
    },
    addUser() {
      this.showModal = true;
    },
    handleSelect(item) {
      this.selectUser = item.userId;
    },
    querySearch(queryString, cb) {
      if (queryString !== "") {
        findFreeUser(queryString, (data) => {
          if (data.code === 200) {
            let suggest = [];
            for (let user of data.data) {
              suggest.push({
                value: user.name,
                userId: user.id,
              });
            }
            cb(suggest);
          }
        });
      }
    },
    removeUserFromGroup(uid) {
      let index = this.users.findIndex((u) => u.id === uid);
      if (index !== -1) {
        this.$confirm(
          `此操作将从组【${this.group.name}】中移除该用户【${this.users[index].name}】, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteUserFromGroup(
              this.groupId,
              uid,
              (data) => {
                if (data.code === 200) {
                  let index = this.users.findIndex((u) => u.id === uid);
                  if (index != -1) {
                    this.users.splice(index, 1);
                  }
                }
              },
              (data) => {
                this.$notify.error({
                  title: "错误",
                  message: `移除用户组成员信息失败，原因${data.reason}`,
                });
              }
            );
          })
          .catch(() => {});
      }
    },
    queryUsers(page) {
      groupUserList(
        this.groupId,
        this.query,
        page,
        this.limit,
        (data) => {
          if (data.code === 200) {
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
                email: item.email,
                role: this.roleTypes[item.role],
              };
              this.users.push(user);
            }
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取用户组成员信息失败，原因${data.reason}`,
          });
        }
      );
    },
    resetGroup() {
      findGroupById(
        this.groupId,
        (data) => {
          if (data.code === 200) {
            this.group = data.data;
            let groupStorages = this.group.groupStorages;
            if (groupStorages && groupStorages.length > 0) {
              this.group.allowUseExternUrl = groupStorages[0].allowUseExternUrl;
              this.group.storageName = groupStorages[0].storageName;
            } else {
              this.group.allowUseExternUrl = false;
              this.group.storageName = "无";
            }
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取用户组信息失败，原因${data.reason}`,
          });
        }
      );
    },
    goBack() {
      this.usersOpened
        ? this.$router.go(-1)
        : this.$router.push({ path: "/users/groups" });
    },
  },
  watch: {
    current(newVal) {
      this.queryUsers(newVal);
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

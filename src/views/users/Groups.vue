<template>
  <div class="wrapper">
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="4" lg="8">
                用户组管理
              </CCol>
              <CCol md="3" lg="2">
                <CInput
                  size="sm"
                  placeholder="请输入关键字"
                  v-model="searchWords"
                ></CInput>
              </CCol>
              <CCol md="2" lg="1">
                <CButton block color="primary" size="sm" @click="searchGroup"
                  >搜索用户组</CButton
                >
              </CCol>
              <CCol md="2" lg="1">
                <CButton block color="primary" size="sm" @click="newGroup0"
                  >添加用户组</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <GroupTable
              :items="groups"
              @editGroup="editGroup0"
              @deleteGroup="deleteGroup0"
              @groupDetail="groupDetail0"
            >
            </GroupTable>
            <CPagination
              :active-page.sync="current"
              :pages="total"
            ></CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal :title="modalTitle" :show.sync="showEditGroup">
      <CForm>
        <CInput label="组名" horizontal v-model="group.name" />
        <CInput
          label="存储配额"
          type="number"
          append="MB"
          horizontal
          v-model="group.storageQuota"
        />
        <CInput
          label="流量配额"
          type="number"
          append="MB"
          horizontal
          v-model="group.trafficQuota"
        />
        <CInput
          label="单文件上传限制"
          type="number"
          append="MB"
          horizontal
          v-model="group.maxFileSize"
        />
        <CInput
          label="允许后缀"
          type="text"
          horizontal
          v-model="group.allowFileExtension"
        />
        <CRow form class="form-group">
          <CCol sm="3">
            关联存储
          </CCol>
          <CCol sm="9">
            <CRow>
              <CCol sm="12">
                <select
                  class="form-control"
                  v-model="group.storageId"
                  style="width:100%"
                >
                  <option
                    v-for="item in storages"
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
            允许使用外部链接
          </CCol>
          <CCol sm="9">
            <CSwitch
              class="mr-1"
              color="primary"
              :checked.sync="group.allowUseExternUrl"
            />
          </CCol>
        </CRow>
      </CForm>
      <template #footer>
        <CButton @click="showEditGroup = false">取消</CButton>
        <CButton @click="createOrUpdateGroup" color="success">确认</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import GroupTable from "./GroupTable.vue";
import { wellSize } from "../../utils/utils";

import {
  groupList,
  findGroupById,
  newGroup,
  updateGroup,
  deleteGroup,
  getGlobalSetting,
  allStorageList,
} from "../../api/adminapi";
export default {
  name: "Groups",
  components: {
    GroupTable,
  },
  data() {
    return {
      storages: [],
      groups: [],
      current: 1,
      limit: 5,
      total: 0,
      searchWords: "",
      query: "",
      modalTitle: "新增用户组",
      showEditGroup: false,
      defaultStorageSize: 10240,
      defaultTrafficPerMonth: 102400,
      group: {
        id: -1,
        name: "",
        groupId: -1,
        allowUseExternUrl: false,
        maxFileSize: 5120,
        allowFileExtension: "*",
      },
    };
  },
  watch: {},
  created: function() {
    this.loadGroups(1);
    this.loadAllStorages();
    getGlobalSetting(
      "site",
      (data) => {
        if (data.code === 200) {
          this.defaultStorageSize = data.data.registerConfig.storageSize;
          this.defaultTrafficPerMonth =
            data.data.registerConfig.trafficPerMonth;
        } else {
        }
      },
      () => {}
    );
  },
  methods: {
    loadAllStorages() {
      allStorageList(
        (data) => {
          if (data.code === 200) {
            this.storages = data.data;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `加载存储列表失败，原因${data.reason}`,
          });
        }
      );
    },
    createOrUpdateGroup() {
      if (this.group.id === -1) {
        // 新增
        newGroup(
          this.group,
          (data) => {
            // 成功
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `创建新用户组【${this.group.name}】成功`,
                type: "success",
              });
              this.loadGroups(1);
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `创建用户组【${this.group.name}】失败，原因${data.reason}`,
            });
          }
        );
      } else {
        // 修改
        updateGroup(
          this.group.id,
          this.group,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: `更新新用户组【${data.data.name}】成功`,
                type: "success",
              });

              this.loadGroups(this.current);
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `更新用户组信息失败，原因${data.reason}`,
            });
          }
        );
      }

      this.showEditGroup = false;
    },
    editGroup0(groupId) {
      findGroupById(
        groupId,
        (data) => {
          if (data.code == 200) {
            this.group = data.data;
            if (
              this.group.groupStorages &&
              this.group.groupStorages.length > 0
            ) {
              this.group.storageId = this.group.groupStorages[0].storageId;
              this.group.allowUseExternUrl = this.group.groupStorages[0].allowUseExternUrl;
            } else {
              this.group.storageId = -1;
              this.group.allowUseExternUrl = false;
            }

            this.modalTitle = `编辑用户组【${data.data.name}】`;
            this.showEditGroup = true;
          }
        },
        () => {}
      );
    },
    groupDetail0(groupId) {
      this.$router.push({ path: `group/${groupId}` });
    },
    deleteGroup0(groupId) {
      findGroupById(
        groupId,
        (data) => {
          if (data.code == 200) {
            this.$confirm(
              `此操作将永久删除用户组【${data.data.name}】, 是否继续?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                deleteGroup(
                  groupId,
                  (data) => {
                    if (data.code === 200) {
                      this.$notify({
                        title: "成功",
                        message: `删除用户组【${data.data.name}】成功`,
                        type: "success",
                      });
                      let index = this.groups.findIndex(
                        (u) => u.id === data.data.id
                      );
                      this.groups.splice(index, 1);
                    }
                  },
                  (data) => {
                    this.$notify.error({
                      title: "错误",
                      message: `删除用户组失败，原因${data.reason}`,
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
    newGroup0() {
      this.group = {
        id: -1,
        name: "",
        storageQuota: this.defaultStorageSize,
        trafficQuota: this.defaultTrafficPerMonth,
        groupId: -1,
        allowUseExternUrl: false,
        maxFileSize: 5120,
        allowFileExtension: "*",
      };
      this.modalTitle = "新增用户组";
      this.showEditGroup = true;
    },
    searchGroup() {
      this.query = this.searchWords;
      this.loadGroups(1);
    },
    loadGroups(page) {
      groupList(this.query, page, this.limit, (data) => {
        if (data.code == 200) {
          this.groups = [];
          let list = data.data.list;
          this.limit = data.data.pageCount;
          this.current = data.data.pageIndex;
          this.total = data.data.totalPage;
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            //item.groupStorages
            let group = {
              id: item.id,
              name: item.name,
              storageQuota: wellSize(item.storageQuota * 1024 * 1024),
              trafficQuota: wellSize(item.trafficQuota * 1024 * 1024),
              count: item.count,
              storageName: "无",
              allowUseExternUrl: false,
              maxFileSize: item.maxFileSize + 'M',
              allowFileExtension: item.allowFileExtension
            };
            if (item.groupStorages && item.groupStorages.length > 0) {
              group.storageName = item.groupStorages[0].storageName;
              group.allowUseExternUrl = item.groupStorages[0].allowUseExternUrl;
            }
            this.groups.push(group);
          }
        }
      });
    },
  },
  watch: {
    current(newVal) {
      this.loadGroups(newVal);
    },
  },
};
</script>

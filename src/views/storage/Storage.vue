<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="10">
                存储管理
              </CCol>
              <CCol md="2">
                <CButton block color="primary" size="sm" @click="newStorage"
                  >添加存储</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <StorageTable
              :items="storages"
              @detail="detail"
              @editStorage="editStorage0"
              @deleteStorage="deleteStorage0"
              @activeStorage="activeStorage0"
              @defaultStorage="defaultStorage0"
            >
            </StorageTable>
            <CPagination
              :active-page.sync="current"
              :pages="total"
            ></CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import StorageTable from "./StorageTable.vue";
import {
  storageList,
  deleteStorage,
  findStorageById,
  activeStorage,
  defaultStorage,
} from "../../api/api";
import { wellSize } from "../../utils/utils.js";
export default {
  name: "Storage",
  components: {
    StorageTable,
  },
  data() {
    return {
      storages: [],
      current: 1,
      limit: 5,
      total: 0,
      storageTypes: {
        alioss: "阿里云OSS",
        fs: "文件系统",
        qqcos: "腾讯云COS",
      },
      storagePermissionTypes: {
        private: "私有",
        public_read: "公共读",
        public_write_read: "公共读写",
      },
    };
  },
  created: function() {
    this.loadStorages(1);
  },
  methods: {
    loadStorages(page) {
      storageList(
        page,
        this.limit,
        (data) => {
          if (data.code == 200) {
            this.storages = [];
            let list = data.data.list;
            this.limit = data.data.pageCount;
            this.current = data.data.pageIndex;
            this.total = data.data.totalPage;
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              let storage = {
                id: item.id,
                name: item.name,
                type: this.storageTypes[item.type],
                active: item.active,
                default: item.default,
                capacity: wellSize(item.capacity * 1024 * 1024),
                used: wellSize(item.usedSize),
                permission: this.storagePermissionTypes[item.storagePermission],
              };
              this.storages.push(storage);
            }
          }
        },
        () => {}
      );
    },
    detail(id) {
      this.$router.push({ path: `storages/show/${id}` });
    },
    editStorage0(id) {
      this.$router.push({ path: `storages/edit/${id}` });
    },
    deleteStorage0(id) {
      findStorageById(
        id,
        (data) => {
          if (data.code === 200) {
            this.$confirm(
              `此操作将永久删除【${data.data.name}】, 是否继续?`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                deleteStorage(
                  id,
                  (data) => {
                    if (data.code === 200) {
                      this.$notify({
                        title: "成功",
                        message: `删除存储【${data.data.name}】成功`,
                        type: "success",
                      });
                      let index = this.storages.findIndex(
                        (u) => u.id === data.data.id
                      );
                      this.storages.splice(index, 1);
                    }
                  },
                  (data) => {
                    this.$notify.error({
                      title: "错误",
                      message: `删除存储【${id}】失败，原因${data.reason}`,
                    });
                  }
                );
              })
              .catch(() => {});
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取存储信息，原因${data.reason}`,
          });
        }
      );
    },
    newStorage() {
      this.$router.push({ path: `storages/edit/-1` });
    },
    activeStorage0(id, active) {
      activeStorage(
        id,
        active,
        (data) => {},
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `更新存储激活状态失败，原因${data.reason}`,
          });
          // 恢复为原来的
          findStorageById(
            id,
            (data) => {
              if (data.code === 200) {
                let index = this.storages.findIndex(
                  (u) => u.id === data.data.id
                );
                this.storages[index].active = data.data.active;
              }
            },
            () => {}
          );
        }
      );
    },
    defaultStorage0(id, setdefault) {
      defaultStorage(
        id,
        setdefault,
        (data) => {
          if (data.code === 200) {
            //重新加载此页
            this.loadStorages(this.current);
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `更新存储默认状态失败，原因${data.reason}`,
          });
          // 恢复为原来的
          findStorageById(
            id,
            (data) => {
              if (data.code === 200) {
                let index = this.storages.findIndex(
                  (u) => u.id === data.data.id
                );
                this.storages[index].default = data.data.default;
              }
            },
            () => {}
          );
        }
      );
    },
  },
  watch: {
    current(newVal) {
      this.loadStorages(newVal);
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
</style>

<style></style>

<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="10">
                授权码管理
              </CCol>
              <CCol md="2">
                <CButton block color="primary" size="sm" @click="newToken"
                  >创建授权码</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <TokenTable
              :items="tokens"
              @editToken="editToken"
              @enableToken="enableToken0"
            >
            </TokenTable>
            <CPagination
              :active-page.sync="current"
              :pages="total"
            ></CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal :title="modalTitle" :show.sync="showEditToken">
      <CForm>
        <CRow form class="form-group">
          <CCol sm="3">
            失效日期
          </CCol>
          <CCol sm="9">
            <CRow>
              <CCol sm="6">
                <CInput type="date" v-model="token.expireTime_date" />
              </CCol>
              <CCol sm="6">
                <CInput type="time" v-model="token.expireTime_time" />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow form class="form-group">
          <CCol sm="3">
            权限
          </CCol>
          <CCol sm="9">
            <CRow>
              <CCol sm="12">
                <select
                  class="form-control"
                  v-model="token.permission"
                  style="width:100%"
                >
                  <option
                    v-for="(value, key) in permissionTypes"
                    v-bind:key="key"
                    :value="key"
                    >{{ value }}</option
                  >
                </select>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CForm>
      <template #footer>
        <CButton @click="showEditToken = false">取消</CButton>
        <CButton @click="createOrUpdateToken" color="success">确认</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import TokenTable from "./TokenTable.vue";
import {
  tokenList,
  findTokenById,
  newToken,
  updateToken,
  enableToken,
} from "../../api/api";
import moment from "moment";

export default {
  name: "Token",
  components: {
    TokenTable,
  },
  data() {
    return {
      tokens: [],
      token: {
        id: -1,
        expireTime: 0,
        permission: "read",
      },
      modalTitle: "",
      showEditToken: false,
      current: 1,
      limit: 5,
      total: 0,
      permissionTypes: {
        read: "只读",
        write: "读写",
      },
    };
  },
  created: function() {
    this.loadTokens(1);
  },
  methods: {
    enableToken0(token, enable) {
      enableToken(
        token,
        enable,
        (data) => {
          if (data.code !== 200) {
            // 查询授权码最新状态
            let index = this.tokens.findIndex(
              (t) => t.token === this.token.token
            );
            if (index !== -1) {
              let tid = this.tokens[index].id;
              findTokenById(
                tid,
                (data) => {
                  if (data.code === 200) {
                    this.tokens[index].enable = data.enable;
                  }
                },
                () => {}
              );
            }
          }
        },
        () => {}
      );
    },
    newToken() {
      let now = new Date();
      now.setDate(now.getDate() + 1);
      this.token = {
        id: -1,
        expireTime: now.getTime() / 1000,
        permission: "read",
      };
      this.modalTitle = "创建新的授权码";
      this.showEditToken = true;
    },
    editToken(tid) {
      findTokenById(
        tid,
        (data) => {
          if (data.code === 200) {
            this.token = data.data;
            this.modalTitle = "修改授权码";
            this.showEditToken = true;
          }
        },
        () => {}
      );
    },
    createOrUpdateToken() {
      let expireDateStr =
        this.token.expireTime_date + " " + this.token.expireTime_time;
      let expireTime = moment(expireDateStr, "YYYY-MM-DD HH:mm").unix();
      if (this.token.id === -1) {
        // 新增模式
        newToken(
          expireTime,
          this.token.permission,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: "创建授权码成功",
                type: "success",
              });
              this.loadTokens(1);
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `创建授权码失败，原因${data.reason}`,
            });
          }
        );
      } else if (this.token.token) {
        // 更新授权码
        updateToken(
          this.token.token,
          expireTime,
          this.token.permission,
          (data) => {
            if (data.code === 200) {
              this.$notify({
                title: "成功",
                message: "更新授权码成功",
                type: "success",
              });
              let index = this.tokens.findIndex(
                (t) => t.token === this.token.token
              );
              if (index !== -1) {
                this.tokens[index].permission = this.permissionTypes[
                  this.token.permission
                ];
                this.tokens[index].expireTime = moment(
                  expireTime * 1000
                ).format("YYYY-MM-DD HH:mm");
              }
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `更新授权码失败，原因${data.reason}`,
            });
          }
        );
      }
      this.showEditToken = false;
    },
    loadTokens(page) {
      tokenList(
        page,
        this.limit,
        (data) => {
          if (data.code == 200) {
            this.tokens = [];
            let list = data.data.list;
            this.limit = data.data.pageCount;
            this.current = data.data.pageIndex;
            this.total = data.data.totalPage;
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              let token = {
                id: item.id,
                token: item.token,
                signTime: moment(item.signTime * 1000).format(
                  "YYYY-MM-DD HH:mm"
                ),
                expireTime: moment(item.expireTime * 1000).format(
                  "YYYY-MM-DD HH:mm"
                ),
                enable: item.enable,
                permission: this.permissionTypes[item.permission],
              };
              this.tokens.push(token);
            }
          }
        },
        () => {}
      );
    },
  },
  watch: {
    current(newVal) {
      this.loadTokens(newVal);
    },
    token(newVal) {
      let expireTime = new Date(newVal.expireTime * 1000);
      newVal.expireTime_date = moment(expireTime).format("YYYY-MM-DD");
      newVal.expireTime_time = moment(expireTime).format("HH:mm");
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

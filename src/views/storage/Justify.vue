<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="10">
                CDN鉴权配置管理
              </CCol>
              <CCol md="2">
                <CButton block color="primary" size="sm" @click="newJustify"
                  >添加CDN鉴权配置</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <JustifyTable
              :items="justifys"
              @editJustify="editJustify0"
              @deleteJustify="deleteJustify0"
              @detail="detail"
            >
            </JustifyTable>
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
import JustifyTable from "./JustifyTable.vue";
import {
  justifyList,
  deleteJustify,
  findJustifyById,
  allJustifyTypes,
} from "../../api/adminapi";
export default {
  name: "Justify",
  components: {
    JustifyTable,
  },
  data() {
    return {
      justifys: [],
      current: 1,
      limit: 5,
      total: 0,
      justifyTypes: {},
      justifyProps: {},
      beyondStrategyTypes: {
        layAside: '不处理',
        blacklist: '拉黑',
        limitRequest: '限制访问'
      }
    };
  },
  created: function() {
    allJustifyTypes(
      (data) => {
        for (let stype in data.data) {
          this.justifyTypes[stype] = data.data[stype].name;
        }
        this.justifyProps = data.data;
        this.loadJustifys(1);
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载CDN鉴权策略类型失败，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    loadJustifys(page) {
      justifyList(
        page,
        this.limit,
        (data) => {
          if (data.code == 200) {
            this.justifys = [];
            let list = data.data.list;
            this.limit = data.data.pageCount;
            this.current = data.data.pageIndex;
            this.total = data.data.totalPage;
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              let justify = {
                id: item.id,
                name: item.name,
                type: this.justifyTypes[item.type],
                maxRequestPerIPSec: item.acConfig.maxRequestPerIPSec || "不限制",
                beyondStrategy: this.beyondStrategyTypes[item.acConfig.beyondStrategy],
                limitTime: item.acConfig.beyondStrategy === "limitRequest" ? item.acConfig.limitTime + "秒" : "无"
              };
              this.justifys.push(justify);
            }
          }
        },
        () => {}
      );
    },
    deleteJustify0(id) {
      findJustifyById(
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
                deleteJustify(
                  id,
                  (data) => {
                    if (data.code === 200) {
                      this.$notify({
                        title: "成功",
                        message: `删除CDN鉴权策略【${data.data.name}】成功`,
                        type: "success",
                      });
                      let index = this.justifys.findIndex(
                        (u) => u.id === data.data.id
                      );
                      this.justifys.splice(index, 1);
                    }
                  },
                  (data) => {
                    this.$notify.error({
                      title: "错误",
                      message: `删除CDN鉴权策略【${id}】失败，原因${data.reason}`,
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
            message: `获取CDN鉴权策略信息失败，原因${data.reason}`,
          });
        }
      );
    },
    detail(id) {
      this.$router.push({ path: `justifys/show/${id}` });
    },
    editJustify0(id) {
      this.$router.push({ path: `justifys/edit/${id}` });
    },
    newJustify() {
      this.$router.push({ path: `justifys/edit/-1` });
    },
    createOrUpdateJustify() {
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
              this.loadJustifys(1);
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

              this.loadJustifys(this.current);
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
  watch: {
    current(newVal) {
      this.loadJustifys(newVal);
    },
  },
  computed: {
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
</style>

<style></style>

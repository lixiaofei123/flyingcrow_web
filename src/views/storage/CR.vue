<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="10">
                内容审核配置管理
              </CCol>
              <CCol md="2">
                <CButton block color="primary" size="sm" @click="newCR"
                  >添加内容审核策略</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRTable
              :items="crs"
              @detail="detail"
              @editCR="editCR0"
              @deleteCR="deleteCR0"
              @defaultCR="defaultCR0"
            >
            </CRTable>
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
import CRTable from "./CRTable.vue";
import { CRList, deleteCR, findCRById, defaultCR } from "../../api/adminapi";
export default {
  name: "CR",
  components: {
    CRTable,
  },
  data() {
    return {
      crs: [],
      current: 1,
      limit: 5,
      total: 0,
      crTypes: {
        aliyun: "阿里云盾-内容安全",
        qqcloud: "腾讯数据万象-图片审核",
      },
      levels: {
        block: "敏感",
        Suspected: "疑似敏感",
        normal: "正常",
      },
      detectTypes: {
        porn: "涉黄",
        terrorist: "涉暴恐",
        politics: "涉政",
        ads: "广告",
      },
    };
  },
  created: function() {
    this.loadCRs(1);
  },
  methods: {
    loadCRs(page) {
      CRList(
        page,
        this.limit,
        (data) => {
          if (data.code == 200) {
            this.crs = [];
            let list = data.data.list;
            this.limit = data.data.pageCount;
            this.current = data.data.pageIndex;
            this.total = data.data.totalPage;
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              let cr = {
                id: item.id,
                name: item.name,
                type: this.crTypes[item.type],
                default: item.default,
                minLevel: this.levels[item.minLevel],
                detectTypes: this.detectTypesToStr(item.detectTypes),
              };
              this.crs.push(cr);
            }
          }
        },
        () => {}
      );
    },
    detectTypesToStr(detectTypes){
      let str = ""
      for(let i = 0; i < detectTypes.length; i++){
        if(i === 0){
          str += this.detectTypes[detectTypes[i]]
        }else{
          str += ","+this.detectTypes[detectTypes[i]]
        }
      }
      return str;
    },
    detail(id) {
      this.$router.push({ path: `crs/show/${id}` });
    },
    editCR0(id) {
      this.$router.push({ path: `crs/edit/${id}` });
    },
    deleteCR0(id) {
      findCRById(
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
                deleteCR(
                  id,
                  (data) => {
                    if (data.code === 200) {
                      this.$notify({
                        title: "成功",
                        message: `删除内容审核策略【${data.data.name}】成功`,
                        type: "success",
                      });
                      let index = this.crs.findIndex(
                        (u) => u.id === data.data.id
                      );
                      this.crs.splice(index, 1);
                    }
                  },
                  (data) => {
                    this.$notify.error({
                      title: "错误",
                      message: `删除内容审核策略【${id}】失败，原因${data.reason}`,
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
            message: `获取内容审核策略信息，原因${data.reason}`,
          });
        }
      );
    },
    newCR() {
      this.$router.push({ path: `crs/edit/-1` });
    },
    defaultCR0(id, setdefault) {
      defaultCR(
        id,
        setdefault,
        (data) => {
          if (data.code === 200) {
            //重新加载此页
            this.loadCRs(this.current);
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `更新内容审核策略默认状态失败，原因${data.reason}`,
          });
          // 恢复为原来的
          findCRById(
            id,
            (data) => {
              if (data.code === 200) {
                let index = this.crs.findIndex((u) => u.id === data.data.id);
                this.crs[index].default = data.data.default;
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
      this.loadCRs(newVal);
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

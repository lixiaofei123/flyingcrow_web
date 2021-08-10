<template>
  <el-drawer :visible.sync="showDrawer" :with-header="false" :direction="direction" :before-close="beforeClose">
    <div class="fileinfo">
      <div class="thumb" v-if="detail.fileType === 'image'">
        <img width="100%" height="250px" :src="imgUrl" />
      </div>
      <div class="info">
        <div class="title">
          <h3>{{ detail.name }}</h3>
        </div>
        <div class="meta">
          <span>{{ wellSize0(detail.fileZise) }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{ wellTime(detail.lastModifyTime) }}</span>
        </div>
        <div class="links">
          <CRow v-for="url in detail.urls" v-bind:key="url">
            <CCol md="12">
              <CInput :readonly="true" :value="url">
                <template #append>
                  <CButton color="primary" @click="copyUrl(url)">复制</CButton>
                  <CButton block color="link" target="_blank" :href="url">打开链接</CButton>
                </template>
              </CInput>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { fileInfo } from "../../api/api";
import { wellSize } from "../../utils/utils";
import moment from "moment";

export default {
  name: "FileDetailDrawer",
  props: {
    path: String,
    drawer: Boolean,
  },
  components: {},
  created() {
    // 方向
    if(document.body.clientWidth <= 800){
      this.direction = "btt"
    }else{
      this.direction = "rtl"
    }
  },
  data() {
    return {
      detail: {
        lastModifyTime: new Date().getTime() / 1000
      },
      showDrawer: this.drawer,
      direction: "rtl",
      imgUrl: "img/loadding.png"
    };
  },
  watch: {
    path(newval) {
      this.imgUrl = "img/loadding.png"
      this.loadFileInfo(newval);
    },
    drawer(newval){
      this.showDrawer = newval
    }
  },
  methods: {
    beforeClose(){
      this.$emit('closeDrawer')
    },
    wellSize0(size) {
      return wellSize(size);
    },
    wellTime(time) {
      return moment(new Date(time * 1000)).format("YYYY-MM-DD");
    },
    loadFileInfo(path) {
      fileInfo(
        path,
        (data) => {
          if (data.code === 200) {
            this.detail = data.data;
            if(this.detail.fileType === 'image'){
              this.imgUrl = this.detail.urls[0]
            }
          }
        },
        data => {
          this.$notify.error({
              title: "错误",
              message: `加载文件信息出错，原因${data.reason}`,
            });
        }
      );
    },
    copyUrl(link) {
      this.$copyText(link).then(
        () => {
          this.$notify({
            title: "成功",
            message: `复制成功，现在您可以开始粘贴了`,
            type: "success",
          });
        },
        () => {
          this.$notify.error({
            title: "错误",
            message: `复制失败，请手动复制`,
          });
        }
      );
    },
  },
  computed: {
  },
};
</script>

<style scoped>
.thumb {
  height: 250px;
}
.info{
  padding: 20px;
}
.meta{
  margin-bottom: 15px;
  color:grey
}
.links{
  margin-top: 40px;
}
</style>

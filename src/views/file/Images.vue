<template>
  <div ref="main">
    <CPagination :active-page.sync="current" :pages="total"></CPagination>
    <CRow>
      <CCol md="3" v-for="bucket in buckets" v-bind:key="bucket.id">
        <CRow>
          <CCol md="12" v-for="img in bucket.items" v-bind:key="img.name">
            <CCard>
              <CCardHeader>
                {{ img.name }}
              </CCardHeader>
              <CCardBody
                style="cursor:pointer"
                @click="showFileDrawer(img.absolutePath, img.name)"
              >
                <img style="width:100%" :src="img.thumbUrl || img.url" />
              </CCardBody>
              <CCardFooter>
                <div>大小: {{ wellSize(img.fileZise) }}</div>
                <div>上传于: {{ wellTime(img.uploadTime) }}</div>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
    <CPagination
      :active-page.sync="current"
      :pages="total"
      align="end"
    ></CPagination>
    <FileDetailDrawer
      @closeDrawer="closeDrawer"
      :drawer.sync="showDrawer"
      :path="path"
    ></FileDetailDrawer>
  </div>
</template>

<script>
import { imagesList } from "../../api/api.js";
import { wellSize } from "../../utils/utils.js";
import moment from "moment";
import FileDetailDrawer from "../components/FileDetailDrawer";

export default {
  name: "Images",
  components: {
    FileDetailDrawer,
  },
  data() {
    return {
      showDrawer: false,
      limit: 20,
      current: 1,
      total: 0,
      bucketCount: 4,
      path: "",
      buckets: [
        {
          id: 0,
          height: 0,
          items: [],
        },
        {
          id: 1,
          height: 0,
          items: [],
        },
        {
          id: 2,
          height: 0,
          items: [],
        },
        {
          id: 3,
          height: 0,
          items: [],
        },
      ],
    };
  },
  created: function() {
    this.loadImages(1);
  },
  methods: {
    wellSize,
    wellTime(time) {
      return moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm:ss");
    },
    closeDrawer() {
      this.showDrawer = false;
    },
    showFileDrawer(absolutePath, filename) {
      this.path = absolutePath + "/" + filename;
      this.showDrawer = true;
    },
    scrollGet: function(e) {
      if (
        this.$refs.scroll.scrollTop + 1 >=
        this.$refs.scroll.scrollHeight - this.$refs.scroll.clientHeight
      ) {
        alert("滑动到了底部");
      }
    },
    loadImages(page) {
      imagesList(
        page,
        this.limit,
        (data) => {
          this.buckets = [];
          for (let i = 0; i < this.bucketCount; i++) {
            this.buckets.push({
              id: i,
              height: 0,
              items: [],
            });
          }
          this.limit = data.data.pageCount;
          this.current = data.data.pageIndex;
          this.total = data.data.totalPage;
          let items = data.data.list;
          for (let item of items) {
            item.imageWidth = item.imageWidth == 0 ? 250 : item.imageWidth;
            item.imageHeight = item.imageHeight == 0 ? 250 : item.imageHeight;
            let minHeightIndex = 0;
            let minHeight = this.buckets[0].height;
            for (let i = 0; i < this.bucketCount; i++) {
              if (minHeight > this.buckets[i].height) {
                minHeight = this.buckets[i].height;
                minHeightIndex = i;
              }
            }
            this.buckets[minHeightIndex].height +=
              item.imageHeight * (250 / item.imageWidth) + 120;
            this.buckets[minHeightIndex].items.push({
              thumbUrl: item.thumbUrls[0],
              url: item.urls[0],
              name: item.name,
              absolutePath: item.absolutePath,
              fileId: item.id,
              fileZise: item.fileZise,
              uploadTime: item.lastModifyTime,
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `加载图片列表失败，原因${data.reason}`,
          });
        }
      );
    },
  },
  watch: {
    current(newVal) {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
      this.loadImages(newVal);
    },
  },
  computed: {},
};
</script>

<style scoped></style>

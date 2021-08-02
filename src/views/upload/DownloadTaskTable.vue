<template>
  <CDataTable
    :hover="hover"
    :striped="striped"
    :border="false"
    :small="small"
    :fixed="fixed"
    :items="items"
    :fields="fields"
    :items-per-page="small ? 10 : 5"
    :dark="dark"
  >
    <template #progress="{item}">
      <td>
        <div>
          <CRow class="align-items-center remove-padding" style="min-width: 150px">
            <CCol col="12">
              <el-progress
                :percentage="item.progress"
                :show-text="false"
                :stroke-width="10"
              ></el-progress>
            </CCol>
          </CRow>
        </div>
      </td>
    </template>
    <template #opera="{item}">
      <td>
        <div>
          <CRow class="align-items-center remove-padding">
            <CCol col="12"
              ><CButton
                block
                color="primary"
                size="sm"
                @click="$emit('taskDetail', item.uuid)"
                >详情</CButton
              ></CCol
            >
          </CRow>
        </div>
      </td>
    </template>
  </CDataTable>
</template>

<script>
export default {
  name: "DownloadTaskTable",
  props: {
    items: Array,
    hover: Boolean,
    striped: Boolean,
    small: Boolean,
    fixed: Boolean,
    dark: Boolean,
  },
  data() {
    return {
      fields: [
        { key: "fileName", label: "名称" },
        { key: "size", label: "大小" },
        { key: "receiveSize", label: "已接收" },
        { key: "status", label: "状态" },
        { key: "progress", label: "进度" },
        { key: "opera", label: "操作" },
      ],
    };
  },
  methods: {
    detail: function(uid) {},
  },
};
</script>

<style scoped>
.remove-padding {
  margin-left: 0px;
  margin-right: 0px;
}
</style>

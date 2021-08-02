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
    <template #allowUseExternUrl="{item}">
      <td>
        <div>
          <CSwitch
            class="mr-1"
            color="primary"
            :checked="item.allowUseExternUrl"
            :disabled="true"
          />
        </div>
      </td>
    </template>

    <template #opera="{item}">
      <td>
        <div>
          <CRow class="align-items-center remove-padding">
            <CCol col="4"
              ><CButton
                block
                color="primary"
                size="sm"
                @click="$emit('groupDetail', item.id)"
                >详情</CButton
              ></CCol
            >
            <CCol col="4">
              <CButton
                block
                color="secondary"
                size="sm"
                @click="$emit('editGroup', item.id)"
                >编辑</CButton
              ></CCol
            >
            <CCol col="4"
              ><CButton
                block
                color="danger"
                size="sm"
                @click="$emit('deleteGroup', item.id)"
                >删除</CButton
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
  name: "GroupTable",
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
        { key: "id", label: "编号" },
        { key: "name", label: "组名" },
        { key: "count", label: "成员数" },
        { key: "storageQuota", label: "存储配额" },
        { key: "trafficQuota", label: "流量配额" },
        { key: "storageName", label: "关联存储" },
        { key: "allowUseExternUrl", label: "允许使用外链" },
        { key: "opera", label: "操作" },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
.remove-padding {
  margin-left: 0px;
  margin-right: 0px;
}
</style>

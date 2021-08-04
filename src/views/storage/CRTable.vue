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
    <template #default="{item}">
      <td>
        <div>
          <CSwitch
            class="mr-1"
            color="primary"
            :checked.sync="item.default"
            @update:checked="$emit('defaultCR', item.id, item.default)"
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
                @click="$emit('detail', item.id)"
                >查看</CButton
              ></CCol
            >
            <CCol col="4"
              ><CButton
                block
                color="secondary"
                size="sm"
                @click="$emit('editCR', item.id)"
                >编辑</CButton
              ></CCol
            >
            <CCol col="4"
              ><CButton
                block
                color="danger"
                size="sm"
                @click="$emit('deleteCR', item.id)"
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
  name: "CRTable",
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
        { key: "type", label: "类型" },
        { key: "name", label: "别名" },
        { key: "detectTypes", label: "审核类型" },
        { key: "minLevel", label: "通过级别" },
        { key: "default", label: "是否默认" },
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

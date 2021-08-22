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
                @click="$emit('editJustify', item.id)"
                >编辑</CButton
              ></CCol
            >
            <CCol col="4"
              ><CButton
                block
                color="danger"
                size="sm"
                @click="$emit('deleteJustify', item.id)"
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
  name: "JustifyTable",
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
        { key: "maxRequestPerIPSec", label: "访问频次限制" },
        { key: "beyondStrategy", label: "超限策略" },
        { key: "limitTime", label: "限制时间" },
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

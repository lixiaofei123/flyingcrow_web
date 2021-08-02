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
            <CCol col="12"
              ><CButton
                block
                color="danger"
                size="sm"
                @click="$emit('removeUserFromGroup', item.id)"
                >移除</CButton
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
  name: "GroupUserTable",
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
        { key: "name", label: "用户名" },
        { key: "email", label: "邮箱" },
        { key: "role", label: "角色" },
        { key: "opera", label: "操作" },
      ],
    };
  },
  methods: {
    
  },
};
</script>

<style scoped>
.remove-padding {
  margin-left: 0px;
  margin-right: 0px;
}
</style>

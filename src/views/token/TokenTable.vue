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
    <template #enable="{item}">
      <td>
        <div>
          <CSwitch class="mr-1" color="primary" :checked.sync="item.enable" @update:checked="$emit('enableToken',item.token,item.enable)" />
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
                color="secondary"
                size="sm"
                @click="$emit('editToken', item.id)"
                >编辑</CButton
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
  name: "TokenTable",
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
        { key: "token", label: "授权码" },
        { key: "signTime", label: "签发日期" },
        { key: "expireTime", label: "失效日期" },
        { key: "permission", label: "权限" },
        { key: "enable", label: "是否禁用" },
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

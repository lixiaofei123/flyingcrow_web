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
          <CSwitch
            class="mr-1"
            color="primary"
            :checked.sync="item.enable"
            @update:checked="$emit('enableUser', item.id, item.enable)"
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
                @click="$emit('userDetail', item.id)"
                >详情</CButton
              ></CCol
            >
            <CCol col="4">
              <CButton
                block
                color="secondary"
                size="sm"
                @click="$emit('editUser', item.id)"
                >编辑</CButton
              ></CCol
            >
            <CCol col="4"
              ><CButton
                block
                color="danger"
                size="sm"
                @click="$emit('deleteUser', item.id)"
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
  name: "UserTable",
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
        { key: "name", label: "账号" },
        { key: "nickName", label: "昵称" },
        { key: "groupName", label: "用户组" },
        { key: "email", label: "邮箱" },
        { key: "role", label: "角色" },
        { key: "enable", label: "是否禁用" },
        { key: "storageQuota", label: "存储配额" },
        { key: "trafficQuota", label: "流量配额" },
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

<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />

    <CHeaderNav class="d-md-down-none">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/index">
          首页
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/admin/me">
          个人资料
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderBrand class="mx-auto" to="/">
      <img name="logo" height="40" alt="Logo" src="img/logo_main.png" />
    </CHeaderBrand>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2" >
        <CHeaderNavLink>
          {{ user.nickName || user.name }}
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt :user="user" :stat="stat" @logout="logout" />
    </CHeaderNav>
  </CHeader>
</template>

<script>
var cookies = require("vue-cookie");
import TheHeaderDropdownAccnt from "./TheHeaderDropdownAccnt";

export default {
  name: "TheHeader",
  props: {
    stat: Object,
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    user: function() {
      return this.$store.state.user;
    },
  },
  methods: {
    logout() {
      cookies.set("authorization", "");
      this.stat = {};
      window.location = "#/index";
    },
  },
  components: {
    TheHeaderDropdownAccnt,
  },
};
</script>

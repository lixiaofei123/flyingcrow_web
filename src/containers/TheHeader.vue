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
      <TheHeaderDropdownAccnt :user="user" :stat="stat" @logout="logout" />
    </CHeaderNav>
  </CHeader>
</template>

<script>
import { myInfo } from "../api/api";
var cookies = require("vue-cookie");
import TheHeaderDropdownAccnt from "./TheHeaderDropdownAccnt";

export default {
  name: "TheHeader",
  data() {
    return {
      user: {},
      stat: {},
    };
  },
  created() {
    this.loadInfo();
  },
  methods: {
    loadInfo() {
      myInfo((data) => {
        if (data.code === 200) {
          this.user = data.data.user;
          this.stat = data.data.stat;
        }
      });
    },
    logout() {
      cookies.set("authorization", "");
      this.user = {};
      this.stat = {};
      window.location = "#/index";
    },
  },
  components: {
    TheHeaderDropdownAccnt,
  },
};
</script>

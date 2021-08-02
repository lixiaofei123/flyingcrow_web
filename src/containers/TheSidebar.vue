<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <img class="c-sidebar-brand-full" :height="35" src="img/logo_white.png" />
      <img
        class="c-sidebar-brand-minimized"
        :height="35"
        src="img/logo_mini_white.png"
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="nav" />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import { user_nav, admin_nav } from "./_nav";

export default {
  name: "TheSidebar",
  props: {
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
    user: function() {
      return this.$store.state.user;
    },
    nav() {
      if (this.user.role === "user") {
        return user_nav;
      } else {
        return admin_nav;
      }
    },
  },
};
</script>

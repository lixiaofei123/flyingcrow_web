<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <img class="c-sidebar-brand-full" :height="35" :src="require('@/assets/image/logo_white.png')" />
      <img
        class="c-sidebar-brand-minimized"
        :height="35"
        :src="require('@/assets/image/logo_mini_white.png')"
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="nav" />
    <CSidebarFooter class="d-md-down-none">
      <div>
        <div class="label">
          存储({{ wellSize(usedStorage) }}/{{ wellSize(totalStorage) }})
        </div>
        <el-progress
          :percentage="storagePercent"
          :show-text="false"
          :stroke-width="10"
          :status="storageStatus"
        ></el-progress>
        <div class="label">
          流量({{ wellSize(usedTraffic) }}/{{ wellSize(totalTraffic) }})
        </div>
        <el-progress
          :percentage="trafficPercent"
          :show-text="false"
          :stroke-width="10"
          :status="trafficStatus"
        ></el-progress>
      </div>
    </CSidebarFooter>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    >
    </CSidebarMinimizer>
  </CSidebar>
</template>

<script>
import { user_nav, admin_nav } from "./_nav";
import { wellSize } from "../utils/utils";
export default {
  name: "TheSidebar",
  props: {
    stat: Object,
  },
  data() {
    return {
      storagePercent: 0,
      trafficPercent: 0,
      storageStatus: "success",
      trafficStatus: "success",
      totalStorage: 0,
      totalTraffic: 0,
      usedStorage: 0,
      usedTraffic: 0,
    };
  },
  methods: {
    wellSize,
  },
  watch: {
    stat() {
      this.totalStorage = this.user.storageQuota * 1024 * 1024;
      this.totalTraffic = this.user.trafficQuota * 1024 * 1024;
      this.usedStorage = this.stat.usedStorage;
      this.usedTraffic = this.stat.usedTraffic;
      this.storagePercent = (this.usedStorage / this.totalStorage) * 100;
      this.trafficPercent = (this.usedTraffic / this.totalTraffic) * 100;
      this.storageStatus =
        this.storagePercent <= 50
          ? "success"
          : this.storagePercent <= 80
          ? "warnning"
          : "exception";

      this.trafficStatus =
        this.trafficPercent <= 50
          ? "success"
          : this.trafficPercent <= 80
          ? "warnning"
          : "exception";
    },
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

<style scoped>

.label {
  padding: 5px 0px;
  font-size: 10px;
  color:  rgba(255, 255, 255, 0.8);;
}
</style>
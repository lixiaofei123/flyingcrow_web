<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            :src="user.avatar"
            class="c-avatar-img "
            onerror="this.src='img/default_avatar.png'"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader>
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
    </CDropdownHeader>
    <CDropdownItem to="/admin/me"> <CIcon name="cil-user" /> 个人资料 </CDropdownItem>
    <CDropdownItem to="/admin"> <CIcon name="cil-user" /> 控制台 </CDropdownItem>
    <CDropdownItem @click="$emit('logout')">
      <CIcon name="cil-lock-locked" /> 注销
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { wellSize } from "../utils/utils";
export default {
  name: "TheHeaderDropdownAccnt",
  props: {
    user: Object,
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
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
.label {
  padding: 5px 0px;
  font-size: 10px;
}
</style>

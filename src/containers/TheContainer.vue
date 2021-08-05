<template>
  <div class="c-app">
    <TheSidebar :stat="stat" />
    <CWrapper>
      <TheHeader :stat="stat" />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter />
    </CWrapper>
  </div>
</template>

<script>
import { myInfo } from "../api/api";
import TheSidebar from "./TheSidebar";
import TheHeader from "./TheHeader";
import TheFooter from "./TheFooter";

export default {
  name: "TheContainer",
  components: {
    TheSidebar,
    TheHeader,
    TheFooter,
  },
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
          this.$store.commit('setUserInfo',this.user)
        }
      });
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

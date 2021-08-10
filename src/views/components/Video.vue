<template>
  <div id="video">
    <div class="container">
      <video  style="max-width:100%" controls autoplay>
        <source  :src="videoSrc" :type="mimeType" />
      </video>
    </div>
    <div class="closebtn" @click="$emit('closeVideo')">
        X
    </div>
  </div>
</template>

<script>
export default {
  name: "Video",
  props: {
    videoSrc: String,
    mimeType: String,
  },
  components: {},
  created() {},
  data() {
    return {};
  },
  watch: {},
  methods: {},
  computed: {},
};
</script>

<style scoped>
#video {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.9);
}

.container {
  text-align: center;
  padding-top: 40px;
}

.closebtn{
    position: fixed;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 55px;
    padding-top: 5px;
    text-align: center;
    border-radius: 100px;
    font-size: 30px;
    color: white;
    background: rgba(46, 46, 46, 0.815);
    cursor: pointer;
}

.closebtn:hover{
    background: rgba(37, 37, 37, 0.815);
}
</style>

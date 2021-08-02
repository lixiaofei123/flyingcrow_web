<template>
  <CFooter :fixed="false">
    <div>
        <a href="https://www.lixf.io" target="_blank">飞鸦</a>
        <span class="ml-1">&copy; {{ new Date().getFullYear() }}</span>
      </div>
    <div class="mfs-auto">
        <span class="mr-1">由</span>
        <a href="https://www.lixf.io">飞鸦</a>
        <span class="mr-1">驱动</span>
      </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>

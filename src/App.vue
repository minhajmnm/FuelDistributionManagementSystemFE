<template>
  <div>
    <PageLoader :show="loading" />
    <router-view />
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue'

export default {
  components: { PageLoader },

  data() {
    return {
      loading: false,
    }
  },

  watch: {
    $route() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
  },
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
</style>

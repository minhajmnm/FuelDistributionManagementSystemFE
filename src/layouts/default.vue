<template>
  <v-app style="height: 100vh">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {}
</script>

<style scoped>
/* Fullscreen for auth pages */
:deep(v-main) {
  padding: 0 !important;
}
</style>

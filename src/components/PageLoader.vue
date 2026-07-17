<template>
  <div v-if="show" class="loader-overlay">
    <div class="loader-box">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
}
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-box {
  text-align: center;
  color: #820000;
  font-weight: 600;
}

.spinner {
  width: 45px;
  height: 45px;
  border: 5px solid #f1d6d6;
  border-top: 5px solid #820000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
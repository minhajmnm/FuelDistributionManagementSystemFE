<template>
  <!-- Queue Statistics Card -->
  <div class="stat-card">
    <!-- Top Gradient Bar -->
    <div class="gradient-bar" />

    <!-- Card Content -->
    <div class="stat-content">
      <!-- Statistic Value -->
      <div class="stat-number">{{ value }}</div>

      <!-- Statistic Label -->
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'QueueCard',

  // Props received from parent component
  props: {
    value: {
      type: [Number, String],
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
/* Statistics card container */
.stat-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 3.19px;
  isolation: isolate;
  flex: 1;
  min-width: 280px;
  min-height: 80px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
}

/* Top gradient bar */
.gradient-bar {
  position: absolute;
  height: 4px;
  left: 0;
  right: 0;
  top: 0;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  border-radius: 11px 11px 0px 0px;
  z-index: 2;
}

/* Card content container */
.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 3.19px;
  width: 100%;
  z-index: 0;
  margin-top: 6px;
}

/* Statistic value */
.stat-number {
  width: 100%;
  height: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: -0.72px;
  color: #1a1a1a;
}

/* Statistic label */
.stat-label {
  width: 100%;
  height: 19px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #7a7974;
}
</style>

<template>
  <!-- Single stat card matching StatsRow individual card -->
  <div class="stat-card">
    <!-- Top gradient bar -->
    <div class="gradient-bar" />

    <!-- Content -->
    <div class="stat-content">
      <div class="stat-number">{{ value }}</div>
      <div class="stat-label">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsumerCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>

<style scoped>
/* INDIVIDUAL STAT CARD (exact match to StatsRow .stat-card-dashboard) */
.stat-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 3.19px;
  isolation: isolate;
  width: 100%;
  flex: 1;
  min-height: 80px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
}

/* TOP GRADIENT BAR  */
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

/* CONTENT WRAPPER */
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

/* STAT NUMBER */
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

/* STAT LABEL  */
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

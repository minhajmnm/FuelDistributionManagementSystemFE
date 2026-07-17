<template>
  <!-- Common statistics cards row container -->
  <div class="common-stats-row">
    <!-- Loop through each card object in the cards array -->
    <div v-for="card in cards" :key="card.label" class="common-stat-card">
      <!-- Top gradient decoration bar -->
      <div class="gradient-bar" />

      <!-- Card content section -->
      <div class="stat-content">
        <!-- Display statistic value -->
        <div class="stat-number">
          {{ card.value }}
        </div>

        <!-- Display statistic label/title -->
        <div class="stat-label">
          {{ card.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component name
  name: 'StatsRow',

  // Props received from parent component
  props: {
    cards: {
      // Expect an array of statistic card objects
      type: Array,

      // Default value if no cards prop is passed
      default: () => [
        // Example:
        // { label: 'Total Users', value: 120 }
      ],
    },
  },
}
</script>

<style scoped>
/*  Statistics Card Content Container */
.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 3.19px;
  width: 100%;
  margin-top: 6px;
}
</style>

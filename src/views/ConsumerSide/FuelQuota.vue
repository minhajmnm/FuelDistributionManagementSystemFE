<template>
  <!-- Consumer Fuel Quota Page -->
  <div class="consumer-fuel-quota-page">
    <!-- Fuel Quota View Component -->
    <FuelQuotaView />
  </div>
</template>

<script>
// Import Fuel Quota Component
import FuelQuotaView from '@/views/ConsumerSide/FuelQuota/Components/FuelQuotaVw.vue'

export default {
  // Component Name
  name: 'ConsumerFuelQuotaPage',

  // Register Components
  components: {
    FuelQuotaView,
  },
}
</script>

<style scoped>
/* Main page container */
.consumer-fuel-quota-page {
  padding: 24px;
}
</style>

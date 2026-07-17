<template>
  <!-- Fuel Price Marquee Container -->
  <div class="price-marquee-container">
    <!-- Scrolling Content -->
    <div class="marquee-content">
      <!-- Original Fuel Price List -->
      <div v-for="(item, index) in displayPrices" :key="index" class="price-item">
        <!-- Fuel Icon -->
        <v-icon size="16" :color="item.color" class="mr-1"> mdi-gas-station </v-icon>

        <!-- Fuel Name -->
        <span class="fuel-name">{{ item.name }}:</span>

        <!-- Fuel Price -->
        <span class="fuel-price"> Rs. {{ item.price.toFixed(2) }} </span>

        <!-- Separator -->
        <span class="separator">|</span>
      </div>

      <!-- Duplicate Items For Infinite Marquee Effect -->
      <div v-for="(item, index) in displayPrices" :key="'dup-' + index" class="price-item">
        <v-icon size="16" :color="item.color" class="mr-1"> mdi-gas-station </v-icon>

        <span class="fuel-name">{{ item.name }}:</span>

        <span class="fuel-price"> Rs. {{ item.price.toFixed(2) }} </span>

        <span class="separator">|</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'FuelPriceMarquee',

  // Props From Parent Component
  props: {
    fuelPrices: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    // Prepare Fuel Data For Display
    displayPrices() {
      return this.fuelPrices.map((fuel) => ({
        name: fuel.name,
        price: Number(fuel.price) || 0,
        color: this.getFuelColor(fuel.name),
      }))
    },
  },

  methods: {
    // Return Color Based On Fuel Type
    getFuelColor(name) {
      if (name?.includes('92')) return '#dc2626'
      if (name?.includes('95')) return '#7c3aed'
      if (name?.toLowerCase().includes('diesel')) return '#2563eb'

      return '#820000'
    },
  },
}
</script>

<style scoped>
/* Main marquee container */
.price-marquee-container {
  width: 100%;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  padding: 10px 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
}

/* Scrolling marquee content */
.marquee-content {
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: marquee 30s linear infinite;
}

/* Individual fuel price item */
.price-item {
  display: flex;
  align-items: center;
  padding: 0 40px;
}

/* Fuel type name */
.fuel-name {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #2a1a1e;
  margin-right: 8px;
}

/* Fuel price value */
.fuel-price {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #820000;
}

/* Separator between fuel items */
.separator {
  margin-left: 40px;
  color: #e8d8cc;
  font-weight: 300;
}

/* Marquee scrolling animation */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>

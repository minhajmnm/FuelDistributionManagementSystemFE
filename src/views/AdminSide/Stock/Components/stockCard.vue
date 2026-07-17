<template>
  <div class="stock-card-premium">
    <!-- Fuel Type pill at the top center -->
    <div class="badge-container">
      <div class="fuel-pill-badge" :class="badgeClass">
        {{ fuel.type }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar-track">
        <div
          class="progress-bar-fill"
          :class="fillClass"
          :style="{ width: percentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Stats Labels below the bar -->
    <div class="stats-labels-row">
      <div class="stat-group left">
        <span class="stat-value">{{ fuel.current.toLocaleString() }}L</span>
        <span class="stat-label">Current</span>
      </div>

      <div class="stat-group center">
        <span class="stat-value">{{ percentage }}%</span>
      </div>

      <div class="stat-group right">
        <span class="stat-value">{{ fuel.capacity.toLocaleString() }}L</span>
        <span class="stat-label">Capacity</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'StockCard',

  // Component Props
  props: {
    fuel: {
      type: Object,
      required: true,
    },
  },

  // Computed Properties
  computed: {
    // Calculate fuel percentage based on current and capacity values
    percentage() {
      if (!this.fuel.capacity) return 0

      return Math.round((this.fuel.current / this.fuel.capacity) * 100)
    },

    // Determine fuel badge style based on fuel type
    badgeClass() {
      const type = this.fuel.type.toLowerCase()

      if (type.includes('92')) return 'badge-petrol92'
      if (type.includes('95')) return 'badge-petrol95'
      if (type.includes('diesel')) return 'badge-diesel'

      return 'badge-petrol92'
    },

    // Determine progress bar color based on stock percentage
    fillClass() {
      if (this.percentage > 70) return 'fill-green'
      if (this.percentage >= 30) return 'fill-orange'

      return 'fill-red'
    },
  },
}
</script>

<style scoped>
/* Fuel Stock Card */
.stock-card-premium {
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  padding: 24px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Fuel Badge Section */
.badge-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
}

/* Fuel Type Badge */
.fuel-pill-badge {
  padding: 6px 20px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 11px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

/* Petrol 92 Badge */
.badge-petrol92 {
  background: rgba(253, 236, 236, 0.8);
  color: #de2626;
  border: 1px solid #de2626;
}

/* Petrol 95 Badge */
.badge-petrol95 {
  background: rgba(246, 238, 254, 0.8);
  color: #9333ea;
  border: 1px solid #a262f1;
}

/* Diesel Badge */
.badge-diesel {
  background: rgba(233, 239, 253, 0.8);
  color: #2563eb;
  border: 1px solid #3b82f6;
}

/* Progress Bar Section */
.progress-container {
  width: 100%;
}

/* Progress Bar Background */
.progress-bar-track {
  width: 100%;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

/* Progress Bar Fill */
.progress-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* High Stock Level */
.fill-green {
  background: #22c55e;
}

/* Medium Stock Level */
.fill-orange {
  background: #f59e0b;
}

/* Low Stock Level */
.fill-red {
  background: #ef4444;
}

/* Statistics Section */
.stats-labels-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: 'Inter', sans-serif;
}

/* Statistics Group */
.stat-group {
  display: flex;
  flex-direction: column;
}

/* Left Statistics */
.stat-group.left {
  align-items: flex-start;
}

/* Center Statistics */
.stat-group.center {
  align-items: center;
  justify-content: center;
  padding-top: 2px;
}

/* Right Statistics */
.stat-group.right {
  align-items: flex-end;
}

/* Statistics Value */
.stat-value {
  font-size: 12px;
  font-weight: 700;
  color: #333;
}

/* Statistics Label */
.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: #777;
  margin-top: 2px;
}
</style>

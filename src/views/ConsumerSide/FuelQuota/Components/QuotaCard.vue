<template>
  <!-- Single Quota Item -->
  <div class="quota-item">
    <!-- Quota Label Row -->
    <div class="quota-label-row">
      <!-- Fuel Name and Fraction -->
      <div class="quota-left">
        <span class="fuel-name" :style="{ color: fuel.color }">
          {{ fuel.name }}
        </span>

        <span class="quota-fraction"> {{ fuel.used }}/{{ fuel.total }} </span>
      </div>

      <!-- Litre Label -->
      <span class="quota-litre-label"> {{ fuel.used }} / {{ fuel.total }} L </span>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bg">
      <div
        class="progress-fill"
        :style="{
          width: progressWidth + '%',
          background: fuel.gradient,
        }"
      ></div>
    </div>

    <!-- Quota Sub Label -->
    <p class="quota-sublabel" :style="{ color: subLabelColor }">
      {{ subLabel }}
    </p>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'QuotaCard',

  // Props received from parent component
  props: {
    fuel: {
      type: Object,
      required: true,
    },
  },

  computed: {
    // Calculate progress bar width
    progressWidth() {
      if (!this.fuel.total) return 0

      return Math.min(100, Math.round((this.fuel.used / this.fuel.total) * 100))
    },

    // Check whether quota is full
    isFull() {
      return this.fuel.used >= this.fuel.total
    },
// Check whether quota assigned
    isQuotaAssigned() {
      return Number(this.fuel.total || 0) > 0
    },

    // Quota status message
    subLabel() {
      if (!this.isQuotaAssigned) return 'Quota Not Assigned'
      if (this.fuel.used === 0) return 'Full quota available'
      if (this.isFull) return 'Quota Full'

      return `${this.fuel.used} litres used this week`
    },
    // Sub label color based on quota status
    subLabelColor() {
      return this.isFull ? '#15803D' : '#B89FA5'
    },
  },
}
</script>

<style scoped>
/* Quota item container */
.quota-item {
  display: flex;
  flex-direction: column;
  gap: 6.4px;
  width: 100%;
}

/* Quota label row */
.quota-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Fuel name and fraction wrapper */
.quota-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Fuel name */
.fuel-name {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 20px;
}

/* Quota fraction */
.quota-fraction {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #b89fa5;
  line-height: 18px;
}

/* Quota litre label */
.quota-litre-label {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #b89fa5;
  line-height: 18px;
}

/* Progress bar background */
.progress-bg {
  width: 100%;
  height: 22px;
  background: #f7ede0;
  border-radius: 99px;
  overflow: hidden;
  position: relative;
}

/* Progress bar fill */
.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}

/* Quota sub label */
.quota-sublabel {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 11.2px;
  line-height: 17px;
  margin: 0;
}
</style>

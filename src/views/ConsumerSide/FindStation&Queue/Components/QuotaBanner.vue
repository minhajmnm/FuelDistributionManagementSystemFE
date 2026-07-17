<template>
  <!-- Weekly Quota Banner -->
  <div class="quota-banner">
    <!-- Left Side Quota Details -->
    <div class="quota-left">
      <!-- Quota Title Section -->
      <div class="quota-title">
        <v-icon size="36" color="white">mdi-calendar-check</v-icon>
        <h2>Your Weekly Quota</h2>
      </div>

      <!-- Quota Badges -->
      <div class="quota-badges">
        <span v-for="item in quotaItems" :key="item.label" class="quota-badge" :class="item.status">
          {{ item.label }}: {{ item.remaining }}
        </span>
      </div>
    </div>

    <!-- Right Side Weekly Usage Summary -->
    <div class="quota-right">
      <p class="quota-week-label">total used this week</p>
      <p class="quota-used">{{ totalUsed }}L</p>
      <p class="quota-limit">of {{ weeklyLimit }}L weekly limit</p>
    </div>
  </div>
</template>

<script>
import { CalendarCheck } from 'lucide-vue-next'

export default {
  // Component Name
  name: 'QuotaBanner',

  // Registered Components
  components: {
    CalendarCheck,
  },

  // Props received from parent component
  props: {
    quotaItems: {
      type: Array,
      default: () => [
        { label: 'Petrol 92', remaining: '12L remaining', status: 'available' },
        { label: 'Auto Diesel', remaining: '12L remaining', status: 'available' },
        { label: 'Petrol 92', remaining: 'Quota Not Assigned', status: 'full' },
      ],
    },

    totalUsed: {
      type: Number,
      default: 19,
    },

    weeklyLimit: {
      type: Number,
      default: 35,
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@300;400;500;700&display=swap');

/* Main quota banner */
.quota-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #4e1119 0%, #b4273a 100%);
  border-radius: 11px;
  padding: 22px 36px;
  gap: 24px;
  margin-bottom: 24px;
}

/* Left quota content */
.quota-left {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Quota title section */
.quota-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Quota title text */
.quota-title h2 {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: #fff;
}

/* Quota badges container */
.quota-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Common quota badge */
.quota-badge {
  padding: 7px 22px;
  border-radius: 15px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 29px;
  color: #fff;
  box-shadow: 0 4px 21.3px rgba(0, 0, 0, 0.1);
}

/* Available quota badge */
.quota-badge.available {
  background: rgba(217, 217, 217, 0.55);
}

/* Full quota badge */
.quota-badge.full {
  background: rgba(178, 0, 0, 0.93);
}

/* Right quota summary */
.quota-right {
  text-align: right;
  flex-shrink: 0;
}

/* Weekly used label */
.quota-week-label {
  margin: 0 0 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  opacity: 0.8;
}

/* Total used amount */
.quota-used {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 58px;
  color: #fc9e2c;
}

/* Weekly limit text */
.quota-limit {
  margin: 4px 0 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  opacity: 0.8;
}

/* Tablet responsive layout */
@media (max-width: 960px) {
  .quota-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .quota-right {
    text-align: left;
  }

  .quota-used {
    font-size: 40px;
  }
}
</style>

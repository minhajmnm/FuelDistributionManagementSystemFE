<template>
  <!-- Fuel Quota Card -->
  <v-card class="card" elevation="0">
    <!-- Card Header -->
    <div class="card-head">
      <span class="card-title">Fuel Quota</span>
    </div>

    <!-- Card Body -->
    <v-card-text class="card-body">
      <div class="quota-wrap">
        <!-- Quota Item -->
        <div v-for="fuel in quotas" :key="fuel.type" class="quota-item">
          <!-- Quota Top Row -->
          <div class="quota-row">
            <div class="quota-name" :style="{ color: fuel.color }">
              {{ fuel.label }}
            </div>

            <div class="quota-nums" :style="fuel.usedPercent >= 100 ? { color: '#15803d' } : {}">
              {{ fuel.used }}/{{ fuel.total }}
            </div>
          </div>

          <!-- Quota Progress Bar -->
          <div class="quota-bar-bg">
            <div
              class="quota-bar-fill"
              :style="{
                width: Math.min(fuel.usedPercent, 100) + '%',
                background: fuel.gradient,
              }"
            ></div>
          </div>

          <!-- Quota Bottom Text -->
          <div class="quota-hint" :style="fuel.usedPercent >= 100 ? { color: '#15803d' } : {}">
            <template v-if="fuel.usedPercent >= 100"> Full quota available </template>

            <template v-else> {{ fuel.used }} litres used this week </template>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // Component Name
  name: 'FuelQuotaCard',

  // Props received from parent component
  props: {
    quotaData: {
      type: Array,
      default: () => [
        {
          type: 'petrol92',
          label: 'Petrol 92',
          used: 8,
          total: 15,
          color: '#dc2626',
          gradient: 'linear-gradient(90deg,#dc2626,#f87171)',
        },
        {
          type: 'petrol95',
          label: 'Petrol 95',
          used: 11,
          total: 15,
          color: '#7c3aed',
          gradient: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
        },
        {
          type: 'diesel',
          label: 'Auto Diesel',
          used: 0,
          total: 15,
          color: '#2563eb',
          gradient: 'linear-gradient(90deg,#2563eb,#60a5fa)',
        },
      ],
    },
  },

  computed: {
    // Prepare quota data with icon and used percentage
    quotas() {
      const icons = {
        petrol92: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v14"/><path d="M3 22h16"/><rect x="7" y="10" width="6" height="4"/></svg>`,
        petrol95: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
        diesel: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
      }

      return this.quotaData.map((q) => ({
        ...q,
        icon: icons[q.type] || icons.petrol92,
        usedPercent: Math.round((q.used / q.total) * 100),
      }))
    },
  },
}
</script>

<style scoped>
/* Main quota card */
.card {
  background: #ffffff;
  border-radius: 11px;
  border: 1px solid #820000;
  box-shadow:
    0 2px 8px rgba(123, 30, 43, 0.07),
    0 8px 28px rgba(123, 30, 43, 0.08);
  overflow: hidden;
}

/* Card header */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e8d8cc;
}

/* Card title */
.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #2a1a1e;
}

/* Card body */
.card-body {
  padding: 1.25rem;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

/* Info badge */
.badge-info {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

/* Quota items wrapper */
.quota-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Single quota item */
.quota-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Quota top row */
.quota-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Quota fuel name */
.quota-name {
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Quota icon wrapper */
.quota-icon {
  display: inline-flex;
  align-items: center;
}

/* Quota SVG icon */
.quota-icon :deep(svg) {
  display: block;
}

/* Quota numbers */
.quota-nums {
  font-size: 0.75rem;
  color: #b89fa5;
}

/* Quota progress bar background */
.quota-bar-bg {
  height: 8px;
  border-radius: 99px;
  background: #f7ede0;
  overflow: hidden;
}

/* Quota progress bar fill */
.quota-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.8s ease;
}

/* Quota helper text */
.quota-hint {
  font-size: 0.7rem;
  color: #b89fa5;
}
</style>

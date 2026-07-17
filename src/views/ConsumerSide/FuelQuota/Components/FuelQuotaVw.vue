<template>
  <!-- Fuel Quota Card -->
  <div class="quota-card">

    <!-- Card Header -->
    <div class="card-header">
      <h2 class="card-title">Fuel Quota</h2>
      <span class="badge-weekly">Weekly</span>
    </div>

    <!-- Loading Message -->
    <div v-if="loading" class="quota-loading">
      Loading quota data...
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="quota-error">
      {{ error }}
    </div>

    <!-- Quota Items List -->
    <div v-else class="quota-list">
      <QuotaCard
        v-for="fuel in fuels"
        :key="fuel.name"
        :fuel="fuel"
      />

      <!-- Empty State -->
      <p v-if="fuels.length === 0" class="quota-empty">
        No quota data found.
      </p>
    </div>
  </div>
</template>

<script>
// Import component
import QuotaCard from './QuotaCard.vue'

// Import API modules
import VehicleManagement from '@/Api/Modules/VehicleManagement.js'
import AuthManagement from '@/Api/Modules/AuthManagement.js'

export default {
  // Component Name
  name: 'FuelQuotaView',

  // Register child components
  components: {
    QuotaCard,
  },

  // Component State
  data() {
    return {
      loading: true,
      error: '',
      fuels: [],
    }
  },

  // Load quota data when component is mounted
  async mounted() {
    await this.loadQuotas()
  },

  // Reload quota data when keep-alive component is activated
  async activated() {
    await this.loadQuotas()
  },

  methods: {
    // Load consumer quota data from API
    async loadQuotas() {
      this.loading = true
      this.error = ''

      try {
        const profileRes = await AuthManagement.getMyProfile()
        const user = profileRes.data.data || profileRes.data

        localStorage.setItem('user', JSON.stringify(user))

        const consumerId = user.consumer_id

        const res = await VehicleManagement.getConsumerQuotas(consumerId)
        const data = res.data.data || []

        this.fuels = data.map((quota) => ({
          name: quota.fuel_name,
          used: Number(quota.used_amount || 0),
          total: Number(quota.weekly_limit || 0),
          color: this.getFuelColor(quota.fuel_name),
          gradient: this.getFuelGradient(quota.fuel_name),
        }))
      } catch (e) {
        this.error = 'Failed to load quota data.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    // Return fuel color based on fuel type
    getFuelColor(fuelName) {
      const colors = {
        'Petrol 92': '#DC2626',
        'Petrol 95': '#993FEB',
        'Auto Diesel': '#2563EB',
      }

      return colors[fuelName] || '#820000'
    },

    // Return progress gradient based on fuel type
    getFuelGradient(fuelName) {
      const gradients = {
        'Petrol 92': 'linear-gradient(90deg, #DC2626 2.4%, #F56A6A 81.25%, #F87171 100%)',
        'Petrol 95': 'linear-gradient(90deg, #572485 0%, #993FEB 100%)',
        'Auto Diesel': 'linear-gradient(90deg, #03246C 0%, #0646D2 100%)',
      }

      return gradients[fuelName] || 'linear-gradient(90deg, #820000 0%, #C40000 100%)'
    },
  },

  watch: {
    // Reload quota data when route changes
    '$route.path': {
      async handler() {
        await this.loadQuotas()
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
/* Main quota card */
.quota-card {
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  box-shadow:
    0px 2px 8px rgba(123, 30, 43, 0.07),
    0px 8px 28px rgba(123, 30, 43, 0.08);
  overflow: hidden;
  max-width: 869px;
}

/* Card header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0e4dc;
}

/* Card title */
.card-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #2a1a1e;
  margin: 0;
}

/* Weekly badge */
.badge-weekly {
  background: #f9f8f5;
  border: 1px solid #93c5fd;
  border-radius: 99px;
  padding: 3px 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 11.2px;
  color: #1d4ed8;
  line-height: 17px;
  white-space: nowrap;
}

/* Quota list */
.quota-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 20px 20px 40px;
}

/* Loading message */
.quota-loading {
  padding: 32px 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}

/* Error message */
.quota-error {
  padding: 32px 20px;
  text-align: center;
  color: #dc2626;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}

/* Empty state message */
.quota-empty {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  margin: 0;
}
</style>
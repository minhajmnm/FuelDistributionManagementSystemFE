<template>
  <!-- Consumer Dashboard Container -->
  <v-container class="dashboard pa-6" fluid>
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="welcome-title">Welcome, {{ userName }}</h1>
      </div>

      <!-- Join Queue Button -->
      <v-btn class="join-btn" elevation="0" @click="goToJoinQueue">
        <v-icon size="16" start>mdi-plus</v-icon>
        Join Queue
      </v-btn>
    </div>

    <!-- Fuel Price Marquee -->
    <FuelPriceMarquee :fuel-prices="fuelPrices" />

    <!-- Top Dashboard Row -->
    <v-row class="mb-1">
      <v-col cols="12" md="6" class="d-flex">
        <!-- Current Queue Card -->
        <QueueCard
          class="card-fill"
          :queue="queueData"
          :has-active-queue="hasActiveQueue"
          @join-queue="goToJoinQueue"
          @leave-queue="handleLeaveQueue"
          @refresh="handleRefreshQueue"
        />
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <!-- Fuel Quota Card -->
        <FuelQuotaCard class="card-fill" :quota-data="quotaData" />
      </v-col>
    </v-row>

    <!-- Bottom Dashboard Row -->
    <v-row>
      <v-col cols="12" md="6" class="d-flex">
        <!-- Nearby Stations Card -->
        <NearbyStationsCard
          class="card-fill"
          :stations="nearbyStations"
          @view-all="goToFuelStations"
          @station-click="handleStationClick"
        />
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <!-- Recent Payments Card -->
        <RecentPaymentsCard class="card-fill" :payments="recentPayments" @view-all="goToPayments" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Import dashboard components
import QueueCard from './Dashboard/Components/QueueCard.vue'
import FuelQuotaCard from './Dashboard/Components/FuelQuotaCard.vue'
import NearbyStationsCard from './Dashboard/Components/NearbyStationsCard.vue'
import RecentPaymentsCard from './Dashboard/Components/RecentPaymentsCard.vue'
import FuelPriceMarquee from './Dashboard/Components/FuelPriceMarquee.vue'

// Import API modules
import AuthManagement from '@/Api/Modules/AuthManagement'
import VehicleManagement from '@/Api/Modules/VehicleManagement.js'
import FuelTypeManagement from '@/Api/Modules/FuelTypeManagement.js'
import FuelStationManagement from '@/Api/Modules/FuelStationManagement.js'
import QueueManagement from '@/Api/Modules/QueueManagement.js'
import PaymentManagement from '@/Api/Modules/PaymentManagement.js'

export default {
  // Component Name
  name: 'ConsumerDashboard',

  // Register child components
  components: {
    QueueCard,
    FuelQuotaCard,
    NearbyStationsCard,
    RecentPaymentsCard,
    FuelPriceMarquee,
  },

  // Component State
  data() {
    return {
      // Logged-in consumer name
      userName: 'Kamal',

      // Active queue status
      hasActiveQueue: false,

      // Current queue details
      queueData: {
        tokenNumber: '',
        fuelType: '',
        stationName: '',
        peopleAhead: 0,
        estimatedWait: 0,
      },

      // Fuel price list
      fuelPrices: [],

      // Selected fuel type ID for station stock filtering
      selectedFuelTypeId: null,

      // Weekly quota details
      quotaData: [],

      // Nearby station list
      nearbyStations: [],

      // Recent payment records
      recentPayments: [],
    }
  },

  // Load dashboard data and register refresh listeners
  async mounted() {
    await this.loadDashboardData()

    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    window.addEventListener('focus', this.handleWindowFocus)
  },

  // Remove refresh listeners before component is destroyed
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('focus', this.handleWindowFocus)
  },

  methods: {
    // Load consumer profile details
    async loadProfile() {
      try {
        const res = await AuthManagement.getMyProfile()
        const user = res.data.data || res.data

        this.userName = user.full_name
      } catch (error) {
        console.error('Profile load error:', error)
      }
    },

    // Load fuel prices from backend
    async loadFuelPrices() {
      try {
        const res = await FuelTypeManagement.getAllFuelTypes()
        const data = res.data.data || res.data

        this.fuelPrices = data.map((fuel) => ({
          name: fuel.fuel_name,
          price: Number(fuel.price_per_litre),
        }))
      } catch (error) {
        console.error('Fuel price load error:', error)
      }
    },

    // Load nearby fuel stations with selected fuel stock
    async loadNearbyStations() {
      try {
        const res = await FuelStationManagement.getAllFuelStations()
        const raw = res.data?.data ?? res.data ?? []

        this.nearbyStations = raw.slice(0, 4).map((s) => {
          const stocks = s.fuel_stocks || s.fuelStocks || s.stocks || []

          const matchedStock = stocks.find((item) => {
            const fuelTypeId =
              item.fuel_type_id ??
              item.fuelType?.fuel_id ??
              item.fuel_type?.fuel_id ??
              item.fuelType?.fuel_type_id ??
              item.fuel_type?.fuel_type_id

            return Number(fuelTypeId) === Number(this.selectedFuelTypeId)
          })

          const totalLitres = Number(matchedStock?.quantity_litres || 0)

          return {
            id: s.station_id,
            name: s.station_name,
            address: s.address,
            liters: totalLitres,
            fuelType: 'Available Stock',
            status: totalLitres <= 0 ? 'out' : totalLitres < 500 ? 'low' : 'available',
          }
        })
      } catch (error) {
        console.error('Nearby stations load error:', error)
        this.nearbyStations = []
      }
    },

    // Load current active queue for logged-in consumer
    async loadCurrentQueue() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        const res = await QueueManagement.getCurrentQueue(consumerId)
        const data = res.data.data

        if (data) {
          this.queueData = {
            queueId: data.queue_id,
            tokenNumber: `TXN - ${data.queue_id}`,
            fuelType: data.fuel_type,
            stationName: data.station_name,
            peopleAhead: data.people_ahead,
            estimatedWait: data.estimated_waiting_time,
            queueStatus: this.formatQueueStatus(data.queue_status),
          }

          this.hasActiveQueue = true
        } else {
          this.hasActiveQueue = false
        }
      } catch (error) {
        console.error('Current queue load error:', error)
        this.hasActiveQueue = false
      }
    },

    // Load weekly fuel quota data
    async loadQuota() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        const res = await VehicleManagement.getConsumerQuotas(consumerId)
        const data = res.data.data || []

        const firstQuota = data[0]
        this.selectedFuelTypeId = firstQuota?.fuel_type_id

        this.quotaData = data.map((quota) => ({
          type: quota.fuel_code?.toLowerCase() || quota.fuel_name,
          label: quota.fuel_name,
          used: quota.used_amount,
          total: quota.weekly_limit,
          color: this.getQuotaColor(quota.fuel_name),
          gradient: this.getQuotaGradient(quota.fuel_name),
        }))
      } catch (error) {
        console.error('Dashboard quota load error:', error)
      }
    },

    // Load latest three payments
    async loadRecentPayments() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        const res = await PaymentManagement.getPaymentsByConsumer(consumerId)
        const raw = res.data?.data ?? res.data ?? []

        this.recentPayments = raw.slice(0, 3).map((p) => ({
          id: p.payment_id ?? p.id,
          date: new Date(p.payment_date ?? p.created_at).toLocaleDateString('en-GB'),
          fuelDescription: `${p.fuel_type?.fuel_name ?? '-'} - ${Number(
            p.quantity_litres || 0,
          ).toFixed(2)}L`,
          amount: Number(p.amount || 0),
          status: 'Paid',
        }))
      } catch (error) {
        console.error('Recent payments load error:', error)
        this.recentPayments = []
      }
    },

    // Load all dashboard sections
    async loadDashboardData() {
      await this.loadProfile()
      await this.loadFuelPrices()
      await this.loadQuota()
      await this.loadCurrentQueue()
      await this.loadNearbyStations()
      await this.loadRecentPayments()
    },

    // Reload dashboard when browser tab becomes active
    async handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        await this.loadDashboardData()
      }
    },

    // Format queue status for UI
    formatQueueStatus(status) {
      const s = String(status || '').toLowerCase()

      if (s === 'waiting') return 'Waiting'
      if (s === 'served') return 'Served'

      return 'No Queue'
    },

    // Reload dashboard when browser window receives focus
    async handleWindowFocus() {
      await this.loadDashboardData()
    },

    // Return color based on fuel type
    getQuotaColor(fuelName) {
      if (fuelName?.includes('92')) return '#dc2626'
      if (fuelName?.includes('95')) return '#7c3aed'
      if (fuelName?.toLowerCase().includes('diesel')) return '#2563eb'

      return '#820000'
    },

    // Return gradient based on fuel type
    getQuotaGradient(fuelName) {
      if (fuelName?.includes('92')) return 'linear-gradient(90deg, #dc2626, #f87171)'
      if (fuelName?.includes('95')) return 'linear-gradient(90deg, #7c3aed, #a78bfa)'
      if (fuelName?.toLowerCase().includes('diesel')) {
        return 'linear-gradient(90deg, #2563eb, #60a5fa)'
      }

      return 'linear-gradient(90deg, #820000, #b60106)'
    },

    // Navigate to join queue page
    goToJoinQueue() {
      this.$router.push('/consumer/findstationandqueue')
    },

    // Navigate to fuel stations page
    goToFuelStations() {
      this.$router.push('/consumer/fuelstation')
    },

    // Navigate to payments page
    goToPayments() {
      this.$router.push('/consumer/mypayments')
    },

    // Navigate to selected station details
    handleStationClick(station) {
      this.$router.push({
        name: 'FuelStations',
        query: { stationId: station.id },
      })
    },

    // Leave current queue
    async handleLeaveQueue() {
      try {
        await QueueManagement.skipConsumer(this.queueData.queueId)
        await this.loadCurrentQueue()
      } catch (error) {
        console.error('Leave queue error:', error)
        alert('Failed to leave queue')
      }
    },

    // Refresh current queue data
    async handleRefreshQueue() {
      await this.loadCurrentQueue()
    },
  },
}
</script>

<style scoped>
/* Card full height */
.card-fill {
  width: 100%;
  height: 100%;
}

/* Stretch card layout */
.card,
.v-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Stretch card content */
.card-body,
.v-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Vuetify row spacing reset */
.v-row {
  margin: 0;
}

/* Page header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.375rem;
  flex-wrap: wrap;
  gap: 0.875rem;
}

/* Header left section */
.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

/* Welcome title */
.welcome-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #2a1a1e;
  line-height: 1.2;
}

/* Welcome subtitle */
.welcome-sub {
  font-size: 0.75rem;
  color: #b89fa5;
}

/* Two column grid */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Bottom margin */
.mb-1 {
  margin-bottom: 1rem;
}

/* Join queue button */
.join-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  height: 45px;
  background: linear-gradient(104.47deg, #4e1119 0%, #7b1e2b 55%, #9b2d3e 100%);
  box-shadow: 0px 2px 10px rgba(123, 30, 43, 0.25);
  border-radius: 7px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

/* Common button style */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 7px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  border: none;
}

/* Button icon */
.btn svg {
  width: 14px;
  height: 14px;
}

/* Primary button */
.btn-primary {
  padding: 0.55rem 1.125rem;
  font-size: 0.8125rem;
  background: linear-gradient(104.47deg, #4e1119 0%, #7b1e2b 55%, #9b2d3e 100%);
  color: #fff;
  box-shadow: 0 2px 10px rgba(123, 30, 43, 0.25);
}

/* Primary button hover */
.btn-primary:hover {
  box-shadow: 0 4px 18px rgba(123, 30, 43, 0.38);
  transform: translateY(-1px);
}

/* Tablet responsive layout */
@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

/* Mobile responsive layout */
@media (max-width: 600px) {
  .dashboard {
    padding: 1.25rem 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

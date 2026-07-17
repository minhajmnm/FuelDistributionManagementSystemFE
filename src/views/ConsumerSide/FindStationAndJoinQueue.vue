<template>
  <!-- Find Station and Join Queue Page -->
  <div class="find-station-page">
    <!-- Weekly Quota Banner -->
    <QuotaBanner :quota-items="quotaItems" :total-used="totalUsed" :weekly-limit="weeklyLimit" />

    <!-- Station Finder Section -->
    <div class="station-finder-section">
      <!-- Section Header -->
      <div class="section-header">
        <v-icon size="22" color="#000000">mdi-magnify</v-icon>
        <h3 class="section-header__title">Find Available Fuel Station</h3>
      </div>

      <!-- Search and Filter Component -->
      <StationSearch :fuel-types="fuelTypes" @filter-change="handleFilterChange" />

      <!-- Station Cards Grid -->
      <div class="station-grid">
        <StationCard
          v-for="station in filteredStations"
          :key="station.id"
          :station="station"
          :remaining-quota="remainingQuota"
          :weekly-limit="weeklyLimit"
          @join-queue="handleJoinQueue"
        />
      </div>
    </div>
  </div>
</template>

<script>
// Import components
import QuotaBanner from '@/views/ConsumerSide/FindStation&Queue/Components/QuotaBanner.vue'
import StationSearch from '@/views/ConsumerSide/FindStation&Queue/Components/StationSearch.vue'
import StationCard from '@/views/ConsumerSide/FindStation&Queue/Components/StationCard.vue'

// Import API modules
import FuelStationManagement from '@/Api/Modules/FuelStationManagement'
import QueueManagement from '@/Api/Modules/QueueManagement'
import FuelTypeManagement from '@/Api/Modules/FuelTypeManagement'
import VehicleManagement from '@/Api/Modules/VehicleManagement'

// import sweet alert library
import Swal from 'sweetalert2'

export default {
  // Component Name
  name: 'FindStationAndJoinQueue',

  // Register child components
  components: {
    QuotaBanner,
    StationSearch,
    StationCard,
  },

  // Component State
  data() {
    return {
      isLoading: false,

      // Search and filter values
      filterFuelType: '',
      filterQuery: '',

      // Fuel types from backend
      fuelTypes: [],

      // Current queue of logged-in consumer
      currentQueue: null,

      // Quota banner data
      quotaItems: [],
      totalUsed: 0,
      weeklyLimit: 0,

      // Selected vehicle and fuel type for queue join
      selectedVehicleId: null,
      selectedFuelTypeId: null,

      // Fuel station list
      stations: [],
    }
  },

  // Load page data when component opens
  async mounted() {
    await this.fetchFuelTypes()
    await this.fetchQuota()
    await this.fetchCurrentQueue()
    await this.fetchStations()
  },

  computed: {
    // Filter stations by selected fuel type and search text
    filteredStations() {
      return this.stations.filter((s) => {
        const fuelTypes = s.fuelTypes || []
        const matchesFuel = !this.filterFuelType || fuelTypes.includes(this.filterFuelType)

        const name = String(s.name || '').toLowerCase()
        const address = String(s.address || '').toLowerCase()
        const query = String(this.filterQuery || '').toLowerCase()
        const matchesQuery = !query || name.includes(query) || address.includes(query)

        return matchesFuel && matchesQuery
      })
    },

    remainingQuota() {
      return Number(this.weeklyLimit || 0) - Number(this.totalUsed || 0)
    },
  },

  methods: {
    // Fetch fuel types for dropdown
    async fetchFuelTypes() {
      try {
        const res = await FuelTypeManagement.getAllFuelTypes()
        const raw = res.data?.data ?? res.data ?? []

        this.fuelTypes = raw.map((f) => ({
          id: f.fuel_id ?? f.fuel_type_id ?? f.id,
          name: f.fuel_name ?? f.name,
        }))
      } catch (error) {
        console.error('Fuel types load error:', error)
        this.fuelTypes = []
      }
    },

    // Fetch stations and map API data for cards
    async fetchStations() {
      try {
        const res = await FuelStationManagement.getAllFuelStations()
        const raw = res.data?.data ?? res.data ?? []

        this.stations = raw.map((s) => {
          const stocks = s.fuel_stocks || s.fuelStocks || s.stocks || []

          const fuelTypes = stocks
            .map(
              (fs) => fs.fuel_type?.fuel_name ?? fs.fuelType?.fuel_name ?? fs.fuel_name ?? fs.name,
            )
            .filter(Boolean)

          const totalStock = stocks.reduce((sum, fs) => {
            return sum + Number(fs.quantity_litres ?? fs.amount ?? fs.stock ?? fs.quantity ?? 0)
          }, 0)

          return {
            id: s.station_id,
            name: s.station_name,
            address: s.address,
            status: s.status,
            queueCount: s.queue_count ?? 0,

            myQueueStatus:
              this.currentQueue && Number(this.currentQueue.station_id) === Number(s.station_id)
                ? this.formatQueueStatus(this.currentQueue.queue_status)
                : 'No Queue',

            stockStatus: totalStock > 0 ? 'Available' : 'Out of Stock',
            fuelTypes,
          }
        })
      } catch (error) {
        console.error('Station load error:', error)
        this.stations = []
      }
    },

    // Fetch weekly quota for logged-in consumer
    async fetchQuota() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        const res = await VehicleManagement.getConsumerQuotas(consumerId)
        const quota = res.data?.data?.[0] || res.data?.data || res.data

        this.selectedVehicleId = quota.vehicle_id
        this.selectedFuelTypeId = quota.fuel_type_id

        this.weeklyLimit = Number(quota.weekly_limit || 0)
        this.totalUsed = Number(quota.used_amount || 0)

        this.quotaItems = [
          {
            label: quota.fuel_name,
            remaining:
              this.weeklyLimit <= 0
                ? 'Quota Not Assigned'
                : `${quota.remaining}L ${quota.is_full ? '(Quota Full)' : 'remaining'}`,
            status: this.weeklyLimit <= 0 ? 'full' : quota.is_full ? 'full' : 'available',
          },
        ]
      } catch (error) {
        console.error('Quota load error:', error)
      }
    },

    // Fetch current queue of logged-in consumer
    async fetchCurrentQueue() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        const res = await QueueManagement.getCurrentQueue(consumerId)
        this.currentQueue = res.data?.data ?? null
      } catch (error) {
        console.error('Current queue load error:', error)
        this.currentQueue = null
      }
    },

    // Receive filter values from StationSearch component
    handleFilterChange({ fuelType, query }) {
      this.filterFuelType = fuelType
      this.filterQuery = query
    },

    // Format queue status for UI
    formatQueueStatus(status) {
      const s = String(status || '').toLowerCase()

      if (s === 'waiting') return 'Waiting'
      if (s === 'served') return 'Served'
      if (s === 'skipped') return 'Skipped'
      if (s === 'completed') return 'Completed'

      return 'No Queue'
    },

    // Join selected station queue
    async handleJoinQueue(station) {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        if (!consumerId || !this.selectedVehicleId || !this.selectedFuelTypeId) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Details',
            text: 'Consumer, vehicle, or fuel type not found.',
            confirmButtonColor: '#820000',
          })
          return
        }

        await QueueManagement.joinQueue({
          consumer_id: consumerId,
          vehicle_id: this.selectedVehicleId,
          fuel_type_id: this.selectedFuelTypeId,
          station_id: station.id,
        })

        Swal.fire({
          icon: 'success',
          title: 'Queue Joined Successfully',
          text: 'Queue join request sent successfully.',
          confirmButtonColor: '#820000',
        })

        await this.fetchStations()
      } catch (error) {
        console.error('Failed to join queue:', error.response?.data || error)

        Swal.fire({
          icon: 'error',
          title: 'Unable to Join Queue',
          text: error.response?.data?.message || 'Failed to join queue.',
          confirmButtonColor: '#820000',
        })
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@300;400;500;700&display=swap');

/* Find station page */
.find-station-page {
  padding: 24px;
  min-height: 100%;
}

/* Station finder card section */
.station-finder-section {
  background: #ffffff;
  border: 1px solid #7b1e2b;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Section header */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

/* Section header title */
.section-header__title {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000;
}

/* Station cards grid */
.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

/* Mobile responsive layout */
@media (max-width: 768px) {
  .find-station-page {
    padding: 16px;
  }

  .station-finder-section {
    padding: 16px;
  }

  .station-grid {
    grid-template-columns: 1fr;
  }
}
</style>

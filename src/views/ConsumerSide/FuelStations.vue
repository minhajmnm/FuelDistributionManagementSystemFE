<template>
  <!-- Consumer Fuel Stations Page -->
  <div class="consumer-fuelstations-page">
    <!-- Statistics Cards -->
    <StatsRow :cards="statsCards" />

    <!-- All Stations Table -->
    <AllStationsTable :stations="stations" />
  </div>
</template>
<script>
// import components
import StatsRow from './FuelStations/Components/StatsRow.vue'
import AllStationsTable from './FuelStations/Components/AllStationsTable.vue'
// import API
import FuelStationManagement from '@/Api/Modules/FuelStationManagement'
export default {
  // Component name
  name: 'ConsumerFuelStationsPage',

  // Register child components
  components: {
    StatsRow,
    AllStationsTable,
  },

  // Component state
  data() {
    return {
      // Station data for table
      stations: [],

      // Statistics cards data
      statsCards: [
        { value: '—', label: 'Total Available Fuel Stations' },
        { value: '—', label: 'Low Stock Fuel Stations' },
        { value: '—', label: 'Out of Stock Fuel Stations' },
        { value: '—', label: 'Total Fuel Stations' },
      ],

      // Loading indicator
      loading: false,

      // Error message
      error: null,
    }
  },

  // Called when component is created
  async created() {
    await this.fetchData()
  },

  methods: {
    // Format litres value
    formatLitres(value) {
      return `${Number(value || 0).toLocaleString()} L`
    },

    // Determine station status
    getStationStatus(station) {
      // Petrol 92 quantity
      const petrol92 = Number(station.petrol_92 || 0)

      // Petrol 95 quantity
      const petrol95 = Number(station.petrol_95 || 0)

      // Diesel quantity
      const diesel =
        station.stocks.find((s) =>
          ['Auto Diesel', 'Diesel', 'AutoDiesel'].includes(s.fuelType?.fuel_name),
        )?.quantity_litres || 0

      // All fuel types empty
      if (petrol92 === 0 && petrol95 === 0 && diesel === 0) {
        return 'Out of Stock'
      }

      // Any fuel below threshold
      if (petrol92 < 1000 || petrol95 < 1000 || diesel < 1000) {
        return 'Low Stock'
      }

      // Normal status
      return 'Available'
    },

    // Load station data from API
    async fetchData() {
      // Enable loading state
      this.loading = true

      // Clear previous error
      this.error = null

      try {
        // Get all stations
        const allRes = await FuelStationManagement.getAllFuelStations()

        // Extract API data
        const allStations = allRes.data.data || []

        // Transform API response
        this.stations = allStations.map((station) => {
          // Stock records
          const stocks = station.stocks || []

          // Helper function to get quantity
          const getQty = (fuelNames) => {
            const names = Array.isArray(fuelNames) ? fuelNames : [fuelNames]

            const stock = stocks.find((s) => {
              const name = s.fuelType?.fuel_name || s.fuel_type?.fuel_name || ''

              return names.some((fuelName) => name.toLowerCase() === fuelName.toLowerCase())
            })

            return Number(stock?.quantity_litres || 0)
          }

          // Fuel quantities
          const petrol92 = getQty(['Petrol 92', 'P92'])
          const petrol95 = getQty(['Petrol 95', 'P95'])
          const autoDiesel = getQty(['Auto Diesel', 'Auto Disel', 'Diesel', 'AutoDiesel'])

          // Default status
          let status = 'Available'

          // Out of stock condition
          if (petrol92 === 0 && petrol95 === 0 && autoDiesel === 0) {
            status = 'Out of Stock'
          }
          // Low stock condition
          else if (petrol92 < 1000 || petrol95 < 1000 || autoDiesel < 1000) {
            status = 'Low Stock'
          }

          // Return station object
          return {
            name: station.station_name || station.name || 'N/A',
            address: station.address || station.station_address || 'N/A',
            petrol92: `${petrol92.toLocaleString()} L`,
            petrol95: `${petrol95.toLocaleString()} L`,
            autoDiesel: `${autoDiesel.toLocaleString()} L`,
            status,
          }
        })

        // Count available stations
        const availableCount = this.stations.filter((s) => s.status === 'Available').length

        // Count low stock stations
        const lowStockCount = this.stations.filter((s) => s.status === 'Low Stock').length

        // Count out of stock stations
        const outOfStockCount = this.stations.filter((s) => s.status === 'Out of Stock').length

        // Update statistics cards
        this.statsCards = [
          {
            value: String(availableCount).padStart(2, '0'),
            label: 'Total Available Fuel Stations',
          },
          {
            value: String(lowStockCount).padStart(2, '0'),
            label: 'Low Stock Fuel Stations',
          },
          {
            value: String(outOfStockCount).padStart(2, '0'),
            label: 'Out of Stock Fuel Stations',
          },
          {
            value: String(this.stations.length).padStart(2, '0'),
            label: 'Total Fuel Stations',
          },
        ]
      } catch (err) {
        // Log error
        console.error('Failed to load fuel station data:', err)

        // Display error message
        this.error = err?.response?.data?.message || 'Failed to load fuel station data.'
      } finally {
        // Disable loading state
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* Consumer fuel stations page */
.consumer-fuelstations-page {
  padding: 24px;
}
</style>

<template>
  <!-- Queue Management Page -->
  <div class="page-wrapper">
    <!-- Page Header -->
    <div class="page-header">
      <!-- Reserved for future page title or actions -->
    </div>

    <!-- Queue Statistics Cards -->
    <div class="stats-grid mb-36">
      <QueueCard :value="inQueueCount" label="In Queue" />
      <QueueCard :value="servedCount" label="Served" />
      <QueueCard :value="skippedCount" label="Skipped" />
    </div>

    <!-- Queue Table Section -->
    <div class="table-card-container">
      <QueueTable
        :stations="stations"
        :active-station="activeStation"
        :rows="queues"
        @change-station="changeStation"
        @skip="handleSkip"
        @serve="handleServe"
      />
    </div>
  </div>
</template>

<script>
// Queue Statistics Card Component
import QueueCard from '@/views/AdminSide/Queue/Components/QueueCard.vue'

// Queue Table Component
import QueueTable from '@/views/AdminSide/Queue/Components/QueueTable.vue'

// API Modules
import FuelStationManagement from '@/Api/Modules/FuelStationManagement'
import QueueManagement from '@/Api/Modules/QueueManagement'

export default {
  // Component Name
  name: 'QueuePage',

  // Child Components
  components: {
    QueueCard,
    QueueTable,
  },

  // Component State
  data() {
    return {
      // Available fuel stations
      stations: [],

      // Currently selected station
      activeStation: null,

      // Queue records for selected station
      queues: [],
      queueStats: {
        in_queue: 0,
        served: 0,
        skipped: 0,
      },
    }
  },

  computed: {
    // Current queue rows
    currentRows() {
      return this.queues
    },

    // Total vehicles waiting in queue
    inQueueCount() {
      return this.queueStats.in_queue
    },

    // Total served vehicles
    servedCount() {
      return this.queueStats.served
    },

    // Total skipped vehicles
    skippedCount() {
      return this.queueStats.skipped
    },
  },

  // Load stations when page is mounted
  async mounted() {
    await this.loadStations()
  },

  methods: {
    // Load all fuel stations from API
    async loadStations() {
      try {
        const res = await FuelStationManagement.getAllFuelStations()
        const raw = res.data?.data ?? res.data ?? []

        this.stations = raw.map((s) => ({
          id: s.station_id ?? s.id,
          name: s.station_name ?? s.name,
        }))

        // Auto-select first station
        if (this.stations.length) {
          this.activeStation = this.stations[0].id
          await this.loadQueues(this.activeStation)
        }
      } catch (error) {
        console.error('Load stations error:', error)
        this.stations = []
      }
    },

    // Load queue data for selected station
    async loadQueues(stationId) {
      const res = await QueueManagement.getQueues(stationId)
      const raw = res.data?.data ?? res.data ?? []

      this.queues = raw
        .filter((q) => String(q.queue_status).toLowerCase() === 'waiting')
        .map((q) => ({
          id: q.queue_id ?? q.id,
          token: q.token_number ?? q.queue_token ?? `TXN-${q.queue_id ?? q.id}`,
          name: q.consumer?.full_name ?? q.consumer_name ?? '-',
          vehicle: q.vehicle?.vehicle_no ?? q.vehicle_no ?? '-',
          fuel: q.fuel_type?.fuel_name ?? q.fuel_name ?? '-',
          status: this.formatStatus(q.queue_status ?? q.status),
        }))
    },

    async loadQueueStats(stationId) {
      const res = await QueueManagement.getQueueStats(stationId)
      const data = res.data?.data ?? {}

      this.queueStats = {
        in_queue: data.in_queue ?? 0,
        served: data.served ?? 0,
        skipped: data.skipped ?? 0,
      }
    },

    // Format queue status for UI display
    formatStatus(status) {
      const s = String(status || '').toLowerCase()

      if (s === 'waiting') return 'Waiting'
      if (s === 'served') return 'Served'
      if (s === 'skipped') return 'Skipped'
      if (s === 'completed') return 'Completed'

      return status || '-'
    },

    // Change active station and reload queue
    async changeStation(stationId) {
      this.activeStation = stationId
      await this.loadQueues(stationId)
      await this.loadQueueStats(stationId)
    },

    // Skip selected queue token
    async handleSkip(row) {
      await QueueManagement.skipConsumer(row.id)
      await this.loadQueues(this.activeStation)
    },

    // Mark selected queue token as served
    async handleServe(row) {
      await QueueManagement.serveConsumer(row.id)
      await this.loadQueues(this.activeStation)
    },
  },
}
</script>

<style scoped>
/* Main page container */
.page-wrapper {
  width: 100%;
}

/* Page header section */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Page title */
.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0;
}

/* Statistics cards container */
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Queue table card container */
.table-card-container {
  background: #fff;
  border: 1px solid #820000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Bottom margin utility */
.mb-36 {
  margin-bottom: 36px;
}
</style>

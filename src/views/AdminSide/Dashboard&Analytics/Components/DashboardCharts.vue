<template>
  <!-- Dashboard charts main wrapper -->
  <div class="dashboard-charts">
    <!-- Chart row container -->
    <div class="charts-row">
      <!-- Fuel Usage Trend Chart Card -->
      <div class="chart-card">
        <div class="chart-card__header">
          <span class="chart-card__title">Fuel Usage Trend (Daily)</span>

          <!-- Fuel type filter dropdown -->
          <select v-model="selectedFuel" class="fuel-select">
            <option value="all">All Fuels</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>

        <!-- Fuel trend chart canvas area -->
        <div class="chart-card__body">
          <canvas ref="trendChartRef" />
        </div>
      </div>

      <!-- Queue Statistics Chart Card -->
      <div class="chart-card">
        <div class="chart-card__header">
          <span class="chart-card__title">Queue Statistics (Daily)</span>
        </div>

        <!-- Queue statistics chart canvas area -->
        <div class="chart-card__body">
          <canvas ref="queueChartRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import Chart.js modules
import {
  Chart,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'

// Import dashboard API service
import DashboardManagement from '@/Api/Modules/DashboardManagement'

// Register Chart.js components
Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Legend,
  Tooltip,
)

export default {
  // Component name
  name: 'DashboardCharts',

  // Props received from parent dashboard
  props: {
    // Number of days for chart data
    days: {
      type: Number,
      default: 1,
    },

    // Selected station ID
    station: {
      type: [String, Number],
      default: '',
    },
  },

  // Component state
  data() {
    return {
      // Selected fuel filter
      selectedFuel: 'all',

      // Chart instances
      trendChart: null,
      queueChart: null,

      // Fuel usage chart data
      trendLabels: [],
      petrolData: [],
      dieselData: [],

      // Queue statistics chart data
      queueLabels: [],
      servedData: [],
      skippedData: [],
    }
  },

  watch: {
    // Update chart when fuel filter changes
    selectedFuel() {
      this.updateTrendChart()
    },

    // Reload data when date range changes
    days() {
      this.fetchChartData()
    },

    // Reload data when station changes
    station() {
      this.fetchChartData()
    },
  },

  // Load charts on component mount
  mounted() {
    this.fetchChartData()
  },

  // Destroy charts before component is removed
  beforeUnmount() {
    this.trendChart?.destroy()
    this.queueChart?.destroy()
  },

  methods: {
    // Fetch chart data from API
    async fetchChartData() {
      try {
        const params = {
          days: this.days,
          station_id: this.station || null,
        }

        // Fetch fuel usage and queue statistics
        const [fuelRes, queueRes] = await Promise.all([
          DashboardManagement.getDailyFuelUsage(params),
          DashboardManagement.getDailyQueueStats(params),
        ])

        // Extract fuel usage response
        const fuel = fuelRes.data?.data ?? fuelRes.data ?? {}

        this.trendLabels = fuel.labels ?? []
        this.petrolData = fuel.petrol ?? []
        this.dieselData = fuel.diesel ?? []

        // Extract queue statistics response
        const queue = queueRes.data?.data ?? queueRes.data ?? {}

        this.queueLabels = queue.labels ?? []
        this.servedData = queue.served ?? []
        this.skippedData = queue.skipped ?? []

        // Create charts after DOM update
        this.$nextTick(() => {
          this.initTrendChart()
          this.initQueueChart()
        })
      } catch (err) {
        console.error('[DashboardCharts] fetchChartData failed:', err)
      }
    },

    // Build fuel trend datasets
    getTrendDatasets() {
      const petrolDs = {
        label: 'Petrol',
        data: this.petrolData,
        borderColor: '#820000',
        backgroundColor: 'rgba(130, 0, 0, 0.12)',
        borderWidth: 2.5,
        pointBackgroundColor: '#820000',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      }

      const dieselDs = {
        label: 'Diesel',
        data: this.dieselData,
        borderColor: '#5a5a5a',
        backgroundColor: 'rgba(90, 90, 90, 0.10)',
        borderWidth: 2.5,
        pointBackgroundColor: '#5a5a5a',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      }

      // Return dataset according to selected fuel type
      if (this.selectedFuel === 'petrol') return [petrolDs]
      if (this.selectedFuel === 'diesel') return [dieselDs]

      return [petrolDs, dieselDs]
    },

    // Create fuel usage trend chart
    initTrendChart() {
      if (this.trendChart) this.trendChart.destroy()

      this.trendChart = new Chart(this.$refs.trendChartRef, {
        type: 'line',
        data: {
          labels: this.trendLabels,
          datasets: this.getTrendDatasets(),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          scales: this.getTrendScales(),
          plugins: this.getSharedPlugins(),
        },
      })
    },

    // Create queue statistics chart
    initQueueChart() {
      if (this.queueChart) this.queueChart.destroy()

      this.queueChart = new Chart(this.$refs.queueChartRef, {
        type: 'bar',
        data: {
          labels: this.queueLabels,
          datasets: [
            {
              label: 'Served',
              data: this.servedData,
              backgroundColor: 'rgba(192, 57, 43, 0.75)',
              borderRadius: 4,
              barThickness: 12,
              maxBarThickness: 14,
            },
            {
              label: 'Skipped',
              data: this.skippedData,
              backgroundColor: 'rgba(240, 180, 130, 0.80)',
              borderRadius: 4,
              barThickness: 12,
              maxBarThickness: 14,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: this.getQueueScales(),
          plugins: this.getSharedPlugins(),
        },
      })
    },

    // Update trend chart when fuel filter changes
    updateTrendChart() {
      if (this.trendChart) {
        this.trendChart.data.datasets = this.getTrendDatasets()
        this.trendChart.update()
      }
    },

    // Shared chart plugins configuration
    getSharedPlugins() {
      return {
        legend: {
          position: 'top',
          align: 'end',
        },
      }
    },

    // Fuel trend chart scales
    getTrendScales() {
      return {
        x: {},
        y: {
          beginAtZero: true,
        },
      }
    },

    // Queue statistics chart scales
    getQueueScales() {
      return {
        x: {},
        y: {
          beginAtZero: true,
        },
      }
    },
  },
}
</script>
<style scoped>
/* Chart cards row layout */
.charts-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
} /* Individual chart card design */
.chart-card {
  width: 527px;
  min-height: 423px;
  flex: 1 1 480px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  box-sizing: border-box;
  padding: 20px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
} /* Responsive layout for mobile screens */
@media (max-width: 600px) {
  .chart-card {
    flex: 1 1 100%;
    min-width: 0;
  }
} /* Chart card header */
.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
} /* Chart title style */
.chart-card__title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #111;
  letter-spacing: -0.3px;
} /* Fuel filter dropdown style */
.fuel-select {
  padding: 4px 28px 4px 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right 8px center;
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
} /* Fuel dropdown focus effect */
.fuel-select:focus {
  border-color: #820000;
} /* Chart body wrapper */
.chart-card__body {
  flex: 1;
  position: relative;
  min-height: 310px;
} /* Make canvas fill full chart area */
.chart-card__body canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>

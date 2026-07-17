<template>
  <div class="dashboard-analytics">
    <!-- Dashboard Filters Section -->
    <div class="dashboard-header">
      <div class="dashboard-filters">
        <!-- Date Range Filter -->
        <div class="filter-card">
          <select v-model="selectedDateFilter" class="filter-select">
            <option>Today</option>
            <option>Last 7 Days</option>
          </select>
          <v-icon size="18" class="dropdown-icon">mdi-menu-down</v-icon>
        </div>

        <!-- Station Filter -->
        <div class="filter-card station-filter">
          <select v-model="selectedStation" class="filter-select">
            <!-- Default Option -->
            <option value="">All Stations</option>

            <!-- Active Stations Loaded from API -->
            <option v-for="station in activeStations" :key="station.id" :value="station.id">
              {{ station.name }}
            </option>
          </select>
          <v-icon size="18" class="dropdown-icon">mdi-menu-down</v-icon>
        </div>
      </div>
    </div>

    <!-- Summary Statistics Cards -->
    <StatsRow :cards="statsCards" class="dashboard-stats" />

    <!-- Dashboard Charts -->
    <DashboardCharts :days="chartDays" :station="selectedStation" />

    <!-- Recent Orders & Payments -->
    <RecentOrdersAndConsumerPaymentsCard
      :recent-orders="recentOrders"
      :recent-payments="recentPayments"
      @view-all-orders="goToOrders"
      @view-all-payments="goToPayments"
    />

    <!-- Reports Section -->
    <Reports :active-stations="activeStations" :fuel-types="fuelTypes" />
  </div>
</template>

<script>
// Dashboard Components
import StatsRow from '@/views/AdminSide/Dashboard&Analytics/Components/StatsRow.vue'
import DashboardCharts from './Dashboard&Analytics/Components/DashboardCharts.vue'
import RecentOrdersAndConsumerPaymentsCard from './Dashboard&Analytics/Components/RecentOrdersAndConsumerPaymentsCard.vue'
import Reports from './Dashboard&Analytics/Components/Reports.vue'

// API Services
import DashboardManagement from '@/Api/Modules/DashboardManagement'
import FuelTypeManagement from '@/Api/Modules/FuelTypeManagement.js'

export default {
  name: 'DashboardAndAnalytics',

  components: {
    StatsRow,
    DashboardCharts,
    RecentOrdersAndConsumerPaymentsCard,
    Reports,
  },

  data() {
    return {
      // Selected dashboard filters
      selectedDateFilter: 'Today',
      selectedStation: '',

      // Dropdown data
      activeStations: [],
      fuelTypes: [],

      // Summary statistic cards
      statsCards: [
        { label: 'Total Fuel Dispensed', value: '—' },
        { label: 'Total Consumer Served', value: '—' },
        { label: 'Total Revenue', value: '—' },
        { label: 'Total Queue', value: '—' },
      ],

      // Recent activity data
      recentOrders: [],
      recentPayments: [],
    }
  },

  computed: {
    // Convert selected filter into number of days
    chartDays() {
      return this.selectedDateFilter === 'Last 7 Days' ? 7 : 1
    },
  },

  watch: {
    // Reload dashboard data when station changes
    selectedStation() {
      this.fetchStats()
      this.fetchRecentOrders()
      this.fetchRecentPayments()
    },

    // Reload stats when date filter changes
    selectedDateFilter() {
      this.fetchStats()
    },
  },

  async mounted() {
    // Load all dashboard data on page load
    await this.fetchAll()
  },

  methods: {
    // Extract object response safely
    unwrap(res) {
      return res?.data?.data ?? res?.data ?? {}
    },

    // Extract array response safely
    unwrapArray(res) {
      const d = res?.data?.data ?? res?.data
      return Array.isArray(d) ? d : []
    },

    // Format date as DD/MM/YYYY
    formatDate(value) {
      if (!value) return ''

      const date = new Date(value)

      if (isNaN(date.getTime())) return value

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    },

    // Load all dashboard data
    async fetchAll() {
      await Promise.all([
        this.fetchActiveStations(),
        this.fetchFuelTypes(),
        this.fetchStats(),
        this.fetchRecentOrders(),
        this.fetchRecentPayments(),
      ])
    },

    // Get active stations for dropdown and reports
    async fetchActiveStations() {
      try {
        const res = await DashboardManagement.getActiveStations()
        this.activeStations = this.unwrapArray(res)
      } catch (err) {
        console.error('[Dashboard] fetchActiveStations failed:', err)
      }
    },

    // Load summary statistic cards
    async fetchStats() {
      try {
        // Build API filter parameters
        const params = {
          station_id: this.selectedStation || null,
          days: this.chartDays,
        }

        const [fuelRes, consumersRes, revenueRes, queueRes] = await Promise.all([
          DashboardManagement.getTotalFuelDispensed(params),
          DashboardManagement.getTotalConsumersServed(params),
          DashboardManagement.getTotalRevenue(params),
          DashboardManagement.getQueueSummary(params),
        ])

        const fuel = this.unwrap(fuelRes)
        const consumers = this.unwrap(consumersRes)
        const revenue = this.unwrap(revenueRes)
        const queue = this.unwrap(queueRes)

        // Update dashboard cards
        this.statsCards = [
          {
            label: 'Total Fuel Dispensed',
            value: `${(fuel.total_fuel_dispensed_litres ?? 0).toLocaleString('en-US')} L`,
          },
          {
            label: 'Total Consumer Served',
            value: (consumers.total_consumers_served ?? 0).toLocaleString('en-US'),
          },
          {
            label: 'Total Revenue',
            value: `LKR ${Number(revenue.total_revenue ?? 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          },
          {
            label: 'Total Queue',
            value: (queue.total_queues ?? 0).toLocaleString('en-US'),
          },
        ]
      } catch (err) {
        console.error('[Dashboard] fetchStats failed:', err)
      }
    },

    // Load recent fuel orders
    async fetchRecentOrders() {
      try {
        const res = await DashboardManagement.getRecentOrders()

        const orders = this.unwrapArray(res)

        this.recentOrders = orders.map((o, i) => ({
          id: o.order_id ?? o.id ?? i,

          orderId:
            o.order_number ??
            o.order_code ??
            `#ORD-${String(o.order_id ?? o.id ?? i).padStart(4, '0')}`,

          supplier: o.supplier?.supplier_name ?? o.supplier?.name ?? o.supplier_name ?? '—',

          fuelType:
            o.fuel_type?.fuel_name ??
            o.fuel_type?.name ??
            o.fuelType?.fuel_name ??
            o.fuelType?.name ??
            o.fuel_name ??
            o.fuel_type_name ??
            '—',

          quantity: o.quantity_litres ?? o.qty_litres ?? o.quantity ?? o.qty ?? 0,

          status: this.formatStatus(o.order_status ?? o.status ?? o.delivery_status ?? 'Pending'),
        }))
      } catch (err) {
        console.error('[Dashboard] fetchRecentOrders failed:', err)
      }
    },

    // Load recent consumer payments
    async fetchRecentPayments() {
      try {
        const res = await DashboardManagement.getRecentPayments()

        this.recentPayments = this.unwrapArray(res).map((p, i) => ({
          id: p.payment_id ?? p.id ?? i,

          consumer: p.consumer?.full_name ?? p.consumer?.name ?? '—',

          amount: Number(p.amount ?? 0),

          fuelType:
            p.fuel_type?.fuel_name ??
            p.fuel_type?.name ??
            p.fuelType?.fuel_name ??
            p.fuelType?.name ??
            '',

          date: p.payment_date ? this.formatDate(p.payment_date) : 'No Date',
        }))
      } catch (err) {
        console.error('[Dashboard] fetchRecentPayments failed:', err)
      }
    },

    // Load fuel types for reports
    async fetchFuelTypes() {
      const res = await FuelTypeManagement.getAllFuelTypes()
      this.fuelTypes = res.data.data
    },

    // Standardize order status display
    formatStatus(status) {
      const s = String(status || '').toLowerCase()

      if (s === 'delivered') return 'Delivered'
      if (s === 'approved') return 'Approved'
      if (s === 'pending') return 'Pending'
      if (s === 'cancelled') return 'Cancelled'

      return status
    },

    // Navigate to Order Management page
    goToOrders() {
      this.$router.push('/adminside/OrderAndSupply')
    },

    // Navigate to Consumer Payments page
    goToPayments() {
      this.$router.push('/adminside/ConsumerPayments')
    },
  },
}
</script>

<style scoped>
/* Dashboard Container */
.dashboard-analytics {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Dashboard Header */
.dashboard-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 29px;
}

/* Dashboard Filters */
.dashboard-filters {
  display: flex;
  align-items: center;
  gap: 29px;
}

/* Filter Card */
.filter-card {
  position: relative;
  min-width: 130px;
  height: 44px;
  background: #fff;
  border: 1px solid #820000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

/* Station Filter */
.station-filter {
  min-width: 140px;
  width: 140px;
}

/* Filter Select */
.filter-select {
  outline: none;
  width: 100%;
  border: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 24px;
  cursor: pointer;
}

/* Dropdown Icon */
.dropdown-icon {
  position: absolute;
  right: 12px;
  color: #820000;
  pointer-events: none;
}

/* Dashboard Stats */
.dashboard-stats {
  margin-bottom: 0 !important;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .dashboard-analytics {
    gap: 20px;
  }

  .dashboard-header {
    width: 100%;
  }

  .dashboard-filters {
    width: 100%;
    gap: 10px;
  }

  .filter-card {
    flex: 1;
    min-width: 0;
  }
}
</style>

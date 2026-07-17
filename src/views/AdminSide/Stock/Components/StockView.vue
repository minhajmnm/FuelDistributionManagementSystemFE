<template>
  <div class="stock-page-wrapper">
    <!-- TOP ACTION ROW -->
    <div class="top-action-row">
      <button class="update-stock-btn" @click="showModal = true">Adjust Stock</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-msg">Loading stock data...</div>
    <div v-if="apiError" class="error-msg">{{ apiError }}</div>

    <!-- SUMMARY STATS -->
    <div class="overview-stats-grid">
      <div class="stat-card">
        <div class="gradient-bar"></div>
        <div class="stat-content">
          <div class="stat-number">{{ totalStock.toLocaleString() }} L</div>
          <div class="stat-label">Total Stock (All Stations)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="gradient-bar"></div>
        <div class="stat-content">
          <div class="stat-number">{{ lowStockCount }}</div>
          <div class="stat-label">Low Stock Stations</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="gradient-bar"></div>
        <div class="stat-content">
          <div class="stat-number">{{ outOfStockCount }}</div>
          <div class="stat-label">Out of Stock Stations</div>
        </div>
      </div>
    </div>

    <!-- STATION OVERVIEW CONTAINER -->
    <div class="overview-white-card-premium">
      <div class="card-inner-padding">
        <h2 class="section-heading">Station Stock Overview</h2>

        <!-- Custom Tabs -->
        <div class="station-tabs-wrap">
          <button
            v-for="station in stations"
            :key="station.station_id"
            class="station-tab-item"
            :class="{ active: activeStation === station.station_id }"
            @click="activeStation = station.station_id"
          >
            {{ station.station_name }}
          </button>
        </div>

        <!-- Fuel Cards Grid -->
        <div class="fuel-cards-display" v-if="currentStation">
          <StockCard
            v-for="stock in currentStation.stocks"
            :key="stock.stock_id"
            :fuel="mapStockToFuel(stock)"
          />
        </div>
        <div v-if="currentStation && currentStation.stocks.length === 0" class="empty-msg-inline">
          No stock records for this station.
        </div>
      </div>
    </div>

    <!-- TRANSACTION HISTORY CONTAINER -->
    <div class="overview-white-card-premium mt-24">
      <div class="card-inner-padding">
        <div class="heading-with-filter">
          <h2 class="section-heading">Station Transaction History</h2>

          <div class="custom-filter-select" @click="dropdownOpen = !dropdownOpen">
            <span>{{ selectedFilter.label }}</span>
            <v-icon size="20">mdi-chevron-down</v-icon>
            <div class="filter-dropdown-list" v-if="dropdownOpen">
              <div
                v-for="opt in filterOptions"
                :key="opt.value"
                class="filter-opt"
                :class="{ active: selectedFilter.value === opt.value }"
                @click.stop="onFilterChange(opt)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-outer">
        <div v-if="txnLoading" class="loading-msg" style="padding: 16px 24px">
          Loading transactions...
        </div>
        <table class="txn-history-table" v-else>
          <thead>
            <tr>
              <th>Station</th>
              <th>Fuel Type</th>
              <th>Before (L)</th>
              <th>After (L)</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tx, i) in transactions" :key="i">
              <td>{{ tx.station_name }}</td>
              <td>{{ tx.fuel_name }}</td>
              <td>{{ Number(tx.before_quantity).toLocaleString() }}</td>
              <td class="bold-val">{{ Number(tx.after_quantity).toLocaleString() }}</td>
              <td class="text-gray">{{ formatDate(tx.transaction_date) }}</td>
            </tr>
            <tr v-if="transactions.length === 0">
              <td colspan="5" class="empty-msg">No transactions found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADJUST STOCK MODAL -->
    <v-dialog v-model="showModal" max-width="520" persistent>
      <v-card class="premium-stock-modal">
        <div class="modal-header-gradient">
          <h3 class="modal-title">Adjust Stock</h3>
          <button type="button" class="modal-close" @click="closeModal">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <div class="modal-form-content">
          <div class="input-grid">
            <!-- Station Select -->
            <div class="input-group full">
              <label>Select Station</label>
              <div class="select-box-wrap">
                <select v-model="form.stationId">
                  <option value="" disabled>Choose a station</option>
                  <option v-for="s in stations" :key="s.station_id" :value="s.station_id">
                    {{ s.station_name }}
                  </option>
                </select>
                <v-icon size="20">mdi-chevron-down</v-icon>
              </div>
            </div>

            <!-- Petrol 92 -->
            <div class="input-group">
              <label>Petrol 92 (L)</label>
              <input type="number" v-model.number="form.petrol92" placeholder="0" min="0" />
            </div>

            <!-- Petrol 95 -->
            <div class="input-group">
              <label>Petrol 95 (L)</label>
              <input type="number" v-model.number="form.petrol95" placeholder="0" min="0" />
            </div>

            <!-- Auto Diesel -->
            <div class="input-group full">
              <label>Auto Diesel (L)</label>
              <input type="number" v-model.number="form.diesel" placeholder="0" min="0" />
            </div>
          </div>
          <p class="err-msg" v-if="formError">{{ formError }}</p>
          <p class="success-msg" v-if="formSuccess">{{ formSuccess }}</p>
        </div>

        <div class="modal-footer-actions">
          <button class="modal-btn cancel" @click="closeModal" :disabled="submitting">
            Cancel
          </button>
          <button class="modal-btn update" @click="submitStock" :disabled="submitting">
            {{ submitting ? 'Updating...' : 'Update Stock' }}
          </button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import stock card component
import StockCard from './stockCard.vue'
// import API
import {
  getStockOverview,
  getTransactionHistory,
  getTransactionHistoryByStation,
  addStock,
} from '@/Api/Modules/StockManagement'

// fuel_type_id → { label, formKey }
// Adjust these IDs to match your actual fuel_types table
const FUEL_TYPE_MAP = {
  1: { label: 'Petrol 92', formKey: 'petrol92' },
  2: { label: 'Petrol 95', formKey: 'petrol95' },
  3: { label: 'Auto Diesel', formKey: 'diesel' },
}

// Reverse: formKey → fuel_type_id
const FORM_KEY_TO_FUEL_TYPE = {
  petrol92: 1,
  petrol95: 2,
  diesel: 3,
}

export default {
  name: 'StockView',
  components: { StockCard },

  data() {
    return {
      // Overview state
      loading: false,
      apiError: '',
      stations: [], // raw API stations array
      activeStation: null,

      // Summary counters (from API)
      totalStock: 0,
      lowStockCount: 0,
      outOfStockCount: 0,

      // Transaction state
      transactions: [],
      txnLoading: false,
      dropdownOpen: false,
      selectedFilter: { label: 'All Stations', value: null },

      // Modal state
      showModal: false,
      submitting: false,
      formError: '',
      formSuccess: '',
      form: {
        stationId: '',
        petrol92: null,
        petrol95: null,
        diesel: null,
      },
    }
  },

  computed: {
    currentStation() {
      if (!this.activeStation) return null
      return this.stations.find((s) => s.station_id === this.activeStation) || null
    },

    filterOptions() {
      const all = [{ label: 'All Stations', value: null }]
      this.stations.forEach((s) => {
        all.push({ label: s.station_name, value: s.station_id })
      })
      return all
    },
  },

  methods: {
    // ─── Helpers ──────────────────────────────────────────────────────────────

    padId(id) {
      return String(id).padStart(2, '0')
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      const d = new Date(dateStr)
      const pad = (n) => String(n).padStart(2, '0')
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    },

    /**
     * Map a raw stock record from the API into the shape StockCard expects:
     * { type, current, capacity, status }
     * capacity is fixed at 10000 unless your API returns it
     */
    mapStockToFuel(stock) {
      const fuelInfo = FUEL_TYPE_MAP[stock.fuel_type_id]
      return {
        type: fuelInfo ? fuelInfo.label : stock.fuel_name,
        current: Number(stock.quantity_litres),
        capacity: Number(stock.capacity_litres || 10000),
        status: stock.stock_status,
      }
    },

    // ─── Data Loading ──────────────────────────────────────────────────────────

    async loadOverview() {
      this.loading = true
      this.apiError = ''
      try {
        const res = await getStockOverview()
        const data = res.data.data

        this.totalStock = Number(data.total_stock_litres)
        this.lowStockCount = data.low_stock_stations
        this.outOfStockCount = data.out_of_stock_stations
        this.stations = data.stations

        // Auto-select first station tab
        if (this.stations.length && !this.activeStation) {
          this.activeStation = this.stations[0].station_id
        }
      } catch (err) {
        this.apiError = err?.response?.data?.message || 'Failed to load stock overview.'
      } finally {
        this.loading = false
      }
    },

    async loadTransactions(stationId = null) {
      this.txnLoading = true
      try {
        const res = stationId
          ? await getTransactionHistoryByStation(stationId)
          : await getTransactionHistory()
        this.transactions = res.data.data
      } catch (err) {
        // silently fail — table will show empty
        this.transactions = []
      } finally {
        this.txnLoading = false
      }
    },

    async onFilterChange(opt) {
      this.selectedFilter = opt
      this.dropdownOpen = false
      await this.loadTransactions(opt.value)
    },

    // ─── Modal ─────────────────────────────────────────────────────────────────

    closeModal() {
      this.showModal = false
      this.formError = ''
      this.formSuccess = ''
      this.submitting = false
      this.form = { stationId: '', petrol92: null, petrol95: null, diesel: null }
    },

    async submitStock() {
      this.formError = ''
      this.formSuccess = ''

      if (!this.form.stationId) {
        this.formError = 'Please select a station.'
        return
      }

      const fuels = [
        { formKey: 'petrol92', qty: this.form.petrol92 },
        { formKey: 'petrol95', qty: this.form.petrol95 },
        { formKey: 'diesel', qty: this.form.diesel },
      ].filter(({ qty }) => qty && qty > 0)

      if (fuels.length === 0) {
        this.formError = 'Please enter at least one fuel quantity.'
        return
      }

      this.submitting = true

      try {
        // Send one API call per fuel type that has a value
        // addStock handles both new records AND updates (upsert logic in backend)
        const promises = fuels.map(({ formKey, qty }) =>
          addStock(this.form.stationId, FORM_KEY_TO_FUEL_TYPE[formKey], qty),
        )

        await Promise.all(promises)

        this.formSuccess = 'Stock updated successfully!'

        // Refresh data
        await this.loadOverview()
        await this.loadTransactions(this.selectedFilter.value)

        setTimeout(() => this.closeModal(), 1200)
      } catch (err) {
        this.formError = err?.response?.data?.message || 'Failed to update stock. Please try again.'
      } finally {
        this.submitting = false
      }
    },
  },

  async mounted() {
    await this.loadOverview()
    await this.loadTransactions()
  },
}
</script>
<style scoped>
/* Page Layout */
.stock-page-wrapper {
  width: 100%;
}

/* Top Action Row */
.top-action-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

/* Update Stock Button */
.update-stock-btn {
  background: #820000 !important;
  color: #fff !important;
  font-family: 'Poppins', sans-serif;
  font-weight: 700 !important;
  font-size: 15px;
  padding: 8px 24px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  height: 44px;
  box-shadow: 0 4px 10px rgba(130, 0, 0, 0.25);
  text-transform: none !important;
}

/* Loading and Error Messages */
.loading-msg {
  text-align: center;
  color: #820000;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 12px 0;
}

.error-msg {
  color: #c40000;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  margin-bottom: 12px;
}

/* Summary Statistics Cards */
.overview-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 3.19px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  min-height: 80px;
}

/* Card Gradient Bar */
.gradient-bar {
  position: absolute;
  height: 4px;
  left: 0;
  right: 0;
  top: 0;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  border-radius: 11px 11px 0px 0px;
  z-index: 2;
}

/* Stat Content */
.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 3.19px;
  width: 100%;
  z-index: 0;
  margin-top: 6px;
}

.stat-number {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: -0.72px;
  color: #1a1a1a;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #7a7974;
}

/* White Card Container */
.overview-white-card-premium {
  background: #fff;
  border: 1px solid #820000;
  border-radius: 11px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Card Inner Padding */
.card-inner-padding {
  padding: 24px;
}

/* Section Heading */
.section-heading {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}

/* Station Tabs */
.station-tabs-wrap {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
  overflow-x: auto;
}

.station-tab-item {
  padding: 12px 24px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #000;
  background: none;
  border: none;
  border-bottom: 4px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.station-tab-item.active {
  border-bottom-color: #820000;
}

/* Fuel Cards Grid */
.fuel-cards-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* Empty Message */
.empty-msg-inline {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #888;
  text-align: center;
  padding: 24px 0;
}

/* Transaction Header */
.heading-with-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Filter Dropdown */
.custom-filter-select {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #820000;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  min-width: 160px;
}

.filter-dropdown-list {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  min-width: 200px;
  background: #fff;
  border: 1px solid #fbeaea;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
}

.filter-opt {
  padding: 10px 14px;
  transition: background 0.2s;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}

.filter-opt:hover {
  background: #fbeaea;
}

.filter-opt.active {
  background: #fbeaea;
  color: #820000;
  font-weight: 700;
}

/* Transaction Table */
.table-outer {
  overflow-x: auto;
}

.txn-history-table {
  width: 100%;
  border-collapse: collapse;
}

.txn-history-table th {
  background: #fbe6e6;
  padding: 16px 24px;
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

.txn-history-table td {
  padding: 16px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

/* Table Text Helpers */
.bold-val {
  font-weight: 700;
}

.text-gray {
  color: #666;
}

.empty-msg {
  text-align: center;
  color: #888;
  font-style: italic;
}

/* Stock Adjustment Modal */
.premium-stock-modal {
  border-radius: 16px !important;
  overflow: hidden;
}

.modal-header-gradient {
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  width: 30px;
  height: 30px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-close:hover {
  opacity: 0.8;
}

/* Modal Form */
.modal-form-content {
  padding: 24px;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-group.full {
  grid-column: span 2;
}

.input-group label {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

/* Form Inputs */
.select-box-wrap {
  position: relative;
}

.input-group input,
.select-box-wrap select {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background: #f5f5f5;
  border: 1px solid #820000;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box;
}

.select-box-wrap .v-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #820000;
}

/* Modal Footer Actions */
.modal-footer-actions {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-btn.cancel {
  background: #f0f0f0;
  color: #666;
}

.modal-btn.update {
  background: #820000;
  color: #fff;
}

/* Utility Classes */
.mt-24 {
  margin-top: 24px;
}

.err-msg {
  color: #c40000;
  font-size: 13px;
  margin-top: 8px;
}

.success-msg {
  color: #16a34a;
  font-size: 13px;
  margin-top: 8px;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .overview-stats-grid {
    grid-template-columns: 1fr;
  }

  .input-grid {
    grid-template-columns: 1fr;
  }

  .input-group.full {
    grid-column: span 1;
  }
}

/* Tablet Responsive */
@media (max-width: 768px) {
  .history-header {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .station-name {
    min-width: 180px;
  }

  .history-filter {
    width: 100%;
  }
}
</style>

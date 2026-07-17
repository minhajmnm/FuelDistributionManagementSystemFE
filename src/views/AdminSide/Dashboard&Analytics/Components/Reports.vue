<template>
  <div class="reports-card">
    <!-- Header with Title and Export Buttons -->
    <div class="reports-header">
      <h2 class="reports-title">Reports</h2>
      <div class="reports-actions">
        <button type="button" class="export-button export-csv" @click="exportCsv">
          Export CSV
        </button>
        <button type="button" class="export-button export-pdf" @click="exportPdf">
          Export PDF
        </button>
      </div>
    </div>

    <!-- Divider below title -->
    <div class="reports-divider"></div>

    <!-- Tab Navigation -->
    <div class="reports-tabs">
      <button
        class="reports-tab"
        :class="{ 'reports-tab--active': activeTab === 'fuel' }"
        @click="switchTab('fuel')"
      >
        Fuel Usage Report
      </button>
      <button
        class="reports-tab"
        :class="{ 'reports-tab--active': activeTab === 'queue' }"
        @click="switchTab('queue')"
      >
        Queue Statistics Report
      </button>
    </div>

    <!-- Divider below tabs -->
    <div class="reports-divider"></div>

    <!-- Filters Row -->
    <div class="reports-filters">
      <!-- Station dropdown -->
      <div class="filter-select-box">
        <select v-model="selectedStation">
          <option value="">All Stations</option>

          <option v-for="station in activeStations" :key="station.id" :value="station.id">
            {{ station.name }}
          </option>
        </select>
        <span class="filter-arrow">▾</span>
      </div>

      <!-- Fuel type dropdown (Fuel Usage tab only) -->
      <div class="filter-select-box" v-if="activeTab === 'fuel'">
        <select v-model="selectedFuel">
          <option value="">All Fuels</option>

          <option v-for="fuel in fuelTypes" :key="fuel.fuel_type_id" :value="fuel.fuel_type_id">
            {{ fuel.fuel_name }}
          </option>
        </select>
        <span class="filter-arrow">▾</span>
      </div>

      <!-- Date From -->
      <div class="filter-date-box">
        <input type="date" v-model="dateFrom" />
      </div>

      <span class="filter-to">to</span>

      <!-- Date To -->
      <div class="filter-date-box">
        <input type="date" v-model="dateTo" />
      </div>

      <!-- Apply Button -->
      <button class="apply-btn" :disabled="loading" @click="applyFilter">
        {{ loading ? '...' : 'Apply' }}
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="reports-loading">Loading…</div>

    <!-- Error message -->
    <div v-if="errorMsg" class="reports-error">{{ errorMsg }}</div>

    <!-- Table -->
    <div class="reports-table-wrap" v-if="!loading">
      <!-- Fuel Usage Report Table -->
      <table v-if="activeTab === 'fuel'" class="reports-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Station</th>
            <th>Fuel Type</th>
            <th>Total (L)</th>
            <th>Revenue (LKR)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="fuelRows.length === 0">
            <td colspan="5" class="empty-row">No data found for the selected filters.</td>
          </tr>
          <tr v-for="(row, i) in fuelRows" :key="i">
            <td>{{ row.date }}</td>
            <td>{{ row.station }}</td>
            <td>{{ row.fuelType }}</td>
            <td>{{ formatNumber(row.total) }}</td>
            <td>{{ formatNumber(row.revenue) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Queue Statistics Report Table -->
      <table v-if="activeTab === 'queue'" class="reports-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Station</th>
            <th>Total Queue Joined</th>
            <th>Total Served</th>
            <th>Total Skipped</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="queueRows.length === 0">
            <td colspan="5" class="empty-row">No data found for the selected filters.</td>
          </tr>
          <tr v-for="(row, i) in queueRows" :key="i">
            <td>{{ row.date }}</td>
            <td>{{ row.station }}</td>
            <td>{{ row.joined }}</td>
            <td>{{ row.served }}</td>
            <td>{{ row.skipped }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// import DashboardManagement API
import DashboardManagement from '@/Api/Modules/DashboardManagement'

export default {
  name: 'Reports',
  props: {
    activeStations: {
      type: Array,
      default: () => [],
    },
    fuelTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: 'fuel',
      selectedStation: '',
      selectedFuel: '',
      dateFrom: '',
      dateTo: '',

      loading: false,
      errorMsg: '',

      fuelRows: [],
      queueRows: [],
    }
  },

  async mounted() {
    // Load initial report data using the default date range on mount
    await this.applyFilter()
  },

  methods: {
    // Switch tab and immediately reload data for the new tab
    async switchTab(tab) {
      this.activeTab = tab
      await this.applyFilter()
    },

    // Fetch report data from API
    async applyFilter() {
      if (!this.dateFrom || !this.dateTo) return

      this.loading = true
      this.errorMsg = ''

      try {
        if (this.activeTab === 'fuel') {
          const res = await DashboardManagement.getFuelUsageReport(this.dateFrom, this.dateTo)
          const raw = res.data?.data ?? res.data ?? []

          this.fuelRows = Array.isArray(raw)
            ? raw.map((item) => ({
                date: this.formatApiDate(item.date),
                station: item.station_name ?? '',
                fuelType: item.fuel_type_name ?? '',
                total: Number(item.total_litres ?? 0),
                revenue: Number(
                  item.total_revenue ?? item.revenue ?? item.amount ?? item.total_amount ?? 0,
                ),
              }))
            : []
        } else {
          const res = await DashboardManagement.getQueueStatsReport(this.dateFrom, this.dateTo)
          const raw = res.data?.data ?? res.data ?? []

          this.queueRows = Array.isArray(raw)
            ? raw.map((r) => ({
                date: this.formatApiDate(r.date),
                station: r.station_name ?? '',
                joined: Number(r.total_joined ?? 0),
                served: Number(r.total_served ?? 0),
                skipped: Number(r.total_skipped ?? 0),
              }))
            : []
        }
      } catch (err) {
        console.error('[Reports] applyFilter failed:', err)
        this.errorMsg = 'Failed to load report data. Please try again.'
      } finally {
        this.loading = false
      }
    },

    // Helpers
    formatNumber(value) {
      return Number(value || 0).toFixed(2)
    },

    // Normalise any ISO/date-string from the API into MM/DD/YYYY display format
    formatApiDate(val) {
      if (!val) return ''
      const d = new Date(val)
      if (isNaN(d)) return val // Return as-is if unparseable
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${m}/${day}/${d.getFullYear()}`
    },

    // CSV Export
    exportCsv() {
      const rows = []
      let filename = 'report.csv'

      if (this.activeTab === 'fuel') {
        filename = 'fuel-usage-report.csv'
        rows.push(['Fuel Usage Report'])
        rows.push(['Generated:', new Date().toLocaleString('en-GB')])
        rows.push([])
        rows.push(['Date', 'Station', 'Fuel Type', 'Total (L)', 'Revenue (LKR)'])
        this.fuelRows.forEach((row) => {
          rows.push([row.date, row.station, row.fuelType, row.total, row.revenue])
        })
      } else {
        filename = 'queue-statistics-report.csv'
        rows.push(['Queue Statistics Report'])
        rows.push(['Generated:', new Date().toLocaleString('en-GB')])
        rows.push([])
        rows.push(['Date', 'Station', 'Total Queue Joined', 'Total Served', 'Total Skipped'])
        this.queueRows.forEach((row) => {
          rows.push([row.date, row.station, row.joined, row.served, row.skipped])
        })
      }

      const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\r\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    // PDF Export
    async exportPdf() {
      const script1 = document.createElement('script')
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      document.head.appendChild(script1)
      await new Promise((res) => (script1.onload = res))

      const script2 = document.createElement('script')
      script2.src =
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
      document.head.appendChild(script2)
      await new Promise((res) => (script2.onload = res))

      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      let reportTitle = ''
      let filename = 'report.pdf'
      let headers = []
      let bodyRows = []

      if (this.activeTab === 'fuel') {
        reportTitle = 'Fuel Usage Report'
        filename = 'fuel-usage-report.pdf'
        headers = [['Date', 'Station', 'Fuel Type', 'Total (L)', 'Revenue (LKR)']]
        bodyRows = this.fuelRows.map((r) => [
          r.date,
          r.station,
          r.fuelType,
          this.formatNumber(r.total),
          this.formatNumber(r.revenue),
        ])
      } else {
        reportTitle = 'Queue Statistics Report'
        filename = 'queue-statistics-report.pdf'
        headers = [['Date', 'Station', 'Total Queue Joined', 'Total Served', 'Total Skipped']]
        bodyRows = this.queueRows.map((r) => [r.date, r.station, r.joined, r.served, r.skipped])
      }

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(163, 0, 0)
      doc.text(reportTitle, 14, 18)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100)
      doc.text('Generated: ' + new Date().toLocaleString('en-GB'), 14, 26)

      doc.autoTable({
        head: headers,
        body: bodyRows,
        startY: 32,
        styles: { fontSize: 11, cellPadding: 4 },
        headStyles: { fillColor: [163, 0, 0], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [251, 230, 230] },
        margin: { left: 14, right: 14 },
      })

      doc.save(filename)
    },
  },
}
</script>

<style scoped>
/* Reports Card */
.reports-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #a30000;
  border-radius: 11px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 22px 24px 0;
  gap: 0;
  box-sizing: border-box;
}

/* Reports Header */
.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 22px;
}

/* Reports Title */
.reports-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  margin: 0;
}

/* Export Actions */
.reports-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Export Button */
.export-button {
  min-width: 123px;
  height: 34px;
  border-radius: 11px;
  border: 1px solid #840000;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12.8px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.72px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

/* Export Button Hover */
.export-button:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}

/* CSV Button */
.export-csv {
  background: #71dba4;
  color: #000000;
}

/* PDF Button */
.export-pdf {
  background: #fd8686;
  color: #000000;
}

/* Divider */
.reports-divider {
  width: calc(100% + 48px);
  margin: 0 -24px;
  height: 1px;
  background: rgba(179, 120, 120, 0.58);
}

/* Report Tabs */
.reports-tabs {
  display: flex;
  gap: 32px;
  padding: 14px 0 0;
  flex-wrap: wrap;
}

/* Tab Button */
.reports-tab {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  background: none;
  border: none;
  padding: 0 0 10px;
  cursor: pointer;
  position: relative;
}

/* Active Tab Underline */
.reports-tab--active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 3px;
  background: #a30000;
  border-radius: 3px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

/* Filters Row */
.reports-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  flex-wrap: wrap;
}

/* Filter Select Box */
.filter-select-box {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 123px;
  height: 34px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  padding: 0 10px 0 12px;
  box-sizing: border-box;
}

/* Filter Select */
.filter-select-box select {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12.8px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  border: none;
  outline: none;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding-right: 16px;
  cursor: pointer;
}

/* Filter Dropdown Arrow */
.filter-arrow {
  position: absolute;
  right: 8px;
  font-size: 12px;
  color: #000000;
  pointer-events: none;
}

/* Date Box */
.filter-date-box {
  display: flex;
  align-items: center;
  min-width: 123px;
  height: 34px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  padding: 0 10px;
  box-sizing: border-box;
}

/* Date Input */
.filter-date-box input[type='date'] {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12.8px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
}

/* Date Range Text */
.filter-to {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
}

/* Apply Button */
.apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 34px;
  background: #e04646;
  border: 1px solid #820000;
  border-radius: 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #ffffff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

/* Apply Button Hover */
.apply-btn:hover {
  opacity: 0.88;
}

/* Disabled Apply Button */
.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading and Error Text */
.reports-loading,
.reports-error {
  padding: 16px 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-align: center;
}

/* Error Text */
.reports-error {
  color: #a30000;
}

/* Table Wrapper */
.reports-table-wrap {
  width: calc(100% + 48px);
  margin: 0 -24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Reports Table */
.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

/* Table Header Row */
.reports-table thead tr {
  background: #fbe6e6;
}

/* Table Header Cells */
.reports-table thead th {
  padding: 22px 18px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
  line-height: 12px;
  letter-spacing: -0.72px;
  color: #000000;
  white-space: nowrap;
}

/* Table Body Rows */
.reports-table tbody tr {
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);
}

/* Last Table Row */
.reports-table tbody tr:last-child {
  border-bottom: none;
}

/* Table Body Cells */
.reports-table tbody td {
  padding: 18px 18px;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
  white-space: nowrap;
}

/* Empty Row */
.empty-row {
  text-align: center;
  color: #999;
  padding: 32px 18px !important;
}

/* Print Styles */
@media print {
  body * {
    visibility: hidden;
  }

  .reports-card,
  .reports-card * {
    visibility: visible;
  }

  .reports-card {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none;
    padding: 0;
  }

  .reports-actions,
  .reports-tabs,
  .reports-filters {
    display: none !important;
  }
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .reports-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .reports-actions {
    width: 100%;
    gap: 12px;
  }

  .export-button {
    flex: 1;
    min-width: 0;
  }

  .reports-tabs {
    flex-direction: column;
    gap: 12px;
  }

  .reports-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select-box,
  .filter-date-box,
  .apply-btn {
    width: 100%;
  }

  .filter-to {
    text-align: left;
  }

  .reports-table {
    min-width: 650px;
  }
}
</style>

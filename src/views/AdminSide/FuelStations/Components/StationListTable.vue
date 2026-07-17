<template>
  <div class="common-table-card station-list-card-spacing">
    <div class="station-list-top">
      <div class="station-list-title-wrap">
        <h2 class="station-list-title">Station List</h2>
      </div>
      <div class="station-list-divider"></div>
      <div class="station-list-filters">
        <!-- search station -->
        <div class="common-search-box search-box-width">
          <v-icon size="18">mdi-magnify</v-icon>
          <input type="text" placeholder="Search Station Name or Address" v-model="searchQuery" />
        </div>
        <!-- station wise filter -->
        <div class="common-select-box filter-select">
          <select v-model="selectedStatus">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>
          <v-icon size="18">mdi-chevron-down</v-icon>
        </div>
        <!-- fuel selection filter -->
        <div class="common-select-box filter-select">
          <select v-model="selectedFuel">
            <option value="">All Fuel</option>
            <option value="petrol92">Petrol 92</option>
            <option value="petrol95">Petrol 95</option>
            <option value="diesel">Auto Diesel</option>
          </select>
          <v-icon size="18">mdi-chevron-down</v-icon>
        </div>
      </div>
    </div>
    <!-- station detail table -->
    <div class="station-table-wrap">
      <table class="station-table">
        <thead class="common-table-header">
          <tr>
            <th>Station Name</th>
            <th>Address</th>
            <th>Fuel Types & Stock(L)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="station in filteredStations"
            :key="station.station_id"
            :class="{ 'station-row--deactive': station.status === 'deactive' }"
          >
            <td>{{ station.name }}</td>
            <td>{{ station.address }}</td>
            <td>
              <div class="fuel-badges">
                <span
                  v-for="(fuel, index) in station.fuelStocks || []"
                  :key="index"
                  :class="['fuel-badge', fuel.typeClass]"
                >
                  {{ fuel.label }}
                </span>
              </div>
            </td>
            <td>
              <div
                :class="[
                  'status-chip',
                  station.status === 'active' ? 'status-active' : 'status-deactive',
                ]"
              >
                <span class="status-dot"></span>
                {{ station.status === 'active' ? 'Active' : 'Deactive' }}
              </div>
            </td>
            <td class="actions-cell">
              <div class="d-flex align-center gap-2">
                <!-- Edit Button: Outlined -->
                <v-btn
                  icon
                  variant="outlined"
                  size="small"
                  class="edit-btn"
                  :disabled="station.status !== 'active'"
                  :class="{ 'disabled-action': station.status !== 'active' }"
                  @click="$emit('edit-station', station)"
                >
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>

                <!-- Delete Button: Text -->
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  class="delete-btn"
                  :disabled="station.status !== 'active'"
                  :class="{ 'disabled-action': station.status !== 'active' }"
                  @click="confirmDelete(station.station_id)"
                >
                  <v-icon size="20">mdi-delete-outline</v-icon>
                </v-btn>

                <!-- Toggle Button -->
                <v-btn
                  icon
                  variant="flat"
                  size="small"
                  :color="station.status === 'active' ? '#E53935' : '#43A047'"
                  class="toggle-btn text-white"
                  @click="toggleStatus(station.station_id)"
                >
                  <v-icon size="16">{{
                    station.status === 'active' ? 'mdi-close' : 'mdi-power'
                  }}</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
          <tr v-if="filteredStations.length === 0">
            <td colspan="5" class="text-center py-7">No fuel stations found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Delete Confirmation Dialog ── -->
    <v-dialog v-model="showDeleteDialog" persistent width="420">
      <v-card class="delete-confirm-card">
        <!-- Header -->
        <div class="delete-dialog-header">
          <div class="delete-icon-wrap">
            <span class="mdi mdi-delete-outline delete-icon"></span>
          </div>
        </div>

        <!-- Body -->
        <div class="delete-dialog-body">
          <h3 class="delete-dialog-title">Delete Station?</h3>
          <p class="delete-dialog-msg">
            Are you sure you want to delete this station? This action cannot be undone.
          </p>
        </div>

        <!-- Actions -->
        <div class="delete-dialog-actions">
          <button class="del-button del-cancel-btn" @click="showDeleteDialog = false">
            Cancel
          </button>
          <button class="del-button del-confirm-btn" @click="doDelete">Delete</button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  // define props
  props: {
    stations: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      searchQuery: '',
      selectedStatus: '',
      selectedFuel: '',
      showDeleteDialog: false,
      deleteTargetId: null,
    }
  },
  //computed property to filter stations based on search query, status, and fuel type
  computed: {
    filteredStations() {
      return this.stations.filter((station) => {
        const name = station.name || ''
        const address = station.address || ''
        const fuelStocks = station.fuelStocks || []

        const searchMatch = this.searchQuery
          ? name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            address.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true

        const statusMatch = this.selectedStatus ? station.status === this.selectedStatus : true

        const fuelMatch = this.selectedFuel
          ? fuelStocks.some((fuel) => fuel.typeClass === this.selectedFuel)
          : true

        return searchMatch && statusMatch && fuelMatch
      })
    },
  },
  methods: {
    toggleStatus(stationId) {
      this.$emit('toggle-status', stationId)
    },

    confirmDelete(stationId) {
      this.deleteTargetId = stationId
      this.showDeleteDialog = true
    },

    doDelete() {
      this.$emit('delete-station', this.deleteTargetId)
      this.showDeleteDialog = false
      this.deleteTargetId = null
    },
  },
}
</script>

<style scoped>
.station-list-card-spacing {
  width: 100%;
  margin-top: 26px;
}

.station-list-top {
  display: flex;
  flex-direction: column;
  padding: 20px 24px 16px;
  gap: 16px;
}

.station-list-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: #000000;
  margin: 0;
}

.station-list-divider {
  width: calc(100% + 48px);
  height: 1px;
  background: rgba(217, 70, 70, 0.2);
  margin: 0 -24px;
}

.station-list-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.search-box-width {
  min-width: 280px;
  max-width: 480px;
  flex: 1 1 320px;
}

.filter-select {
  min-width: 130px;
  flex: 0 0 auto;
}

.station-table-wrap {
  width: 100%;
  max-height: 340px;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.station-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1220px;
  font-family: 'Inter', sans-serif;
}

.station-table th,
.station-table td {
  white-space: nowrap;
}

.station-table thead th {
  padding: 16px 18px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
  color: #000000;
}

.station-table tbody tr {
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);
}

.station-table tbody tr:hover {
  background: #fffafa;
}

.station-row--deactive {
  background: rgba(182, 137, 137, 0.21) !important;
}

.station-row--deactive:hover {
  background: rgba(182, 137, 137, 0.21) !important;
}

.station-row--deactive td {
  opacity: 0.8;
}

.station-table tbody tr:last-child {
  border-bottom: none;
}

.station-table td {
  padding: 16px 18px;
  font-size: 14px;
  color: #000000;
  vertical-align: middle;
}

/* Fuel Badge styles now in global.scss */

/* Status Chip classes removed - now in global.scss */

.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  border: 1.5px solid #000 !important;
  width: 28px !important;
  height: 28px !important;
  color: #000 !important;
}

.delete-btn {
  color: #333 !important;
  width: 28px !important;
  height: 28px !important;
}

.toggle-btn {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  border-radius: 50% !important;
}

.gap-2 {
  gap: 6px;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.text-white {
  color: white !important;
}

.disabled-action {
  opacity: 0.35;
  pointer-events: none;
}

/* ── DELETE CONFIRMATION DIALOG ── */
.delete-confirm-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
}

.delete-dialog-header {
  background: linear-gradient(135deg, #b60106 0%, #820000 100%);
  padding: 28px 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.delete-icon {
  font-size: 32px;
  color: #ffffff;
}

.delete-dialog-body {
  padding: 24px 28px 8px;
  text-align: center;
}

.delete-dialog-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #1a1a1a;
  margin: 0 0 10px;
}

.delete-dialog-msg {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.delete-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 28px 28px;
}

.del-button {
  width: 108px;
  height: 36px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-transform: none;
  cursor: pointer;
}

.del-cancel-btn {
  border: 1px solid #aaa;
  background: rgba(217, 217, 217, 0.5);
  color: #555;
}

.del-confirm-btn {
  border: 1px solid #820000;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(182, 1, 6, 0.35);
  transition: opacity 0.2s;
}

.del-confirm-btn:hover {
  opacity: 0.88;
}
.fuel-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>

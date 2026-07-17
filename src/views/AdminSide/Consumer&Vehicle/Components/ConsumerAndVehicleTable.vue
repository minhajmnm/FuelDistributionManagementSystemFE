<template>
  <div class="consumer-list-card">
    <div class="consumer-list-top">
      <div class="consumer-list-title-wrap">
        <h2 class="consumer-list-title">Consumer and Vehicle List</h2>
      </div>

      <div class="consumer-list-divider"></div>

      <div class="consumer-list-filters">
        <!-- Search -->
        <div class="search-box">
          <v-icon size="18">mdi-magnify</v-icon>
          <input
            type="text"
            placeholder="Search by Name, NIC or Vehicle No"
            v-model="searchQuery"
          />
        </div>

        <!-- Status filter -->
        <div class="select-box filter-select">
          <select v-model="selectedStatus">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
          <v-icon size="18">mdi-menu-down</v-icon>
        </div>

        <!-- Fuel type filter -->
        <div class="select-box filter-select">
          <select v-model="selectedFuel">
            <option value="">All Fuel</option>
            <option value="Petrol 92">Petrol 92</option>
            <option value="Petrol 95">Petrol 95</option>
            <option value="Auto Diesel">Auto Diesel</option>
          </select>
          <v-icon size="18">mdi-menu-down</v-icon>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="consumer-table-wrap">
      <table class="consumer-table">
        <thead>
          <tr>
            <th>Consumer Name</th>
            <th>NIC</th>
            <th>Email</th>
            <th>Vehicle No</th>
            <th>Fuel Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredConsumers"
            :key="item.id"
            :class="{ 'consumer-row--deactive': item.status === 'Deactive' }"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.nic }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.vehicleNo }}</td>
            <td>
              <span :class="['fuel-badge', fuelBadgeClass(item.fuelType)]">
                {{ item.fuelType }}
              </span>
            </td>
            <td>
              <div
                :class="[
                  'status-chip',
                  item.status === 'Active' ? 'status-active' : 'status-deactive',
                ]"
              >
                <span class="status-dot"></span>
                {{ item.status }}
              </div>
            </td>
            <td class="actions-cell">
              <div class="d-flex align-center gap-2">
                <v-btn
                  icon
                  variant="outlined"
                  size="small"
                  class="edit-btn"
                  :disabled="item.status !== 'Active'"
                  :class="{ 'disabled-action': item.status !== 'Active' }"
                  @click="$emit('edit', item)"
                >
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>

                <v-btn
                  icon
                  variant="text"
                  size="small"
                  class="delete-btn"
                  :disabled="item.status !== 'Active'"
                  :class="{ 'disabled-action': item.status !== 'Active' }"
                  @click="openDeleteDialog(item.id)"
                >
                  <v-icon size="20">mdi-account-off-outline</v-icon>
                </v-btn>

                <v-btn
                  icon
                  variant="flat"
                  size="small"
                  :color="item.status === 'Active' ? '#E53935' : '#43A047'"
                  class="toggle-btn text-white"
                  @click="$emit('toggle-status', item.id)"
                >
                  <v-icon size="16">{{
                    item.status === 'Active' ? 'mdi-close' : 'mdi-power'
                  }}</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
          <tr v-if="filteredConsumers.length === 0">
            <td colspan="7" class="empty-row">No consumers found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" persistent width="420">
      <v-card class="delete-confirm-card">
        <div class="delete-dialog-header">
          <div class="delete-icon-wrap">
            <span class="mdi mdi-delete-outline delete-icon"></span>
          </div>
        </div>
        <div class="delete-dialog-body">
          <h3 class="delete-dialog-title">Delete Consumer?</h3>
          <p class="delete-dialog-msg">
            Are you sure you want to delete this consumer? This action cannot be undone.
          </p>
        </div>
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
  name: 'ConsumerAndVehicleTable',

  // Props from parent component
  props: {
    consumers: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // Search and filter values
      searchQuery: '',
      selectedStatus: '',
      selectedFuel: '',

      // Delete dialog state
      showDeleteDialog: false,
      deleteTargetId: null,
    }
  },

  computed: {
    // Filter consumers by search, status, and fuel type
    filteredConsumers() {
      return this.consumers.filter((c) => {
        const q = this.searchQuery.toLowerCase()

        const searchMatch = q
          ? c.name.toLowerCase().includes(q) ||
            c.nic.toLowerCase().includes(q) ||
            c.vehicleNo.toLowerCase().includes(q)
          : true

        const statusMatch = this.selectedStatus ? c.status === this.selectedStatus : true

        const fuelMatch = this.selectedFuel ? c.fuelType === this.selectedFuel : true

        return searchMatch && statusMatch && fuelMatch
      })
    },
  },

  methods: {
    // Open delete confirmation dialog
    openDeleteDialog(id) {
      this.deleteTargetId = id
      this.showDeleteDialog = true
    },

    // Confirm delete and send event to parent
    doDelete() {
      this.$emit('delete', this.deleteTargetId)
      this.showDeleteDialog = false
      this.deleteTargetId = null
    },

    // Return fuel badge class based on fuel type
    fuelBadgeClass(fuelType) {
      const f = fuelType ? fuelType.toLowerCase() : ''

      if (f.includes('92')) return 'petrol92'
      if (f.includes('95')) return 'petrol95'
      if (f.includes('diesel')) return 'diesel'

      return ''
    },
  },
}
</script>

<style scoped>
/* Consumer List Card */
.consumer-list-card {
  width: 100%;
  margin-top: 26px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* Top Section */
.consumer-list-top {
  display: flex;
  flex-direction: column;
  padding: 20px 24px 16px;
  gap: 16px;
}

/* Title */
.consumer-list-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: #000000;
  margin: 0;
}

/* Divider */
.consumer-list-divider {
  width: calc(100% + 48px);
  height: 1px;
  background: rgba(217, 70, 70, 0.2);
  margin: 0 -24px;
}

/* Filters */
.consumer-list-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

/* Search and Select Boxes */
.search-box,
.select-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #820000;
  border-radius: 11px;
  background: #ffffff;
}

/* Search Box */
.search-box {
  min-width: 280px;
  max-width: 420px;
  flex: 1 1 320px;
}

/* Filter Select */
.filter-select {
  min-width: 130px;
  width: 130px;
}

/* Search Input and Select */
.search-box input,
.select-box select {
  width: 100%;
  border: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6b7280;
  background: transparent;
}

/* Select Dropdown */
.select-box select {
  appearance: none;
  -webkit-appearance: none;
}

/* Table Wrapper */
.consumer-table-wrap {
  width: 100%;
  max-height: 340px;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Consumer Table */
.consumer-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  font-family: 'Inter', sans-serif;
}

/* Table Cell Text Wrap */
.consumer-table th,
.consumer-table td {
  white-space: nowrap;
}

/* Table Header */
.consumer-table thead th {
  padding: 16px 18px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  background: #fbe6e6;
}

/* Table Rows */
.consumer-table tbody tr {
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);
}

.consumer-table tbody tr:hover {
  background: #fffafa;
}

.consumer-table tbody tr:last-child {
  border-bottom: none;
}

/* Table Data */
.consumer-table td {
  padding: 16px 18px;
  font-size: 14px;
  color: #000000;
  vertical-align: middle;
}

/* Deactive Row */
.consumer-row--deactive {
  background: rgba(182, 137, 137, 0.21) !important;
}

.consumer-row--deactive:hover {
  background: rgba(182, 137, 137, 0.21) !important;
}

.consumer-row--deactive td {
  opacity: 0.8;
}

/* Fuel Badges */
.fuel-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: 15px;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

/* Petrol 92 Badge */
.fuel-badge.petrol92 {
  color: #de2626;
  background: rgba(253, 236, 236, 0.55);
  border: 1px solid #de2626;
}

/* Petrol 95 Badge */
.fuel-badge.petrol95 {
  color: #9333ea;
  background: rgba(246, 238, 254, 0.55);
  border: 1px solid #a262f1;
}

/* Diesel Badge */
.fuel-badge.diesel {
  color: #2563eb;
  background: rgba(233, 239, 253, 0.55);
  border: 1px solid #2563eb;
}

/* Status Chip */
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
}

/* Active Status */
.status-active {
  background-color: #e6f4ea;
  color: #1e8e3e;
  border: 1px solid #ceead6;
}

.status-active .status-dot {
  background-color: #1e8e3e;
}

/* Deactive Status */
.status-deactive {
  background-color: #f1f3f4;
  color: #5f6368;
  border: 1px solid #e8eaed;
}

.status-deactive .status-dot {
  background-color: #5f6368;
}

/* Status Dot */
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Actions */
.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Edit Button */
.edit-btn {
  border: 1.5px solid #000 !important;
  width: 28px !important;
  height: 28px !important;
  color: #000 !important;
}

/* Delete Button */
.delete-btn {
  color: #333 !important;
  width: 28px !important;
  height: 28px !important;
}

/* Toggle Button */
.toggle-btn {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  border-radius: 50% !important;
}

/* Utility Classes */
.gap-2 {
  gap: 12px;
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

/* Disabled Action */
.disabled-action {
  opacity: 0.35;
  pointer-events: none;
}

/* Empty Row */
.empty-row {
  text-align: center;
  padding: 24px;
  color: #6b7280;
}

/* Delete Dialog */
.delete-confirm-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
}

/* Delete Dialog Header */
.delete-dialog-header {
  background: linear-gradient(135deg, #b60106 0%, #820000 100%);
  padding: 28px 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Delete Icon Wrapper */
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

/* Delete Icon */
.delete-icon {
  font-size: 32px;
  color: #ffffff;
}

/* Delete Dialog Body */
.delete-dialog-body {
  padding: 24px 28px 8px;
  text-align: center;
}

/* Delete Dialog Title */
.delete-dialog-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #1a1a1a;
  margin: 0 0 10px;
}

/* Delete Dialog Message */
.delete-dialog-msg {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* Delete Dialog Actions */
.delete-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 28px 28px;
}

/* Delete Dialog Button */
.del-button {
  width: 108px;
  height: 36px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
}

/* Cancel Button */
.del-cancel-btn {
  border: 1px solid #aaa;
  background: rgba(217, 217, 217, 0.5);
  color: #555;
}

/* Confirm Delete Button */
.del-confirm-btn {
  border: 1px solid #820000;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(182, 1, 6, 0.35);
  transition: opacity 0.2s;
}

/* Confirm Delete Button Hover */
.del-confirm-btn:hover {
  opacity: 0.88;
}
</style>

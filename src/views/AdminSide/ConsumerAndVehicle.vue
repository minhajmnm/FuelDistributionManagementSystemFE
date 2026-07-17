<template>
  <!-- main container -->
  <v-container fluid class="wrapper pa-0">
    <!-- top cards -->
    <div class="cards-row" style="margin-bottom: 36px">
      <ConsumerCard title="Total Consumer" :value="totalConsumers" />
      <ConsumerCard title="Active Consumers" :value="activeConsumers" />
      <ConsumerCard title="Deactive Consumers" :value="deactiveConsumers" />
      <ConsumerCard title="Total Vehicles" :value="totalVehicles" />
    </div>

    <!-- main box -->
    <div class="table-card-container">
      <!-- tabs -->
      <div class="tabs-header px-6 pt-4">
        <div class="tabs-list">
          <div :class="['tab-item', { active: tab === 'consumer' }]" @click="tab = 'consumer'">
            Consumer List
          </div>
          <div :class="['tab-item', { active: tab === 'vehicle' }]" @click="tab = 'vehicle'">
            Vehicle List
          </div>
        </div>
      </div>

      <div class="tabs-divider"></div>

      <!-- filters -->
      <div class="filters-row pa-6">
        <!-- search -->
        <div class="search-field">
          <v-icon size="20" color="#666">mdi-magnify</v-icon>
          <input
            v-model="search"
            type="text"
            :placeholder="tab === 'consumer' ? 'Search consumer, NIC' : 'Search vehicle, owner'"
          />
        </div>

        <!-- status -->
        <!-- Removed status filter as only active records are shown -->

        <!-- vehicle type -->
        <div class="select-field">
          <select v-model="vehicleFilter">
            <option v-for="v in vehicleTypes" :key="v" :value="v">{{ v }}</option>
          </select>
          <v-icon size="20">mdi-chevron-down</v-icon>
        </div>
      </div>

      <!-- consumer table -->
      <div v-if="tab === 'consumer'" class="table-responsive">
        <table class="premium-table">
          <thead>
            <tr>
              <th style="min-width: 220px">Consumer</th>
              <th style="min-width: 140px">Phone</th>
              <th style="min-width: 200px">Email</th>
              <th style="min-width: 140px">Vehicle.No</th>
              <th style="min-width: 140px">Vehicle Type</th>
              <th style="min-width: 150px">Weekly Quota(L)</th>
              <th style="min-width: 120px">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredConsumers"
              :key="item.id"
              class="table-row"
              :class="{ 'row-deactive': item.status !== 'Active' }"
            >
              <td>
                <div class="consumer-info">
                  <span class="name">{{ item.name }}</span>
                  <span class="nic">{{ item.nic }}</span>
                </div>
              </td>
              <td>{{ item.phone }}</td>
              <td class="email-cell">{{ item.email }}</td>
              <td>{{ item.vehicle }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.quota }}</td>
              <td>
                <div class="actions-wrap">
                  <template v-if="item.status === 'Active'">
                    <button
                      class="action-icon-btn edit-btn"
                      @click="openAssign(item)"
                      title="Assign Quota"
                    >
                      <v-icon size="18">mdi-clock-outline</v-icon>
                    </button>

                    <button
                      class="action-icon-btn delete-btn"
                      @click="confirmDeactivate(item.id)"
                      title="Deactivate Consumer"
                    >
                      <v-icon size="20">mdi-account-off-outline</v-icon>
                    </button>
                  </template>

                  <template v-else>
                    <button
                      class="action-icon-btn activate-btn"
                      @click="activateConsumer(item.id)"
                      title="Activate Consumer"
                    >
                      <v-icon size="20">mdi-account-check-outline</v-icon>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- vehicle table -->
      <div v-if="tab === 'vehicle'" class="table-responsive">
        <table class="premium-table">
          <thead>
            <tr>
              <th style="min-width: 180px">Vehicle.No</th>
              <th style="min-width: 180px">Vehicle Type</th>
              <th style="min-width: 180px">Fuel type</th>
              <th style="min-width: 220px">Owner Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredVehicles" :key="item.id" class="table-row">
              <td>{{ item.vehicle }}</td>
              <td>{{ item.type }}</td>
              <td>
                <span :class="['fuel-badge', getFuelClass(item.fuel)]">
                  {{ item.fuel }}
                </span>
              </td>
              <td>{{ item.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- popup -->
    <v-dialog v-model="assignDialog" max-width="520" persistent>
      <v-card class="assign-modal-card">
        <div class="modal-header">
          <span class="modal-title">Assign Quota</span>
          <button type="button" class="modal-close" @click="assignDialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <div class="modal-body pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <label class="modal-label">Consumer Name</label>
              <input :value="selectedItem && selectedItem.name" class="modal-input" disabled />
            </v-col>
            <v-col cols="12" md="6">
              <label class="modal-label">Vehicle No.</label>
              <input :value="selectedItem && selectedItem.vehicle" class="modal-input" disabled />
            </v-col>
            <v-col cols="12" md="6">
              <label class="modal-label">Vehicle Type</label>
              <input :value="selectedItem && selectedItem.type" class="modal-input" disabled />
            </v-col>
            <v-col cols="12" md="6">
              <label class="modal-label">Weekly Quota</label>
              <input v-model="quotaInput" type="number" class="modal-input active" />
            </v-col>
          </v-row>
        </div>

        <div class="modal-footer pa-6 pt-0">
          <button class="modal-btn cancel" @click="assignDialog = false">Cancel</button>
          <button class="modal-btn assign" @click="assignQuota">Assign Quota</button>
        </div>
      </v-card>
    </v-dialog>

    <!-- ── Deactive Confirmation Dialog ── -->
    <v-dialog v-model="showDeleteDialog" persistent width="420">
      <v-card class="delete-confirm-card">
        <div class="delete-dialog-header">
          <div class="delete-icon-wrap">
            <span class="mdi mdi-account-off-outline delete-icon"></span>
          </div>
        </div>
        <div class="delete-dialog-body">
          <h3 class="delete-dialog-title">Deactivate Consumer?</h3>
          <p class="delete-dialog-msg">
            Are you sure you want to deactivate this consumer? This action cannot be undone.
          </p>
        </div>
        <div class="delete-dialog-actions">
          <button class="del-button del-cancel-btn" @click="showDeleteDialog = false">
            Cancel
          </button>
          <button class="del-button del-confirm-btn" @click="doDelete">Deactivate</button>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
// Components
import ConsumerCard from './Consumer&Vehicle/Components/ConsumerCard.vue'

// API Services
import AuthManagement from '@/Api/Modules/AuthManagement.js'
import VehicleManagement from '@/Api/Modules/VehicleManagement.js'

export default {
  // Registered Components
  components: {
    ConsumerCard,
  },

  data() {
    return {
      // Active tab
      tab: 'consumer',

      // Search value
      search: '',

      // Filter values
      statusFilter: 'All Status',
      vehicleFilter: 'All Vehicle Type',

      // Filter dropdown options
      statusList: ['All Status', 'Active', 'Deactive'],
      vehicleTypes: [
        'All Vehicle Type',
        'Car',
        'Motor Cycle',
        'Van',
        'Bus',
        'Tractor',
        'Three Wheeler',
        'Lorry',
        'Special Purpose Vehicle',
      ],

      // Dialog states
      assignDialog: false,
      showDeleteDialog: false,

      // Selected records
      deleteTargetId: null,
      selectedItem: null,

      // Quota input
      quotaInput: '',

      // Table data
      consumers: [],
      vehicles: [],

      // Loading state
      loading: false,

      refreshTimer: null,
    }
  },

  mounted() {
    // Load consumers and vehicles when page opens
    this.loadData()

    this.refreshTimer = setInterval(() => {
      this.loadData()
    }, 10000)

    // Reload data when browser tab becomes visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    // Reload data when window gets focus
    window.addEventListener('focus', this.handleWindowFocus)
  },
  beforeUnmount() {
    // Remove visibility event listener
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)

    // Remove focus event listener
    window.removeEventListener('focus', this.handleWindowFocus)

    // Clear auto refresh timer
    clearInterval(this.refreshTimer)
  },

  methods: {
    // Load consumers and vehicles from API
    async loadData() {
      try {
        this.loading = true

        const consumerRes = await AuthManagement.getAllConsumers()
        const vehicleRes = await VehicleManagement.getAllVehicles()

        const consumersData = consumerRes.data.data || consumerRes.data
        const vehiclesData = vehicleRes.data.data || vehicleRes.data

        // Format vehicle data for table
        this.vehicles = vehiclesData.map((v) => ({
          id: v.vehicle_id || v.id,
          consumer_id: v.consumer_id,
          vehicle: v.vehicle_no || 'N/A',
          type: v.vehicle_type || 'N/A',
          fuel: v.fuel_type?.fuel_name || 'N/A',
          owner: v.consumer?.full_name || 'N/A',
          quota: v.quota?.weekly_limit || 0,
        }))

        // Format consumer data for table
        this.consumers = consumersData
          .filter((c) => c.role === 'consumer')
          .map((c) => {
            const vehicle = this.vehicles.find((v) => v.consumer_id === c.consumer_id)

            return {
              id: c.consumer_id || c.id,
              vehicle_id: vehicle?.id,
              name: c.full_name,
              nic: c.nic_number,
              phone: c.phone_number,
              email: c.email_address,
              vehicle: vehicle?.vehicle || 'N/A',
              type: vehicle?.type || 'N/A',
              quota: vehicle?.quota || 0,
              status: c.status === 'active' ? 'Active' : 'Deactive',
            }
          })
      } catch (error) {
        console.error('Backend connect error:', error)
      } finally {
        this.loading = false
      }
    },

    // Deactivate selected consumer
    async doDelete() {
      try {
        await AuthManagement.deactivateConsumer(this.deleteTargetId)

        const consumer = this.consumers.find((c) => c.id === this.deleteTargetId)

        if (consumer) {
          consumer.status = 'Deactive'
        }

        this.showDeleteDialog = false
      } catch (error) {
        console.error(error)
      }
    },

    // Activate selected consumer
    async activateConsumer(id) {
      try {
        await AuthManagement.activateConsumer(id)

        const consumer = this.consumers.find((c) => c.id === id)

        if (consumer) {
          consumer.status = 'Active'
        }
      } catch (error) {
        console.error(error)
      }
    },

    // Open assign quota dialog
    openAssign(item) {
      this.selectedItem = item
      this.quotaInput = item.quota
      this.assignDialog = true
    },

    // Open deactivate confirmation dialog
    confirmDeactivate(id) {
      this.deleteTargetId = id
      this.showDeleteDialog = true
    },

    // Assign quota to selected vehicle
    async assignQuota() {
      try {
        await VehicleManagement.assignQuotaByVehicle(this.selectedItem.vehicle_id, this.quotaInput)

        this.selectedItem.quota = this.quotaInput
        this.assignDialog = false

        await this.loadData()
      } catch (error) {
        console.error('Assign quota error:', error)
      }
    },

    // Reload data when browser tab becomes visible
    async handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        await this.loadData()
      }
    },

    // Reload data when window gets focus
    async handleWindowFocus() {
      await this.loadData()
    },

    // Return fuel badge class based on fuel type
    getFuelClass(fuel) {
      if (!fuel) return ''

      const f = String(fuel).toLowerCase()

      if (f.includes('92')) return 'petrol92'
      if (f.includes('95')) return 'petrol95'
      if (f.includes('diesel')) return 'diesel'

      return ''
    },
  },

  computed: {
    // Total consumers count
    totalConsumers() {
      return this.consumers.length
    },

    // Active consumers count
    activeConsumers() {
      return this.consumers.filter((c) => c.status === 'Active').length
    },

    // Deactive consumers count
    deactiveConsumers() {
      return this.consumers.filter((c) => c.status === 'Deactive').length
    },

    // Total vehicles count
    totalVehicles() {
      return this.vehicles.length
    },

    // Filter consumers by search and vehicle type
    filteredConsumers() {
      return this.consumers.filter((item) => {
        const matchesSearch =
          !this.search ||
          item.name?.toLowerCase().includes(this.search.toLowerCase()) ||
          item.nic?.toLowerCase().includes(this.search.toLowerCase())

        const matchesVehicleType =
          this.vehicleFilter === 'All Vehicle Type' || item.type === this.vehicleFilter

        return matchesSearch && matchesVehicleType
      })
    },

    // Filter vehicles by search and vehicle type
    filteredVehicles() {
      return this.vehicles.filter((item) => {
        const matchesSearch =
          !this.search ||
          item.vehicle?.toLowerCase().includes(this.search.toLowerCase()) ||
          item.owner?.toLowerCase().includes(this.search.toLowerCase())

        const matchesVehicleType =
          this.vehicleFilter === 'All Vehicle Type' || item.type === this.vehicleFilter

        return matchesSearch && matchesVehicleType
      })
    },
  },
}
</script>

<style scoped>
/* Wrapper */
.wrapper {
  background: transparent;
}

/* Summary Cards */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
}

/* Main Table Card */
.table-card-container {
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Tabs */
.tabs-header {
  display: flex;
  align-items: center;
}

.tabs-list {
  display: flex;
  gap: 32px;
}

.tab-item {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  padding-bottom: 12px;
  position: relative;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #000;
}

.tab-item.active {
  color: #000;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  border-radius: 2px;
}

.tabs-divider {
  height: 1px;
  background: rgba(130, 0, 0, 0.1);
  width: 100%;
}

/* Filters */
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search-field {
  flex: 1;
  min-width: 300px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border: 1px solid #820000;
  border-radius: 11px;
  background: #fff;
}

.search-field input {
  width: 100%;
  border: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
}

.select-field {
  width: 180px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border: 1px solid #820000;
  border-radius: 11px;
  background: #fff;
  position: relative;
}

.select-field select {
  width: 100%;
  border: none;
  outline: none;
  appearance: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  background: transparent;
  cursor: pointer;
  z-index: 1;
}

.select-field .v-icon {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

/* Table Styling */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.premium-table {
  width: 100%;
  border-collapse: collapse;
}

.premium-table thead th {
  background-color: #fbeaea;
  color: #000;
  font-weight: 700;
  font-size: 16px;
  height: 52px;
  padding: 0 18px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid rgba(130, 0, 0, 0.1);
}

.premium-table thead th.text-center {
  text-align: center;
}

/* Table Rows */
.table-row {
  border-bottom: 1px solid rgba(130, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #fff9f9;
}

.table-row td {
  padding: 16px 18px;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
  white-space: nowrap;
}

/* Deactive Rows */
.table-row.row-deactive {
  background-color: #f9f9f9;
}

.row-deactive {
  background: #f5f5f5;
}

.row-deactive td {
  opacity: 0.7;
}

.row-deactive:hover {
  background: #f5f5f5 !important;
}

/* Activate Button */
.activate-btn {
  color: #16a34a !important;
  background: #dcfce7;
  border-radius: 50%;
  padding: 6px;
  transition: all 0.3s ease;
}

.activate-btn,
.row-deactive .activate-btn,
.row-deactive .activate-btn .v-icon {
  color: #166534 !important;
  opacity: 1 !important;
}

/* Consumer Information */
.consumer-info {
  display: flex;
  flex-direction: column;
}

.consumer-info .name {
  font-weight: 700;
  color: #000;
}

.consumer-info .nic {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.email-cell {
  color: #b60106;
}

/* Status Chips */
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
}

.status-active {
  background-color: #e6f4ea;
  color: #1e8e3e;
  border: 1px solid #ceead6;
}

.status-deactive {
  background-color: #f1f3f4;
  color: #5f6368;
  border: 1px solid #e8eaed;
}

/* Fuel Badges */
.fuel-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 15px;
  font-weight: 700;
  font-size: 11px;
  white-space: nowrap;
}

.fuel-badge.petrol92 {
  color: #de2626;
  background: rgba(253, 236, 236, 0.5);
  border: 1px solid #de2626;
}

.fuel-badge.petrol95 {
  color: #9333ea;
  background: rgba(246, 238, 254, 0.5);
  border: 1px solid #a262f1;
}

.fuel-badge.diesel {
  color: #2563eb;
  background: rgba(233, 239, 253, 0.5);
  border: 1px solid #2563eb;
}

/* Action Buttons */
.actions-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}

.edit-btn {
  color: #820000 !important;
}

.delete-btn {
  color: #333 !important;
}

/* Assign Quota Modal */
.assign-modal-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.modal-header {
  height: 70px;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.modal-title {
  color: #fff;
  font-weight: 700;
  font-size: 20px;
}

.modal-close {
  width: 34px;
  height: 34px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.modal-input {
  width: 100%;
  height: 44px;
  border: 1px solid #820000;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  background: #f5f5f5;
  outline: none;
}

.modal-input.active {
  background: #ffffff;
}

.modal-input:focus {
  border-color: #b60106;
  box-shadow: 0 0 0 2px rgba(182, 1, 6, 0.12);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  height: 40px;
  padding: 0 22px;
  border-radius: 9px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.modal-btn.cancel {
  background: #f0f0f0;
  color: #555;
}

.modal-btn.assign {
  background: #820000;
  color: #ffffff;
}

/* Delete Confirmation Dialog */
.delete-confirm-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
}

.delete-dialog-header {
  background: linear-gradient(135deg, #b60106 0%, #820000 100%);
}

.delete-dialog-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
}

/* Tablet Responsive */
@media (max-width: 992px) {
  .cards-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .cards-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .search-field {
    min-width: 100%;
  }

  .select-field {
    width: 100%;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs-list {
    gap: 20px;
  }

  .tab-item {
    font-size: 14px;
  }
}
</style>

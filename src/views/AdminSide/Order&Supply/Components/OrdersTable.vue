<template>
  <!-- ─────────────────────────────────────────────
       MAIN ORDERS HISTORY CARD CONTAINER
  ───────────────────────────────────────────── -->
  <div class="orders-history-card">
    <!-- ─────────────────────────────────────────────
         HEADER SECTION
         Contains title and filters
    ───────────────────────────────────────────── -->
    <div class="card-header-section">
      <!-- Title Area -->
      <div class="title-wrap">
        <!-- Main Card Title -->
        <h2 class="card-title">Orders History</h2>
      </div>

      <!-- Divider Line -->
      <div class="header-divider"></div>

      <!-- ─────────────────────────────────────────
           FILTERS ROW
      ───────────────────────────────────────── -->
      <div class="filters-row">
        <!-- ─────────────────────────────────────
             SEARCH INPUT
        ───────────────────────────────────── -->
        <div class="search-box">
          <!-- Search Icon -->
          <v-icon size="18" class="icon-gray"> mdi-magnify </v-icon>

          <!-- Search Field -->
          <input
            v-model="searchQuery"
            type="text"
            class="filter-input"
            placeholder="Search Order ID / Supplier"
          />
        </div>

        <!-- ─────────────────────────────────────
             STATION FILTER DROPDOWN
        ───────────────────────────────────── -->
        <div class="select-box">
          <!-- Dropdown -->
          <select v-model="selectedStation" class="filter-input">
            <!-- Default Option -->
            <option value="">All Stations</option>

            <!-- Dynamic Station Options -->
            <option v-for="station in stations" :key="station.id" :value="station.name">
              {{ station.name }}
            </option>
          </select>

          <!-- Dropdown Icon -->
          <v-icon size="18" class="icon-gray"> mdi-menu-down </v-icon>
        </div>
      </div>
    </div>

    <!-- ─────────────────────────────────────────────
         TABLE SECTION
    ───────────────────────────────────────────── -->
    <div class="table-scroll-wrap">
      <!-- Orders Table -->
      <table class="premium-table">
        <!-- ─────────────────────────────────────
             TABLE HEADER
        ───────────────────────────────────── -->
        <thead>
          <tr>
            <!-- Column: Order ID -->
            <th style="min-width: 100px">Order ID</th>

            <!-- Column: Supplier -->
            <th style="min-width: 140px">Supplier</th>

            <!-- Column: Station -->
            <th style="min-width: 200px">Station</th>

            <!-- Column: Fuel Type -->
            <th style="min-width: 120px">Fuel Type</th>

            <!-- Column: Quantity -->
            <th style="min-width: 110px">Qty (L)</th>

            <!-- Column: Order Date -->
            <th style="min-width: 120px">Order Date</th>

            <!-- Column: Expected Date -->
            <th style="min-width: 130px">Expected Date</th>

            <!-- Column: Status -->
            <th style="min-width: 120px">Status</th>

            <!-- Column: Actions -->
            <th style="min-width: 160px" class="text-center">Actions</th>
          </tr>
        </thead>

        <!-- ─────────────────────────────────────
             TABLE BODY
        ───────────────────────────────────── -->
        <tbody>
          <!-- Dynamic Order Rows -->
          <tr v-for="order in filteredOrders" :key="order.orderId">
            <!-- Order Display ID -->
            <td>
              {{ order.orderDisplay }}
            </td>

            <!-- Supplier Name -->
            <td>
              {{ order.supplier }}
            </td>

            <!-- Station Name -->
            <td class="station-cell">
              {{ order.station }}
            </td>

            <!-- Fuel Type Badge -->
            <td>
              <span :class="['fuel-badge', getFuelBadgeClass(order.fuelType)]">
                {{ order.fuelType }}
              </span>
            </td>

            <!-- Quantity -->
            <td class="font-bold">
              {{ formatQuantity(order.qty) }}
            </td>

            <!-- Order Date -->
            <td>
              {{ order.orderDate }}
            </td>

            <!-- Expected Date -->
            <td>
              {{ order.expectedDate }}
            </td>

            <!-- ─────────────────────────────────
                 STATUS CHIP
            ───────────────────────────────── -->
            <td>
              <div :class="['status-chip', getStatusChipClass(order.status)]">
                <!-- Status Dot -->
                <span class="status-dot"></span>

                <!-- Status Text -->
                {{ order.status }}
              </div>
            </td>

            <!-- ─────────────────────────────────
                 ACTION BUTTONS
            ───────────────────────────────── -->
            <td class="text-center">
              <div class="actions-stack">
                <!-- ─────────────────────────────
                     DELIVERED STATUS
                     View only
                ───────────────────────────── -->
                <template v-if="normalizeStatus(order.status) === 'delivered'">
                  <button class="action-btn view-btn" @click="$emit('view-order', order)">
                    View Details
                  </button>
                </template>

                <!-- ─────────────────────────────
                     APPROVED STATUS
                     Deliver + View
                ───────────────────────────── -->
                <template v-else-if="normalizeStatus(order.status) === 'approved'">
                  <!-- Mark Delivered -->
                  <button
                    class="action-btn deliver-btn"
                    @click="$emit('request-deliver', order.orderId)"
                  >
                    Mark Delivered
                  </button>

                  <!-- View Details -->
                  <button class="action-btn view-btn" @click="$emit('view-order', order)">
                    View Details
                  </button>
                </template>

                <!-- ─────────────────────────────
                     PENDING STATUS
                     Approve + Cancel + View
                ───────────────────────────── -->
                <template v-else-if="normalizeStatus(order.status) === 'pending'">
                  <div class="pending-actions">
                    <!-- Approve Button -->
                    <button
                      class="action-btn approve-btn"
                      @click="$emit('request-approve', order.orderId)"
                    >
                      Approve
                    </button>

                    <!-- Cancel Button -->
                    <button
                      class="action-btn cancel-btn"
                      @click="$emit('request-cancel', order.orderId)"
                    >
                      Cancel
                    </button>

                    <!-- View Button -->
                    <button class="action-btn view-btn small" @click="$emit('view-order', order)">
                      View
                    </button>
                  </div>
                </template>

                <!-- ─────────────────────────────
                     CANCELLED / OTHER STATUS
                     View only
                ───────────────────────────── -->
                <template v-else>
                  <button class="action-btn view-btn" @click="$emit('view-order', order)">
                    View Details
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <!-- ─────────────────────────────────────
               EMPTY STATE ROW
          ───────────────────────────────────── -->
          <tr v-if="filteredOrders.length === 0">
            <td colspan="9" class="empty-state">No orders found matching your criteria.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
/* ─────────────────────────────────────────────
   IMPORT VUE FUNCTIONS
───────────────────────────────────────────── */
import { computed, ref } from 'vue'

/* ─────────────────────────────────────────────
   COMPONENT PROPERTIES
───────────────────────────────────────────── */
const props = defineProps({
  // Orders array
  orders: {
    type: Array,
    default: () => [],
  },

  // Station dropdown options
  stations: {
    type: Array,
    default: () => [],
  },
})

/* ─────────────────────────────────────────────
   COMPONENT EMITTED EVENTS
───────────────────────────────────────────── */
const emit = defineEmits([
  // Open order details modal
  'view-order',

  // Approve order request
  'request-approve',

  // Cancel order request
  'request-cancel',

  // Deliver order request
  'request-deliver',
])

/* ─────────────────────────────────────────────
   FILTER STATES
───────────────────────────────────────────── */

// Search text input
const searchQuery = ref('')

// Selected station filter
const selectedStation = ref('')

/* ─────────────────────────────────────────────
   FILTERED ORDERS COMPUTED PROPERTY
───────────────────────────────────────────── */
const filteredOrders = computed(() => {
  // Convert search keyword to lowercase
  const keyword = searchQuery.value.trim().toLowerCase()

  // Filter orders
  return props.orders.filter((order) => {
    /* ─────────────────────────────
       SEARCH MATCH CHECK
    ───────────────────────────── */
    const matchSearch =
      !keyword ||
      String(order.orderDisplay ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(order.supplier ?? '')
        .toLowerCase()
        .includes(keyword)

    /* ─────────────────────────────
       STATION FILTER CHECK
    ───────────────────────────── */
    const matchStation = !selectedStation.value || order.station === selectedStation.value

    // Return final filter result
    return matchSearch && matchStation
  })
})

/* ─────────────────────────────────────────────
   NORMALIZE STATUS TEXT
───────────────────────────────────────────── */
function normalizeStatus(status) {
  return status ? status.toLowerCase().trim() : ''
}

/* ─────────────────────────────────────────────
   FORMAT QUANTITY WITH COMMAS
───────────────────────────────────────────── */
function formatQuantity(qty) {
  // Convert value to number
  const n = Number(qty)

  // Return fallback if invalid
  if (isNaN(n)) {
    return '-'
  }

  // Format number
  return n.toLocaleString('en-US')
}

/* ─────────────────────────────────────────────
   RETURN FUEL BADGE CLASS
───────────────────────────────────────────── */
function getFuelBadgeClass(fuelType) {
  // Convert to lowercase
  const fuel = fuelType ? fuelType.toLowerCase() : ''

  // Petrol 92
  if (fuel.includes('92')) {
    return 'petrol92'
  }

  // Petrol 95
  if (fuel.includes('95')) {
    return 'petrol95'
  }

  // Diesel
  if (fuel.includes('diesel')) {
    return 'diesel'
  }

  // Default
  return ''
}

/* ─────────────────────────────────────────────
   RETURN STATUS CHIP CLASS
───────────────────────────────────────────── */
function getStatusChipClass(status) {
  // Normalize status
  const s = normalizeStatus(status)

  // Delivered status
  if (s === 'delivered') {
    return 'status-active'
  }

  // Approved status
  if (s === 'approved') {
    return 'status-approved'
  }

  // Pending status
  if (s === 'pending') {
    return 'status-pending'
  }

  // Cancelled status
  if (s === 'cancelled') {
    return 'status-deactive'
  }

  // Default
  return ''
}
</script>

<style scoped>
/* ─────────────────────────────────────────────
   MAIN CARD CONTAINER
───────────────────────────────────────────── */
.orders-history-card {
  width: 100%;

  background: #ffffff;

  border: 1px solid #820000;
  border-radius: 11px;

  overflow: hidden;

  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  margin-top: 26px;
}

/* ─────────────────────────────────────────────
   HEADER SECTION
───────────────────────────────────────────── */
.card-header-section {
  display: flex;
  flex-direction: column;

  padding: 20px 24px 16px;

  gap: 16px;
}

/* ─────────────────────────────────────────────
   CARD TITLE
───────────────────────────────────────────── */
.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 18px;

  color: #000000;

  margin: 0;
}

/* ─────────────────────────────────────────────
   HEADER DIVIDER LINE
───────────────────────────────────────────── */
.header-divider {
  width: calc(100% + 48px);

  height: 1px;

  background: rgba(217, 70, 70, 0.2);

  margin: 0 -24px;
}

/* ─────────────────────────────────────────────
   FILTERS ROW
───────────────────────────────────────────── */
.filters-row {
  display: flex;
  flex-wrap: wrap;

  gap: 12px;

  align-items: center;
}

/* ─────────────────────────────────────────────
   SEARCH & SELECT BOXES
───────────────────────────────────────────── */
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

/* Search box sizing */
.search-box {
  flex: 1 1 320px;
  max-width: 420px;
}

/* Select box sizing */
.select-box {
  width: 180px;
}

/* ─────────────────────────────────────────────
   FILTER INPUTS
───────────────────────────────────────────── */
.filter-input {
  width: 100%;

  border: none;
  outline: none;

  font-family: 'Inter', sans-serif;
  font-size: 14px;

  color: #6b7280;

  background: transparent;
}

/* Dropdown appearance */
.select-box select {
  appearance: none;
  cursor: pointer;
}

/* ─────────────────────────────────────────────
   ICON COLOR
───────────────────────────────────────────── */
.icon-gray {
  color: #9ca3af;
}

/* ─────────────────────────────────────────────
   TABLE WRAPPER
───────────────────────────────────────────── */
.table-scroll-wrap {
  width: 100%;
  max-height: 480px;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ─────────────────────────────────────────────
   TABLE STYLING
───────────────────────────────────────────── */
.premium-table {
  width: 100%;

  border-collapse: collapse;

  min-width: 1200px;

  font-family: 'Inter', sans-serif;
}

/* ─────────────────────────────────────────────
   TABLE HEADER CELLS
───────────────────────────────────────────── */
.premium-table thead th {
  padding: 16px 18px;

  text-align: left;

  font-weight: 700;
  font-size: 16px;

  color: #000000;

  background: #fbe6e6;

  white-space: nowrap;

  position: sticky;
  top: 0;
  z-index: 1;
}

/* ─────────────────────────────────────────────
   TABLE ROWS
───────────────────────────────────────────── */
.premium-table tbody tr {
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);

  transition: background 0.15s;
}

/* Hover effect */
.premium-table tbody tr:hover {
  background: #fffafa;
}

/* ─────────────────────────────────────────────
   TABLE CELLS
───────────────────────────────────────────── */
.premium-table td {
  padding: 16px 18px;

  font-size: 14px;

  color: #000;

  vertical-align: middle;

  white-space: nowrap;
}

/* ─────────────────────────────────────────────
   STATION CELL
───────────────────────────────────────────── */
.station-cell {
  white-space: normal !important;

  line-height: 1.4;

  min-width: 200px;
}

/* Bold text */
.font-bold {
  font-weight: 700;
}

/* Center alignment */
.text-center {
  text-align: center !important;
}

/* ─────────────────────────────────────────────
   FUEL BADGES
───────────────────────────────────────────── */
.fuel-badge {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 6px 14px;

  border-radius: 15px;

  font-weight: 700;
  font-size: 11px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Petrol 92 badge */
.fuel-badge.petrol92 {
  color: #de2626;

  background: rgba(253, 236, 236, 0.55);

  border: 1px solid #de2626;
}

/* Petrol 95 badge */
.fuel-badge.petrol95 {
  color: #9333ea;

  background: rgba(246, 238, 254, 0.55);

  border: 1px solid #a262f1;
}

/* Diesel badge */
.fuel-badge.diesel {
  color: #2563eb;

  background: rgba(233, 239, 253, 0.55);

  border: 1px solid #3b82f6;
}

/* ─────────────────────────────────────────────
   STATUS CHIP
───────────────────────────────────────────── */
.status-chip {
  display: inline-flex;

  align-items: center;

  padding: 4px 12px;

  border-radius: 16px;

  font-size: 12px;
  font-weight: 500;

  gap: 6px;

  text-transform: capitalize;
}

/* Status indicator dot */
.status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  flex-shrink: 0;
}

/* Delivered status */
.status-active {
  background-color: #e6f4ea;
  color: #1e8e3e;
  border: 1px solid #ceead6;
}

.status-active .status-dot {
  background-color: #1e8e3e;
}

/* Approved status */
.status-approved {
  background-color: #e3f2fd;
  color: #0288d1;
  border: 1px solid #bbdefb;
}

.status-approved .status-dot {
  background-color: #0288d1;
}

/* Pending status */
.status-pending {
  background-color: #fff8e1;
  color: #f57c00;
  border: 1px solid #ffecb3;
}

.status-pending .status-dot {
  background-color: #f57c00;
}

/* Cancelled status */
.status-deactive {
  background-color: #fce8e6;
  color: #d93025;
  border: 1px solid #f8d7da;
}

.status-deactive .status-dot {
  background-color: #d93025;
}

/* ─────────────────────────────────────────────
   ACTION BUTTON SECTION
───────────────────────────────────────────── */
.actions-stack {
  display: flex;
  flex-direction: column;

  gap: 6px;

  align-items: center;
}

/* Pending actions grid */
.pending-actions {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 4px;

  width: 100%;
}

/* ─────────────────────────────────────────────
   COMMON ACTION BUTTON STYLES
───────────────────────────────────────────── */
.action-btn {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;

  padding: 7px 10px;

  border-radius: 8px;

  cursor: pointer;

  border: 1.5px solid transparent;

  transition:
    opacity 0.2s,
    background 0.2s;

  white-space: nowrap;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover effect */
.action-btn:hover {
  opacity: 0.82;
}

/* View button */
.view-btn {
  background: #f8f9fa;
  color: #5a6672;
  border-color: #d1d5db;
}

/* Approve button */
.approve-btn {
  background: #0288d1;
  color: #ffffff;

  border: none;

  box-shadow: 0 2px 4px rgba(2, 136, 209, 0.2);
}

/* Cancel button */
.cancel-btn {
  background: #fce8e6;
  color: #d93025;
  border-color: #d93025;
}

/* Deliver button */
.deliver-btn {
  background: #2e7d32;
  color: #ffffff;

  border: none;

  box-shadow: 0 2px 4px rgba(46, 125, 50, 0.2);
}

/* Small view button */
.view-btn.small {
  grid-column: span 2;
}

/* ─────────────────────────────────────────────
   EMPTY STATE MESSAGE
───────────────────────────────────────────── */
.empty-state {
  text-align: center;

  padding: 48px !important;

  color: #999;

  font-family: 'Inter', sans-serif;
}

/* ─────────────────────────────────────────────
   CONFIRMATION DIALOG CARD
───────────────────────────────────────────── */
.delete-confirm-card {
  border-radius: 16px !important;

  overflow: hidden;

  background: #ffffff;
}

/* ─────────────────────────────────────────────
   DIALOG HEADER
───────────────────────────────────────────── */
.delete-dialog-header {
  background: linear-gradient(135deg, #b60106 0%, #820000 100%);

  padding: 28px 0 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}

/* Approve dialog header */
.delete-dialog-header.approve-header {
  background: linear-gradient(135deg, #0288d1 0%, #01579b 100%);
}

/* Deliver dialog header */
.delete-dialog-header.deliver-header {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

/* ─────────────────────────────────────────────
   DIALOG ICON CONTAINER
───────────────────────────────────────────── */
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

/* Dialog icon */
.delete-icon {
  font-size: 32px;
  color: #ffffff;
}

/* ─────────────────────────────────────────────
   DIALOG BODY
───────────────────────────────────────────── */
.delete-dialog-body {
  padding: 24px 28px 8px;

  text-align: center;
}

/* Dialog title */
.delete-dialog-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;

  color: #1a1a1a;

  margin: 0 0 10px;
}

/* Dialog message */
.delete-dialog-msg {
  font-family: 'Inter', sans-serif;
  font-size: 14px;

  color: #555;

  line-height: 1.6;

  margin: 0;
}

/* ─────────────────────────────────────────────
   DIALOG ACTION BUTTONS
───────────────────────────────────────────── */
.delete-dialog-actions {
  display: flex;
  justify-content: center;

  gap: 16px;

  padding: 20px 28px 28px;
}

/* Common dialog button */
.del-button {
  min-width: 110px;

  padding: 0 20px;

  height: 40px;

  border-radius: 10px;

  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  border: none;

  transition: opacity 0.2s;
}

/* Hover effect */
.del-button:hover {
  opacity: 0.85;
}

/* Cancel dialog button */
.del-cancel-btn {
  border: 1px solid #aaa;

  background: rgba(217, 217, 217, 0.5);

  color: #555;
}

/* Confirm dialog button */
.del-confirm-btn {
  border: 1px solid #820000;

  background: linear-gradient(90deg, #b60106 0%, #820000 100%);

  color: #ffffff;

  box-shadow: 0 3px 10px rgba(182, 1, 6, 0.35);
}

/* Approve confirm button */
.approve-confirm-btn {
  border-color: #0288d1 !important;

  background: linear-gradient(90deg, #03a9f4 0%, #0288d1 100%) !important;

  box-shadow: 0 3px 10px rgba(2, 136, 209, 0.35) !important;
}

/* Deliver confirm button */
.deliver-confirm-btn {
  border-color: #2e7d32 !important;

  background: linear-gradient(90deg, #4caf50 0%, #2e7d32 100%) !important;

  box-shadow: 0 3px 10px rgba(46, 125, 50, 0.35) !important;
}

/* ─────────────────────────────────────────────
   RESPONSIVE TABLE STYLES
───────────────────────────────────────────── */
@media (max-width: 900px) {
  .card-header-section {
    padding: 18px 16px 14px;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box,
  .select-box {
    width: 100%;
    max-width: 100%;
  }

  .table-scroll-wrap {
    overflow-x: auto;
    overflow-y: visible;
  }

  .premium-table {
    min-width: 1200px;
  }

  .premium-table thead {
    display: table-header-group;
  }

  .premium-table tr {
    display: table-row;
  }

  .premium-table th,
  .premium-table td {
    display: table-cell;
    white-space: nowrap;
  }

  .station-cell {
    white-space: nowrap !important;
  }

  @media (max-width: 900px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-box,
  .select-box {
    width: 100%;
    max-width: 100%;
    height: 44px;
    min-height: 44px;
    box-sizing: border-box;
  }

    .select-box select {
    width: 100%;
  }

  .search-box {
    flex: 0 0 auto;
  }

  .filter-input {
    height: 100%;
  }

  .table-scroll-wrap {
    overflow-x: auto;
  }

}

}
</style>

<template>
  <!-- Supplier Table Card -->
  <div class="common-table-card">
    <!-- Supplier List Header Section -->
    <div class="supplier-list-top">
      <!-- Supplier List Title -->
      <div class="supplier-list-title-wrap">
        <h2 class="supplier-list-title">Supplier List</h2>
      </div>

      <!-- Divider Line -->
      <div class="supplier-list-divider"></div>

      <!-- Search and Filter Section -->
      <div class="supplier-list-filters">
        <!-- Search Supplier -->
        <div class="common-search-box search-box-width">
          <v-icon size="18">mdi-magnify</v-icon>
          <input
            type="text"
            placeholder="Search Supplier Name or Contact Person"
            v-model="searchQuery"
          />
        </div>

        <!-- Status Filter -->
        <div class="common-select-box filter-select">
          <select v-model="selectedStatus">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>

          <v-icon size="18">mdi-chevron-down</v-icon>
        </div>
      </div>
    </div>

    <!-- Supplier Details Table -->
    <div class="supplier-table-wrap">
      <table class="supplier-table">
        <!-- Table Header -->
        <thead class="common-table-header">
          <tr>
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Fuel Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr
            v-for="supplier in filteredSuppliers"
            :key="supplier.id"
            :class="{ 'supplier-row--deactive': !isActive(supplier) }"
          >
            <td>{{ supplier.name }}</td>
            <td>{{ supplier.contactPerson }}</td>
            <td>{{ supplier.contactNumber }}</td>
            <td>{{ supplier.email }}</td>
            <td>{{ supplier.fuelType }}</td>

            <!-- Supplier Status -->
            <td>
              <div
                :class="['status-chip', isActive(supplier) ? 'status-active' : 'status-deactive']"
              >
                <span class="status-dot"></span>
                {{ isActive(supplier) ? 'Active' : 'Deactive' }}
              </div>
            </td>

            <!-- Action Buttons -->
            <td class="actions-cell">
              <div class="common-actions-wrap">
                <!-- Edit Button -->
                <button
                  class="action-btn edit"
                  :disabled="!isActive(supplier)"
                  :class="{ 'disabled-action': !isActive(supplier) }"
                  @click="$emit('edit', supplier)"
                  title="Edit"
                >
                  <v-icon size="16">mdi-pencil</v-icon>
                </button>

                <!-- Delete Button -->
                <button
                  class="action-btn delete"
                  :disabled="!isActive(supplier)"
                  :class="{ 'disabled-action': !isActive(supplier) }"
                  @click="$emit('delete', supplier.id)"
                  title="Delete"
                >
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </button>

                <!-- Toggle Status Button -->
                <button
                  class="action-btn toggle-style"
                  :class="isActive(supplier) ? 'deactivate' : 'activate'"
                  @click="$emit('toggle-status', supplier.id)"
                  :title="isActive(supplier) ? 'Deactivate' : 'Activate'"
                >
                  <v-icon size="16" color="white">
                    {{ isActive(supplier) ? 'mdi-close' : 'mdi-power' }}
                  </v-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'SupplierTable',

  // Props received from parent component
  props: {
    suppliers: {
      type: Array,
      required: true,
    },
  },

  // Events sent to parent component
  emits: ['edit', 'delete', 'toggle-status'],

  // Component State
  data() {
    return {
      searchQuery: '',
      selectedStatus: '',
    }
  },

  computed: {
    // Filter suppliers by search text and selected status
    filteredSuppliers() {
      return this.suppliers.filter((supplier) => {
        const name = supplier.name || ''
        const contactPerson = supplier.contactPerson || ''
        const status = supplier.status?.toLowerCase() || ''

        const searchMatch = this.searchQuery
          ? name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            contactPerson.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true

        const selected = this.selectedStatus.toLowerCase()
        const statusMatch = selected ? status === selected : true

        return searchMatch && statusMatch
      })
    },
  },

  methods: {
    // Check whether supplier is active
    isActive(supplier) {
      return supplier.status?.toLowerCase() === 'active'
    },
  },
}
</script>

<style scoped>
/* Supplier list card */
.supplier-list-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* Supplier list top section */
.supplier-list-top {
  display: flex;
  flex-direction: column;
  padding: 20px 24px 16px;
  gap: 16px;
}

/* Supplier list title */
.supplier-list-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #000000;
  margin: 0;
}

/* Divider below title */
.supplier-list-divider {
  width: calc(100% + 48px);
  height: 1px;
  background: rgba(217, 70, 70, 0.2);
  margin: 0 -24px;
}

/* Search and filter container */
.supplier-list-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

/* Search box width */
.search-box-width {
  min-width: 280px;
  max-width: 480px;
  flex: 1 1 320px;
}

/* Status filter width */
.filter-select {
  min-width: 130px;
  flex: 0 0 auto;
}

/* Supplier table scroll wrapper */
.supplier-table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Supplier table */
.supplier-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  min-width: 800px;
}

/* Supplier table header cells */
.supplier-table thead th {
  padding: 16px 24px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  background: #fbe6e6;
  white-space: nowrap;
}

/* Supplier table rows */
.supplier-table tbody tr {
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);
}

/* Supplier row hover effect */
.supplier-table tbody tr:hover {
  background: #fffafa;
}

/* Deactive supplier row */
.supplier-row--deactive {
  background: #f5f5f5 !important;
}

/* Deactive supplier row content */
.supplier-row--deactive td {
  opacity: 0.45;
  filter: grayscale(100%);
}

/* Keep action buttons visible for deactive row */
.supplier-row--deactive .actions-cell {
  opacity: 1 !important;
  filter: none !important;
}

/* Activate button for deactive supplier */
.supplier-row--deactive .activate {
  opacity: 1 !important;
  filter: none !important;
  background-color: #43a047 !important;
}

/* Remove border from last row */
.supplier-table tbody tr:last-child {
  border-bottom: none;
}

/* Supplier table data cells */
.supplier-table td {
  padding: 16px 24px;
  font-size: 14px;
  color: #000000;
  vertical-align: middle;
  white-space: nowrap;
}

/* Toggle status button */
.toggle-style {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

/* Deactivate status button */
.toggle-style.deactivate {
  background-color: #e53935;
}

/* Activate status button */
.toggle-style.activate {
  background-color: #43a047;
}

/* Disabled edit and delete buttons */
.disabled-action {
  opacity: 0.35;
  pointer-events: none;
}
</style>

<template>
  <!-- Queue Table Card -->
  <div class="queue-table-card">
    <!-- Station Tabs -->
    <div class="tabs-header">
      <button
        v-for="station in stations"
        :key="station.id"
        class="tab-item"
        :class="{ 'tab-item--active': activeStation === station.id }"
        @click="$emit('change-station', station.id)"
      >
        {{ station.name }}
      </button>
    </div>

    <!-- Queue Table Container -->
    <div class="table-scroll-container">
      <table class="premium-table">
        <!-- Table Header -->
        <thead>
          <tr>
            <th style="min-width: 100px">Token</th>
            <th style="min-width: 180px">Consumer Name</th>
            <th style="min-width: 160px">Vehicle Number</th>
            <th style="min-width: 140px">Fuel Type</th>
            <th style="min-width: 120px">Status</th>
            <th style="min-width: 160px" class="text-center">Actions</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <!-- Token Number -->
            <td>
              <div class="token-chip">{{ row.token }}</div>
            </td>

            <!-- Consumer Details -->
            <td>{{ row.name }}</td>
            <td class="font-bold">{{ row.vehicle }}</td>
            <td>{{ row.fuel }}</td>

            <!-- Queue Status -->
            <td>
              <div :class="['status-badge', getStatusBadgeClass(row.status)]">
                <span class="status-dot"></span>
                {{ row.status }}
              </div>
            </td>

            <!-- Queue Actions -->
            <td class="text-center">
              <div class="actions-group">
                <button
                  class="queue-btn skip"
                  @click="markSkipped(row)"
                  :disabled="row.status !== 'Waiting'"
                >
                  Skip
                </button>

                <button
                  class="queue-btn serve"
                  @click="markServed(row)"
                  :disabled="row.status !== 'Waiting'"
                >
                  Serve
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="rows.length === 0">
            <td colspan="6" class="empty-state">No vehicles in queue for this station.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Skip Confirmation Dialog -->
    <v-dialog v-model="showSkipDialog" max-width="440" transition="fade-transition">
      <v-card class="delete-dialog-card">
        <!-- Dialog Header -->
        <div class="delete-header">
          <div class="delete-icon-circle">
            <v-icon color="white" size="32">mdi-alert-circle-outline</v-icon>
          </div>
        </div>

        <!-- Dialog Body -->
        <v-card-text class="delete-body">
          <h3 class="delete-title">Skip Vehicle?</h3>
          <p class="delete-desc">
            Are you sure you want to skip token
            <strong>{{ skipTargetToken }}</strong
            >? This will mark the vehicle as skipped in the queue.
          </p>
        </v-card-text>

        <!-- Dialog Actions -->
        <v-card-actions class="delete-actions">
          <button class="delete-btn cancel" @click="showSkipDialog = false">Cancel</button>

          <button class="delete-btn confirm" @click="confirmSkip">Skip</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Serve Confirmation Dialog -->
    <v-dialog v-model="showServeDialog" max-width="440" transition="fade-transition">
      <v-card class="delete-dialog-card">
        <!-- Dialog Header -->
        <div class="delete-header serve-header">
          <div class="delete-icon-circle">
            <v-icon color="white" size="32">mdi-check-circle-outline</v-icon>
          </div>
        </div>

        <!-- Dialog Body -->
        <v-card-text class="delete-body">
          <h3 class="delete-title">Mark as Served?</h3>
          <p class="delete-desc">
            Are you sure you want to mark token
            <strong>{{ serveTargetToken }}</strong>
            as served? This will confirm the fuel distribution is complete.
          </p>
        </v-card-text>

        <!-- Dialog Actions -->
        <v-card-actions class="delete-actions">
          <button class="delete-btn cancel" @click="showServeDialog = false">Cancel</button>

          <button class="delete-btn confirm serve-confirm" @click="confirmServe">Serve</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Notification Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400" transition="fade-transition">
      <v-card class="success-dialog-card">
        <!-- Success Header -->
        <div class="success-header">
          <div class="success-icon-circle">
            <v-icon color="white" size="48">mdi-check-all</v-icon>
          </div>
        </div>

        <!-- Success Body -->
        <v-card-text class="success-body">
          <h3 class="success-title">Token Sent Successfully!</h3>
          <p class="success-desc">
            The service confirmation and token details have been successfully sent to the consumer.
          </p>

          <button class="success-btn" @click="showSuccessDialog = false">Great!</button>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'QueueTable',

  // Props received from parent component
  props: {
    stations: {
      type: Array,
      default: () => [],
    },
    activeStation: {
      type: [Number, String],
      default: null,
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },

  // Component State
  data() {
    return {
      // Skip confirmation dialog state
      showSkipDialog: false,
      skipTargetRow: null,
      skipTargetToken: '',

      // Serve confirmation dialog state
      showServeDialog: false,
      serveTargetRow: null,
      serveTargetToken: '',

      // Success dialog state
      showSuccessDialog: false,
    }
  },

  methods: {
    // Return CSS class based on queue status
    getStatusBadgeClass(status) {
      const s = status.toLowerCase()

      if (s === 'served') return 'status-active'
      if (s === 'skipped') return 'status-deactive'

      return 'status-pending'
    },

    // Open skip confirmation dialog
    markSkipped(row) {
      this.skipTargetRow = row
      this.skipTargetToken = row.token
      this.showSkipDialog = true
    },

    // Confirm skip action and notify parent
    confirmSkip() {
      this.$emit('skip', this.skipTargetRow)
      this.showSkipDialog = false
    },

    // Open serve confirmation dialog
    markServed(row) {
      this.serveTargetRow = row
      this.serveTargetToken = row.token
      this.showServeDialog = true
    },

    // Confirm serve action and show success dialog
    confirmServe() {
      this.$emit('serve', this.serveTargetRow)

      this.showServeDialog = false

      setTimeout(() => {
        this.showSuccessDialog = true
      }, 300)
    },
  },
}
</script>
<style scoped>
/* Queue table card container */
.queue-table-card {
  width: 100%;
}

/* Station tabs header */
.tabs-header {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #820000;
}

/* Station tab button */
.tab-item {
  flex: 1;
  padding: 18px 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #666;
  background: none;
  border: none;
  border-bottom: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

/* Station tab hover effect */
.tab-item:hover {
  color: #820000;
  background: #fffafa;
}

/* Active station tab */
.tab-item--active {
  color: #820000;
  border-bottom-color: #820000;
  background: #fdf2f2;
}

/* Table scroll container */
.table-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Queue management table */
.premium-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

/* Table header cells */
.premium-table thead th {
  background: #fbeaea;
  padding: 16px 24px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
  color: #000;
  white-space: nowrap;
}

/* Table rows */
.premium-table tbody tr {
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);
}

/* Table row hover effect */
.premium-table tbody tr:hover {
  background: #fdfdfd;
}

/* Table data cells */
.premium-table td {
  padding: 16px 24px;
  font-size: 15px;
  color: #333;
  vertical-align: middle;
  white-space: nowrap;
}

/* Bold text utility */
.font-bold {
  font-weight: 700;
}

/* Center aligned text utility */
.text-center {
  text-align: center !important;
}

/* Queue token badge */
.token-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 44px;
  background: #820000;
  color: #fff;
  border-radius: 8px;
  font-weight: 800;
  font-size: 12px;
  box-shadow: 0 4px 8px rgba(130, 0, 0, 0.2);
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  text-transform: capitalize;
}

/* Served status badge */
.status-active {
  background-color: #e6f4ea;
  color: #1e8e3e;
  border: 1px solid #ceead6;
}

/* Served status dot */
.status-active .status-dot {
  background-color: #1e8e3e;
}

/* Skipped status badge */
.status-deactive {
  background-color: #fce8e6;
  color: #d93025;
  border: 1px solid #f8d7da;
}

/* Skipped status dot */
.status-deactive .status-dot {
  background-color: #d93025;
}

/* Waiting status badge */
.status-pending {
  background-color: #fff8e1;
  color: #f57c00;
  border: 1px solid #ffecb3;
}

/* Waiting status dot */
.status-pending .status-dot {
  background-color: #f57c00;
}

/* Status indicator dot */
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Action buttons container */
.actions-group {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Queue action button */
.queue-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

/* Skip button */
.queue-btn.skip {
  background: #fee2e2;
  color: #b91c1c;
}

/* Serve button */
.queue-btn.serve {
  background: #dcfce7;
  color: #15803d;
}

/* Action button hover effect */
.queue-btn:hover {
  opacity: 0.8;
}

/* Disabled action button */
.queue-btn:disabled {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  opacity: 1;
  cursor: not-allowed;
  pointer-events: none;
}

/* Empty table message */
.empty-state {
  text-align: center;
  padding: 48px !important;
  color: #999;
  font-style: italic;
}

/* Confirmation dialog card */
.delete-dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Dialog header */
.delete-header {
  background: linear-gradient(135deg, #b60106 0%, #820000 100%);
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Serve confirmation dialog header */
.delete-header.serve-header {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

/* Dialog icon circle */
.delete-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dialog body */
.delete-body {
  padding: 32px 32px 16px !important;
  text-align: center;
}

/* Dialog title */
.delete-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 12px;
}

/* Dialog description */
.delete-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

/* Dialog action buttons */
.delete-actions {
  padding: 0 24px 32px !important;
  justify-content: center;
  gap: 12px;
}

/* Dialog button */
.delete-btn {
  min-width: 110px;
  height: 44px;
}

/* Success dialog card */
.success-dialog-card {
  border-radius: 20px !important;
  overflow: hidden;
}

/* Success dialog header */
.success-header {
  background: #1b5e20;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Success icon circle */
.success-icon-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
}

/* Success dialog body */
.success-body {
  padding: 32px !important;
  text-align: center;
}

/* Success dialog title */
.success-title {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
}

/* Success dialog description */
.success-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
}

/* Success action button */
.success-btn {
  width: 100%;
  height: 48px;
}
</style>

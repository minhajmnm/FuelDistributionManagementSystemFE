<template>
  <div>
    <!-- Payment History Table -->
    <div class="common-table-card">
      <!-- Table Header -->
      <div class="table-header-box">
        <h3 class="table-title">Payment History</h3>
      </div>

      <!-- Scrollable Table Container -->
      <div class="scroll-container">
        <table class="premium-table">
          <!-- Table Columns -->
          <thead>
            <tr>
              <th style="min-width: 100px">Txn Id</th>
              <th style="min-width: 140px">Station</th>
              <th style="min-width: 160px">Consumer</th>
              <th style="min-width: 140px">Amount (LKR)</th>
              <th style="min-width: 140px">Fuel Type</th>
              <th style="min-width: 120px">Qty (L)</th>
              <th style="min-width: 130px">Date</th>
              <th style="min-width: 120px">Status</th>
              <th style="min-width: 90px">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr v-for="(item, index) in payments" :key="index">
              <td>{{ item.id }}</td>
              <td>{{ item.station }}</td>
              <td>{{ item.name }}</td>
              <td>{{ Number(item.amount || 0).toFixed(2) }}</td>
              <td>{{ item.fuel }}</td>
              <td>{{ Number(item.qty).toLocaleString() }}</td>
              <td class="text-muted">{{ item.date }}</td>

              <!-- Payment Status -->
              <td>
                <span class="status-chip completed">{{ item.status }}</span>
              </td>

              <!-- Action Buttons -->
              <td>
                <div class="common-actions-wrap">
                  <!-- Edit Button -->
                  <button class="action-btn edit" @click="openEditDialog(item)" title="Edit">
                    <v-icon size="16">mdi-pencil</v-icon>
                  </button>

                  <!-- Delete Button -->
                  <button
                    class="action-btn delete"
                    @click="openDeleteConfirmation(item.id)"
                    title="Delete"
                  >
                    <v-icon size="18">mdi-delete-outline</v-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Payment Dialog -->
    <v-dialog v-model="showEditDialog" max-width="520" transition="fade-transition">
      <v-card class="common-modal-card">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title">Edit Payment</h3>

          <!-- Close Button -->
          <button type="button" class="modal-close" @click="closeEditDialog">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Station and Consumer Fields -->
          <div class="form-row">
            <div class="common-form-group">
              <label>Station</label>
              <input type="text" v-model="editForm.station" class="common-input" />
            </div>

            <div class="common-form-group">
              <label>Consumer</label>
              <input type="text" v-model="editForm.name" class="common-input" />
            </div>
          </div>

          <!-- Amount and Fuel Type Fields -->
          <div class="form-row">
            <div class="common-form-group">
              <label>Amount (LKR)</label>
              <input type="number" v-model.number="editForm.amount" class="common-input" />
            </div>

            <div class="common-form-group">
              <label>Fuel Type</label>

              <!-- Fuel Type Select -->
              <div class="modal-select-wrap">
                <select v-model="editForm.fuel" class="common-input">
                  <option>Petrol 92</option>
                  <option>Petrol 95</option>
                  <option>Auto Diesel</option>
                </select>

                <v-icon size="20" class="select-icon">mdi-chevron-down</v-icon>
              </div>
            </div>
          </div>

          <!-- Quantity and Date Fields -->
          <div class="form-row">
            <div class="common-form-group">
              <label>Qty (L)</label>
              <input type="number" v-model.number="editForm.qty" class="common-input" />
            </div>

            <div class="common-form-group">
              <label>Date</label>

              <!-- Date Input -->
              <div class="modal-date-wrap">
                <input type="date" v-model="editForm.date" class="common-input" />
                <v-icon size="18" class="select-icon">mdi-calendar-month-outline</v-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="closeEditDialog">Cancel</button>
          <button class="modal-btn confirm" @click="submitEdit">Update Payment</button>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="440" transition="fade-transition">
      <v-card class="common-modal-card common-delete-dialog">
        <!-- Delete Header -->
        <div class="delete-header">
          <div class="delete-icon-circle">
            <v-icon color="white" size="32">mdi-delete-outline</v-icon>
          </div>
        </div>

        <!-- Delete Body -->
        <v-card-text class="delete-body">
          <h3>Delete Payment?</h3>
          <p>
            Are you sure you want to delete transaction
            <strong>{{ deleteTargetId }}</strong
            >? This action cannot be undone.
          </p>
        </v-card-text>

        <!-- Delete Actions -->
        <v-card-actions class="delete-actions">
          <button class="modal-btn cancel" @click="showDeleteDialog = false">Cancel</button>
          <button class="modal-btn confirm" @click="confirmDelete">Delete</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'ConsumerPaymentTable',

  // Props received from parent component
  props: {
    paymentData: {
      type: Array,
      default: () => [],
    },
  },

  // Events emitted to parent component
  emits: ['update-payment', 'delete-payment'],

  // Component State
  data() {
    return {
      showEditDialog: false,
      editingItem: null,

      showDeleteDialog: false,
      deleteTargetId: null,

      editForm: {
        station: '',
        name: '',
        amount: 0,
        fuel: '',
        qty: 0,
        date: '',
      },
    }
  },

  computed: {
    // Payment data for table
    payments() {
      return this.paymentData || []
    },
  },

  methods: {
    // Open edit dialog and fill form data
    openEditDialog(item) {
      this.editingItem = item

      this.editForm = {
        station: item.station,
        name: item.name,
        amount: item.amount,
        fuel: item.fuel,
        qty: item.qty,
        date: item.date,
      }

      this.showEditDialog = true
    },

    // Close edit dialog
    closeEditDialog() {
      this.showEditDialog = false
      this.editingItem = null
    },

    // Submit updated payment data
    submitEdit() {
      if (!this.editingItem) return

      this.$emit('update-payment', {
        ...this.editingItem,
        ...this.editForm,
      })

      this.closeEditDialog()
    },

    // Open delete confirmation dialog
    openDeleteConfirmation(id) {
      this.deleteTargetId = id
      this.showDeleteDialog = true
    },

    // Confirm delete payment
    confirmDelete() {
      this.$emit('delete-payment', this.deleteTargetId)

      this.showDeleteDialog = false
      this.deleteTargetId = null
    },
  },
}
</script>

<style scoped>
/* Muted text */
.text-muted {
  color: #666;
}

/* Bold text */
.font-bold {
  font-weight: 700;
}

/* Form row layout */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* Mobile form layout */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .scroll-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Select and date input wrapper */
.modal-select-wrap,
.modal-date-wrap {
  position: relative;
}

/* Remove default select and date icons */
.modal-select-wrap select,
.modal-date-wrap input[type='date'] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

/* Hide native date icon */
.modal-date-wrap input[type='date']::-webkit-calendar-picker-indicator {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* Custom select and date icon */
.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #820000;
  pointer-events: none;
}

/* Delete dialog action buttons */
.delete-actions {
  padding: 0 24px 32px !important;
  justify-content: center;
  gap: 12px;
}
</style>

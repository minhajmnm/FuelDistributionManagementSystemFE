<template>
  <div class="fuel-card">
    <h2 class="fuel-card__title">Fuel Types and Price</h2>

    <div class="fuel-table-wrap">
      <table class="fuel-table">
        <thead>
          <tr class="fuel-table__header-row">
            <th class="col-code">Fuel code</th>
            <th class="col-name">Fuel Name</th>
            <th class="col-price">Price Per Litre (LKR)</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(fuel, index) in fuelTypes"
            :key="fuel.id"
            class="fuel-table__row"
            :class="{ 'fuel-table__row--last': index === fuelTypes.length - 1 }"
          >
            <td class="col-code">{{ fuel.code }}</td>
            <td class="col-name">{{ fuel.name }}</td>
            <td class="col-price">{{ Number(fuel.pricePerLitre || 0).toFixed(2) }}</td>
            <td>
              <div class="d-flex align-center gap-2">
                <!-- Edit Button: Hollow Circle -->
                <v-btn
                  icon
                  variant="outlined"
                  size="small"
                  class="edit-btn"
                  @click="$emit('edit', fuel)"
                >
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>

                <!-- Delete Button: No Circle -->
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  class="delete-btn"
                  @click="confirmDelete(fuel.id)"
                >
                  <v-icon size="20">mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
          <tr v-if="fuelTypes.length === 0">
            <td colspan="4" class="text-center py-6">No fuel types found</td>
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
          <h3 class="delete-dialog-title">Delete Fuel Type?</h3>
          <p class="delete-dialog-msg">
            Are you sure you want to delete this fuel type? This action cannot be undone.
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
  // Component Props
  props: {
    fuelTypes: {
      type: Array,
      default: () => [],
    },
  },

  // Emitted Events
  emits: ['edit', 'delete'],

  // Component State
  data() {
    return {
      showDeleteDialog: false,
      deleteTargetId: null,
    }
  },

  methods: {
    // Open delete confirmation dialog
    confirmDelete(id) {
      this.deleteTargetId = id
      this.showDeleteDialog = true
    },

    // Delete selected fuel type
    doDelete() {
      this.$emit('delete', this.deleteTargetId)
      this.showDeleteDialog = false
      this.deleteTargetId = null
    },
  },
}
</script>

<style scoped>
/* Main fuel card container */
.fuel-card {
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* Fuel card title */
.fuel-card__title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  margin: 0;
  padding: 18px 14px 0;
}

/* Table wrapper with horizontal scrolling */
.fuel-table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Fuel types table */
.fuel-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  margin-top: 14px;
  min-width: 600px;
}

/* Table header row */
.fuel-table__header-row {
  background: #fbe6e6;
}

/* Table header cells */
.fuel-table thead th {
  padding: 14px 15px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  text-align: left;
}

/* Table body row cells */
.fuel-table__row td {
  padding: 14px 16px;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
  border-bottom: 1px solid rgba(179, 120, 120, 0.58);
}

/* Remove border from last row */
.fuel-table__row--last td {
  border-bottom: none;
}

/* Row hover effect */
.fuel-table__row:hover td {
  background: #fffafa;
}

/* Fuel code column */
.col-code {
  width: 25%;
}

/* Fuel name column */
.col-name {
  width: 30%;
}

/* Price per litre column */
.col-price {
  width: 30%;
}

/* Actions column */
.col-actions {
  width: 15%;
}

/* Edit button */
.edit-btn {
  border: 1.5px solid #000 !important;
  width: 28px !important;
  height: 28px !important;
  color: #000 !important;
}

/* Delete button */
.delete-btn {
  color: #333 !important;
  width: 28px !important;
  height: 28px !important;
}

/* Gap utility class */
.gap-2 {
  gap: 6px;
}

/* Flex container utility */
.d-flex {
  display: flex;
}

/* Align items vertically */
.align-center {
  align-items: center;
}

/* Delete confirmation dialog card */
.delete-confirm-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
}

/* Delete dialog header section */
.delete-dialog-header {
  background: linear-gradient(135deg, #b60106 0%, #820000 100%);
  padding: 28px 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Delete icon wrapper */
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

/* Delete icon */
.delete-icon {
  font-size: 32px;
  color: #ffffff;
}

/* Delete dialog body content */
.delete-dialog-body {
  padding: 24px 28px 8px;
  text-align: center;
}

/* Delete dialog title */
.delete-dialog-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #1a1a1a;
  margin: 0 0 10px;
}

/* Delete dialog message */
.delete-dialog-msg {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* Delete dialog action buttons container */
.delete-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 28px 28px;
}

/* Common dialog button */
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

/* Cancel button */
.del-cancel-btn {
  border: 1px solid #aaa;
  background: rgba(217, 217, 217, 0.5);
  color: #555;
}

/* Confirm delete button */
.del-confirm-btn {
  border: 1px solid #820000;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(182, 1, 6, 0.35);
  transition: opacity 0.2s;
}

/* Confirm delete button hover effect */
.del-confirm-btn:hover {
  opacity: 0.88;
}
</style>

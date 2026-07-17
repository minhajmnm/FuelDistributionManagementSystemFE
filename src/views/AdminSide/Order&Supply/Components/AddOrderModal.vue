<template>
  <!-- ─────────────────────────────────────────────
       VUETIFY DIALOG COMPONENT
       Main popup modal container
  ───────────────────────────────────────────── -->
  <v-dialog v-model="dialog" max-width="460" eager transition="fade-transition">
    <!-- ─────────────────────────────────────────────
         MODAL CARD CONTAINER
    ───────────────────────────────────────────── -->
    <v-card class="order-modal-card">
      <!-- ─────────────────────────────────────────────
           MODAL HEADER SECTION
           Contains title and close button
      ───────────────────────────────────────────── -->
      <div class="order-modal-header">
        <!-- Modal Title -->
        <h2 class="order-modal-title">Create New Order</h2>

        <!-- Close Button -->
        <button type="button" class="order-modal-close" @click="closeDialog">
          <v-icon size="18"> mdi-close </v-icon>
        </button>
      </div>

      <!-- ─────────────────────────────────────────────
           MODAL BODY SECTION
           Contains all form inputs
      ───────────────────────────────────────────── -->
      <v-card-text class="order-modal-body">
        <!-- Grid Layout -->
        <v-row dense class="ma-0">
          <!-- ─────────────────────────────────────────
               SUPPLIER DROPDOWN FIELD
          ───────────────────────────────────────── -->
          <v-col cols="12" md="6" class="pa-0 pr-md-2">
            <div class="order-form-group">
              <!-- Label -->
              <label class="order-form-label"> Supplier </label>

              <!-- Select Field Wrapper -->
              <div class="order-field-wrap" :class="{ 'field-error': errors.supplierId }">
                <!-- Supplier Dropdown -->
                <select v-model="form.supplierId" class="order-form-field">
                  <!-- Default Option -->
                  <option value="">Select Supplier</option>

                  <!-- Dynamic Supplier Options -->
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>

                <!-- Dropdown Icon -->
                <v-icon size="18" class="order-field-icon"> mdi-menu-down </v-icon>
              </div>

              <!-- Validation Error -->
              <span v-if="errors.supplierId" class="error-msg"> Required </span>
            </div>
          </v-col>

          <!-- ─────────────────────────────────────────
               STATION DROPDOWN FIELD
          ───────────────────────────────────────── -->
          <v-col cols="12" md="6" class="pa-0 pl-md-2">
            <div class="order-form-group">
              <!-- Label -->
              <label class="order-form-label"> Station </label>

              <!-- Select Field Wrapper -->
              <div class="order-field-wrap" :class="{ 'field-error': errors.stationId }">
                <!-- Station Dropdown -->
                <select v-model="form.stationId" class="order-form-field">
                  <!-- Default Option -->
                  <option value="">Select Station</option>

                  <!-- Dynamic Station Options -->
                  <option v-for="station in stations" :key="station.id" :value="station.id">
                    {{ station.name }}
                  </option>
                </select>

                <!-- Dropdown Icon -->
                <v-icon size="18" class="order-field-icon"> mdi-menu-down </v-icon>
              </div>

              <!-- Validation Error -->
              <span v-if="errors.stationId" class="error-msg"> Required </span>
            </div>
          </v-col>

          <!-- ─────────────────────────────────────────
               FUEL TYPE DROPDOWN FIELD
          ───────────────────────────────────────── -->
          <v-col cols="12" md="6" class="pa-0 pr-md-2">
            <div class="order-form-group">
              <!-- Label -->
              <label class="order-form-label"> Fuel Type </label>

              <!-- Select Field Wrapper -->
              <div class="order-field-wrap" :class="{ 'field-error': errors.fuelTypeId }">
                <!-- Fuel Type Dropdown -->
                <select v-model="form.fuelTypeId" class="order-form-field">
                  <!-- Default Option -->
                  <option value="">Select Fuel</option>

                  <!-- Dynamic Fuel Type Options -->
                  <option v-for="fuel in fuelTypes" :key="fuel.id" :value="fuel.id">
                    {{ fuel.name }}
                  </option>
                </select>

                <!-- Dropdown Icon -->
                <v-icon size="18" class="order-field-icon"> mdi-menu-down </v-icon>
              </div>

              <!-- Validation Error -->
              <span v-if="errors.fuelTypeId" class="error-msg"> Required </span>
            </div>
          </v-col>

          <!-- ─────────────────────────────────────────
               QUANTITY INPUT FIELD
          ───────────────────────────────────────── -->
          <v-col cols="12" md="6" class="pa-0 pl-md-2">
            <div class="order-form-group">
              <!-- Label -->
              <label class="order-form-label"> Quantity (Litres) </label>

              <!-- Input Wrapper -->
              <div class="order-field-wrap" :class="{ 'field-error': errors.quantity }">
                <!-- Quantity Input -->
                <input
                  v-model.number="form.quantity"
                  type="number"
                  min="1"
                  class="order-form-field"
                  placeholder="e.g. 5000"
                />
              </div>

              <!-- Validation Error -->
              <span v-if="errors.quantity" class="error-msg"> Must be greater than 0 </span>
            </div>
          </v-col>

          <!-- ─────────────────────────────────────────
               EXPECTED DELIVERY DATE FIELD
          ───────────────────────────────────────── -->
          <v-col cols="12" md="6" class="pa-0">
            <div class="order-form-group">
              <!-- Label -->
              <label class="order-form-label"> Expected Delivery Date </label>

              <!-- Date Input Wrapper -->
              <div class="order-field-wrap" :class="{ 'field-error': errors.expectedDate }">
                <!-- Date Input -->
                <input
                  v-model="form.expectedDate"
                  type="date"
                  class="order-form-field"
                  :min="today"
                />
              </div>

              <!-- Validation Error -->
              <span v-if="errors.expectedDate" class="error-msg"> Required </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- ─────────────────────────────────────────────
           MODAL ACTION BUTTONS
      ───────────────────────────────────────────── -->
      <v-card-actions class="order-modal-actions">
        <!-- Cancel Button -->
        <v-btn variant="outlined" class="order-btn order-btn--cancel" @click="closeDialog">
          Cancel
        </v-btn>

        <!-- Create Button -->
        <v-btn class="order-btn order-btn--create" @click="submitForm"> + Create </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
/* ─────────────────────────────────────────────
   IMPORT VUE COMPOSITION API FUNCTIONS
───────────────────────────────────────────── */
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

/* ─────────────────────────────────────────────
   COMPONENT PROPERTIES
   Receives dropdown data from parent component
───────────────────────────────────────────── */
const props = defineProps({
  // Supplier list
  suppliers: {
    type: Array,
    default: () => [],
  },

  // Fuel station list
  stations: {
    type: Array,
    default: () => [],
  },

  // Fuel type list
  fuelTypes: {
    type: Array,
    default: () => [],
  },
})

/* ─────────────────────────────────────────────
   COMPONENT EVENTS
───────────────────────────────────────────── */
const emit = defineEmits(['close', 'create'])

/* ─────────────────────────────────────────────
   DIALOG STATE
───────────────────────────────────────────── */

// Controls modal visibility
const dialog = ref(true)

/* ─────────────────────────────────────────────
   TODAY DATE
   Used as minimum selectable date
───────────────────────────────────────────── */
const today = new Date().toISOString().split('T')[0]

/* ─────────────────────────────────────────────
   FORM DATA
   Stores user input values
───────────────────────────────────────────── */
const form = reactive({
  // Selected supplier ID
  supplierId: '',

  // Selected station ID
  stationId: '',

  // Selected fuel type ID
  fuelTypeId: '',

  // Fuel quantity
  quantity: '',

  // Expected delivery date
  expectedDate: '',
})

/* ─────────────────────────────────────────────
   VALIDATION ERROR STATES
───────────────────────────────────────────── */
const errors = reactive({
  // Supplier validation
  supplierId: false,

  // Station validation
  stationId: false,

  // Fuel type validation
  fuelTypeId: false,

  // Quantity validation
  quantity: false,

  // Expected date validation
  expectedDate: false,
})

/* ─────────────────────────────────────────────
   CLOSE DIALOG FUNCTION
───────────────────────────────────────────── */
function closeDialog() {
  // Hide dialog
  dialog.value = false

  // Notify parent component
  emit('close')
}

/* ─────────────────────────────────────────────
   VALIDATE FORM INPUTS
───────────────────────────────────────────── */
function validateForm() {
  // Supplier validation
  errors.supplierId = !form.supplierId

  // Station validation
  errors.stationId = !form.stationId

  // Fuel type validation
  errors.fuelTypeId = !form.fuelTypeId

  // Quantity validation
  errors.quantity = !form.quantity || Number(form.quantity) <= 0

  // Expected date validation
  errors.expectedDate = !form.expectedDate

  // Return validation result
  return !Object.values(errors).some(Boolean)
}

/* ─────────────────────────────────────────────
   SUBMIT FORM FUNCTION
───────────────────────────────────────────── */
function submitForm() {
  // Stop if validation fails
  if (!validateForm()) return

  // Send data to parent component
  emit('create', {
    supplierId: form.supplierId,

    stationId: form.stationId,

    fuelTypeId: form.fuelTypeId,

    quantity: form.quantity,

    expectedDate: form.expectedDate,
  })

  /* ─────────────────────────────
     RESET FORM FIELDS
  ───────────────────────────── */
  form.supplierId = ''
  form.stationId = ''
  form.fuelTypeId = ''
  form.quantity = ''
  form.expectedDate = ''

  // Close modal
  closeDialog()
}

/* ─────────────────────────────────────────────
   HANDLE ESCAPE KEY PRESS
───────────────────────────────────────────── */
function handleEsc(e) {
  // Close dialog on Escape key
  if (e.key === 'Escape') {
    closeDialog()
  }
}

/* ─────────────────────────────────────────────
   ADD EVENT LISTENER WHEN COMPONENT MOUNTS
───────────────────────────────────────────── */
onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

/* ─────────────────────────────────────────────
   REMOVE EVENT LISTENER BEFORE COMPONENT REMOVES
───────────────────────────────────────────── */
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/* Modal card container */
.order-modal-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}

/* Modal header section */
.order-modal-header {
  height: 82px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
}

/* Modal title */
.order-modal-title {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
}

/* Close button */
.order-modal-close {
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

/* Close button hover effect */
.order-modal-close:hover {
  opacity: 0.8;
}

/* Modal body section */
.order-modal-body {
  padding: 22px 18px 8px !important;
}

/* Form group */
.order-form-group {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

/* Form label */
.order-form-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  color: #111111;
}

/* Input field wrapper */
.order-field-wrap {
  position: relative;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid rgba(182, 1, 6, 0.55);
  border-radius: 11px;
  background: #ffffff;
  transition: border-color 0.2s;
}

/* Input error state */
.order-field-wrap.field-error {
  border-color: #d93025;
  background: #fff8f8;
}

/* Input and select field */
.order-form-field {
  width: 100%;
  min-height: 38px;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: #4b5563;
}

/* Remove default select and date icons */
.order-field-wrap select,
.order-field-wrap input[type='date'] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Hide default calendar icon */
.order-field-wrap input[type='date']::-webkit-calendar-picker-indicator {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* Field icon */
.order-field-icon {
  color: #9ca3af;
  flex-shrink: 0;
  pointer-events: none;
}

/* Validation error message */
.error-msg {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #d93025;
  margin-top: 2px;
}

/* Modal action buttons section */
.order-modal-actions {
  justify-content: flex-end;
  gap: 12px;
  padding: 0 18px 18px 18px !important;
}

/* Common button style */
.order-btn {
  min-width: 90px;
  height: 36px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: 19px;
  text-transform: none;
}

/* Cancel button */
.order-btn--cancel {
  border-color: rgba(182, 1, 6, 0.45) !important;
  color: #938383 !important;
  background: transparent !important;
}

/* Create button */
.order-btn--create {
  background: #820000 !important;
  color: #ffffff !important;
}
</style>

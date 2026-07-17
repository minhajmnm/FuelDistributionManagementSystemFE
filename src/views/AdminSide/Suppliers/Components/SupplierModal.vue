<template>
  <!-- Supplier Add/Edit Dialog -->
  <v-dialog v-model="internalValue" max-width="600px" transition="fade-transition">
    <v-card class="supplier-modal-card">
      <!-- Modal Header -->
      <div class="modal-header">
        <span class="modal-title">
          {{ isEdit ? 'Edit Supplier' : 'Add New Supplier' }}
        </span>

        <!-- Close Button -->
        <button type="button" class="modal-close" @click="close">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <!-- Supplier Form -->
      <form class="modal-form" @submit.prevent="save">
        <!-- Supplier Name and Contact Person -->
        <div class="form-row">
          <div class="form-group">
            <label>Supplier Name</label>
            <input
              v-model="editedItem.name"
              type="text"
              placeholder="Enter Supplier Name"
              class="modal-input"
              required
            />
          </div>

          <div class="form-group">
            <label>Contact Person</label>
            <input
              v-model="editedItem.contactPerson"
              type="text"
              placeholder="Enter Contact Person"
              class="modal-input"
              required
            />
          </div>
        </div>

        <!-- Contact Number and Email Address -->
        <div class="form-row">
          <div class="form-group">
            <label>Contact Number</label>
            <input
              v-model="editedItem.contactNumber"
              type="text"
              placeholder="Enter Contact Number"
              class="modal-input"
              required
            />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input
              v-model="editedItem.email"
              type="email"
              placeholder="Enter Email Address"
              class="modal-input"
              required
            />
          </div>
        </div>

        <!-- Fuel Types Supplied -->
        <div class="form-row">
          <div class="form-group">
            <label>Fuel Types Supplied</label>

            <div class="fuel-checkbox-list">
              <label
                v-for="fuel in fuelTypes"
                :key="fuel.fuel_type_id || fuel.id"
                class="fuel-checkbox"
              >
                <input
                  type="checkbox"
                  :value="Number(fuel.fuel_type_id || fuel.id)"
                  v-model="editedItem.fuelTypeIds"
                />

                <span>{{ fuel.fuel_name || fuel.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-actions">
          <button type="button" class="button cancel-btn" @click="close">Cancel</button>

          <button type="submit" class="button confirm-btn">
            {{ isEdit ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
// Import API module
import FuelTypeManagement from '@/Api/Modules/FuelTypeManagement'

export default {
  // Component Name
  name: 'SupplierModal',

  // Props received from parent component
  props: {
    modelValue: Boolean,

    item: {
      type: Object,
      default: () => ({
        id: null,
        name: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        fuelTypeIds: [],
        status: 'Active',
      }),
    },

    isEdit: Boolean,
  },

  // Component State
  data() {
    return {
      editedItem: {
        ...this.item,
        fuelTypeIds: this.item.fuelTypeIds || [],
      },

      fuelTypes: [],
    }
  },

  // Load fuel types when modal component is mounted
  async mounted() {
    await this.loadFuelTypes()
  },

  computed: {
    // Controls modal visibility using v-model
    internalValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },

    // Selected fuel type IDs
    selectedFuelTypes() {
      return Array.isArray(this.editedItem?.fuelTypeIds) ? this.editedItem.fuelTypeIds : []
    },
  },

  watch: {
    // Update form when selected supplier changes
    item: {
      immediate: true,
      deep: true,
      handler(newItem) {
        this.editedItem = {
          ...newItem,
          fuelTypeIds: newItem?.fuelTypeIds || [],
        }
      },
    },
  },

  methods: {
    // Load all fuel types from API
    async loadFuelTypes() {
      try {
        const res = await FuelTypeManagement.getAllFuelTypes()
        this.fuelTypes = res.data.data || res.data || []
      } catch (error) {
        console.error('Fuel types load error:', error)
        this.fuelTypes = []
      }
    },

    // Close modal
    close() {
      this.internalValue = false
      this.$emit('close')
    },

    // Submit supplier data to parent component
    save() {
      this.$emit('save', this.editedItem)
      this.close()
    },
  },
}
</script>

<style scoped>
/* Supplier modal card */
.supplier-modal-card {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

/* Fuel checkbox list */
.fuel-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}

/* Fuel checkbox item */
.fuel-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #000;
}

/* Fuel checkbox input */
.fuel-checkbox input {
  width: 15px;
  height: 15px;
  cursor: pointer;
}

/* Modal header */
.modal-header {
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
}

/* Modal title */
.modal-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
}

/* Modal close button */
.modal-close {
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
.modal-close:hover {
  opacity: 0.8;
}

/* Modal form */
.modal-form {
  padding: 24px;
  display: grid;
  gap: 20px;
}

/* Form row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Form group */
.form-group {
  display: grid;
  gap: 8px;
}

/* Form label */
.form-group label {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}

/* Form input */
.modal-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  background: rgba(217, 217, 217, 0.35);
  border: 1px solid #b60106;
  border-radius: 11px;
  color: #000000;
  outline: none;
  line-height: 40px;
}

/* Input placeholder text */
.modal-input::placeholder {
  color: #938383;
}

/* Select wrapper */
.modal-select-wrap {
  position: relative;
}

/* Select icon */
.select-icon {
  position: absolute;
  right: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  top: 0;
  transform: none;
}

/* Modal action buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 10px;
}

/* Common button style */
.button {
  width: 108px;
  height: 36px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

/* Cancel button */
.cancel-btn {
  border: 1px solid #820000;
  background: rgba(217, 217, 217, 0.5);
  color: #938383;
}

/* Confirm button */
.confirm-btn {
  background: #820000;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(130, 0, 0, 0.2);
}

/* Button hover effect */
.button:hover {
  opacity: 0.9;
}

/* Mobile responsive layout */
@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>

<template>
  <!-- Update Fuel Station Dialog -->
  <v-dialog v-model="internalShow" width="520" transition="fade-transition">
    <v-card class="add-station-dialog-card">
      <!-- Dialog Header -->
      <div class="dialog-header">
        <span class="dialog-title">Edit Fuel Station</span>

        <!-- Close Button -->
        <button type="button" class="dialog-close" @click="close">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <!-- Update Station Form -->
      <form class="dialog-form" @submit.prevent="submit">
        <!-- Station Name Field -->
        <div class="dialog-group">
          <label for="update-station-name">Station Name</label>
          <input id="update-station-name" type="text" v-model="form.name" class="dialog-input" />
        </div>

        <!-- Station Address Field -->
        <div class="dialog-group">
          <label for="update-station-address">Address</label>
          <input
            id="update-station-address"
            type="text"
            v-model="form.address"
            class="dialog-input"
          />
        </div>

        <!-- Fuel Stock and Capacity Section -->
        <div class="dialog-group">
          <label>Fuel Types, Stock & Capacity (L)</label>

          <div class="fuel-checkbox-row">
            <label v-for="(fuel, index) in form.fuelStocks" :key="index" class="fuel-checkbox-item">
              <input type="checkbox" v-model="form.fuelStocks[index].enabled" />

              <span>{{ fuel.name }}</span>

              <input
                type="number"
                placeholder="Stock"
                v-model="form.fuelStocks[index].amount"
                class="fuel-stock-input"
                :disabled="!form.fuelStocks[index].enabled"
              />

              <input
                type="number"
                placeholder="Capacity"
                v-model="form.fuelStocks[index].capacity"
                class="fuel-stock-input"
                :disabled="!form.fuelStocks[index].enabled"
              />
            </label>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="dialog-actions">
          <button type="button" class="button cancel-btn" @click="close">Cancel</button>

          <button type="submit" class="button confirm-btn">Update</button>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  // Component name
  name: 'UpdateStationDialog',

  // Data received from parent component
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    station: {
      type: Object,
      default: null,
    },
    fuelTypes: {
      type: Array,
      default: () => [],
    },
  },

  // Events sent to parent component
  emits: ['update:modelValue', 'submit'],

  // Component state
  data() {
    return {
      form: {
        name: '',
        address: '',
        status: '',
        fuelStocks: [],
      },
    }
  },

  computed: {
    // Controls dialog visibility using v-model
    internalShow: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },

  watch: {
    // Fill form when selected station data changes
    station: {
      immediate: true,
      handler(station) {
        if (!station) return

        this.form = {
          name: station.name || '',
          address: station.address || '',
          status: station.status || '',

          fuelStocks: this.fuelTypes.map((fuelType) => {
            const existing = (station.fuelStocks || []).find(
              (fs) => fs.fuel_type_id === fuelType.id,
            )

            return {
              fuel_type_id: fuelType.id,
              name: fuelType.name,
              enabled: !!existing,
              amount: existing ? existing.amount : '',
              capacity: existing ? existing.capacity : '',
            }
          }),
        }
      },
    },
  },

  methods: {
    // Close dialog
    close() {
      this.$emit('update:modelValue', false)
    },

    // Submit updated station details
    submit() {
      const payload = {
        station_name: this.form.name,
        address: this.form.address,
        status: this.form.status,

        fuel_stocks: this.form.fuelStocks
          .filter((item) => item.enabled)
          .map((fuel) => ({
            fuel_type_id: fuel.fuel_type_id,
            quantity_litres: Number(fuel.amount),
            capacity_litres: Number(fuel.capacity),
            stock_status: Number(fuel.amount) > 0 ? 'available' : 'out_of_stock',
          })),
      }

      this.$emit('submit', payload)
    },
  },
}
</script>

<style scoped>
/* Main dialog card */
.add-station-dialog-card {
  position: relative;
  width: 520px;
  height: auto;
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
}

/* Dialog header */
.dialog-header {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
}

/* Dialog title */
.dialog-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #ffffff;
}

/* Dialog close button */
.dialog-close {
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
}

/* Dialog form */
.dialog-form {
  padding: 35px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Form input group */
.dialog-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Form labels */
.dialog-group label {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
}

/* Text input field */
.dialog-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  background: rgba(217, 217, 217, 0.35);
  opacity: 0.81;
  border: 1px solid #b60106;
  border-radius: 11px;
  color: #000000;
  outline: none;
}

/* Fuel checkbox list */
.fuel-checkbox-row {
  display: grid;
  gap: 12px;
}

/* Fuel checkbox item */
.fuel-checkbox-item {
  display: grid;
  grid-template-columns: 18px 90px 130px 130px;
  gap: 10px;
  align-items: center;
}

/* Fuel checkbox input */
.fuel-checkbox-item input[type='checkbox'] {
  width: 18px;
  height: 18px;
}

/* Fuel type name */
.fuel-checkbox-item span {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #000000;
}

/* Fuel stock and capacity input */
.fuel-stock-input {
  height: 32px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
}

/* Disabled fuel stock input */
.fuel-stock-input:disabled {
  background: rgba(217, 217, 217, 0.4);
  color: #999;
  cursor: not-allowed;
}

/* Dialog action button container */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

/* Common button style */
.button {
  width: 108px;
  height: 28px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-transform: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.72px;
}

/* Cancel button */
.cancel-btn {
  border: 1px solid #820000;
  background: rgba(217, 217, 217, 0.5);
  color: #938383;
}

/* Confirm update button */
.confirm-btn {
  background: #820000;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(130, 0, 0, 0.2);
}

/* Mobile responsive layout */
@media (max-width: 480px) {
  .fuel-checkbox-item {
    grid-template-columns: 18px 1fr;
  }

  .fuel-stock-input {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>

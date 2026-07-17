<template>
  <!-- Fuel Stations Management Page -->
  <div class="fuel-stations-page">
    <!-- Top Action Buttons -->
    <div class="fuel-stations-actions">
      <button class="add-fuel-price-btn" @click="openAddFuelDialog">+ Add Fuel Type & Price</button>

      <button class="add-fuel-station-btn" @click="openAddStationDialog">+ Add Station</button>
    </div>

    <!-- Add Fuel Station Dialog -->
    <v-dialog v-model="showAddStationDialog" max-width="520" width="95%">
      <v-card class="add-station-dialog-card">
        <!-- Dialog Header -->
        <div class="dialog-header add-station-header">
          <span class="dialog-title">Add Fuel Station</span>

          <!-- Close Button -->
          <button type="button" class="dialog-close" @click="closeAddStationDialog">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <!-- Add Station Form -->
        <form class="dialog-form" @submit.prevent="submitAddStation">
          <!-- Station Name -->
          <div class="dialog-group">
            <label for="add-station-name">Station Name</label>
            <input
              id="add-station-name"
              type="text"
              v-model="addStationForm.name"
              class="dialog-input"
            />
          </div>

          <!-- Station Address -->
          <div class="dialog-group">
            <label for="add-station-address">Address</label>
            <input
              id="add-station-address"
              type="text"
              v-model="addStationForm.address"
              class="dialog-input"
            />
          </div>

          <!-- Fuel Stocks -->
          <div class="dialog-group">
            <label>Fuel Types, Stock & Capacity (L)</label>

            <div class="fuel-checkbox-row">
              <label
                v-for="(fuel, index) in addStationForm.fuelStocks"
                :key="index"
                class="fuel-checkbox-item"
              >
                <input type="checkbox" v-model="addStationForm.fuelStocks[index].enabled" />

                <span>{{ fuel.name }}</span>

                <input
                  type="number"
                  placeholder="Initial stock"
                  v-model="addStationForm.fuelStocks[index].amount"
                  class="fuel-stock-input"
                  :disabled="!addStationForm.fuelStocks[index].enabled"
                />

                <input
                  type="number"
                  placeholder="Capacity"
                  v-model="addStationForm.fuelStocks[index].capacity"
                  class="fuel-stock-input"
                  :disabled="!addStationForm.fuelStocks[index].enabled"
                />
              </label>
            </div>
          </div>

          <!-- Dialog Actions -->
          <div class="dialog-actions">
            <button type="button" class="button cancel-btn" @click="closeAddStationDialog">
              Cancel
            </button>

            <button type="submit" class="button confirm-btn">Add</button>
          </div>
        </form>
      </v-card>
    </v-dialog>

    <!-- Add / Edit Fuel Type Dialog -->
    <v-dialog v-model="showFuelDialog" max-width="600" width="95%">
      <v-card class="add-fuel-dialog-card">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <span class="dialog-title">{{ dialogTitle }}</span>

          <button type="button" class="dialog-close" @click="closeFuelDialog">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <!-- Fuel Type Form -->
        <form class="dialog-form" @submit.prevent="submitFuelType">
          <!-- Fuel Code -->
          <div class="dialog-group">
            <label for="fuel-code-input">Fuel code</label>
            <input id="fuel-code-input" type="text" v-model="newFuel.code" class="dialog-input" />
          </div>

          <!-- Fuel Name -->
          <div class="dialog-group">
            <label for="fuel-name-input">Fuel Name</label>
            <input id="fuel-name-input" type="text" v-model="newFuel.name" class="dialog-input" />
          </div>

          <!-- Fuel Price -->
          <div class="dialog-group">
            <label for="fuel-price-input">Fuel price per litre (LKR)</label>
            <input
              id="fuel-price-input"
              type="number"
              step="0.01"
              v-model.number="newFuel.pricePerLitre"
              class="dialog-input"
            />
          </div>

          <!-- Dialog Actions -->
          <div class="dialog-actions">
            <button type="button" class="button cancel-btn" @click="closeFuelDialog">Cancel</button>

            <button type="submit" class="button confirm-btn">
              {{ submitButtonText }}
            </button>
          </div>
        </form>
      </v-card>
    </v-dialog>

    <!-- Statistics Cards -->
    <StatsRow :total="totalStations" :active="activeCount" :inactive="deactiveCount" />

    <!-- Fuel Types Table -->
    <FuelTypesTable :fuelTypes="fuelTypes" @edit="openEditFuelDialog" @delete="deleteFuelType" />

    <!-- Fuel Stations Table -->
    <StationListTable
      :stations="stations"
      @toggle-status="toggleStatus"
      @edit-station="openEditStation"
      @delete-station="deleteStation"
    />

    <!-- Update Station Dialog -->
    <UpdateStationDialog
      v-model="showStationDialog"
      :station="editingStation"
      :fuelTypes="fuelTypes"
      @submit="submitStationUpdate"
    />
  </div>
</template>

<script>
import StatsRow from '@/views/AdminSide/FuelStations/Components/StatsRow.vue'
import FuelTypesTable from '@/views/AdminSide/FuelStations/Components/Fueltypestable.vue'
import StationListTable from '@/views/AdminSide/FuelStations/Components/StationListTable.vue'
import UpdateStationDialog from '@/views/AdminSide/FuelStations/Components/UpdateStationDialog.vue'

import FuelTypeManagement from '@/Api/Modules/FuelTypeManagement'
import FuelStationManagement from '@/Api/Modules/FuelStationManagement'

export default {
  // Child Components
  components: {
    StatsRow,
    FuelTypesTable,
    StationListTable,
    UpdateStationDialog,
  },

  // Component State
  data() {
    return {
      stations: [],
      fuelTypes: [],

      showFuelDialog: false,
      isEditingFuel: false,
      editingFuelId: null,

      newFuel: {
        code: '',
        name: '',
        pricePerLitre: null,
      },

      showAddStationDialog: false,

      addStationForm: {
        name: '',
        address: '',
        fuelStocks: [],
      },

      showStationDialog: false,
      editingStation: null,
    }
  },

  computed: {
    // Total stations count
    totalStations() {
      return this.stations.length
    },

    // Active stations count
    activeCount() {
      return this.stations.filter((s) => String(s.status).toLowerCase().trim() === 'active').length
    },

    // Deactive stations count
    deactiveCount() {
      return this.stations.filter((s) => String(s.status).toLowerCase().trim() === 'deactive')
        .length
    },

    // Dialog title for add/edit fuel type
    dialogTitle() {
      return this.isEditingFuel ? 'Edit Fuel Type' : 'Add Fuel Type & Price'
    },

    // Submit button text
    submitButtonText() {
      return this.isEditingFuel ? 'Update' : 'Add'
    },
  },

  // Load data when page opens
  async mounted() {
    await this.fetchFuelTypes()
    await this.fetchStations()
  },

  methods: {
    // Fetch fuel types from backend
    async fetchFuelTypes() {
      try {
        const res = await FuelTypeManagement.getAllFuelTypes()

        this.fuelTypes = res.data.data.map((f) => ({
          id: f.fuel_id ?? f.fuel_type_id ?? f.id ?? f._id,
          code: f.fuel_code ?? f.code,
          name: f.fuel_name ?? f.name,
          pricePerLitre: parseFloat(f.price_per_litre ?? f.pricePerLitre ?? 0),
        }))
      } catch (e) {
        console.error('Failed to load fuel types:', e)
      }
    },

    // Fetch fuel stations from backend
    async fetchStations() {
      try {
        const res = await FuelStationManagement.getAllFuelStations()
        const stations = res.data?.data || res.data || []

        this.stations = stations.map((s) => this.mapStation(s))
      } catch (e) {
        console.error('Failed to load fuel stations:', e)
      }
    },

    // Toggle station active/deactive status
    async toggleStatus(stationId) {
      try {
        await FuelStationManagement.toggleFuelStationStatus(stationId)
        await this.fetchStations()
      } catch (e) {
        console.error('Failed to toggle station status:', e)
      }
    },

    // Convert backend station data into frontend format
    mapStation(s) {
      const stocks = s.fuel_stocks || s.fuelStocks || s.stocks || []

      const fuelStocks = stocks.map((fs) => {
        const fuelName =
          fs.fuel_type?.fuel_name ||
          fs.fuelType?.fuel_name ||
          fs.fuel_name ||
          fs.name ||
          this.getFuelNameById(fs.fuel_type_id)

        const amount = fs.quantity_litres ?? fs.amount ?? fs.stock ?? fs.quantity ?? 0

        return {
          fuel_type_id: fs.fuel_type_id,
          typeClass: this.getFuelClass(fuelName),
          label: `${fuelName} - ${amount}`,
          amount,
          capacity: fs.capacity_litres ?? fs.capacity ?? '',
        }
      })

      return {
        station_id: s.station_id ?? s.id,
        id: s.station_id ?? s.id,
        name: s.station_name ?? s.name,
        address: s.address,
        status: s.status,
        fuelStocks,
      }
    },

    // Open add fuel type dialog
    openAddFuelDialog() {
      this.isEditingFuel = false
      this.editingFuelId = null
      this.resetNewFuel()
      this.showFuelDialog = true
    },

    // Open edit fuel type dialog
    openEditFuelDialog(fuel) {
      this.isEditingFuel = true
      this.editingFuelId = fuel.id ?? fuel.fuel_id ?? fuel.fuel_type_id ?? fuel._id

      this.newFuel = {
        code: fuel.code || fuel.fuel_code,
        name: fuel.name || fuel.fuel_name,
        pricePerLitre: fuel.pricePerLitre || fuel.price_per_litre,
      }

      this.showFuelDialog = true
    },

    // Close fuel type dialog
    closeFuelDialog() {
      this.showFuelDialog = false
      this.isEditingFuel = false
      this.editingFuelId = null
      this.resetNewFuel()
    },

    // Reset fuel type form
    resetNewFuel() {
      this.newFuel = {
        code: '',
        name: '',
        pricePerLitre: null,
      }
    },

    // Add or update fuel type
    async submitFuelType() {
      if (this.isEditingFuel && !this.editingFuelId) {
        console.error('Fuel ID missing:', this.newFuel)
        return
      }

      const payload = {
        fuel_code: this.newFuel.code,
        fuel_name: this.newFuel.name,
        price_per_litre: Number(this.newFuel.pricePerLitre),
      }

      try {
        if (this.isEditingFuel) {
          await FuelTypeManagement.updateFuelType(this.editingFuelId, payload)
        } else {
          await FuelTypeManagement.addFuelType(payload)
        }

        await this.fetchFuelTypes()
        this.closeFuelDialog()
      } catch (e) {
        console.error('Failed to save fuel type:', e)
      }
    },

    // Delete fuel type
    async deleteFuelType(id) {
      try {
        await FuelTypeManagement.deleteFuelType(id)
        this.fuelTypes = this.fuelTypes.filter((f) => f.id !== id)
      } catch (e) {
        console.error('Failed to delete fuel type:', e)
      }
    },

    // Open add station dialog
    openAddStationDialog() {
      this.resetAddStationForm()
      this.showAddStationDialog = true
    },

    // Close add station dialog
    closeAddStationDialog() {
      this.showAddStationDialog = false
    },

    // Reset add station form using available fuel types
    resetAddStationForm() {
      this.addStationForm = {
        name: '',
        address: '',
        fuelStocks: this.fuelTypes.map((fuel) => ({
          fuel_type_id: fuel.id,
          typeClass: this.getFuelClass(fuel.name),
          name: fuel.name,
          enabled: false,
          amount: '',
          capacity: '',
        })),
      }
    },

    // Submit new fuel station
    async submitAddStation() {
      const payload = {
        station_name: this.addStationForm.name,
        address: this.addStationForm.address,

        fuel_stocks: this.addStationForm.fuelStocks
          .filter((item) => item.enabled)
          .map((item) => ({
            fuel_type_id: item.fuel_type_id,
            quantity_litres: Number(item.amount),
            capacity_litres: Number(item.capacity),
            stock_status: Number(item.amount) > 0 ? 'available' : 'out_of_stock',
          })),
      }

      try {
        await FuelStationManagement.addFuelStation(payload)
        await this.fetchStations()
        this.closeAddStationDialog()
      } catch (e) {
        console.error('Failed to add station:', e.response?.data || e)
      }
    },

    // Delete fuel station
    async deleteStation(stationId) {
      try {
        await FuelStationManagement.deleteFuelStation(stationId)
        await this.fetchStations()
      } catch (e) {
        console.error('Failed to delete station:', e.response?.data || e)
      }
    },

    // Open edit station dialog
    openEditStation(station) {
      this.editingStation = station
      this.showStationDialog = true
    },

    // Submit updated station details
    async submitStationUpdate(payload) {
      if (!this.editingStation) return

      try {
        await FuelStationManagement.updateFuelStation(this.editingStation.id, payload)
        await this.fetchStations()

        this.showStationDialog = false
        this.editingStation = null
      } catch (e) {
        console.error('Failed to update station:', e.response?.data || e)
      }
    },

    // Return fuel CSS class based on fuel name
    getFuelClass(name) {
      const text = String(name || '').toLowerCase()

      if (text.includes('92')) return 'petrol92'
      if (text.includes('95')) return 'petrol95'
      if (text.includes('diesel')) return 'diesel'

      return 'petrol92'
    },

    // Return fuel name based on class
    getFuelName(typeClass) {
      if (typeClass === 'petrol92') return 'Petrol 92'
      if (typeClass === 'petrol95') return 'Petrol 95'
      if (typeClass === 'diesel') return 'Auto Diesel'

      return 'Fuel'
    },

    // Find fuel name using fuel type ID
    getFuelNameById(id) {
      const fuel = this.fuelTypes.find((f) => f.id === id)

      return fuel ? fuel.name : 'Fuel'
    },
  },
}
</script>
<style scoped>
/* Fuel stations page container */
.fuel-stations-page {
  width: 100%;
}

/* Top action buttons container */
.fuel-stations-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

/* Add fuel price and add station buttons */
.add-fuel-price-btn,
.add-fuel-station-btn {
  background: #820000 !important;
  color: #ffffff !important;
  font-family: 'Poppins', sans-serif;
  font-weight: 700 !important;
  font-size: 15px;
  padding: 8px 24px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  height: 44px;
  box-shadow: 0 4px 10px rgba(130, 0, 0, 0.25);
  text-transform: none !important;
}

/* Button hover effect */
.add-fuel-price-btn:hover,
.add-fuel-station-btn:hover {
  opacity: 0.9;
}

/* Add fuel dialog card */
.add-fuel-dialog-card {
  width: 600px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

/* Common dialog card width */
.add-fuel-dialog-card,
.add-station-dialog-card {
  width: 100%;
  max-width: 600px;
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

/* Form label */
.dialog-group label {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
}

/* Dialog input field */
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

/* Dialog action buttons container */
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

/* Confirm button */
.confirm-btn {
  background: #820000;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(130, 0, 0, 0.2);
}

/* Fuel stock input */
.fuel-stock-input {
  width: 130px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid #b60106;
  border-radius: 8px;
  font-size: 12px;
  text-align: center;
  outline: none;
}

/* Add station dialog card */
.add-station-dialog-card {
  position: relative;
  width: 520px;
  height: auto;
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
}

/* Fuel checkbox row */
.fuel-checkbox-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Fuel checkbox item */
.fuel-checkbox-item {
  display: grid;
  grid-template-columns: 18px 80px 130px 130px;
  align-items: center;
  gap: 14px;
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

/* Mobile form layout */
@media (max-width: 768px) {
  .fuel-checkbox-item {
    grid-template-columns: 1fr;
    gap: 8px;
    align-items: start;
  }

  .fuel-stock-input {
    width: 100%;
  }

  .dialog-form {
    padding: 20px 16px;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
    height: 42px;
  }
}

/* Mobile action button layout */
@media (max-width: 768px) {
  .fuel-stations-actions {
    flex-direction: column;
    align-items: flex-end;
  }

  .add-fuel-price-btn,
  .add-fuel-station-btn {
    width: 60%;
  }
}

/* Mobile dialog layout */
@media (max-width: 768px) {
  .add-station-dialog-card,
  .add-fuel-dialog-card {
    width: 100%;
    max-width: 95vw;
    max-height: 85vh;
    overflow-y: auto;
  }

  /* Mobile add station header */
  .add-station-header {
    height: 48px !important;
    min-height: 48px !important;
    padding: 0 14px !important;
  }

  /* Mobile add station title */
  .add-station-header .dialog-title {
    font-size: 16px !important;
    line-height: 20px !important;
  }

  /* Mobile add station close button */
  .add-station-header .dialog-close {
    width: 26px !important;
    height: 26px !important;
  }

  /* Mobile dialog header */
  .dialog-header {
    background: #b60106;
    color: #fff;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-radius: 12px 12px 0 0;
  }

  /* Mobile dialog title */
  .dialog-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }

  /* Mobile close button */
  .dialog-close {
    width: 28px;
    height: 28px;
  }

  /* Mobile form spacing */
  .dialog-form {
    padding: 18px 14px;
    gap: 18px;
  }

  /* Mobile fuel checkbox item */
  .fuel-checkbox-item {
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 8px 10px;
  }

  /* Mobile fuel type name */
  .fuel-checkbox-item span {
    grid-column: 2;
  }

  /* Mobile stock input */
  .fuel-stock-input {
    grid-column: 1 / -1;
    width: 100%;
    height: 34px;
  }

  /* Sticky mobile action buttons */
  .dialog-actions {
    position: sticky;
    bottom: 0;
    background: #fff;
    padding-top: 12px;
    flex-direction: row;
  }

  /* Mobile dialog buttons */
  .button {
    width: 50%;
    height: 38px;
  }
}
</style>

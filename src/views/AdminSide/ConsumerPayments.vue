<template>
  <!-- Consumer Payments Page -->
  <div class="page-wrapper">
    <!-- Page Header -->
    <div class="page-header">
      <button class="btn-primary" @click="showModal = true">+ Add Payment</button>
    </div>

    <!-- Payment Summary Cards -->
    <div class="mb-36">
      <ConsumerPaymentCard :payments="payments" />
    </div>

    <!-- Payment History Table -->
    <div class="table-card-container">
      <ConsumerPaymentTable
        :paymentData="payments"
        @update-payment="handleUpdate"
        @delete-payment="handleDelete"
      />
    </div>

    <!-- Add Payment Modal -->
    <v-dialog v-model="showModal" max-width="520" transition="fade-transition">
      <v-card class="premium-modal-card">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title">Add New Payment</h3>

          <!-- Close Button -->
          <button type="button" class="modal-close" @click="showModal = false">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Consumer and Amount Fields -->
          <div class="form-row">
            <div class="form-group">
              <label class="modal-label">Select Consumer</label>

              <!-- Consumer Dropdown -->
              <div class="modal-select-wrap">
                <select
                  v-model="form.consumer_id"
                  class="modal-input"
                  @change="handleConsumerChange"
                >
                  <option disabled value="">Select Consumer</option>

                  <option
                    v-for="consumer in consumers"
                    :key="consumer.consumer_id"
                    :value="consumer.consumer_id"
                  >
                    {{ consumer.full_name }}
                  </option>
                </select>

                <v-icon size="20" class="select-icon">mdi-chevron-down</v-icon>
              </div>
            </div>

            <div class="form-group">
              <label class="modal-label">Amount (LKR)</label>

              <!-- Auto Calculated Amount -->
              <input
                v-model.number="form.amount"
                class="modal-input"
                placeholder="0.00"
                type="number"
                readonly
              />
            </div>
          </div>

          <!-- Fuel Type and Quantity Fields -->
          <div class="form-row">
            <div class="form-group">
              <label class="modal-label">Fuel Type</label>

              <!-- Auto Selected Fuel Type -->
              <div class="modal-select-wrap">
                <input v-model="form.fuel" class="modal-input" placeholder="Fuel type" readonly />
              </div>
            </div>

            <div class="form-group">
              <label class="modal-label">Quantity (L)</label>

              <!-- Quantity Input -->
              <input
                v-model.number="form.qty"
                class="modal-input"
                placeholder="0"
                type="number"
                @input="calculateAmount"
              />
            </div>
          </div>

          <!-- Station and Payment Method Fields -->
          <div class="form-row">
            <div class="form-group">
              <label class="modal-label">Station</label>

              <!-- Auto Selected Station -->
              <div class="modal-select-wrap">
                <input v-model="form.station" class="modal-input" placeholder="Station" readonly />
              </div>
            </div>

            <div class="form-group">
              <label class="modal-label">Payment Method</label>

              <!-- Payment Method Dropdown -->
              <div class="modal-select-wrap">
                <select v-model="form.method" class="modal-input">
                  <option disabled value="">Select Method</option>

                  <option v-for="method in paymentMethods" :key="method" :value="method">
                    {{ method }}
                  </option>
                </select>

                <v-icon size="20" class="select-icon">mdi-chevron-down</v-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showModal = false">Cancel</button>

          <button class="modal-btn confirm" @click="addPayment">Add Payment</button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// Import child components
import ConsumerPaymentCard from './ConsumerPayments/Components/ConsumerPaymentCard.vue'
import ConsumerPaymentTable from './ConsumerPayments/Components/ConsumerPaymentTable.vue'

// Import API modules
import PaymentManagement from '@/Api/Modules/PaymentManagement.js'
import AuthManagement from '@/Api/Modules/AuthManagement.js'

export default {
  // Component Name
  name: 'ConsumerPayments',

  // Child Components
  components: {
    ConsumerPaymentCard,
    ConsumerPaymentTable,
  },

  // Component State
  data() {
    return {
      showModal: false,

      // Add payment form
      form: {
        consumer_id: '',
        amount: '',
        fuel: '',
        fuel_type_id: '',
        fuel_price: '',
        qty: '',
        station: '',
        station_id: '',
        queue_id: '',
        method: '',
      },

      // Dropdown and table data
      fuelTypes: [],
      stations: [],
      paymentMethods: ['Cash', 'Card'],
      payments: [],
      consumers: [],
    }
  },

  // Load data when page opens
  mounted() {
    this.fetchPayments()
    this.fetchConsumers()
  },

  methods: {
    // Fetch active consumers for dropdown
    async fetchConsumers() {
      try {
        const res = await AuthManagement.getActiveConsumers()
        this.consumers = res.data?.data ?? []
      } catch (error) {
        console.error('fetchConsumers error:', error)
      }
    },

    // Fetch payment history
    async fetchPayments() {
      try {
        const res = await PaymentManagement.getAllPayments()
        const raw = res.data?.data ?? res.data ?? []

        this.payments = Array.isArray(raw) ? raw.map(this.mapPayment) : []
      } catch (error) {
        console.error('fetchPayments error:', error)
        this.payments = []
      }
    },

    // Convert API payment data to UI table format
    mapPayment(p) {
      return {
        id: p.payment_id ?? p.id,
        station: p.station?.station_name ?? p.station_name ?? '-',
        name: p.consumer?.full_name ?? p.consumer?.name ?? p.consumer_name ?? '-',
        amount: Number(p.amount ?? 0).toFixed(2),
        fuel: p.fuel_type?.fuel_name ?? p.fuel_type?.fuel_type_name ?? '-',
        qty: p.quantity_litres ?? p.qty ?? 0,
        date: this.formatDate(p.payment_date ?? p.created_at),
        status: p.payment_status ?? 'Completed',
      }
    },

    // Add new payment
    async addPayment() {
      const { consumer_id, amount, fuel, qty, station, method } = this.form

      if (!consumer_id || !amount || !fuel || !qty || !station || !method) {
        alert('Please fill all required fields.')
        return
      }

      try {
        await PaymentManagement.createNewPayment({
          consumer_id: Number(this.form.consumer_id),
          vehicle_id: Number(this.form.vehicle_id),
          fuel_type_id: Number(this.form.fuel_type_id),
          station_id: Number(this.form.station_id),
          queue_id: Number(this.form.queue_id),
          quantity_litres: Number(qty),
          amount: Number(amount),
          payment_method: this.form.method,
          payment_status: 'success',
          payment_date: new Date().toISOString().split('T')[0],
        })

        await this.fetchPayments()

        // Reset form after successful payment
        this.form = {
          consumer_id: '',
          vehicle_id: '',
          amount: '',
          fuel: '',
          fuel_type_id: '',
          qty: '',
          station: '',
          station_id: '',
          queue_id: '',
          method: '',
        }

        this.showModal = false
      } catch (error) {
        console.error('addPayment error:', error.response?.data || error)
      }
    },

    // Update existing payment
    async handleUpdate(updated) {
      try {
        await PaymentManagement.updatePayment(updated.id, {
          station_name: updated.station,
          consumer_name: updated.name,
          amount: Number(updated.amount),
          fuel_type: updated.fuel,
          quantity_litres: Number(updated.qty),
        })

        await this.fetchPayments()
      } catch (error) {
        console.error('update payment error:', error)
      }
    },

    // Auto-fill fuel, station and queue details when consumer is selected
    handleConsumerChange() {
      const consumer = this.consumers.find(
        (c) => Number(c.consumer_id) === Number(this.form.consumer_id),
      )

      const activeQueue = consumer?.queues?.find((q) =>
        ['waiting', 'served'].includes(String(q.queue_status).toLowerCase()),
      )

      const vehicle = activeQueue?.vehicle || consumer?.vehicles?.[0]

      this.form.fuel = activeQueue?.fuel_type?.fuel_name || vehicle?.fuel_type?.fuel_name || ''

      this.form.fuel_price =
        activeQueue?.fuel_type?.price_per_litre ||
        activeQueue?.fuel_type?.price ||
        vehicle?.fuel_type?.price_per_litre ||
        vehicle?.fuel_type?.price ||
        0

      this.calculateAmount()

      this.form.fuel_type_id =
        activeQueue?.fuel_type_id ||
        activeQueue?.fuel_type?.fuel_type_id ||
        vehicle?.fuel_type_id ||
        vehicle?.fuel_type?.fuel_type_id ||
        ''

      this.form.station = activeQueue?.station?.station_name || ''
      this.form.station_id = activeQueue?.station_id || ''
      this.form.queue_id = activeQueue?.queue_id || ''
      this.form.vehicle_id = vehicle?.vehicle_id || vehicle?.id
    },

    // Delete payment
    async handleDelete(id) {
      try {
        await PaymentManagement.deletePayment(id)
        await this.fetchPayments()
      } catch (error) {
        console.error('delete payment error:', error)
      }
    },

    // Calculate amount using quantity and fuel price
    calculateAmount() {
      const qty = Number(this.form.qty) || 0
      const price = Number(this.form.fuel_price) || 0

      this.form.amount = (qty * price).toFixed(2)
    },

    // Format date as DD/MM/YYYY
    formatDate(value) {
      if (!value) return ''

      const date = new Date(value)

      if (isNaN(date.getTime())) return value

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    },
  },
}
</script>

<style scoped>
/* Main page wrapper */
.page-wrapper {
  width: 100%;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}

/* Page title */
.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0;
}

/* Primary button */
.btn-primary {
  background: #820000 !important;
  color: #fff !important;
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

/* Primary button hover */
.btn-primary:hover {
  opacity: 0.9;
}

/* Table card container */
.table-card-container {
  background: #fff;
  border: 1px solid #820000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Modal card */
.premium-modal-card {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Modal header */
.modal-header {
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* Modal close button hover */
.modal-close:hover {
  opacity: 0.8;
}

/* Modal title */
.modal-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* Modal body */
.modal-body {
  padding: 24px;
}

/* Form row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* Modal label */
.modal-label {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #000;
}

/* Modal input */
.modal-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background: #f5f5f5;
  border: 1px solid #820000;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
}

/* Select input wrapper */
.modal-select-wrap {
  position: relative;
}

/* Remove default select icon */
.modal-select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

/* Custom select icon */
.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #820000;
  pointer-events: none;
}

/* Modal action buttons */
.modal-actions {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Common modal button */
.modal-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 9px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

/* Cancel button */
.modal-btn.cancel {
  background: #f0f0f0;
  color: #666;
}

/* Confirm button */
.modal-btn.confirm {
  background: #820000;
  color: #fff;
}

/* Bottom spacing */
.mb-36 {
  margin-bottom: 36px;
}
</style>

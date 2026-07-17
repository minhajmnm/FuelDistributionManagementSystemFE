<template>
  <!-- ─────────────────────────────────────────────
       MAIN VUETIFY DIALOG
       Displays order details popup modal
  ───────────────────────────────────────────── -->
  <v-dialog
    v-model="dialog"
    max-width="460"
    persistent
    :transition="false"
    no-click-animation
    eager
  >
    <!-- ─────────────────────────────────────────
         OUTSIDE WRAPPER
         Clicking outside closes modal
    ───────────────────────────────────────── -->
    <div class="dialog-wrapper" @click="closeDialog">
      <!-- ─────────────────────────────────────
           MODAL CARD
      ───────────────────────────────────── -->
      <v-card class="order-modal-card" @click.stop>
        <!-- ─────────────────────────────────
             MODAL HEADER
        ───────────────────────────────── -->
        <div class="order-modal-header">
          <!-- Modal Title -->
          <h2 class="order-modal-title">Order Details</h2>

          <!-- Close Button -->
          <button type="button" class="order-modal-close" @click="closeDialog">
            <!-- Close Icon -->
            <v-icon size="18"> mdi-close </v-icon>
          </button>
        </div>

        <!-- ─────────────────────────────────
             MODAL BODY
        ───────────────────────────────── -->
        <v-card-text class="order-modal-body order-modal-body--view">
          <!-- Order Details List -->
          <div class="order-detail-list">
            <!-- ─────────────────────────────
                 ORDER ID
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Order ID </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ order?.orderDisplay || '-' }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 SUPPLIER
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Supplier </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ order?.supplier || '-' }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 STATION
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Station </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ order?.station || '-' }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 FUEL TYPE
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Fuel Type </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                <!-- Fuel Type Badge -->
                <span :class="['orders-fuel-badge', fuelBadgeClass(order?.fuelType)]">
                  {{ order?.fuelType || '-' }}
                </span>
              </span>
            </div>

            <!-- ─────────────────────────────
                 QUANTITY
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Qty (L) </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ formattedQuantity }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 ORDER DATE
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Order Date </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ order?.orderDate || '-' }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 EXPECTED DELIVERY DATE
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Expected Date </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ order?.expectedDate || '-' }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 DELIVERY DATE
                 Only visible for delivered orders
            ───────────────────────────── -->
            <div v-if="order?.deliveryDate" class="order-detail-row">
              <span class="order-detail-label"> Delivery Date </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                {{ order.deliveryDate }}
              </span>
            </div>

            <!-- ─────────────────────────────
                 ORDER STATUS
            ───────────────────────────── -->
            <div class="order-detail-row">
              <span class="order-detail-label"> Status </span>

              <span class="order-detail-colon"> : </span>

              <span class="order-detail-value">
                <!-- Status Badge -->
                <span :class="['orders-status-badge', statusBadgeClass(order?.status)]">
                  {{ order?.status || '-' }}
                </span>
              </span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script setup>
/* ─────────────────────────────────────────────
   IMPORT VUE FUNCTIONS
───────────────────────────────────────────── */
import { ref, computed } from 'vue'

/* ─────────────────────────────────────────────
   COMPONENT PROPERTIES
───────────────────────────────────────────── */
const props = defineProps({
  // Order object passed from parent component
  order: {
    type: Object,

    // Default empty object
    default: () => ({}),
  },
})

/* ─────────────────────────────────────────────
   COMPONENT EVENTS
───────────────────────────────────────────── */
const emit = defineEmits([
  // Close modal event
  'close',
])

/* ─────────────────────────────────────────────
   DIALOG STATE
───────────────────────────────────────────── */

// Controls dialog visibility
const dialog = ref(true)

/* ─────────────────────────────────────────────
   CLOSE DIALOG FUNCTION
───────────────────────────────────────────── */
function closeDialog() {
  // Hide modal
  dialog.value = false

  // Notify parent component
  emit('close')
}

/* ─────────────────────────────────────────────
   FORMATTED QUANTITY
   Adds commas to quantity value
───────────────────────────────────────────── */
const formattedQuantity = computed(() => {
  // Get quantity value
  const qty = props.order?.qty

  // Return fallback if empty
  if (qty === null || qty === undefined || qty === '') {
    return '-'
  }

  // Convert to number
  const n = Number(qty)

  // Return fallback if invalid
  if (isNaN(n)) {
    return '-'
  }

  // Format with commas
  return n.toLocaleString('en-US')
})

/* ─────────────────────────────────────────────
   RETURN FUEL BADGE CLASS
───────────────────────────────────────────── */
function fuelBadgeClass(fuelType) {
  // Convert fuel type to lowercase
  const fuel = fuelType ? fuelType.toLowerCase() : ''

  // Petrol 92 badge
  if (fuel.includes('92')) {
    return 'orders-fuel-badge--petrol92'
  }

  // Petrol 95 badge
  if (fuel.includes('95')) {
    return 'orders-fuel-badge--petrol95'
  }

  // Diesel badge
  if (fuel.includes('diesel')) {
    return 'orders-fuel-badge--diesel'
  }

  // Default class
  return ''
}

/* ─────────────────────────────────────────────
   RETURN STATUS BADGE CLASS
───────────────────────────────────────────── */
function statusBadgeClass(status) {
  // Normalize status text
  const s = status ? status.toLowerCase().trim() : ''

  // Delivered status
  if (s === 'delivered') {
    return 'orders-status-badge--delivered'
  }

  // Approved status
  if (s === 'approved') {
    return 'orders-status-badge--approved'
  }

  // Pending status
  if (s === 'pending') {
    return 'orders-status-badge--pending'
  }

  // Cancelled status
  if (s === 'cancelled') {
    return 'orders-status-badge--cancelled'
  }

  // Default class
  return ''
}
</script>

<style scoped>
/* ─────────────────────────────────────────────
   MODAL CARD STYLING
───────────────────────────────────────────── */
.order-modal-card {
  border-radius: 16px;

  overflow: hidden;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}

/* ─────────────────────────────────────────────
   MODAL HEADER
───────────────────────────────────────────── */
.order-modal-header {
  height: 82px;

  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
}

/* ─────────────────────────────────────────────
   MODAL TITLE
───────────────────────────────────────────── */
.order-modal-title {
  margin: 0;

  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;

  color: #ffffff;
}

/* ─────────────────────────────────────────────
   CLOSE BUTTON
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   MODAL BODY
───────────────────────────────────────────── */
.order-modal-body--view {
  padding: 24px 18px 24px !important;
}

/* ─────────────────────────────────────────────
   DETAILS LIST CONTAINER
───────────────────────────────────────────── */
.order-detail-list {
  display: grid;

  gap: 20px;
}

/* ─────────────────────────────────────────────
   DETAIL ROW
───────────────────────────────────────────── */
.order-detail-row {
  display: grid;

  grid-template-columns:
    110px
    14px
    minmax(0, 1fr);

  gap: 8px;

  align-items: center;
}

/* ─────────────────────────────────────────────
   DETAIL LABEL
───────────────────────────────────────────── */
.order-detail-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;

  color: #111111;
}

/* ─────────────────────────────────────────────
   COLON & VALUE TEXT
───────────────────────────────────────────── */
.order-detail-colon,
.order-detail-value {
  font-family: 'Inter', sans-serif;

  font-size: 15px;
  line-height: 18px;

  color: #4b5563;
}

/* ─────────────────────────────────────────────
   FUEL BADGE COMMON STYLE
───────────────────────────────────────────── */
.orders-fuel-badge {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 4px 12px;

  border-radius: 12px;

  font-weight: 700;
  font-size: 12px;
}

/* ─────────────────────────────────────────────
   PETROL 92 BADGE
───────────────────────────────────────────── */
.orders-fuel-badge--petrol92 {
  color: #de2626;

  background: rgba(253, 236, 236, 0.55);

  border: 1px solid #de2626;
}

/* ─────────────────────────────────────────────
   PETROL 95 BADGE
───────────────────────────────────────────── */
.orders-fuel-badge--petrol95 {
  color: #9333ea;

  background: rgba(246, 238, 254, 0.55);

  border: 1px solid #a262f1;
}

/* ─────────────────────────────────────────────
   DIESEL BADGE
───────────────────────────────────────────── */
.orders-fuel-badge--diesel {
  color: #2563eb;

  background: rgba(233, 239, 253, 0.55);

  border: 1px solid #3b82f6;
}

/* ─────────────────────────────────────────────
   STATUS BADGE COMMON STYLE
───────────────────────────────────────────── */
.orders-status-badge {
  display: inline-flex;

  align-items: center;

  padding: 4px 12px;

  border-radius: 16px;

  font-size: 12px;
  font-weight: 600;

  text-transform: capitalize;
}

/* ─────────────────────────────────────────────
   DELIVERED STATUS BADGE
───────────────────────────────────────────── */
.orders-status-badge--delivered {
  background-color: #e6f4ea;

  color: #1e8e3e;

  border: 1px solid #ceead6;
}

/* ─────────────────────────────────────────────
   APPROVED STATUS BADGE
───────────────────────────────────────────── */
.orders-status-badge--approved {
  background-color: #e3f2fd;

  color: #0288d1;

  border: 1px solid #bbdefb;
}

/* ─────────────────────────────────────────────
   PENDING STATUS BADGE
───────────────────────────────────────────── */
.orders-status-badge--pending {
  background-color: #fff8e1;

  color: #f57c00;

  border: 1px solid #ffecb3;
}

/* ─────────────────────────────────────────────
   CANCELLED STATUS BADGE
───────────────────────────────────────────── */
.orders-status-badge--cancelled {
  background-color: #fce8e6;

  color: #d93025;

  border: 1px solid #f8d7da;
}
</style>

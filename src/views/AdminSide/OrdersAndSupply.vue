<template>
  <!-- Orders page container -->
  <div class="orders-page-container">
    <!-- Top action section -->
    <div class="orders-top-actions">
      <button class="add-order-btn" @click="openAddOrder">+ Add Order</button>
    </div>

    <!-- Order statistics cards -->
    <div class="orders-stats-row">
      <!-- Total orders card -->
      <div class="stat-card">
        <div class="gradient-bar"></div>

        <div class="stat-content">
          <div class="stat-number">{{ pad(stats.total) }}</div>
          <div class="stat-label">Total Orders</div>
        </div>
      </div>

      <!-- Approved orders card -->
      <div class="stat-card">
        <div class="gradient-bar"></div>

        <div class="stat-content">
          <div class="stat-number">{{ pad(stats.approved) }}</div>
          <div class="stat-label">Total Approved Orders</div>
        </div>
      </div>

      <!-- Delivered orders card -->
      <div class="stat-card">
        <div class="gradient-bar"></div>

        <div class="stat-content">
          <div class="stat-number">{{ pad(stats.delivered) }}</div>
          <div class="stat-label">Total Delivered Orders</div>
        </div>
      </div>
    </div>

    <!-- Orders table component -->
    <OrdersTable
      :orders="orders"
      :stations="stationOptions"
      @view-order="openViewOrder"
      @request-approve="openApproveDialog"
      @request-cancel="openCancelDialog"
      @request-deliver="openDeliverDialog"
    />

    <!-- Add order modal -->
    <AddOrderModal
      v-if="showAddOrderModal"
      :suppliers="supplierOptions"
      :stations="stationOptions"
      :fuelTypes="fuelTypeOptions"
      :key="addOrderKey"
      @close="showAddOrderModal = false"
      @create="createOrder"
    />

    <!-- View order modal -->
    <ViewOrderModal v-if="showViewOrderModal" :order="selectedOrder" @close="closeViewOrder" />

    <!-- Cancel order confirmation dialog -->
    <v-dialog v-model="showCancelDialog" transition="fade-transition" width="420">
      <v-card class="delete-confirm-card">
        <!-- Dialog header -->
        <div class="delete-dialog-header">
          <div class="delete-icon-wrap">
            <span class="mdi mdi-close-circle-outline delete-icon"></span>
          </div>
        </div>

        <!-- Dialog body -->
        <div class="delete-dialog-body">
          <h3 class="delete-dialog-title">Cancel Order?</h3>

          <p class="delete-dialog-msg">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
        </div>

        <!-- Dialog actions -->
        <div class="delete-dialog-actions">
          <button class="del-button del-cancel-btn" @click="showCancelDialog = false">No</button>

          <button class="del-button del-confirm-btn" @click="doCancel">Yes, Cancel</button>
        </div>
      </v-card>
    </v-dialog>

    <!-- Approve order confirmation dialog -->
    <v-dialog v-model="showApproveDialog" transition="fade-transition" width="420">
      <v-card class="delete-confirm-card">
        <!-- Dialog header -->
        <div class="delete-dialog-header approve-header">
          <div class="delete-icon-wrap">
            <span class="mdi mdi-check-circle-outline delete-icon"></span>
          </div>
        </div>

        <!-- Dialog body -->
        <div class="delete-dialog-body">
          <h3 class="delete-dialog-title">Approve Order?</h3>

          <p class="delete-dialog-msg">
            Are you sure you want to approve this order? This will confirm the order to the
            supplier.
          </p>
        </div>

        <!-- Dialog actions -->
        <div class="delete-dialog-actions">
          <button class="del-button del-cancel-btn" @click="showApproveDialog = false">
            Cancel
          </button>

          <button class="del-button del-confirm-btn approve-confirm-btn" @click="doApprove">
            Approve
          </button>
        </div>
      </v-card>
    </v-dialog>

    <!-- Deliver order confirmation dialog -->
    <v-dialog v-model="showDeliverDialog" transition="fade-transition" width="420">
      <v-card class="delete-confirm-card">
        <!-- Dialog header -->
        <div class="delete-dialog-header deliver-header">
          <div class="delete-icon-wrap">
            <span class="mdi mdi-truck-delivery-outline delete-icon"></span>
          </div>
        </div>

        <!-- Dialog body -->
        <div class="delete-dialog-body">
          <h3 class="delete-dialog-title">Mark as Delivered?</h3>

          <p class="delete-dialog-msg">
            Are you sure you want to mark this order as delivered? This will update the fuel stock
            at the station.
          </p>
        </div>

        <!-- Dialog actions -->
        <div class="delete-dialog-actions">
          <button class="del-button del-cancel-btn" @click="showDeliverDialog = false">
            Cancel
          </button>

          <button class="del-button del-confirm-btn deliver-confirm-btn" @click="doDeliver">
            Mark Delivered
          </button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
/* Import Vue functions */
import { ref, onMounted } from 'vue'

/* Import components */
import AddOrderModal from './Order&Supply/Components/AddOrderModal.vue'
import OrdersTable from './Order&Supply/Components/OrdersTable.vue'
import ViewOrderModal from './Order&Supply/Components/ViewOrderModal.vue'

/* Import API modules */
import OrderManagement from '../../Api/Modules/OrderManagement'
import FuelStationManagement from '../../Api/Modules/FuelStationManagement'
import FuelTypeManagement from '../../Api/Modules/FuelTypeManagement'
import SupplierManagement from '../../Api/Modules/SupplierManagement'

/* Modal states */
const showAddOrderModal = ref(false)
const addOrderKey = ref(0)
const showViewOrderModal = ref(false)
const selectedOrder = ref({})

/* Confirmation dialog states */
const showApproveDialog = ref(false)
const showCancelDialog = ref(false)
const showDeliverDialog = ref(false)
const pendingActionId = ref(null)

/* Main order data */
const orders = ref([])

/* Order statistics */
const stats = ref({
  total: 0,
  approved: 0,
  delivered: 0,
})

/* Dropdown options */
const supplierOptions = ref([])
const stationOptions = ref([])
const fuelTypeOptions = ref([])

/* Load initial data */
onMounted(async () => {
  await Promise.all([fetchOrders(), fetchStats(), fetchDropdownOptions()])
})

/* Fetch all orders from API */
async function fetchOrders() {
  try {
    const res = await OrderManagement.getAllOrders()
    const raw = res.data?.data ?? res.data ?? []

    orders.value = (Array.isArray(raw) ? raw : []).map(mapOrder)
  } catch (err) {
    console.error('fetchOrders error:', err)
    orders.value = []
  }
}

/* Fetch order statistics */
async function fetchStats() {
  try {
    const [total, approved, delivered] = await Promise.all([
      OrderManagement.getTotalOrders(),
      OrderManagement.getApprovedOrdersCount(),
      OrderManagement.getDeliveredOrdersCount(),
    ])

    stats.value = {
      total: total.data?.total_orders ?? total.data?.data ?? total.data ?? 0,
      approved: approved.data?.approved_orders ?? approved.data?.data ?? approved.data ?? 0,
      delivered: delivered.data?.delivered_orders ?? delivered.data?.data ?? delivered.data ?? 0,
    }
  } catch (err) {
    console.error('fetchStats error:', err)
  }
}

/* Fetch supplier, station and fuel type dropdown data */
async function fetchDropdownOptions() {
  try {
    const stationRes = await FuelStationManagement.getAllFuelStations()
    const fuelRes = await FuelTypeManagement.getAllFuelTypes()
    const supplierRes = await SupplierManagement.getSuppliers()

    const rawStations = stationRes.data?.data ?? []
    const rawFuels = fuelRes.data?.data ?? []
    const rawSuppliers = supplierRes.data?.data ?? []

    stationOptions.value = rawStations.map((s) => ({
      id: s.station_id,
      name: s.station_name,
    }))

    fuelTypeOptions.value = rawFuels.map((f) => ({
      id: f.fuel_type_id,
      name: f.fuel_name,
    }))

    supplierOptions.value = rawSuppliers.map((s) => ({
      id: s.supplier_id,
      name: s.supplier_name,
    }))
  } catch (err) {
    console.error('fetchDropdownOptions error:', err)
  }
}

/* Convert backend order data to frontend format */
function mapOrder(o) {
  return {
    orderId: o.order_id,
    orderDisplay: `ORD-${String(o.order_id).padStart(4, '0')}`,
    supplier: o.supplier?.supplier_name ?? '-',
    station: o.station?.station_name ?? '-',
    fuelType: o.fuel_type?.fuel_type_name ?? o.fuel_type?.fuel_name ?? '-',
    qty: o.quantity_litres ?? 0,
    orderDate: formatDate(o.order_date),
    expectedDate: formatDate(o.expected_date),
    deliveryDate: o.delivery_date ? formatDate(o.delivery_date) : null,
    status: o.order_status ?? '-',
  }
}

/* Create new order */
async function createOrder(payload) {
  try {
    await OrderManagement.addOrder({
      supplier_id: payload.supplierId,
      station_id: payload.stationId,
      fuel_type_id: payload.fuelTypeId,
      quantity_litres: Number(payload.quantity),
      expected_date: payload.expectedDate,
    })

    await fetchOrders()
    await fetchStats()
  } catch (err) {
    console.error('createOrder error:', err)
  }
}

/* Update order status */
async function updateOrderStatus(orderId, action) {
  try {
    if (action === 'approved') {
      await OrderManagement.approveOrder(orderId)
    }

    if (action === 'cancelled') {
      await OrderManagement.cancelOrder(orderId)
    }

    if (action === 'delivered') {
      await OrderManagement.deliverOrder(orderId)
    }

    await fetchOrders()
    await fetchStats()
  } catch (err) {
    console.error(`updateOrderStatus(${action}) error:`, err)
  }
}

/* Open approve confirmation dialog */
function openApproveDialog(orderId) {
  pendingActionId.value = orderId
  showApproveDialog.value = true
}

/* Open cancel confirmation dialog */
function openCancelDialog(orderId) {
  pendingActionId.value = orderId
  showCancelDialog.value = true
}

/* Open deliver confirmation dialog */
function openDeliverDialog(orderId) {
  pendingActionId.value = orderId
  showDeliverDialog.value = true
}

/* Confirm approve action */
async function doApprove() {
  await updateOrderStatus(pendingActionId.value, 'approved')
  showApproveDialog.value = false
  pendingActionId.value = null
}

/* Confirm cancel action */
async function doCancel() {
  await updateOrderStatus(pendingActionId.value, 'cancelled')
  showCancelDialog.value = false
  pendingActionId.value = null
}

/* Confirm deliver action */
async function doDeliver() {
  await updateOrderStatus(pendingActionId.value, 'delivered')
  showDeliverDialog.value = false
  pendingActionId.value = null
}

/* Open view order modal */
function openViewOrder(order) {
  selectedOrder.value = { ...order }
  showViewOrderModal.value = true
}

/* Close view order modal */
function closeViewOrder() {
  showViewOrderModal.value = false
  selectedOrder.value = {}
}

/* Open add order modal */
async function openAddOrder() {
  await fetchDropdownOptions()
  addOrderKey.value++
  showAddOrderModal.value = true
}

/* Pad number with leading zero */
function pad(value) {
  return String(value ?? 0).padStart(2, '0')
}

/* Format date as DD/MM/YYYY */
function formatDate(value) {
  if (!value) return ''

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
  }

  const date = value instanceof Date ? value : new Date(value)

  if (isNaN(date.getTime())) {
    return value
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
</script>

<style scoped>
/* Orders page container */
.orders-page-container {
  width: 100%;
}

/* Top actions section */
.orders-top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  min-height: 41px;
}

/* Add order button */
.add-order-btn {
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
  transition: opacity 0.2s;
}

/* Add order button hover */
.add-order-btn:hover {
  opacity: 0.9;
}

/* Statistics row */
.orders-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 27px;
}

/* Statistics card */
.stat-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
  min-height: 80px;
}

/* Top gradient bar */
.gradient-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  border-radius: 11px 11px 0 0;
}

/* Statistics content */
.stat-content {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Statistics number */
.stat-number {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #1a1a1a;
  line-height: 1;
}

/* Statistics label */
.stat-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #7a7974;
}

/* Mobile statistics layout */
@media (max-width: 900px) {
  .orders-stats-row {
    grid-template-columns: 1fr;
  }
}

/* Confirmation dialog card */
.delete-confirm-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}

/* Dialog header */
.delete-dialog-header {
  height: 70px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
  border-bottom: 1px solid rgba(220, 53, 69, 0.2);
}

/* Approve dialog header */
.delete-dialog-header.approve-header {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
  border-bottom-color: rgba(40, 167, 69, 0.2);
}

/* Deliver dialog header */
.delete-dialog-header.deliver-header {
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
  border-bottom-color: rgba(0, 123, 255, 0.2);
}

/* Dialog icon wrapper */
.delete-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(220, 53, 69, 0.1);
}

/* Approve icon wrapper */
.delete-dialog-header.approve-header .delete-icon-wrap {
  background: rgba(40, 167, 69, 0.1);
}

/* Deliver icon wrapper */
.delete-dialog-header.deliver-header .delete-icon-wrap {
  background: rgba(0, 123, 255, 0.1);
}

/* Dialog icon */
.delete-icon {
  font-size: 24px;
  color: #dc3545;
}

/* Approve dialog icon */
.delete-dialog-header.approve-header .delete-icon {
  color: #28a745;
}

/* Deliver dialog icon */
.delete-dialog-header.deliver-header .delete-icon {
  color: #007bff;
}

/* Dialog body */
.delete-dialog-body {
  padding: 24px 20px;
  text-align: center;
}

/* Dialog title */
.delete-dialog-title {
  margin: 0 0 8px 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
}

/* Dialog message */
.delete-dialog-msg {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* Dialog action buttons */
.delete-dialog-actions {
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
  border-top: 1px solid #e5e7eb;
}

/* Common dialog button */
.del-button {
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

/* Cancel button */
.del-cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

/* Cancel button hover */
.del-cancel-btn:hover {
  background: #e5e7eb;
}

/* Confirm button */
.del-confirm-btn {
  background: #dc3545;
  color: white;
}

/* Confirm button hover */
.del-confirm-btn:hover {
  background: #bb2d3b;
  opacity: 0.9;
}

/* Approve confirm button */
.del-confirm-btn.approve-confirm-btn {
  background: #28a745;
}

/* Approve confirm button hover */
.del-confirm-btn.approve-confirm-btn:hover {
  background: #218838;
}

/* Deliver confirm button */
.del-confirm-btn.deliver-confirm-btn {
  background: #007bff;
}

/* Deliver confirm button hover */
.del-confirm-btn.deliver-confirm-btn:hover {
  background: #0056b3;
}
</style>

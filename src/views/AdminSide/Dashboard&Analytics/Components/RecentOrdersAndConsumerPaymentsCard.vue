<template>
  <!-- GRID WRAPPER FOR BOTH CARDS -->
  <div class="recent-cards-grid">
    <!--RECENT ORDERS CARD -->
    <div class="recent-card">
      <!-- Card Header -->
      <div class="recent-card__header">
        <h3 class="recent-card__title">Recent Orders</h3>

        <!-- Navigate to full orders page -->
        <button class="recent-card__button" @click="$router.push('/admin/orderandsupply')">
          View All
        </button>
      </div>

      <!-- Orders Table -->
      <div class="table-scroll-wrap">
        <table class="recent-table recent-table--orders">
        <!-- Table Header -->
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Supplier</th>
            <th>Fuel Type</th>
            <th>QTY(L)</th>
            <th>Status</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <!-- Loop through recent orders -->
          <tr v-for="order in recentOrders" :key="order.id">
            <!-- Order ID (no wrap) -->
            <td class="cell-order-id">{{ order.orderId }}</td>

            <!-- Supplier name -->
            <td>{{ order.supplier }}</td>

            <!-- Fuel type (no wrap) -->
            <td class="cell-fuel-type">{{ order.fuelType }}</td>

            <!-- Quantity formatted -->
            <td>{{ formatNumber(order.quantity) }}</td>

            <!-- Status with dynamic styling -->
            <td>
              <span class="status-pill" :class="statusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>

    <!-- RECENT CONSUMER PAYMENTS CARD  -->
    <div class="recent-card">
      <!-- Card Header -->
      <div class="recent-card__header">
        <h3 class="recent-card__title">Recent Consumer Payments</h3>

        <!-- Navigate to payments page -->
        <button class="recent-card__button" @click="$router.push('/admin/consumerpayments')">
          View All
        </button>
      </div>

      <!-- Payments Table -->
      <div class="table-scroll-wrap">
        <table class="recent-table recent-table--payments">
        <!-- Table Header -->
        <thead>
          <tr>
            <th>Consumer</th>
            <th>Amount(LKR)</th>
            <th>Fuel Type</th>
            <th>Date</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <!-- Loop through recent payments -->
          <tr v-for="payment in recentPayments" :key="payment.id">
            <!-- Consumer name (ellipsis overflow) -->
            <td class="cell-consumer">{{ payment.consumer }}</td>

            <!-- Amount formatted -->
            <td class="amount-cell">
              {{ formatNumber(payment.amount) }}
            </td>

            <!-- Fuel type -->
            <td class="cell-fuel-type">{{ payment.fuelType }}</td>

            <!-- Date formatted -->
            <td>{{ payment.date }}</td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recentOrders: Array,
    recentPayments: Array,
  },

  methods: {
    formatNumber(val) {
      return Number(val || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    formatDate(value) {
      if (!value) return '—'

      const date = new Date(String(value))

      if (isNaN(date.getTime())) return '—'

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    },

    statusClass(status) {
      const s = String(status || '')

      if (s === 'Pending') return 'status-pending'
      if (s === 'Approved') return 'status-approved'
      if (s === 'Delivered') return 'status-delivered'
      if (s === 'Completed') return 'status-delivered'

      return 'status-pending'
    },
  },
}
</script>
<style scoped>

/* Recent Cards Grid */
.recent-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

@media (max-width: 1024px) {
  .recent-cards-grid {
    grid-template-columns: 1fr;
  }
}

/* Card Container */
.recent-card {
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
}

/* Card Header */
.recent-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 18px;
  height: 68px;
}

/* Card Title */
.recent-card__title {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

/* View All Button */
.recent-card__button {
  border: 1.5px solid #d44335;
  border-radius: 16px;
  padding: 6px 16px;
  background: transparent;
  color: #444444;
  cursor: pointer;
}

/* Table Wrapper */
.table-scroll-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Main Table */
.recent-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 600px;
}

/* Table Header */
.recent-table thead {
  background: #fbe6e6;
}

/* Table Cells */
.recent-table th,
.recent-table td {
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid #ebc7c5;
  text-align: left;
  vertical-align: middle;
  color: #000000;
}

/* Table Header Text */
.recent-table th {
  font-weight: 500;
}

/* Last Row */
.recent-table tbody tr:last-child td {
  border-bottom: none;
}

/* Orders Table Column Widths */
.recent-table--orders th:nth-child(1),
.recent-table--orders td:nth-child(1) {
  width: 20%;
}

.recent-table--orders th:nth-child(2),
.recent-table--orders td:nth-child(2) {
  width: 23%;
}

.recent-table--orders th:nth-child(3),
.recent-table--orders td:nth-child(3) {
  width: 21%;
}

.recent-table--orders th:nth-child(4),
.recent-table--orders td:nth-child(4) {
  width: 16%;
}

.recent-table--orders th:nth-child(5),
.recent-table--orders td:nth-child(5) {
  width: 20%;
}

/* Payments Table Column Widths */
.recent-table--payments th:nth-child(1),
.recent-table--payments td:nth-child(1) {
  width: 38%;
}

.recent-table--payments th:nth-child(2),
.recent-table--payments td:nth-child(2) {
  width: 30%;
}

.recent-table--payments th:nth-child(3),
.recent-table--payments td:nth-child(3) {
  width: 25%;
}

.recent-table--payments th:nth-child(4),
.recent-table--payments td:nth-child(4) {
  width: 24%;
}

/* Table Cell Formatting */
.cell-order-id {
  white-space: nowrap;
}

.cell-fuel-type {
  white-space: nowrap;
}

.cell-consumer {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 24px;
}

.amount-cell {
  font-weight: 700;
  white-space: nowrap;
  padding-left: 20px;
}

/* Status Badges */
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 67px;
  height: 20px;
  padding: 0 12px;
  border-radius: 11px;
  font-size: 8px;
  line-height: 10px;
  font-weight: 600;
  white-space: nowrap;
}

/* Pending Status */
.status-pending {
  background: #f9cdc7;
  color: #d06054;
}

/* Approved Status */
.status-approved {
  background: rgba(66, 201, 91, 0.24);
  color: #3b3098;
}

/* Delivered Status */
.status-delivered {
  background: #c7eac7;
  color: #2e9c4d;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .recent-cards-grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .recent-card {
    width: 100%;
    overflow-x: auto;
  }

  .recent-card__header {
    padding: 16px;
    height: auto;
  }

  .recent-card__title {
    font-size: 16px;
    line-height: 22px;
  }

  .recent-card__button {
    min-width: 68px;
    padding: 6px 14px;
  }

  .recent-table {
    min-width: 520px;
  }

  .recent-table th,
  .recent-table td {
    padding: 12px 14px;
    font-size: 13px;
  }
}
</style>
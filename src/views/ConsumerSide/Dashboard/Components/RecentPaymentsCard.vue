<template>
  <!-- Recent Payments Card -->
  <div class="card">
    <!-- Card Header -->
    <div class="card-head">
      <span class="card-title">Recent Payments</span>

      <!-- View All Button -->
      <button class="btn btn-outline btn-sm" @click="$emit('view-all')">View all</button>
    </div>

    <!-- Card Body -->
    <div class="card-body np">
      <!-- Payments Table -->
      <table v-if="payments.length" class="tbl">
        <!-- Table Header -->
        <thead>
          <tr>
            <th>Date</th>
            <th>Fuel</th>
            <th>Amount (LKR)</th>
            <th>Status</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td>{{ payment.date }}</td>
            <td>{{ payment.fuelDescription }}</td>
            <td class="tbl-num">{{ formatAmount(payment.amount) }}</td>

            <!-- Payment Status -->
            <td>
              <span class="badge" :class="statusBadge(payment.status)">
                {{ payment.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>

        <p>No payments yet</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'RecentPaymentsCard',

  // Events sent to parent component
  emits: ['view-all'],

  // Props received from parent component
  props: {
    payments: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    // Return badge class based on payment status
    statusBadge(status) {
      const map = {
        Paid: 'badge-success',
        Pending: 'badge-warn',
        Failed: 'badge-danger',
      }

      return map[status] || 'badge-neutral'
    },

    // Format payment amount with two decimal places
    formatAmount(val) {
      return Number(val || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
  },
}
</script>

<style scoped>
/* Main card container */
.card {
  background: #ffffff;
  border-radius: 11px;
  border: 1px solid #820000;
  box-shadow:
    0 2px 8px rgba(123, 30, 43, 0.07),
    0 8px 28px rgba(123, 30, 43, 0.08);
  overflow: hidden;
}

/* Card header */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e8d8cc;
}

/* Card title */
.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #2a1a1e;
}

/* Payments table */
.tbl {
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
}

/* Table header cells */
.tbl th {
  font-size: 0.7rem;
  font-weight: 700;
  color: #b89fa5;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.75rem 1rem;
  background: #f7ede0;
  text-align: left;
  border-bottom: 1px solid #e8d8cc;
}

/* Table data cells */
.tbl td {
  font-size: 0.8rem;
  color: #2a1a1e;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e8d8cc;
}

/* Remove border from last table row */
.tbl tr:last-child td {
  border-bottom: none;
}

/* Table row hover effect */
.tbl tr:hover td {
  background: #fdf9f6;
}

/* Numeric table value */
.tbl-num {
  font-variant-numeric: tabular-nums lining-nums;
  font-weight: 600;
}

/* Status badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

/* Success badge */
.badge-success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #86efac;
}

/* Warning badge */
.badge-warn {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fcd34d;
}

/* Danger badge */
.badge-danger {
  background: #fdf0ee;
  color: #c0392b;
  border: 1px solid #f5b8b2;
}

/* Neutral badge */
.badge-neutral {
  background: #f7ede0;
  color: #7a5c62;
  border: 1px solid #e8d8cc;
}

/* Empty state container */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1rem;
  gap: 0.75rem;
  color: #b89fa5;
  text-align: center;
}

/* Empty state icon */
.empty-state svg {
  width: 36px;
  height: 36px;
  opacity: 0.35;
}

/* Empty state text */
.empty-state p {
  font-size: 0.8rem;
  color: #7a5c62;
}

/* Common button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 7px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  border: none;
}

/* Small button */
.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
}

/* Outline button */
.btn-outline {
  background: transparent;
  color: #7b1e2b;
  border: 1px solid rgba(123, 30, 43, 0.5);
}

/* Outline button hover effect */
.btn-outline:hover {
  background: #f9eced;
  border-color: #7b1e2b;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .card-body.np {
    padding: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>

<template>
  <!-- Transactions Table Wrapper -->
  <div class="table-wrapper">

    <!-- Table Header -->
    <div class="table-header">
      <h3 class="table-title">All Transactions</h3>
    </div>

    <!-- Transactions Table -->
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Station</th>
          <th>Fuel type</th>
          <th>Quantity</th>
          <th>Amount (LKR)</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <!-- Transaction Rows -->
        <tr v-for="(tx, i) in filteredTransactions" :key="i">
          <td>{{ tx.date }}</td>
          <td>{{ tx.station }}</td>

          <td>
            <span :class="['fuel', tx.fuelClass]">
              {{ tx.fuelType }}
            </span>
          </td>

          <td>{{ tx.quantity }}</td>
          <td>{{ tx.amount }}</td>

          <td>
            <span class="status-paid">Paid</span>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="filteredTransactions.length === 0">
          <td colspan="6" class="no-results">
            No transactions found.
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  /* Component Name */
  name: 'MyPaymentsTable',

  /* Component Props */
  props: {
    payments: {
      type: Array,

      /* Default Empty Array */
      default: () => [],
    },
  },

  /* Component Data */
  data() {
    return {
      searchQuery: '',
    }
  },

  computed: {
    /* Format API Data For Table */
    transactions() {
      return this.payments.map((p) => {
        const fuelName =
          p.fuel_type?.fuel_name ||
          p.fuelType?.fuel_name ||
          p.fuel_name ||
          '-'

        return {
          date: this.formatDate(p.payment_date),

          station:
            p.station?.station_name ||
            p.fuel_station?.station_name ||
            p.station_name ||
            '-',

          fuelType: fuelName,
          fuelClass: this.getFuelClass(fuelName),

          quantity: `${p.quantity_litres} L`,

          amount: Number(p.amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),

          status: p.payment_status || 'paid',
        }
      })
    },

    /* Search Filter */
    filteredTransactions() {
      const q = this.searchQuery.trim().toLowerCase()

      if (!q) return this.transactions

      return this.transactions.filter(
        (tx) =>
          tx.date.toLowerCase().includes(q) ||
          tx.station.toLowerCase().includes(q) ||
          tx.fuelType.toLowerCase().includes(q) ||
          tx.quantity.toLowerCase().includes(q) ||
          tx.amount.includes(q),
      )
    },
  },

  methods: {
    /* Format Date */
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-GB')
    },

    /* Get Fuel Badge Class */
    getFuelClass(fuelName) {
      const name = String(fuelName).toLowerCase()

      if (name.includes('diesel')) return 'diesel'
      if (name.includes('95')) return 'petrol95'

      return 'petrol92'
    },
  },
}
</script>

<style scoped>
/* Table Wrapper */
.table-wrapper {
  background: #ffffff;
  border-radius: 11px;
  padding: 0;
  border: 1px solid #820000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Table Header */
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 14px 20px;
  flex-wrap: wrap;
  gap: 10px;
  border-bottom: 1px solid #e0d5cf;
}

/* Table Title */
.table-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Table */
table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  font-size: 13px;
}

/* Table Header Cells */
thead th {
  padding: 12px 20px;
  text-align: left;
  font-weight: 700;
  color: #000;
  border-bottom: 1px solid #e0d5cf;
  background: #fbe6e6;
  font-size: 16px;
}

/* Table Data Cells */
tbody td {
  padding: 12px 20px;
  color: #333;
  border-bottom: 1px solid #f0ebe5;
  font-size: 13px;
}

/* Table Row */
tbody tr {
  background: #ffffff;
}

/* Row Hover Effect */
tbody tr:hover {
  background: #faf8f5;
}

/* Remove Last Border */
tbody tr:last-child td {
  border-bottom: none;
}

/* Fuel Badge */
.fuel {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

/* Petrol Badges */
.petrol92,
.petrol95 {
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #f5b7b1;
}

/* Diesel Badge */
.diesel {
  background: #e8f4fd;
  color: #2471a3;
  border: 1px solid #aed6f1;
}

/* Paid Status Badge */
.status-paid {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  background: #e9f7ef;
  color: #1e8449;
  border: 1px solid #a9dfbf;
}

/* No Results Message */
.no-results {
  text-align: center;
  color: #bbb;
  padding: 20px;
  font-size: 13px;
}
</style>
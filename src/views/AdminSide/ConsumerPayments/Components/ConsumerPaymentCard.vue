<template>
  <!-- Payment Statistics Cards Row -->
  <div class="stats-row">
    <!-- Statistics Card -->
    <div class="stat-card" v-for="card in cards" :key="card.label">
      <!-- Top Gradient Bar -->
      <div class="gradient-bar" />

      <!-- Card Content -->
      <div class="stat-content">
        <!-- Card Label -->
        <p class="stat-label">{{ card.label }}</p>

        <!-- Card Value -->
        <p class="stat-number">{{ card.value }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'ConsumerPaymentCard',

  // Props received from parent component
  props: {
    payments: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    // Calculate total income from all payments
    totalIncome() {
      return this.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
    },

    // Count today's transactions
    transactionsToday() {
      const today = new Date().toLocaleDateString('en-GB')

      return this.payments.filter((p) => p.date === today).length
    },

    // Calculate current month income
    monthlyIncome() {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()

      return this.payments
        .filter((p) => {
          if (!p.date) return false

          const parts = p.date.split('/')

          return parts[1] === month && Number(parts[2]) === year
        })
        .reduce((sum, p) => sum + Number(p.amount || 0), 0)
    },

    // Statistics cards data
    cards() {
      return [
        {
          value: `LKR ${this.totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          label: 'Total Income',
        },
        {
          value: this.transactionsToday,
          label: 'Transactions Today',
        },
        {
          value: `LKR ${this.monthlyIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          label: 'This Month Income',
        },
      ]
    },
  },
}
</script>

<style scoped>
/* Statistics cards row */
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Statistics card */
.stat-card {
  flex: 1;
  min-width: 280px;
  background: #fff;
  border: 1px solid #820000;
  border-radius: 12px;
  padding: 20px 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Top gradient bar */
.gradient-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  border-radius: 12px 12px 0 0;
}

/* Card content container */
.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

/* Statistics label */
.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #7a7974;
  margin: 0;
  order: 2;
}

/* Statistics value */
.stat-number {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.72px;
  order: 1;
}
</style>

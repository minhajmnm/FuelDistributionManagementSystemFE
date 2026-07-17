<template>
  <!-- Payment Summary Cards -->
  <div class="cards">

    <!-- Total Payments Card -->
    <div class="card">
      <div class="card-bar bg-green"></div>

      <div class="card-icon icon-green">
        <span class="mdi mdi-cash"></span>
      </div>

      <div class="card-info">
        <h2>
          Rs
          {{
            Number(summary.total_payments || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </h2>
        <p>Total Payments</p>
      </div>
    </div>

    <!-- Total Transactions Card -->
    <div class="card">
      <div class="card-bar bg-orange"></div>

      <div class="card-icon icon-orange">
        <span class="mdi mdi-chart-line"></span>
      </div>

      <div class="card-info">
        <h2>{{ summary.transaction_count || 0 }}</h2>
        <p>Total Transactions</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  /* Component Name */
  name: 'MyPaymentsCard',

  /* Component Props */
  props: {
    summary: {
      type: Object,

      /* Default Summary Values */
      default: () => ({
        total_payments: 0,
        transaction_count: 0,
      }),
    },
  },
}
</script>

<style scoped>
/* Cards Container */
.cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

/* Individual Card */
.card {
  position: relative;
  flex: 1;
  min-width: 150px;
  background: #ffffff;
  border-radius: 11px;
  padding: 24px 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #820000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Top Gradient Bar */
.card-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

/* Green Gradient */
.bg-green {
  background: linear-gradient(90deg, #2e8b57, #66cdaa);
}

/* Red Gradient */
.bg-red {
  background: linear-gradient(90deg, #d64444, #ff6b6b);
}

/* Blue Gradient */
.bg-blue {
  background: linear-gradient(90deg, #2a6fbb, #6495ed);
}

/* Orange Gradient */
.bg-orange {
  background: linear-gradient(90deg, #e07b28, #ffa07a);
}

/* Card Icon */
.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

/* Green Icon */
.icon-green {
  background: #e6f4ec;
  color: #2e8b57;
}

/* Red Icon */
.icon-red {
  background: #fdecea;
  color: #d64444;
}

/* Blue Icon */
.icon-blue {
  background: #e6f0fb;
  color: #2a6fbb;
}

/* Orange Icon */
.icon-orange {
  background: #fff3e6;
  color: #e07b28;
}

/* Card Value */
.card-info h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e1e1e;
  margin: 0 0 3px;
}

/* Card Label */
.card-info p {
  font-size: 11px;
  color: #999;
  margin: 0;
}
</style>
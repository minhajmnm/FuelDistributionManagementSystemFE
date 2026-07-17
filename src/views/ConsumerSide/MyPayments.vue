<template>
  <!-- My Payments Page -->
  <div class="my-payments-view">

    <!-- Payment Summary Cards -->
    <MyPaymentsCard :summary="summary" />

    <!-- Payment Transactions Table -->
    <MyPaymentsTable :payments="payments" />

  </div>
</template>

<script>
/* Import Components */
import MyPaymentsCard from './MyPayments/Components/MyPaymentsCard.vue'
import MyPaymentsTable from './MyPayments/Components/Mypaymentstable.vue'

/* Import API Module */
import PaymentManagement from '@/Api/Modules/PaymentManagement.js'

export default {
  /* Component Name */
  name: 'MyPayments',

  /* Register Components */
  components: {
    MyPaymentsCard,
    MyPaymentsTable,
  },

  /* Component Data */
  data() {
    return {
      /* Consumer Payment Records */
      payments: [],

      /* Payment Summary Data */
      summary: {},
    }
  },

  computed: {
    /* Calculate Payment Summary */
    summary() {
      return {
        total_payments: this.payments.reduce(
          (sum, p) => sum + Number(p.amount || 0),
          0,
        ),

        transaction_count: this.payments.length,
      }
    },
  },

  /* Load Data When Component Mounts */
  async mounted() {
    /* Get Logged-in User */
    const user = JSON.parse(localStorage.getItem('user'))

    /* Get Consumer ID */
    const consumerId = user?.consumer_id

    /* Load Consumer Payments */
    const paymentRes =
      await PaymentManagement.getPaymentsByConsumer(consumerId)

    this.payments = paymentRes.data?.data ?? []

    /* Load Payment Summary */
    const summaryRes =
      await PaymentManagement.getConsumerPaymentSummary(consumerId)

    this.summary = summaryRes.data?.data ?? {}
  },
}
</script>

<style scoped>
/* My Payments Page Container */
.my-payments-view {
  padding: 24px;
}
</style>
import { api } from "../index";

export default {
    // Get all payments
    async getAllPayments() {
        return await api.get(`payments/getallpayments`)
    },

    // Get single payment by ID
    async getSinglePayment(id) {
        return await api.get(`payments/getsinglepayment/${id}`)
    },

    // Create new payment
    async createNewPayment(data) {
        return await api.post('payments/createnewpayment', data)
    },

    // Update payment status
    async updatePayment(id, data) {
        return await api.put(`payments/updatepayment/${id}`, data)
    },

    // Delete payment
    async deletePayment(id) {
        return await api.delete(`payments/deletepayment/${id}`)
    },

    // Get payments by consumer
    async getPaymentsByConsumer(consumerId) {
        return await api.get(`payments/getpaymentsbyconsumer/${consumerId}`)
    },

    // Get payment history
    async getPaymentHistory() {
        return await api.get('payments/getpaymenthistory')
    },

    // Get recent payments
    async getRecentPayments() {
        return await api.get('payments/getrecentpayments')
    },

    // Get consumer payment summary
    async getConsumerPaymentSummary(consumerId) {
        return await api.get(`payments/getconsumerpaymentsummary/${consumerId}`)
    },

    // Get total income
    async getTotalIncome() {
        return await api.get('payments/gettotalincome')
    },

    // Get monthly income
    async getMonthlyIncome() {
        return await api.get('payments/getmonthlyincome')
    },

    // Get today transactions
    async getTodayTransactions() {
        return await api.get('payments/gettodaytransactions')
    },

    // Get payment report
    async getPaymentReport() {
        return await api.get('payments/getpaymentreport')
    },
}

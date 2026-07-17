import { api } from '../index'

export default {
  // Get all orders
  async getAllOrders() {
    return await api.get('orders/getorders')
  },

  // Get single order by ID
  async getSingleOrder(orderId) {
    return await api.get(`orders/getorder/${orderId}`)
  },

  // Add a new order
  async addOrder(data) {
    return await api.post('orders/addorder', data)
  },

  // Update an existing order by ID (only pending orders)
  async updateOrder(orderId, data) {
    return await api.put(`orders/updateorder/${orderId}`, data)
  },

  // Delete an order by ID (only pending orders)
  async deleteOrder(orderId) {
    return await api.delete(`orders/deleteorder/${orderId}`)
  },

  // Approve an order by ID
  async approveOrder(orderId) {
    return await api.post(`orders/approveorder/${orderId}`)
  },

  // Cancel an order by ID
  async cancelOrder(orderId) {
    return await api.post(`orders/cancelorder/${orderId}`)
  },

  // Mark an order as delivered by ID
  async deliverOrder(orderId) {
    return await api.post(`orders/deliverorder/${orderId}`)
  },

  // Get total orders count — dashboard card
  async getTotalOrders() {
    return await api.get('orders/totalorders')
  },

  // Get approved orders count — dashboard card
  async getApprovedOrdersCount() {
    return await api.get('orders/approvedorders')
  },

  // Get delivered orders count — dashboard card
  async getDeliveredOrdersCount() {
    return await api.get('orders/deliveredorders')
  },

  // Get orders filtered by station ID
  async getOrdersByStation(stationId) {
    return await api.get(`orders/getorderbystation/${stationId}`)
  },

  // Search orders by keyword
  async searchOrders(keyword) {
    return await api.get('orders/searchorders', {
      params: { keyword },
    })
  },
}
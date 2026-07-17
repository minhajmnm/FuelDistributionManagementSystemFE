import { api } from '../index'

export default {
  // Get All Vehicles
  async getAllVehicles() {
    return await api.get('v1/vehicles/all')
  },

  // Search Vehicle
  async searchVehicle(search) {
    return await api.get('v1/vehicles/search', {
      params: { search },
    })
  },

  // Filter Vehicle Type
  async filterVehicleType(vehicleType) {
    return await api.get(`v1/vehicles/filter/${vehicleType}`)
  },

  // Get Vehicle Count
  async getVehicleCount() {
    return await api.get('v1/vehicles/count')
  },

  // Get Consumer Quotas
  getConsumerQuotas(consumerId) {
    return api.get(`/v1/quota/consumer/${consumerId}`)
  },

  // Get Quota By ID
  async getQuotaById(quotaId) {
    return await api.get(`v1/quota/${quotaId}`)
  },

  // Assign Quota By Vehicle
  async assignQuotaByVehicle(vehicleId, weeklyLimit) {
    return await api.post(`v1/quota/assign/vehicle/${vehicleId}`, {
      weekly_limit: weeklyLimit,
    })
  },

  // Reset All Quotas
  async resetAllQuotas() {
    return await api.post('v1/quota/reset')
  },
}

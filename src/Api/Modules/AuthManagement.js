import { api } from '../index'

export default {
  // Login
  login(data) {
    return api.post('auth/login', data)
  },

  // Logout
  logout() {
    return api.post('auth/logout')
  },

  // Register Consumer
  registerConsumer(data) {
    return api.post('consumer/registerconsumer', data)
  },

  // Get My Profile
  async getMyProfile() {
    return await api.get('consumer/profile')
  },

  // Update My Profile
  updateProfile(data) {
    return api.put('consumer/profile', data)
  },

  // Admin - Get All Consumers
  getAllConsumers() {
    return api.get('consumer/getallconsumers')
  },

  // Admin - Get Active Consumers
  async getActiveConsumers() {
  return await api.get('consumer/getactiveconsumers')
},
  

  // Get Consumer By ID
  getConsumerById(id) {
    return api.get(`consumer/getconsumerbyid/${id}`)
  },

  // Search Consumer
  searchConsumer(search) {
    return api.get('consumer/searchconsumer', {
      params: { search },
    })
  },

  // Filter by Status
  filterConsumerStatus(status) {
    return api.get(`consumer/filterconsumerstatus/${status}`)
  },

  // Filter by Vehicle Type
  filterVehicleType(vehicleType) {
    return api.get(`consumer/filtervehicletype/${vehicleType}`)
  },
  // Deactivate Consumer
  async deactivateConsumer(id) {
    return await api.put(`consumer/deactivateconsumer/${id}`)
  },

  // Activate Consumer
  async activateConsumer(id) {
    return await api.put(`consumer/activateconsumer/${id}`)
  },
  // Delete Consumer
  deleteConsumer(id) {
    return api.delete(`consumer/deleteconsumer/${id}`)
  },
}

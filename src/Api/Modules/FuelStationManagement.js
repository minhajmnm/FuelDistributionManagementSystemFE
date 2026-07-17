import { api } from '../index'  

export default {
  // Get all fuel stations
  async getAllFuelStations() {
    return await api.get('fuelstations/getfuelstations')
  },

  // Get single fuel station by ID
  async getSingleFuelStation(id) {
    return await api.get(`fuelstations/getfuelstation/${id}`)
  },

  // Add a new fuel station
  async addFuelStation(data) {
    return await api.post('fuelstations/addfuelstation', data)
  },

  // Update an existing fuel station by ID
  async updateFuelStation(id, data) {
    return await api.post(`fuelstations/updatefuelstation/${id}`, data)
  },

  // Delete a fuel station by ID
  async deleteFuelStation(id) {
    return await api.delete(`fuelstations/deletefuelstation/${id}`)
  },

  // Toggle fuel station status by ID
  async toggleFuelStationStatus(id) {
    return await api.post(`fuelstations/togglefuelstationstatus/${id}`)
  },

  // Get available fuel stations
  async getAvailableFuelStations() {
    return await api.get('fuelstations/available')
  },

  // Get low stock fuel stations
  async getLowStockStations() {
    return await api.get('fuelstations/lowstock')
  },

  // Get out of stock fuel stations
  async getOutOfStockStations() {
    return await api.get('fuelstations/outofstock')
  },

  // Get nearby fuel stations based on address
  async getNearbyStations(address) {
    return await api.get('fuelstations/nearby', {
      params: { address },
    })
  },
}

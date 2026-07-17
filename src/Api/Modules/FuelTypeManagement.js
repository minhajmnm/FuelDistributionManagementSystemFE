import { api } from '../index'  

export default {
  // Get all fuel types
  async getAllFuelTypes() {
    return await api.get('fueltypes/getfueltypes')
  },

  // Get single fuel type by ID
  async getSingleFuelType(id) {
    return await api.get(`fueltypes/getfueltype/${id}`)
  },

  // Add a new fuel type
  async addFuelType(data) {
    return await api.post("fueltypes/addfueltype", data)
  },

  // Update an existing fuel type by ID
  async updateFuelType(id, data) {
    return await api.post(`fueltypes/updatefueltype/${id}`, data)
  },

  // Delete a fuel type by ID
  async deleteFuelType(id) {
    return await api.delete(`fueltypes/deletefueltype/${id}`)
  },
}

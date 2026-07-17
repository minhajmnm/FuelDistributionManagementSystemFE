import { api } from '../index'

export default {
  // get all suppliers
  async getSuppliers() {
    return await api.get('suppliers/getsuppliers')
  },
  // store a new supplier
  async storeSupplier(payload) {
    return await api.post('suppliers/addsupplier', payload)
  },
  // get a specific supplier by ID
  async getSupplier(id) {
    return await api.get(`suppliers/getsupplier/${id}`)
  },
  // update a status of a supplier (active/deactive)
  async toggleSupplierStatus(id) {
    return await api.patch(`suppliers/togglestatus/${id}`)
  },
  // update a supplier's details
  async updateSupplier(id, payload) {
    return await api.post(`suppliers/updatesupplier/${id}`, payload)
  },
  // delete a supplier by ID
  async deleteSupplier(id) {
    return await api.delete(`suppliers/deletesupplier/${id}`)
  },
}

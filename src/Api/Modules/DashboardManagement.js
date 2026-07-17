import { api } from '../index'

export default {
  // Summary Cards
  // Get summary stats (total consumers, stations, orders, low stock alerts)
  async getSummaryStats() {
    return await api.get('dashboard/getsummarystats')
  },

  // Get total fuel dispensed in litres
  async getTotalFuelDispensed(params = {}) {
  return api.get('dashboard/gettotalfueldispensed', { params })
  },

  // Get total revenue from paid payments
  async getTotalRevenue(params = {}) {
  return api.get('dashboard/gettotalrevenue', { params })
},


  // Get total unique consumers served
  async getTotalConsumersServed(params = {}) {
  return api.get('dashboard/gettotalconsumersserved', { params })
  },

  // Get active fuel stations for dropdown filters
  async getActiveStations() {
    return await api.get('dashboard/getactivestations')
  },

  // Chart Data
  // Get daily fuel usage chart data (?days=7 or ?days=30)
  async getDailyFuelUsage(params = {}) {
  return api.get('dashboard/getdailyfuelusage', { params })
  },

  // Get daily queue statistics chart data (?days=7 or ?days=30)
  async getDailyQueueStats(params = {}) {
  return api.get('dashboard/getdailyqueuestats', { params })

  },

  // Table Data
  // Get recent orders
  async getRecentOrders() {
    return await api.get('dashboard/getrecentorders')
  },

  // Get station fuel stock overview
  async getStationStockOverview() {
    return await api.get('dashboard/getstationstockoverview')
  },

  // Get queue summary stats
  async getQueueSummary(params = {}) {
  return api.get('dashboard/getqueuesummary', { params })
},
  

  // Get recent consumer payments
  async getRecentPayments() {
    return await api.get('dashboard/getrecentpayments')
  },

  //Reports
  // Get fuel usage report (?from=YYYY-MM-DD&to=YYYY-MM-DD)
  async getFuelUsageReport(from, to) {
    return await api.get('dashboard/getfuelusagereport', {
      params: { from, to },
    })
  },

  // Get queue statistics report (?from=YYYY-MM-DD&to=YYYY-MM-DD)
  async getQueueStatsReport(from, to) {
    return await api.get('dashboard/getqueuestatsreport', {
      params: { from, to },
    })
  },
}

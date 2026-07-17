/**
 * @module QueueManagement
 * @description API module for managing consumer queues, joining, leaving, serving, and viewing queue analytics.
 */
import { api } from '../index'

export default {
  /**
   * Retrieves the queue list for a specific station (typically for Admin dashboard).
   * @param {number|string} stationId - ID of the fuel station.
   * @returns {Promise<Object>} The API response with queues array.
   */
  getQueues(stationId) {
    return api.get('/v1/queuemanagements', { params: { station_id: stationId } })
  },

  /**
   * Consumer joins a specific queue at a station.
   * @param {Object} data - The queue join payload.
   * @param {number} data.station_id - ID of the fuel station.
   * @param {number} data.consumer_id - ID of the consumer joining.
   * @param {number} data.vehicle_id - ID of the consumer's vehicle.
   * @param {number} data.fuel_type_id - ID of the fuel type selected.
   * @returns {Promise<Object>} The API response with queue token details.
   */
  joinQueue(data) {
    return api.post('/v1/queuemanagements/join', data)
  },


/**   * Retrieves the current active queue token or details for a specific consumer.
   * @param {number|string} consumerId - ID of the consumer.
   * @returns {Promise<Object>} The API response with current queue details for the consumer.
   */ 
    getCurrentQueue(consumerId) {
    return api.get(`/v1/queue/current-queue/${consumerId}`)
  },

  /**
   * Refreshes a queue token to obtain updated queue status.
   * @param {number|string} id - The queue ID.
   * @returns {Promise<Object>} The API response with refreshed queue details.
   */
  refreshQueue(id) {
    return api.get(`/v1/queuemanagements/${id}/refresh`)
  },

  /**
   * Allows a consumer to exit the queue early.
   * @param {number|string} id - The queue ID to leave.
   * @returns {Promise<Object>} The API response confirming queue exit.
   */
  leaveQueue(id) {
    return api.patch(`/v1/queuemanagements/${id}/leave`)
  },

  /**
   * Marks a queue token as served (typically by station operators).
   * @param {number|string} id - The queue ID.
   * @returns {Promise<Object>} The API response with updated queue details.
   */
  serveConsumer(id) {
    return api.patch(`/v1/queuemanagements/${id}/serve`)
  },

  /**
   * Marks a queue token as skipped (typically by station operators).
   * @param {number|string} id - The queue ID.
   * @returns {Promise<Object>} The API response with updated queue details.
   */
  skipConsumer(id) {
    return api.patch(`/v1/queuemanagements/${id}/skip`)
  },

  /**
   * Retrieves queue statistics (e.g., waiting, served, skipped counts) for a station.
   * @param {number|string} stationId - ID of the fuel station.
   * @returns {Promise<Object>} The API response containing queue status counts.
   */
  getQueueStats(stationId) {
    return api.get('/v1/queuemanagements/stats', { params: { station_id: stationId } })
  },

  /**
   * Retrieves a list of available stations.
   * @returns {Promise<Object>} The API response with available stations.
   */
  getAvailableStations() {
    return api.get('/v1/queuemanagements/stations')
  },

  getConsumerQuotas(consumerId) {
  return api.get(`/v1/fuelquotas/consumer/${consumerId}`)
},
}

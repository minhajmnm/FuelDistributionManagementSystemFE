import { api } from '../index'

export default {
  // Get all notifications
  async getAllNotifications() {
    return await api.get('notification/getallnotifications')
  },

  // Get notification by ID
  async getNotificationById(id) {
    return await api.get(`notification/getnotificationbyid/${id}`)
  },

  // Get consumer notification by consumer id
  async getConsumerNotifications(consumerId) {
  return await api.get(`notification/${consumerId}`)
},


  // Get unread count
  async getUnreadCount() {
    return await api.get('notification/getunreadcount')
  },

  // Mark notification as read
  async markAsRead(id) {
    return await api.patch(`notification/markasread/${id}`)
  },
}

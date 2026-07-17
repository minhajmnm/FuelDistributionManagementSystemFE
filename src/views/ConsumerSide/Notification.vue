<template>
  <!-- MAIN CONTAINER -->
  <v-container fluid class="notification-page pa-6">
    <!-- HEADER -->
    <div class="d-flex justify-end header-section">
      <!-- MARK ALL READ BUTTON -->
      <v-btn variant="outlined" color="red-darken-2" class="mark-btn" @click="markAllRead">
        Mark all read
      </v-btn>
    </div>

    <!-- NOTIFICATION WRAPPER -->
    <v-card class="pa-4 notification-wrapper">
      <!-- NOTIFICATION LIST -->
      <div class="notification-list">
        <!-- NOTIFICATION CARD -->
        <NotificationCard
          v-for="item in notifications"
          :key="item.notification_id"
          :title="item.title"
          :message="item.message"
          :time="item.created_at"
          :icon="item.icon"
          :isRead="!!item.read_at"
          @click="markNotificationRead(item)"
        />
      </div>
    </v-card>
  </v-container>
</template>

<script>
// Import notification card component
import NotificationCard from './Notifications/Components/NotificationCard.vue'

// Import notification API
import NotificationManagement from '@/Api/Modules/NotificationManagement'

import WelcomeIcon from '@/assets/images/Notification images/Welcome to FuelFlow Lanka.png'
import QueueIcon from '@/assets/images/Notification images/Queue update.png'
import PaymentIcon from '@/assets/images/Notification images/Payment confirmed.png'

export default {
  // Register components
  components: {
    NotificationCard,
  },

  data() {
    return {
      // Notification list from database
      notifications: [],
    }
  },

  // Load notifications when page opens
  async mounted() {
    await this.loadNotifications()
  },

  methods: {
    // Load all notifications
    async loadNotifications() {
      try {
        // Call backend API
        const user = JSON.parse(localStorage.getItem('user'))
        const consumerId = user?.consumer_id

        const response = await NotificationManagement.getConsumerNotifications(consumerId)

        // Store notifications

        this.notifications = response.data.data.map((item) => ({
          ...item,
          icon: this.getNotificationIcon(item.notification_type),
        }))
      } catch (error) {
        console.error('Error loading notifications', error)
      }
    },

// Mark notification as read
    async markNotificationRead(notification) {
  try {
    if (!notification.read_at) {
      await NotificationManagement.markAsRead(
        notification.notification_id
      )

      notification.read_at = new Date()
    }
  } catch (error) {
    console.error('Error marking notification as read', error)
  }
},

    // Mark all notifications as read
    async markAllRead() {
      try {
        // Loop notifications
        for (const notification of this.notifications) {
          // Mark as read
          await NotificationManagement.markAsRead(notification.notification_id)
        }

        // Reload notifications
        await this.loadNotifications()
      } catch (error) {
        console.error('Error marking notifications', error)
      }
    },

    getNotificationIcon(type) {
      switch (type) {
        case 'welcome':
          return WelcomeIcon

        case 'queue_joined':
          return QueueIcon

        case 'queue_served':
          return QueueIcon

        case 'payment_confirmed':
          return PaymentIcon

        default:
          return WelcomeIcon
      }
    },
  },
}
</script>

<style scoped>
/* MAIN PAGE */

.notification-page {
  width: 100%;

  overflow-x: hidden;
}

/* HEADER */

.header-section {
  padding-right: 12px;

  margin-bottom: 16px;
}

/* BUTTON */

.mark-btn {
  margin-top: 4px;
}

/* WRAPPER */

.notification-wrapper {
  width: 100%;

  border-radius: 12px;
}

/* LIST */

.notification-list {
  display: flex;

  flex-direction: column;

  gap: 14px;
}

/* LARGE SCREEN */

@media (max-width: 1200px) {
  .notification-wrapper {
    width: 100%;
  }
}

/* TABLET */

@media (max-width: 992px) {
  .notification-page {
    padding: 20px !important;
  }
}

/* MOBILE */

@media (max-width: 768px) {
  .notification-page {
    padding: 14px !important;
  }

  .header-section {
    padding-right: 0;

    margin-bottom: 14px;
  }

  .mark-btn {
    font-size: 12px;
  }

  .notification-list {
    gap: 12px;
  }
}

/* SMALL MOBILE */

@media (max-width: 480px) {
  .notification-page {
    padding: 10px !important;
  }

  .notification-wrapper {
    border-radius: 10px;
  }

  .mark-btn {
    min-width: auto;

    padding: 0 12px;

    font-size: 11px;
  }
}
</style>

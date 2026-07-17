<template>
  <!-- CARD -->
  <v-card class="pa-4 notification-card" elevation="1" :class="{ 'unread-card': !isRead }"   @click="$emit('click')"
>
    <!-- FLEX -->
    <div class="d-flex align-start ga-3 notification-content">
      <!-- ICON -->
      <img :src="icon" class="notification-icon" />

      <!-- TEXT AREA -->
      <div class="text-wrapper">
        <div class="notification-text">
          <strong>{{ title }}</strong>
          <span> : {{ message }}</span>
        </div>

        <!-- TIME -->
        <div class="notification-time">
          {{ formattedTime }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  // props
  props: {
    title: String,

    message: String,

    time: String,

    icon: String,

    isRead: Boolean,
  
  },
 
  emits: ['click'],
  
  computed: {
    formattedTime() {
      if (!this.time) return ''

      return new Date(this.time).toLocaleString('en-LK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    },
  },
}
</script>

<style scoped>
/* CARD */

.notification-card {
  width: 100%;

  border-radius: 12px;

  overflow: hidden;
}

/* UNREAD */

.unread-card {
  background-color: #f5faff;

  border-left: 4px solid #1976d2;
}

/* FLEX CONTENT */

.notification-content {
  width: 100%;
}

/* TEXT WRAPPER */

.text-wrapper {
  width: 100%;

  min-width: 0;
}

/* ICON */

.notification-icon {
  width: 41px;

  height: 41px;

  border-radius: 7px;

  object-fit: cover;

  flex-shrink: 0;
}

/* TEXT */

.notification-text {
  font-size: 15px;

  color: #000000;

  line-height: 22px;

  word-break: break-word;
}

.notification-text strong {
  font-weight: 700;
  color: #111111;
}

/* TIME */

.notification-time {
  font-size: 12px;

  color: gray;

  margin-top: 4px;
}

/* TABLET */

@media (max-width: 992px) {
  /* text */
  .notification-text {
    font-size: 14px;
  }
}

/* MOBILE */

@media (max-width: 768px) {
  /* card */
  .notification-card {
    padding: 14px !important;
  }

  /* icon */
  .notification-icon {
    width: 38px;

    height: 38px;
  }

  /* text */
  .notification-text {
    font-size: 13px;

    line-height: 20px;
  }

  /* time */
  .notification-time {
    font-size: 11px;
  }
}

/* SMALL MOBILE */

@media (max-width: 480px) {
  /* card */
  .notification-card {
    padding: 12px !important;
  }

  /* icon */
  .notification-icon {
    width: 34px;

    height: 34px;
  }

  /* text */
  .notification-text {
    font-size: 12px;

    line-height: 18px;
  }

  /* time */
  .notification-time {
    font-size: 10px;
  }
}
</style>

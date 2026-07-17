<template>
  <!-- Fuel Station Card -->
  <div class="station-card" :class="{ 'station-card--inactive': !isActive }">
    <!-- Station Header -->
    <div class="station-card__header">
      <!-- Station Information -->
      <div class="station-card__info">
        <h3 class="station-card__name">{{ station.name }}</h3>
        <p class="station-card__address">{{ station.address }}</p>
      </div>

      <!-- Station Status Badge -->
      <span
        class="station-card__status-badge"
        :class="isActive ? 'badge--active' : 'badge--inactive'"
      >
        <span class="badge-dot"></span>
        {{ isActive ? 'Active' : 'Deactive' }}
      </span>
    </div>

    <!-- Fuel Type Tags -->
    <div class="station-card__fuel-types">
      <span
        v-for="fuel in station.fuelTypes"
        :key="fuel"
        class="fuel-tag"
        :class="getFuelClass(fuel)"
      >
        {{ fuel }}
      </span>
    </div>

    <!-- Queue and Stock Details -->
    <div class="station-card__meta">
      <!-- Queue Details -->
      <div class="meta-item">
        <v-icon size="18" color="#999292">mdi-account-group</v-icon>
        <span class="meta-label">Queue :</span>
        <span class="meta-value" :class="getQueueClass()">
          {{
            station.myQueueStatus !== 'No Queue'
              ? station.myQueueStatus
              : station.queueCount > 0
                ? station.queueCount + ' Waiting'
                : 'No Queue'
          }}
        </span>
      </div>

      <!-- Stock Details -->
      <div class="meta-item">
        <v-icon size="18" color="#999292">mdi-cart</v-icon>
        <span class="meta-label">Stock :</span>
        <span class="meta-value" :class="getStockClass()">
          {{ !isActive ? 'Out of Stock' : station.stockStatus || 'Available' }}
        </span>
      </div>
    </div>

    <!-- Join Queue Button -->
    <button
      class="station-card__action-btn"
      :class="canJoinQueue ? 'btn--join' : 'btn--closed'"
      :disabled="!canJoinQueue"
      @click="handleJoinQueue"
    >
      <v-icon v-if="canJoinQueue" size="18" color="white">mdi-plus</v-icon>
      <v-icon v-else size="18" color="#7A7974">mdi-lock</v-icon>

      <span>{{ buttonText }}</span>
    </button>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'StationCard',

  // Props received from parent component
  props: {
    station: {
      type: Object,
      required: true,
    },
    remainingQuota: {
      type: [Number, String],
      default: 0,
    },
    weeklyLimit: {
      type: [Number, String],
      default: 0,
    },
  },

  computed: {
    // Check whether station is active
    isActive() {
      return this.station.status === 'active'
    },

    // Check whether consumer can join queue
    canJoinQueue() {
      return (
        this.isActive &&
        Number(this.remainingQuota) > 0 &&
        !['Waiting', 'Served'].includes(this.station.myQueueStatus)
      )
    },
    // Dynamic button text
    buttonText() {
      if (!this.isActive) {
        return 'Station Closed'
      }

      if (Number(this.remainingQuota) === 0) {
        return 'Quota Not Assigned'
      }

      if (Number(this.remainingQuota) < 0) {
        return 'Weekly Quota Completed'
      }

      if (this.station.myQueueStatus === 'Waiting' || this.station.myQueueStatus === 'Served') {
        return 'Already in Queue'
      }

      return 'Join Queue at this Station'
    },
  },

  methods: {
    // Return fuel tag class based on fuel type
    getFuelClass(fuel) {
      const f = String(fuel).toLowerCase().replace(/\s+/g, '')

      if (f.includes('92')) return 'fuel-tag--petrol92'
      if (f.includes('diesel')) return 'fuel-tag--diesel'
      if (f.includes('95')) return 'fuel-tag--petrol95'

      return 'fuel-tag--petrol92'
    },

    // Return queue status text class
    getQueueClass() {
      if (this.station.myQueueStatus === 'Waiting') {
        return 'text--waiting'
      }

      if (this.station.myQueueStatus === 'Served') {
        return 'text--available'
      }

      return 'text--closed'
    },

    // Return stock status text class
    getStockClass() {
      if (!this.isActive) return 'text--outstock'

      return this.station.stockStatus === 'Out of Stock' ? 'text--outstock' : 'text--available'
    },

    // Emit join queue event to parent component
    handleJoinQueue() {
      if (this.canJoinQueue) {
        this.$emit('join-queue', this.station)
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@300;400;500;700&display=swap');

/* Station card container */
.station-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 18px 20px 22px;
  border: 1px solid #820000;
  border-radius: 11px;
  background: rgba(235, 204, 204, 0.17);
}

/* Station card header */
.station-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #7b1e2b;
}

/* Station name */
.station-card__name {
  margin: 0 0 4px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000;
}

/* Station address */
.station-card__address {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  color: #000;
}

/* Station status badge */
.station-card__status-badge {
  display: flex;
  align-items: center;
  gap: 4.8px;
  padding: 3.2px 10.4px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 11.2px;
  line-height: 14px;
}

/* Status badge dot */
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
}

/* Active status badge */
.badge--active {
  background: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.25);
  color: #16a34a;
}

/* Active status badge dot */
.badge--active .badge-dot {
  background: #16a34a;
}

/* Inactive status badge */
.badge--inactive {
  background: rgba(107, 114, 128, 0.1);
  border: 1px solid rgba(107, 114, 128, 0.25);
  color: #6b7280;
}

/* Inactive status badge dot */
.badge--inactive .badge-dot {
  background: #6b7280;
}

/* Fuel type tags container */
.station-card__fuel-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

/* Common fuel tag */
.fuel-tag {
  box-sizing: border-box;
  padding: 5px 16px;
  border-radius: 15px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
}

/* Petrol 92 tag */
.fuel-tag--petrol92 {
  background: rgba(253, 236, 236, 0.55);
  border: 1px solid #de2626;
  color: #de2626;
}

/* Diesel tag */
.fuel-tag--diesel {
  background: rgba(233, 239, 253, 0.55);
  border: 1px solid #c1d3f9;
  color: #2563eb;
}

/* Petrol 95 tag */
.fuel-tag--petrol95 {
  background: rgba(246, 238, 254, 0.55);
  border: 1px solid #a262f1;
  color: #9333ea;
}

/* Queue and stock meta section */
.station-card__meta {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 20px;
}

/* Meta item */
.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Meta label */
.meta-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  color: #999292;
}

/* Meta value */
.meta-value {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
}

/* Waiting text */
.text--waiting {
  color: #d97706;
}

/* Closed text */
.text--closed {
  color: #e14834;
}

/* Available text */
.text--available {
  color: #68a367;
}

/* Out of stock text */
.text--outstock {
  color: #dc262d;
}

/* Join queue action button */
.station-card__action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 7px 12px;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  transition: opacity 0.18s ease;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 29px;
}

/* Join button active state */
.btn--join {
  background: rgba(123, 30, 43, 0.93);
  color: #fff;
}

/* Join button hover */
.btn--join:hover {
  opacity: 0.85;
}

/* Disabled or closed button */
.btn--closed {
  background: rgba(240, 237, 232, 0.93);
  color: #7a7974;
  cursor: not-allowed;
}

/* Mobile responsive layout */
@media (max-width: 600px) {
  .station-card {
    padding: 14px 14px 18px;
  }

  .station-card__header {
    gap: 10px;
  }

  .station-card__name {
    font-size: 14px;
    line-height: 20px;
  }

  .station-card__address {
    font-size: 11px;
    line-height: 16px;
  }

  .station-card__status-badge {
    font-size: 10px;
    padding: 3px 8px;
  }

  .station-card__fuel-types {
    gap: 8px;
  }

  .fuel-tag {
    font-size: 11px;
    padding: 4px 12px;
  }

  .station-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .meta-item {
    width: 100%;
  }

  .station-card__action-btn {
    font-size: 14px;
    line-height: 24px;
    padding: 8px 10px;
  }
}
</style>

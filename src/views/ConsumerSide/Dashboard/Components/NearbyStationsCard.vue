<template>
  <v-card class="card" elevation="0">
    <!-- Card Header -->
    <div class="card-head">
      <!-- Card Title -->
      <span class="card-title">Nearby Stations</span>

      <!-- View All Button -->
      <button class="btn btn-outline btn-sm" @click="$emit('view-all')">View all</button>
    </div>

    <!-- Card Body -->
    <v-card-text class="card-body np">
      <!-- Station List -->
      <div class="station-list">
        <div
          v-for="station in stations"
          :key="station.id"
          class="station-row"
          @click="$emit('station-click', station)"
        >
          <!-- Station Information -->
          <div class="station-info">
            <div class="station-name">{{ station.name }}</div>
            <div class="station-addr">{{ station.address }}</div>
          </div>

          <!-- Station Stock Information -->
          <div class="station-stock">
            <div class="station-liters" :style="literColor(station.status)">
              {{ formatLiters(station.liters) }}
            </div>

            <div class="station-label">
              {{ stockLabel(station) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State Message -->
      <div v-if="!stations.length" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 22V8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v14" />
          <path d="M3 22h16" />
          <rect x="7" y="10" width="6" height="4" />
        </svg>

        <p>No stations found nearby</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // Component Name
  name: 'NearbyStationsCard',

  // Events emitted to parent component
  emits: ['view-all', 'station-click'],

  // Component Props
  props: {
    stations: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    /* Returns status dot class */
    statusClass(status) {
      return (
        {
          available: 'dot-available',
          low: 'dot-low',
          out: 'dot-out',
        }[status] || 'dot-available'
      )
    },

    /* Returns text color based on stock status */
    literColor(status) {
      if (status === 'low') return { color: '#b45309' }
      if (status === 'out') return { color: '#c0392b' }
      return {}
    },

    /* Returns stock label text */
    stockLabel(station) {
      if (station.status === 'out') return 'Out of stock'
      if (station.status === 'low') return 'Low stock'
      return station.fuelType
    },

    /* Formats litres with comma separator */
    formatLiters(val) {
      return val.toLocaleString() + ' L'
    },
  },
}
</script>

<style scoped>
/* ==================================================
   Main Card Container
================================================== */
.card {
  background: #ffffff;
  border-radius: 11px;
  border: 1px solid #820000;
  box-shadow:
    0 2px 8px rgba(123, 30, 43, 0.07),
    0 8px 28px rgba(123, 30, 43, 0.08);
  overflow: hidden;
}

/* ==================================================
   Card Header
================================================== */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e8d8cc;
}

/* Card Title */
.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #2a1a1e;
}

/* Remove default padding */
.card-body.np {
  padding: 0;
}

/* ==================================================
   Station List
================================================== */
.station-list {
  display: flex;
  flex-direction: column;
}

/* Single Station Row */
.station-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #e8d8cc;
  cursor: pointer;
  transition: background 200ms ease;
}

/* Remove border for last row */
.station-row:last-child {
  border-bottom: none;
}

/* Hover Effect */
.station-row:hover {
  background: #f7ede0;
}

/* ==================================================
   Status Dots
================================================== */
.station-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Available Status */
.dot-available {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

/* Low Stock Status */
.dot-low {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

/* Out Of Stock Status */
.dot-out {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* ==================================================
   Station Information
================================================== */
.station-info {
  flex: 1;
  min-width: 0;
}

/* Station Name */
.station-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2a1a1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Station Address */
.station-addr {
  font-size: 0.7rem;
  color: #b89fa5;
  margin-top: 0.1rem;
}

/* ==================================================
   Stock Details
================================================== */
.station-stock {
  text-align: right;
  flex-shrink: 0;
}

/* Fuel Quantity */
.station-liters {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2a1a1e;
}

/* Stock Label */
.station-label {
  font-size: 0.675rem;
  color: #b89fa5;
  margin-top: 0.1rem;
}

/* ==================================================
   Empty State
================================================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1rem;
  gap: 0.75rem;
  color: #b89fa5;
  text-align: center;
}

/* Empty State Icon */
.empty-state svg {
  width: 36px;
  height: 36px;
  opacity: 0.35;
}

/* Empty State Text */
.empty-state p {
  font-size: 0.8rem;
  color: #7a5c62;
}

/* ==================================================
   Buttons
================================================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 7px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  border: none;
}

/* Small Button */
.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: #7b1e2b;
  border: 1px solid rgba(123, 30, 43, 0.5);
}

/* Outline Button Hover */
.btn-outline:hover {
  background: #f9eced;
  border-color: #7b1e2b;
}
</style>

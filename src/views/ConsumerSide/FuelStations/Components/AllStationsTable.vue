<template>
  <!-- All Stations Table -->
  <div class="all-stations-table">
    <div class="common-table-card table-padding">

      <!-- Table Title -->
      <div class="table-title">All Stations</div>

      <!-- Scrollable Table Container -->
      <div class="table-scroll">

        <!-- Table Header -->
        <div class="common-table-header table-header-grid">
          <span class="header-cell station-name">Station Name</span>
          <span class="header-cell address">Address</span>
          <span class="header-cell petrol92">Petrol 92</span>
          <span class="header-cell petrol95">Petrol 95</span>
          <span class="header-cell auto-diesel">Auto Diesel</span>
          <span class="header-cell status">Status</span>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div v-for="(station, index) in stations" :key="index" class="table-row">
            <span class="row-cell station-name">{{ station.name }}</span>
            <span class="row-cell address">{{ station.address }}</span>
            <span class="row-cell petrol92">{{ station.petrol92 }}</span>
            <span class="row-cell petrol95">{{ station.petrol95 }}</span>
            <span class="row-cell auto-diesel">{{ station.autoDiesel }}</span>

            <!-- Status Badge -->
            <span class="row-cell status">
              <span :class="['status-badge', statusClass(station.status)]">
                {{ station.status }}
              </span>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'AllStationsTable',

  // Props received from parent component
  props: {
    stations: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    // Return status badge class based on station stock status
    statusClass(status = '') {
      const value = status.toLowerCase()

      if (value.includes('available')) return 'status-available'
      if (value.includes('low')) return 'status-low'
      if (value.includes('out')) return 'status-out'

      return ''
    },
  },
}
</script>

<style scoped>
/* All stations table wrapper */
.all-stations-table {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

/* Main table card */
.common-table-card {
  width: 100%;
  overflow: hidden;
}

/* Table padding */
.table-padding {
  padding: 24px;
  box-sizing: border-box;
}

/* Table title */
.table-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
  margin-bottom: 20px;
}

/* Table header and row grid */
.table-header-grid,
.table-row {
  display: grid;
  grid-template-columns: 2.2fr 2fr 1fr 1fr 1fr 0.9fr;
  gap: 12px;
  align-items: center;
  width: calc(100% + 48px);
  margin-left: -24px;
  padding: 12px 24px;
  box-sizing: border-box;
}

/* Table header row */
.table-header-grid {
  border-radius: 0;
  font-style: normal;
  letter-spacing: -0.72px;
}

/* Shared table cell style */
.header-cell,
.row-cell {
  display: flex;
  align-items: center;
}

/* Header cell text */
.header-cell {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.72px;
  color: #000000;
}

/* Table body */
.table-body {
  margin-top: 8px;
}

/* Table row */
.table-row {
  border-bottom: 1px solid rgba(130, 0, 0, 0.25);
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #000000;
}

/* Remove border from last row */
.table-row:last-child {
  border-bottom: none;
}

/* Station name column */
.station-name {
  min-width: 130px;
}

/* Address column */
.address {
  min-width: 180px;
}

/* Fuel and status columns */
.petrol92,
.petrol95,
.auto-diesel,
.status {
  min-width: 75px;
}

/* Status badge */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

/* Available status */
.status-available {
  background: #9af0a6;
  color: #007a20;
}

/* Low stock status */
.status-low {
  background: #fff3a3;
  color: #b88700;
}

/* Out of stock status */
.status-out {
  background: #ffd6d6;
  color: #d00000;
}

/* Mobile responsive layout */
@media (max-width: 600px) {
  .table-padding {
    padding: 14px;
  }

  .table-title {
    font-size: 15px;
    margin-bottom: 14px;
  }

  .table-header-grid,
  .table-row {
    width: 760px;
    margin-left: 0;
    padding: 12px 14px;
    grid-template-columns: 150px 180px 90px 90px 100px 90px;
    gap: 10px;
  }

  .header-cell {
    font-size: 13px;
    line-height: 18px;
  }

  .row-cell {
    font-size: 12px;
    line-height: 16px;
  }

  .common-table-card {
    overflow: hidden;
  }

  .table-scroll {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
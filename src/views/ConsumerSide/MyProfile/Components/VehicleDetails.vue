<template>
  <v-card class="vehicle-card" elevation="0">
    <!-- Card Header -->
    <div class="card-header d-flex justify-space-between align-center px-6 py-4">
      <h3 class="card-title">Vehicle Details</h3>
    </div>

    <!-- Divider -->
    <v-divider class="header-divider"></v-divider>

    <div class="card-content pa-6">
      <!-- Maroon Highlight Card -->
      <div class="registration-highlight mb-8">
        <div class="highlight-label">VEHICLE REGISTRATION</div>
        <div class="highlight-value">{{ vehicle.registrationNumber }}</div>
        <div class="highlight-sub">{{ vehicle.type }} &nbsp; · &nbsp; {{ vehicle.fuelType }}</div>
      </div>

      <v-row>
        <v-col cols="12" sm="4" class="py-2">
          <div class="info-label">VEHICLE NO.</div>
          <div class="info-value">{{ vehicle.registrationNumber }}</div>
        </v-col>
        <v-col cols="12" sm="4" class="py-2">
          <div class="info-label">VEHICLE TYPE</div>
          <div class="info-value">{{ vehicle.type }}</div>
        </v-col>
        <v-col cols="12" sm="4" class="py-2">
          <div class="info-label">FUEL TYPE</div>
          <div class="info-value">{{ vehicle.fuelType }}</div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>



<script>
export default {
  /* Component Name */
  name: 'VehicleDetails',

  /* Component Props */
  props: {
    vehicle: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Vehicle details card container */
.vehicle-card {
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
}

/* Card title */
.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #2a1a1e;
  margin: 0;
}

/* Divider below header */
.header-divider {
  border-color: #f0e4dc !important;
  opacity: 1;
}

/* Vehicle registration highlight section */
.registration-highlight {
  background: #721b29;
  border-radius: 12px;
  padding: 24px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Registration label */
.highlight-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
}

/* Vehicle registration number */
.highlight-value {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 32px;
  line-height: 1;
  color: #ffffff;
}

/* Vehicle type and fuel type text */
.highlight-sub {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* Information labels */
.info-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 11px;
  color: #999292;
  margin-bottom: 4px;
  letter-spacing: 0.05em;
}

/* Information values */
.info-value {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #333333;
}
</style>

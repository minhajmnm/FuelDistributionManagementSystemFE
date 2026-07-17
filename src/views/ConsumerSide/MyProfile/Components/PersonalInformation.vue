<template>
  <!-- Personal Information Card -->
  <v-card class="profile-card" elevation="0">
    <!-- Card Header -->
    <div class="card-header d-flex justify-space-between align-center px-6 py-4">
      <h3 class="card-title">Personal Information</h3>

      <!-- Edit Profile Button -->
      <v-btn class="edit-btn text-none" color="#721B29" variant="flat" @click="$emit('edit')">
        Edit
      </v-btn>
    </div>

    <!-- Card Content -->
    <div class="card-content pa-6">
      <!-- Header Divider -->
      <v-divider class="header-divider"></v-divider>

      <!-- Spacing -->
      <div><p>&nbsp;</p></div>

      <!-- Profile Summary Section -->
      <div class="d-flex align-center mb-8">
        <!-- Profile Avatar -->
        <div class="avatar-circle mr-4">
          {{ (profile.full_name || 'U').charAt(0) }}
        </div>

        <!-- Spacing -->
        <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>

        <!-- Profile Basic Details -->
        <div>
          <div class="profile-name">{{ profile.full_name }}</div>
          <div class="profile-nic">NIC: {{ profile.nic_number }}</div>
        </div>
      </div>

      <!-- Spacing -->
      <div><p>&nbsp;</p></div>

      <!-- Details Divider -->
      <v-divider class="header-divider"></v-divider>

      <!-- Information Grid -->
      <v-row class="info-grid">
        <!-- Full Name -->
        <v-col cols="12" sm="6" class="info-item py-3">
          <div class="info-label">FULL NAME</div>
          <div class="info-value">{{ profile.full_name }}</div>
        </v-col>

        <!-- NIC Number -->
        <v-col cols="12" sm="6" class="info-item py-3">
          <div class="info-label">NIC NUMBER</div>
          <div class="info-value">{{ profile.nic_number }}</div>
        </v-col>

        <!-- Email Address -->
        <v-col cols="12" sm="6" class="info-item py-3">
          <div class="info-label">EMAIL ADDRESS</div>
          <div class="info-value">{{ profile.email_address }}</div>
        </v-col>

        <!-- Phone Number -->
        <v-col cols="12" sm="6" class="info-item py-3">
          <div class="info-label">PHONE NUMBER</div>
          <div class="info-value">{{ profile.phone_number }}</div>
        </v-col>

        <!-- Account Status -->
        <v-col cols="12" sm="6" class="info-item py-3">
          <div class="info-label">ACCOUNT STATUS</div>
          <div class="status-container mt-1">
            <span class="status-chip">{{ profile.status }}</span>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  /* Component Name */
  name: 'PersonalInformation',

  /* Component Props */
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },

  /* Component Events */
  emits: ['edit'],
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Profile card container */
.profile-card {
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

/* Edit button */
.edit-btn {
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  height: 32px !important;
}

/* Divider line */
.header-divider {
  border-color: #f0e4dc !important;
  opacity: 1;
}

/* Profile avatar circle */
.avatar-circle {
  width: 56px;
  height: 56px;
  background: #721b29;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 24px;
}

/* Profile name */
.profile-name {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #000000;
}

/* Profile NIC text */
.profile-nic {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: #7a7974;
}

/* Information label */
.info-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: #999292;
  margin-bottom: 4px;
  letter-spacing: 0.02em;
}

/* Information value */
.info-value {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #333333;
}

/* Account status badge */
.status-chip {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 99px;
  background: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.2);
  color: #16a34a;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-transform: capitalize;
}
</style>

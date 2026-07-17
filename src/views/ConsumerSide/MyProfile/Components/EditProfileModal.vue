<template>
  <!-- Edit Profile Dialog -->
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500px"
  >
    <!-- Edit Profile Modal Card -->
    <v-card class="edit-modal">
      <!-- Modal Header -->
      <div class="modal-header d-flex justify-space-between align-center px-6 py-5">
        <h3 class="modal-title">Edit Profile</h3>

        <!-- Close Button -->
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          size="small"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
      </div>

      <!-- Modal Form Content -->
      <v-card-text class="pa-6">
        <v-form @submit.prevent="handleUpdate">
          <!-- Full Name Input -->
          <div class="input-group mb-4">
            <label class="input-label">Full Name</label>
            <v-text-field
              v-model="editedProfile.full_name"
              variant="outlined"
              density="comfortable"
              hide-details
              class="custom-input"
            ></v-text-field>
          </div>

          <!-- NIC Number Input -->
          <div class="input-group mb-4">
            <label class="input-label">NIC Number</label>
            <v-text-field
              v-model="editedProfile.nic_number"
              variant="outlined"
              density="comfortable"
              hide-details
              class="custom-input"
            ></v-text-field>
          </div>

          <!-- Email Address Input -->
          <div class="input-group mb-4">
            <label class="input-label">Email Address</label>
            <v-text-field
              v-model="editedProfile.email_address"
              variant="outlined"
              density="comfortable"
              hide-details
              class="custom-input"
            ></v-text-field>
          </div>

          <!-- Phone Number Input -->
          <div class="input-group">
            <label class="input-label">Phone</label>
            <v-text-field
              v-model="editedProfile.phone_number"
              variant="outlined"
              density="comfortable"
              hide-details
              class="custom-input"
            ></v-text-field>
          </div>

          <!-- Modal Action Buttons -->
          <div class="d-flex justify-end mt-10 mb-2 gap-3">
            <!-- Cancel Button -->
            <v-btn
              class="cancel-btn text-none"
              variant="outlined"
              @click="$emit('update:modelValue', false)"
            >
              Cancel
            </v-btn>

            <!-- Update Button -->
            <v-btn class="update-btn text-none" @click="handleUpdate"> Update </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  /* Component Name */
  name: 'EditProfileModal',

  /* Component Props */
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },

    profile: {
      type: Object,
      required: true,
    },
  },

  /* Component Events */
  emits: ['update:modelValue', 'update-profile'],

  /* Component Data */
  data() {
    return {
      editedProfile: { ...this.profile },
    }
  },

  watch: {
    /* Sync profile data when modal opens */
    modelValue(val) {
      if (val) {
        this.editedProfile = { ...this.profile }
      }
    },
  },

  methods: {
    /* Send updated profile data to parent */
    handleUpdate() {
      this.$emit('update-profile', { ...this.editedProfile })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

/* Edit modal card */
.edit-modal {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Modal header */
.modal-header {
  background: linear-gradient(90deg, #64111d 0%, #2a1a1e 100%);
  padding: 24px 28px !important;
}

/* Modal title */
.modal-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #ffffff;
  margin: 0;
}

/* Input group */
.input-group {
  display: flex;
  flex-direction: column;
}

/* Input label */
.input-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
}

/* Custom Vuetify input field */
.custom-input :deep(.v-field) {
  border-radius: 12px;
  background-color: #f7f7f7;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}

/* Input outline */
.custom-input :deep(.v-field__outline) {
  --v-field-border-color: #d8c4c4;
  --v-field-border-width: 1px;
}

/* Focused input outline */
.custom-input :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #4e1119;
}

/* Cancel button */
.cancel-btn {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 30px;
  height: 40px !important;
  min-width: 110px;
  color: #666666 !important;
  border: 1px solid #d1d1d1 !important;
  transition: all 0.2s ease;
}

/* Cancel button hover */
.cancel-btn:hover {
  background-color: #f9f9f9;
}

/* Update button */
.update-btn {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 30px;
  height: 40px !important;
  margin-left: 10px;
  min-width: 110px;
  background: #5d101d !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(93, 16, 29, 0.2);
  transition: all 0.2s ease;
}

/* Update button hover */
.update-btn:hover {
  background: #2a1a1e !important;
  transform: translateY(-1px);
}
</style>

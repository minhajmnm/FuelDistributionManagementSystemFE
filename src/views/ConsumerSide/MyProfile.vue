<template>
  <div class="my-profile-view">
    <!-- Cards Section -->
    <v-row>
      <v-col cols="12" md="6">
        <PersonalInformation :profile="userProfile" @edit="showEditModal = true" />
      </v-col>
      <v-col cols="12" md="6">
        <VehicleDetails :vehicle="vehicleDetails" />
      </v-col>
    </v-row>

    <!-- Edit Modal -->
    <EditProfileModal
      v-model="showEditModal"
      :profile="userProfile"
      @update-profile="updateUserProfile"
    />
  </div>
</template>

<script>
import PersonalInformation from './MyProfile/Components/PersonalInformation.vue'
import VehicleDetails from './MyProfile/Components/VehicleDetails.vue'
import EditProfileModal from './MyProfile/Components/EditProfileModal.vue'
// Import Profile API functions
import AuthManagement from '@/Api/Modules/AuthManagement.js'

import Swal from 'sweetalert2'

export default {
  name: 'MyProfile',
  components: {
    PersonalInformation,
    VehicleDetails,
    EditProfileModal,
  },
  data() {
    return {
      showEditModal: false,
      userProfile: {
        full_name: '',
        nic_number: '',
        email_address: '',
        phone_number: '',
        status: 'Active',
      },
      vehicleDetails: {
        registrationNumber: 'ABC-1234',
        type: 'Car / SUV',
        fuelType: 'Petrol',
      },
    }
  },
  mounted() {
    // Fetch profile from database when component loads
    this.fetchProfile()
  },
  methods: {
    // Fetch profile from database
    async fetchProfile() {
      try {
        // replace with actual API call to fetch profile data
        const response = await AuthManagement.getMyProfile()
        // Update userProfile with the fetched data
        this.userProfile = response.data.data || response.data
        // Extract vehicle details from the profile
        const vehicle = this.userProfile.vehicles?.[0]
        // Update vehicleDetails with the fetched vehicle data
        if (vehicle) {
          this.vehicleDetails = {
            registrationNumber: vehicle.vehicle_no,
            type: vehicle.vehicle_type,
            fuelType: vehicle.fuel_type?.fuel_name || 'N/A',
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    },

    // Update user profile in the database
    async updateUserProfile(updatedData) {
      try {
        const payload = {
          full_name: updatedData.full_name,
          nic_number: updatedData.nic_number,
          email_address: updatedData.email_address,
          phone_number: updatedData.phone_number || updatedData.phone,
        }

        // Update profile
        await AuthManagement.updateProfile(payload)

        // Refresh profile
        await this.fetchProfile()

        // Close modal
        this.showEditModal = false

        // Success message
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Profile updated successfully. Please use your new email for future logins.',
          confirmButtonColor: '#7B1E2B',
          timer: 4000,
          showConfirmButton: false,
        })
      } catch (error) {
        console.log('Update error:', error.response?.data)

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.message || 'Failed to update profile.',
          confirmButtonColor: '#7B1E2B',
        })
      }
    },
  },
}
</script>

<style scoped>
/* My profile view  */
.my-profile-view {
  padding: 24px;
}
</style>

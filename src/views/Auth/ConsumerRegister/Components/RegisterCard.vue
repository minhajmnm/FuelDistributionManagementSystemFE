<template>
  <!-- Main registration card container -->
  <v-card class="register-card">
    <!-- Title -->
    <h2 class="title">Register</h2>

    <!-- Form layout split into two columns -->
    <v-row dense>
      <!-- LEFT SIDE (USER DETAILS)  -->
      <v-col cols="6">
        <!-- Full Name input -->
        <v-text-field
          v-model="fullName"
          placeholder="Full Name"
          :rules="[rules.required]"
          prepend-inner-icon="mdi-account"
          class="input"
          variant="outlined"
          density="compact"
        />

        <!-- NIC Number input -->
        <v-text-field
          v-model="nic"
          :rules="[rules.required, rules.nic]"
          placeholder="NIC Number"
          prepend-inner-icon="mdi-card-account-details"
          class="input"
          variant="outlined"
          density="compact"
        />

        <!-- Phone Number input -->
        <v-text-field
          v-model="phone"
          :rules="[rules.required, rules.phone]"
          placeholder="Phone Number"
          prepend-inner-icon="mdi-phone"
          class="input"
          variant="outlined"
          density="compact"
        />

        <!-- Email Address input -->
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          placeholder="Email Address"
          prepend-inner-icon="mdi-email"
          class="input"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!--  RIGHT SIDE (ACCOUNT + VEHICLE DETAILS)  -->
      <v-col cols="6">
        <!-- Password input with toggle visibility -->
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePassword"
          class="input"
          variant="outlined"
          density="compact"
        />

        <!-- Vehicle Type dropdown -->
        <v-select
          v-model="vehicleType"
          :items="vehicleTypes"
          prepend-inner-icon="mdi-car"
          class="input"
          variant="outlined"
          density="compact"
        >
          <template #selection>
            <span :style="{ color: vehicleType ? 'black' : '#9ca3af' }">
              {{ vehicleType || 'Vehicle Type' }}
            </span>
          </template>
        </v-select>

        <!-- Vehicle Number input -->
        <v-text-field
          v-model="vehicleNo"
          placeholder="Vehicle Number"
          prepend-inner-icon="mdi-car-search"
          class="input"
          variant="outlined"
          density="compact"
        />

        <!-- Fuel Type dropdown -->
        <v-select
          v-model="fuelType"
          :items="fuelTypes"
          item-title="title"
          item-value="value"
          :return-object="false"
          prepend-inner-icon="mdi-gas-station"
          class="input"
          variant="outlined"
          density="compact"
        >
          <template #selection>
            <span :style="{ color: fuelType ? '#000' : '#9ca3af' }">
              {{ getFuelTypeTitle() }}
            </span>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <!-- Terms and conditions text -->
    <p class="terms">By signing up, you agree to our Terms of Service and Privacy Policy</p>

    <!-- Register button -->
    <v-btn block class="register-btn" @click="handleRegister"> Register </v-btn>

    <!-- Redirect to login -->
    <p class="login-link">
      Already have an account?
      <span @click="goLogin">Log in</span>
    </p>
  </v-card>
</template>
<script>
// Import necessary modules and libraries
import AuthManagement from '@/Api/Modules/AuthManagement'
import FuelTypeManagement from '@/Api/Modules/FuelTypeManagement'
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || 'This field is required',

        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter valid email address',

        phone: (value) => /^[0-9]{10}$/.test(value) || 'Phone number must be 10 digits',

        nic: (value) => /^([0-9]{9}[vVxX]|[0-9]{12})$/.test(value) || 'Enter valid NIC number',

        password: (value) => value.length >= 8 || 'Password must be at least 8 characters',
      },
      fullName: '',
      nic: '',
      phone: '',
      email: '',
      password: '',
      vehicleNo: '',
      vehicleType: '',
      fuelType: '',
      showPassword: false,
      vehicleTypes: [
        'Car',
        'Motor Cycle',
        'Van',
        'Bus',
        'Tractor',
        'Three Wheeler',
        'Lorry',
        'Special Purpose Vehicle',
      ],

      fuelTypes: [],
    }
  },
  // Load fuel types when the component is mounted
  async mounted() {
    await this.loadFuelTypes()
  },

  methods: {
    //go to login page
     goLogin() {
    this.$router.push('/consumer/login')
  },
    // get the display title for the selected fuel type based on its value
    getFuelTypeTitle() {
      const fuel = this.fuelTypes.find((item) => item.value === this.fuelType)
      return fuel ? fuel.title : 'Fuel Type'
    },
    // load fuel types from the API and populate the dropdown options
    async loadFuelTypes() {
      try {
        const response = await FuelTypeManagement.getAllFuelTypes()

        this.fuelTypes = response.data.data.map((item) => ({
          title: item.fuel_name,
          value: item.fuel_type_id,
        }))
      } catch (error) {
        console.error(error)
      }
    },

    // Toggle password visibility when the eye icon is clicked
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    // Handle registration logic with validation and API call
    async handleRegister() {
      if (
        !this.fullName ||
        !this.nic ||
        !this.phone ||
        !this.email ||
        !this.password ||
        !this.vehicleNo ||
        !this.vehicleType ||
        !this.fuelType
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Information',
          text: 'Please fill all required fields.',
        })
        return
      }

      try {
        await AuthManagement.registerConsumer({
          full_name: this.fullName,
          nic_number: this.nic,
          phone_number: this.phone,
          email_address: this.email,
          password: this.password,
          vehicle_no: this.vehicleNo,
          vehicle_type: this.vehicleType,
          fuel_type_id: this.fuelType,
        })

        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created successfully.',
          timer: 2000,
          showConfirmButton: false,
        })

        this.$router.push('/consumer/login')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.response?.data?.message || 'Unable to register. Please try again.',
        })
      }
    },
  },
}
</script>

<style scoped>
.select-placeholder {
  color: #9ca3af;
  font-size: 16px;
}

.register-card {
  padding: 20px 25px;
  border-radius: 20px;
  background: rgba(220, 230, 245, 0.9);
}
.title {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 10px;
}
.input {
  margin-bottom: 8px;
}
:deep(.v-field) {
  border: 2px solid #2f4ea2;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
}
:deep(.v-field__outline) {
  display: none;
}
:deep(.v-field__prepend-inner i),
:deep(.v-field__append-inner i) {
  color: #2f4ea2;
}
.terms {
  text-align: center;
  font-size: 12px;
  margin: 8px 0;
  color: #1e3a8a;
}
.register-btn {
  background: #1e3a8a;
  color: white;
  height: 42px;
  border-radius: 10px;
  font-weight: 600;
}
.login-link {
  text-align: center;
  margin-top: 8px;
  font-size: 13px;
}
.login-link span {
  color: #2f4ea2;
  cursor: pointer;
  font-weight: 600;
}
</style>

<template>
  <div class="login-wrapper">
    <!-- HEADER -->
    <div class="login-header">
      <h2 class="login-title">Welcome Back!</h2>
      <p class="login-subtitle">Please Login here</p>
    </div>

    <!-- CARD -->
    <v-card class="login-card" elevation="8">
      <!-- EMAIL -->
      <v-text-field
        v-model="email"
        label="Enter your email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        density="comfortable"
        hide-details
        class="custom-input"
        autocomplete="off"
      />

      <!-- PASSWORD -->
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Enter your Password"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="togglePassword"
        variant="outlined"
        density="comfortable"
        hide-details
        class="custom-input"
        autocomplete="new-password"
      />

      <!-- BUTTON -->
      <v-btn block class="login-button" @click="handleLogin"> Log in </v-btn>

      <!-- LINKS -->
      <div class="links-wrapper">
        <p class="login-forgot">Forgot password?</p>
        <p class="login-register">
          Don’t have an account?
          <span class="register-link" @click="goRegister">Register</span>
        </p>
      </div>
    </v-card>
  </div>
</template>

<script>
import AuthManagement from '@/Api/Modules/AuthManagement'
import Swal from 'sweetalert2'
export default {
  name: 'LoginCard',

  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    }
  },

  mounted() {
    localStorage.removeItem('consumer_token')
    localStorage.removeItem('consumer_user')
    this.email = ''
    this.password = ''
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    async handleLogin() {
      if (!this.email || !this.password) {
        Swal.fire({
          icon: 'warning',
          title: 'Required',
          text: 'Please enter email and password.',
        })
        return
      }

      try {
        const response = await AuthManagement.login({
          email_address: this.email,
          password: this.password,
        })

        const user = response.data.data.data
        const token = response.data.data.token

        console.log('FULL RESPONSE:', response.data)
        console.log('USER:', user)
        console.log('ROLE:', user.role)

        if (!token || !user) {
          throw new Error('Invalid login response')
        }

        if (user.role?.trim().toLowerCase() !== 'consumer') {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Only consumers can log in here.',
          })
          return
        }

        localStorage.setItem('consumer_token', token)
        localStorage.setItem('consumer_user', JSON.stringify(user))

        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome!',
          timer: 1500,
          showConfirmButton: false,
        })

        this.$router.push('/consumer/dashboard')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.response?.data?.message || 'Invalid email or password.',
        })
      }
    },

    goRegister() {
      this.$router.push('/consumer/register')
    },
  },
}
</script>

<style scoped>
/* ================= WRAPPER ================= */
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(97, 152, 218, 0.25), rgba(97, 152, 218, 0.15));
}

/* ================= HEADER ================= */
.login-header {
  text-align: center;
  margin-bottom: clamp(12px, 3vw, 35px);
}

.login-title {
  font-size: clamp(20px, 3.5vw, 30px);
  font-weight: 700;
  color: #000e33;
}

.login-subtitle {
  margin-bottom: 12px;
  color: #000e33;
  font-size: clamp(13px, 1.8vw, 18px);
  font-weight: 500;
}

/* ================= CARD ================= */
.login-card {
  width: min(350px, 100%);
  margin-bottom: 12px;
  padding: clamp(12px, 2.5vw, 22px) clamp(12px, 2.5vw, 20px) 15px;
  border-radius: 12px;
  background: rgba(219, 230, 245, 0.85);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

/* ================= INPUT ================= */
.custom-input {
  margin-bottom: 8px;
}

:deep(.custom-input .v-field--variant-outlined .v-field__outline) {
  display: none;
}

:deep(.custom-input .v-field) {
  border: 2px solid #2f4ea2;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
}

:deep(.custom-input .v-field__prepend-inner i),
:deep(.custom-input .v-field__append-inner i) {
  color: #2f4ea2;
  font-size: 18px;
}

:deep(.custom-input input) {
  font-size: 14px;
  color: #2f4ea2;
}

:deep(.custom-input .v-label) {
  font-size: 13px;
  color: #2f4ea2;
}

:deep(.custom-input .v-field--active) {
  border-color: #1e3a8a;
}

:deep(.custom-input .v-field__details) {
  display: none;
}

/* ================= BUTTON ================= */
.login-button {
  margin-top: 5px;
  height: 42px;
  border-radius: 10px;
  background: #1e3a8a;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

/* ================= LINKS ================= */
.links-wrapper {
  text-align: center;
}

.login-forgot {
  margin-top: 12px;
  font-size: 13px;
}

.login-register {
  margin-top: 4px;
  font-size: 13px;
}

.register-link {
  color: #2f4ea2;
  cursor: pointer;
  font-weight: 600;
}
</style>

<template>
  <!--  MAIN CARD -->
  <v-card class="admin-card">
    <!--  ICON -->
    <div class="icon-wrapper">
      <img src="@/assets/images/ConsumerLogin images/admin.png" class="admin-icon" />
    </div>

    <!--  TITLE -->
    <h2 class="title">Admin Login</h2>

    <!--  SUBTITLE -->
    <p class="subtitle">Enter your credentials to access the control panel</p>

    <!--  EMAIL -->
    <label class="label email-label">E-MAIL ADDRESS</label>
    <v-text-field
      v-model="email"
      placeholder="admin@fuelflow.lk"
      variant="outlined"
      density="comfortable"
      hide-details
      class="input email-input"
    />

    <!--  PASSWORD -->
    <label class="label password-label">PASSWORD</label>
    <v-text-field
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="••••••••"
      variant="outlined"
      density="comfortable"
      hide-details
      class="input password-input"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="togglePassword"
    />

    <!--  BUTTON -->
    <v-btn block class="login-btn login-button" @click="handleLogin"> Sign in to Dashboard </v-btn>
  </v-card>
</template>

<script>
import AuthManagement from '@/Api/Modules/AuthManagement'
import Swal from 'sweetalert2'
export default {
  name: 'AdminCard',

  data() {
    return {
      email: '', //  email input
      password: '', //  password input
      showPassword: false, //  toggle password
    }
  },

  methods: {
    // SHOW / HIDE PASSWORD
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    //  LOGIN FUNCTION
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

        const token = response.data.token || response.data.data?.token
        const user = response.data.user || response.data.data?.user || response.data.data?.data

        if (!token || !user) {
          throw new Error('Invalid login response')
        }

        if (user.role !== 'admin') {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Only admins can log in here.',
          })
          return
        }

        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(user))

        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome Admin!',
          timer: 1500,
          showConfirmButton: false,
        })

        this.$router.push('/admin/dashboard')
      } catch (error) {
        const message = error.response?.data?.message || error.message

        Swal.fire({
          icon: 'error',
          title:
            message === 'Your account has been deactivated. Please contact admin.'
              ? 'Account Deactivated'
              : 'Login Failed',
          text: message || 'Invalid email or password.',
          confirmButtonColor: '#820000',
        })
      }
    },
  },
}
</script>

<style scoped>
.admin-card {
  width: min(400px, 92vw);
  padding: clamp(12px, 2.5vw, 18px);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(9px);
  border: 2px solid rgba(255, 255, 255, 0.4);
  margin: 0;
  box-sizing: border-box;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 0 5px;
}

.admin-icon {
  width: clamp(40px, 8vw, 60px);
  height: clamp(40px, 8vw, 60px);
  object-fit: contain;
}

.title {
  text-align: center;
  color: white;
  font-size: clamp(18px, 3.5vw, 24px);
  font-weight: 700;
  margin: 0 0 4px;
}

.subtitle {
  text-align: center;
  color: #e5e7eb;
  font-size: clamp(11px, 1.8vw, 13px);
  margin: 0 0 8px;
}

.label {
  color: #e5e7eb;
  font-size: clamp(10px, 1.5vw, 12px);
  margin-bottom: 5px;
  display: block;
}

.input {
  margin-bottom: 4px;
}

:deep(.v-field) {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

:deep(input) {
  color: white;
}

:deep(.v-field__prepend-inner .v-icon),
:deep(.v-field__append-inner .v-icon) {
  color: white !important;
}

.login-btn {
  height: 45px;
  border-radius: 10px;
  background: #1e3a8a;
  color: white;
  font-weight: 600;
  margin-top: 8px;
}
</style>

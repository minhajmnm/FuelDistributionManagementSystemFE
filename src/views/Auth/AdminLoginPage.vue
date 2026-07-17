<template>
  <!--  MAIN CONTAINER -->
  <v-container fluid class="admin-login-page pa-0">
    <div class="overlay">
      <div class="page-content">
        <!-- LOGO & TITLE -->
        <div class="brand-section">
          <img src="@/assets/images/ConsumerLogin images/logo.png" class="logo" />
          <h1 class="system-title">FUEL DISTRIBUTION MANAGEMENT SYSTEM</h1>
        </div>

        <!-- LOGIN CARD -->
        <div class="card-section">
          <div class="card-wrapper">
            <AdminCard />
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import AdminCard from './AdminLogin/Components/AdminCard.vue'

export default {
  components: { AdminCard },
}
</script>

<style scoped>
.admin-login-page {
  width: 100%;
  min-height: 100dvh;
  background: url('@/assets/images/ConsumerLogin images/main image.png') no-repeat center center /
    cover;
  overflow-y: auto;
}

.overlay {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(10px, 3vw, 24px);
  box-sizing: border-box;
  overflow-y: auto;
}

.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(5px, 1vh, 10px);
  width: 100%;
  max-width: 480px;
  padding: clamp(8px, 1.5vh, 16px) 0;
}

.brand-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: clamp(70px, 12vw, 130px);
  height: auto;
  display: block;
  margin: 0 auto;
}

.system-title {
  margin: 8px 0 0;
  color: white;
  font-size: clamp(13px, 2.5vw, 20px);
  font-weight: 600;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  transform: none;
  padding: 0 8px;
}

.card-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .logo {
    width: clamp(80px, 20vw, 170px);
  }

  .system-title {
    font-size: clamp(12px, 3.5vw, 18px);
    padding: 0 10px;
  }
}
</style>

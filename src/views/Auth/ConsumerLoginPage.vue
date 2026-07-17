<template>
  <v-container fluid class="login-page pa-0">
    <v-row class="overlay ma-0" align="center" justify="space-between">
      <!-- LEFT SIDE -->
      <v-col cols="12" md="7" class="left-section">
        <div class="logo-wrapper">
          <img src="@/assets/images/ConsumerLogin images/logo.png" class="logo" />
        </div>

        <div class="title-wrapper">
          <h1 class="main-title">
            FUEL FLOW <br />
            LANKA CONSUMER PORTAL
          </h1>
        </div>

        <div class="subtitle-wrapper">
          <p class="main-subtitle">Manage Your Fuel Efficiently</p>
        </div>

        <div class="desc-wrapper">
          <p class="main-desc">
            Monitor and manage your fuel quotas and usage seamlessly to optimize your fuel
            requirements across Sri Lanka.
          </p>
        </div>

        <div class="features-wrapper">
          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/ConsumerLogin images/Fuel Quotas.png" />
            </div>
            <div class="feature-text">
              <h3 class="feature-title">Fuel Quotas</h3>
              <p class="feature-desc">Track and manage your allocated fuel quotas</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/ConsumerLogin images/Usage History.png" />
            </div>
            <div class="feature-text">
              <h3 class="feature-title">Usage History</h3>
              <p class="feature-desc">View detailed fuel usage and transaction history</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/ConsumerLogin images/Station Fuel Stock.png" />
            </div>
            <div class="feature-text">
              <h3 class="feature-title">Station Fuel Stock</h3>
              <p class="feature-desc">Monitor fuel stock levels and availability in real-time</p>
            </div>
          </div>
        </div>
      </v-col>

      <!-- RIGHT SIDE -->
      <v-col cols="12" md="5" class="right-section">
        <div class="outer-frame">
          <LoginCard />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginCard from './ConsumerLogin/Components/LoginCard.vue'

export default {
  components: { LoginCard },
}
</script>

<style scoped>
/* PAGE */
.login-page {
  min-height: 100vh;
  background: url('@/assets/images/ConsumerLogin images/main image.png') no-repeat center
    center/cover;
}

/* OVERLAY */
.overlay {
  min-height: 100vh;
  padding: clamp(10px, 2vh, 25px) clamp(16px, 4vw, 40px) clamp(8px, 1.5vh, 12px);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.25));
}

/* LEFT */
.left-section {
  color: white;
  padding-left: clamp(12px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* LOGO */
.logo-wrapper {
  margin-bottom: 5px;
  margin-left: -20px;
}

.logo {
  width: clamp(80px, 12vw, 150px);
  height: auto;
}

.title-wrapper {
  margin-top: -5px;
  margin-bottom: 2px;
}

/* TITLE */
.main-title {
  font-size: clamp(20px, 3vw, 36px);
  font-weight: bold;
  margin: 0;
  margin-bottom: 4px;
}

/* SUBTITLE */
.main-subtitle {
  font-size: clamp(14px, 1.8vw, 18px);
  margin-bottom: 8px;
}

/* DESCRIPTION */
.main-desc {
  max-width: 480px;
  margin-bottom: 5px;
  font-size: clamp(11px, 1.3vw, 14px);
}

/* FEATURES */
.features-wrapper {
  margin-top: 5px;
  max-width: 650px;
}

/* FEATURE CARD */
.feature-card {
  display: flex;
  align-items: center;
  padding: clamp(6px, 1.2vw, 12px);
  border-radius: 16px;
  margin-bottom: 6px;
  gap: 10px;
  margin-top: clamp(6px, 1.5vw, 15px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(200, 230, 255, 0.55));
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* ICON */
.feature-icon img {
  width: clamp(30px, 4vw, 50px);
  height: clamp(30px, 4vw, 50px);
  border-radius: 14px;
  background: white;
  padding: 6px;
}

/* TEXT */
.feature-title {
  font-size: clamp(13px, 1.4vw, 16px);
  font-weight: 700;
  color: #294389;
}

.feature-desc {
  font-size: clamp(11px, 1.2vw, 14px);
  font-weight: 460;
  color: #1b3fa3;
}

/* RIGHT */
.right-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* FRAME */
.outer-frame {
  padding: clamp(8px, 1.5vw, 15px);
  border-radius: 30px;
  width: min(380px, 95vw);
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
}
</style>

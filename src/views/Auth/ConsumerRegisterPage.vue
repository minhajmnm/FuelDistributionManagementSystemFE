<template>
  <v-container fluid class="register-page pa-0">
    <v-row class="overlay ma-0" align="center" justify="space-between">
      <!-- LEFT TEXT -->
      <v-col cols="12" md="5" class="left-content">
        <img src="@/assets/images/ConsumerLogin images/logo.png" class="logo" />

        <h1 class="main-title">
          Register with <br />
          Lanka Fuel Consumer Portal
        </h1>

        <p class="desc">
          Create your account to manage your <br />
          fuel quotas and history
        </p>
      </v-col>

      <!-- REGISTER CARD -->
      <v-col cols="12" md="7" class="card-col">
        <div class="card-wrapper">
          <RegisterCard />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RegisterCard from './ConsumerRegister/Components/RegisterCard.vue'

export default {
  components: { RegisterCard },
}
</script>

<style scoped>
/* PAGE BACKGROUND */
.register-page {
  min-height: 100vh;
  background: url('@/assets/images/ConsumerLogin images/main image.png') no-repeat center
    center/cover;
}

/* OVERLAY */
.overlay {
  min-height: 100vh;
  padding: clamp(20px, 5vh, 50px) clamp(20px, 5vw, 60px);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.2));
}

/* LEFT TEXT */
.left-content {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: clamp(40px, 8vw, 100px);
  margin-top: -150px;
}

.logo {
  width: 170px;
  margin-bottom: 20px;
  margin-left: -28px;
}

.main-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  margin-top: -23px;
}

.desc {
  margin-top: 15px;
  font-size: 18px;
  line-height: 1.5;
}

/* CARD COLUMN */
.card-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* CARD WRAPPER — responsive, no fixed width */
.card-wrapper {
  width: 100%;
  max-width: 660px;
}
</style>

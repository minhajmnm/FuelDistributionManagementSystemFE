<template>
  <v-app>
    <!-- Sidebar -->
    <CommonSidebar
      v-model="drawer"
      :logo="logo"
      panel-title="CONSUMER PANEL"
      :menu-items="consumerMenu"
      :user-name="consumer?.full_name || 'Loading...'"
      :user-info="consumer?.nic_number ? `NIC: ${consumer.nic_number}` : ''"
      @logout="logout"
    />

    <!-- Common Top Bar -->
    <CommonTopBar
      :title="currentPage.title"
      :breadcrumb="currentPage.breadcrumb"
      :show-profile="false"
      @toggle-drawer="drawer = !drawer"
    />

    <!-- Page Content -->
    <v-main class="common-layout-page">
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import CommonSidebar from '@/components/CommonSidebar.vue'
import CommonTopBar from '@/components/CommonTopBar.vue'
import logo from '@/assets/images/FDMS Logo.png'
import AuthManagement from '@/Api/Modules/AuthManagement'
import Swal from 'sweetalert2'

export default {
  components: { CommonSidebar, CommonTopBar },
  data() {
    return {
      drawer: true,
      logo,

      consumer: null,

      consumerMenu: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard-outline',
          route: '/consumer/dashboard',
        },
        {
          title: 'Find Station & Join Queue',
          icon: 'mdi-format-list-bulleted',
          route: '/consumer/findstationandqueue',
        },
        {
          title: 'Fuel Quota',
          icon: 'mdi-clock-outline',
          route: '/consumer/fuelquota',
        },
        {
          title: 'Fuel Stations',
          icon: 'mdi-gas-station-outline',
          route: '/consumer/fuelstation',
        },
        {
          title: 'My Payments',
          icon: 'mdi-credit-card-outline',
          route: '/consumer/mypayments',
        },
        {
          title: 'My Profile',
          icon: 'mdi-account-outline',
          route: '/consumer/myprofile',
        },
        {
          title: 'Notifications',
          icon: 'mdi-bell-outline',
          route: '/consumer/notifications',
        },
      ],
    }
  },

  async mounted() {
    await this.getMyProfile()
  },
  computed: {
    currentPage() {
      const path = this.$route.path

      const routeMeta = {
        '/consumer/dashboard': {
          title: 'Dashboard',
          breadcrumb: 'FuelFlow Lanka > Dashboard',
        },
        '/consumer/findstationandqueue': {
          title: 'Find Station & Queue',
          breadcrumb: 'FuelFlow Lanka > Find Station & Queue',
        },
        '/consumer/fuelquota': {
          title: 'Fuel Quota',
          breadcrumb: 'FuelFlow Lanka > Fuel Quota',
        },
        '/consumer/fuelstation': {
          title: 'Fuel Stations',
          breadcrumb: 'FuelFlow Lanka > Fuel Stations',
        },
        '/consumer/mypayments': {
          title: 'My Payments',
          breadcrumb: 'FuelFlow Lanka > My Payments',
        },
        '/consumer/myprofile': {
          title: 'My Profile',
          breadcrumb: 'FuelFlow Lanka > My Profile',
        },
        '/consumer/notifications': {
          title: 'Notifications',
          breadcrumb: 'FuelFlow Lanka > Notifications',
        },
      }

      return (
        routeMeta[path] || {
          title: 'Consumer Panel',
          breadcrumb: 'FuelFlow Lanka',
        }
      )
    },
  },

  methods: {
    async getMyProfile() {
      try {
        const response = await AuthManagement.getMyProfile()
        this.consumer = response.data.data || response.data
      } catch (error) {
        console.error(error)
      }
    },

    logout() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#820000',
      }).then((result) => {
        if (result.isConfirmed) {
          // Remove only consumer login data
          localStorage.removeItem('consumer_token')
          localStorage.removeItem('consumer_user')
    

          this.$router.push('/consumer/login')
        }
      })
    },
  },
}
</script>
<style scoped>
.common-layout-page {
  background-color: rgba(219, 184, 168, 0.56) !important;
}
</style>

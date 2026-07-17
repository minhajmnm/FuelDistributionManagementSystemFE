<template>
  <v-app>
    <!-- Common Sidebar -->
    <CommonSidebar
      v-model="drawer"
      :logo="logo"
      panel-title="ADMIN PANEL"
      :menu-items="adminMenu"
      @logout="logout"
    />

    <!-- Top Bar -->
    <CommonTopBar
      :title="currentPage.title"
      :breadcrumb="currentPage.breadcrumb"
      email="admin@fuelflow.lk"
      :show-profile="true"
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
  name: 'Admin',

  components: {
    CommonSidebar,
    CommonTopBar,
  },

  data() {
    return {
      drawer: true,
      logo,

      adminMenu: [
        {
          title: 'Dashboard and Analytics',
          icon: 'mdi-view-grid-outline',
          route: '/admin/dashboard',
        },
        {
          title: 'Consumer & Vehicles',
          icon: 'mdi-car-outline',
          route: '/admin/consumerandvehicles',
        },
        {
          title: 'Suppliers',
          icon: 'mdi-account-group-outline',
          route: '/admin/suppliers',
        },
        {
          title: 'Fuel Stations',
          icon: 'mdi-gas-station-outline',
          route: '/admin/fuelstations',
        },
        {
          title: 'Stock',
          icon: 'mdi-package-variant-closed',
          route: '/admin/stock',
        },
        {
          title: 'Queue',
          icon: 'mdi-account-multiple-outline',
          route: '/admin/queue',
        },
        {
          title: 'Order & Supply',
          icon: 'mdi-clipboard-text-outline',
          route: '/admin/orderandsupply',
        },
        {
          title: 'Consumer Payments',
          icon: 'mdi-cash-sync',
          route: '/admin/consumerpayments',
        },
      ],
    }
  },
  computed: {
    currentPage() {
      const path = this.$route.path

      const routeMeta = {
        '/admin/dashboard': {
          title: 'Dashboard and Analytics',
          breadcrumb: 'FuelFlow Lanka > Dashboard and Analytics',
        },
        '/admin/consumerandvehicles': {
          title: 'Consumer & Vehicles',
          breadcrumb: 'FuelFlow Lanka > Consumer & Vehicles',
        },
        '/admin/suppliers': {
          title: 'Suppliers',
          breadcrumb: 'FuelFlow Lanka > Suppliers',
        },
        '/admin/fuelstations': {
          title: 'Fuel Stations',
          breadcrumb: 'FuelFlow Lanka > Fuel Stations',
        },
        '/admin/stock': {
          title: 'Stock',
          breadcrumb: 'FuelFlow Lanka > Stock',
        },
        '/admin/queue': {
          title: 'Queue',
          breadcrumb: 'FuelFlow Lanka > Queue',
        },
        '/admin/orderandsupply': {
          title: 'Order & Supply',
          breadcrumb: 'FuelFlow Lanka > Order & Supply',
        },
        '/admin/consumerpayments': {
          title: 'Consumer Payments',
          breadcrumb: 'FuelFlow Lanka > Consumer Payments',
        },
      }

      return (
        routeMeta[path] || {
          title: 'Admin Panel',
          breadcrumb: 'FuelFlow Lanka',
        }
      )
    },
  },
  methods: {
    async logout() {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel',
      })

      if (!result.isConfirmed) return

      try {
        await AuthManagement.logout()
      } catch (error) {
        console.log(error)
      }

      // Remove only admin login data
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')

      await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        timer: 1500,
        showConfirmButton: false,
      })

      this.$router.push('/admin/login')
    },
  },
}
</script>

<style scoped>
.common-layout-page {
  background-color: rgba(219, 184, 168, 0.56) !important;
}
</style>

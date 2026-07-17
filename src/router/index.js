import { createRouter, createWebHistory } from 'vue-router'

// Importing Authentication route modules
import AdminLoginRoutes from './Authentication/AdminLogin.routes'
import ConsumerLoginRoutes from './Authentication/ConsumerLogin.routes'
import ConsumerRegisterRoutes from './Authentication/ConsumerRegister.routes'

//Importing Admin route modules
import DashboardRoutes from './AdminModules/Dashboard.routes'
import FuelStationsRoutes from './AdminModules/FuelStations.routes'
import OrderAndSupplyRoutes from './AdminModules/OrderAndSupply.routes'
import QueueRoutes from './AdminModules/Queue.routes'
import StockRoutes from './AdminModules/Stock.routes'
import SuppliersRoutes from './AdminModules/Suppliers.routes'
import ConsumerPaymentsRoutes from './AdminModules/ConsumerPayments.routes'
import ConsumerAndVehiclesRoutes from './AdminModules/ConsumerAndVehicles.routes'

//Importing Consumer route modules
import ConsumerDashboardRoutes from './ConsumerModules/Dashboard.routes'
import FuelStationRoutes from './ConsumerModules/FuelStation.routes'
import FindStationAndQueueRoutes from './ConsumerModules/FindStationAndQueue.routes'
import FuelQuotaRoutes from './ConsumerModules/FuelQuota.rotes'
import MyPaymentsRoutes from './ConsumerModules/MyPayments.routes'
import MyProfileRoutes from './ConsumerModules/MyProfile.routes'
import NotificationRoutes from './ConsumerModules/Notification.routes'

const adminRoutes = {
  path: '/admin',
  component: () => import('@/layouts/admin.vue'),
  children: [
    ...DashboardRoutes,
    ...FuelStationsRoutes,
    ...OrderAndSupplyRoutes,
    ...QueueRoutes,
    ...StockRoutes,
    ...SuppliersRoutes,
    ...ConsumerPaymentsRoutes,
    ...ConsumerAndVehiclesRoutes,
  ],
}

const consumerRoutes = {
  path: '/consumer',
  component: () => import('@/layouts/consumer.vue'),
  children: [
    ...ConsumerDashboardRoutes,
    ...FuelStationRoutes,
    ...FindStationAndQueueRoutes,
    ...FuelQuotaRoutes,
    ...MyPaymentsRoutes,
    ...MyProfileRoutes,
    ...NotificationRoutes,
  ],
}

const routes = [
  ...AdminLoginRoutes,
  ...ConsumerLoginRoutes,
  ...ConsumerRegisterRoutes,
  adminRoutes,
  consumerRoutes,
  {
    path: '/',
    redirect: '/admin/login',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

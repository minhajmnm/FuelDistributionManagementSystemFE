<template>
  <!-- Suppliers Management Page -->
  <div class="suppliers-page">
    <!-- Page Header with Add Button -->
    <div class="page-header">
      <button class="add-supplier-btn" @click="openAddModal">+ Add Supplier</button>
    </div>

    <!-- Summary Statistics Cards -->
    <div class="stats-row">
      <div v-for="card in summaryCards" :key="card.title" class="stat-card">
        <!-- Top Gradient Bar -->
        <div class="gradient-bar" />

        <!-- Card Content -->
        <div class="stat-content">
          <div class="stat-number">{{ card.value }}</div>
          <div class="stat-label">{{ card.title }}</div>
        </div>
      </div>
    </div>

    <!-- Supplier Table -->
    <div class="table-container">
      <SupplierTable
        :suppliers="suppliers"
        @edit="openEditModal"
        @delete="deleteSupplier"
        @toggle-status="toggleStatus"
      />
    </div>

    <!-- Add / Edit Supplier Modal -->
    <SupplierModal
      v-model="modalVisible"
      :item="selectedSupplier"
      :is-edit="isEdit"
      @save="handleSave"
      @close="resetForm"
    />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-model="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :confirm-color="confirmDialog.confirmColor"
      :icon="confirmDialog.icon"
      @confirm="handleConfirm"
      @cancel="closeConfirm"
    />
  </div>
</template>

<script>
import SupplierTable from './Suppliers/Components/SupplierTable.vue'
import SupplierModal from './Suppliers/Components/SupplierModal.vue'
import ConfirmationModal from './Suppliers/Components/ConfirmationModal.vue'

import SupplierManagement from '@/Api/Modules/SupplierManagement'

export default {
  // Component Name
  name: 'SuppliersView',

  // Child Components
  components: {
    SupplierTable,
    SupplierModal,
    ConfirmationModal,
  },

  // Component State
  data() {
    return {
      modalVisible: false,
      isEdit: false,

      selectedSupplier: {
        id: null,
        name: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        fuelType: null,
        quantity: '',
        status: 'Active',
      },

      suppliers: [],

      confirmDialog: {
        show: false,
        title: '',
        message: '',
        confirmText: 'Delete',
        icon: 'mdi-delete-outline',
        confirmColor: '#B60106',
        type: '',
        targetId: null,
      },
    }
  },

  // Load suppliers when page opens
  async mounted() {
    await this.fetchSuppliers()
  },

  computed: {
    // Summary cards for supplier counts
    summaryCards() {
      return [
        {
          title: 'Total Suppliers',
          value: String(this.suppliers.length).padStart(2, '0'),
        },
        {
          title: 'Active Suppliers',
          value: String(
            this.suppliers.filter((s) => s.status?.toLowerCase() === 'active').length,
          ).padStart(2, '0'),
        },
        {
          title: 'Deactive Suppliers',
          value: String(
            this.suppliers.filter((s) => s.status?.toLowerCase() !== 'active').length,
          ).padStart(2, '0'),
        },
      ]
    },
  },

  methods: {
    // Open add supplier modal
    openAddModal() {
      this.isEdit = false
      this.selectedSupplier = {
        id: null,
        name: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        fuelType: null,
        quantity: '',
        status: 'Active',
      }
      this.modalVisible = true
    },

    // Open edit supplier modal
    openEditModal(item) {
      this.isEdit = true
      this.selectedSupplier = { ...item }
      this.modalVisible = true
    },

    // Save supplier data for add or edit
    async handleSave(data) {
      try {
        const payload = {
          supplier_name: data.name,
          contact_person: data.contactPerson,
          contact_number: data.contactNumber,
          email_address: data.email,
          fuel_type_ids: data.fuelTypeIds || [],
          status: 'active',
        }

        if (this.isEdit) {
          await SupplierManagement.updateSupplier(data.id, payload)
        } else {
          await SupplierManagement.storeSupplier(payload)
        }

        await this.fetchSuppliers()
        this.modalVisible = false
      } catch (error) {
        console.error(error.response?.data || error)
      }
    },

    // Fetch suppliers from API
    async fetchSuppliers() {
      try {
        const response = await SupplierManagement.getSuppliers()

        this.suppliers = (response.data.data || []).map((supplier) => ({
          id: supplier.supplier_id,
          name: supplier.supplier_name,
          contactPerson: supplier.contact_person,
          contactNumber: supplier.contact_number,
          email: supplier.email_address,
          status: supplier.status,
          fuelType: supplier.fuel_types?.map((fuel) => fuel.fuel_name).join(', ') || '',
          fuelTypeIds: supplier.fuel_types?.map((fuel) => Number(fuel.fuel_type_id)) || [],
        }))
      } catch (error) {
        console.error(error)
      }
    },

    // Open delete confirmation modal
    deleteSupplier(id) {
      this.confirmDialog = {
        show: true,
        title: 'Delete Supplier?',
        message: 'Are you sure you want to delete this supplier? This action cannot be undone.',
        confirmText: 'Delete',
        icon: 'mdi-delete-outline',
        confirmColor: '#B60106',
        type: 'delete',
        targetId: id,
      }
    },

    // Open activate/deactivate confirmation modal
    toggleStatus(id) {
      const supplier = this.suppliers.find((s) => s.id === id)

      if (!supplier) return

      const isActive = supplier.status?.toLowerCase() === 'active'
      const action = isActive ? 'deactivate' : 'activate'

      this.confirmDialog = {
        show: true,
        title: isActive ? 'Deactivate Supplier?' : 'Activate Supplier?',
        message: `Are you sure you want to ${action} this supplier?`,
        confirmText: isActive ? 'Deactivate' : 'Activate',
        icon: isActive ? 'mdi-close-circle-outline' : 'mdi-power',
        confirmColor: isActive ? '#B60106' : '#43A047',
        type: 'status',
        targetId: id,
      }
    },

    // Confirm delete or status change action
    async handleConfirm() {
      const id = this.confirmDialog.targetId

      try {
        if (this.confirmDialog.type === 'delete') {
          await SupplierManagement.deleteSupplier(id)
        }

        if (this.confirmDialog.type === 'status') {
          await SupplierManagement.toggleSupplierStatus(id)
        }

        await this.fetchSuppliers()
      } catch (error) {
        console.error(error)
      }

      this.closeConfirm()
    },

    // Close confirmation modal
    closeConfirm() {
      this.confirmDialog.show = false
      this.confirmDialog.targetId = null
      this.confirmDialog.type = ''
    },

    // Reset supplier form
    resetForm() {
      this.modalVisible = false

      this.selectedSupplier = {
        id: null,
        name: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        fuelType: null,
        quantity: '',
        status: 'Active',
      }
    },
  },
}
</script>

<style scoped>
/* Suppliers page container */
.suppliers-page {
  width: 100%;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}

/* Add supplier button */
.add-supplier-btn {
  background: #820000 !important;
  color: #ffffff !important;
  font-family: 'Poppins', sans-serif;
  font-weight: 700 !important;
  font-size: 15px;
  padding: 8px 24px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  height: 44px;
  box-shadow: 0 4px 10px rgba(130, 0, 0, 0.25);
  transition: opacity 0.2s;
}

/* Add supplier button hover effect */
.add-supplier-btn:hover {
  opacity: 0.9;
}

/* Statistics row */
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 27px;
}

/* Statistics card */
.stat-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 3.19px;
  isolation: isolate;
  flex: 1;
  min-width: 280px;
  min-height: 80px;
  background: #ffffff;
  border: 1px solid #820000;
  border-radius: 11px;
  overflow: hidden;
}

/* Top gradient bar */
.gradient-bar {
  position: absolute;
  height: 4px;
  left: 0;
  right: 0;
  top: 0;
  background: linear-gradient(90deg, #b60106 0%, #820000 100%);
  border-radius: 11px 11px 0px 0px;
  z-index: 2;
}

/* Statistics content */
.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 3.19px;
  width: 100%;
  z-index: 0;
  margin-top: 6px;
}

/* Statistics number */
.stat-number {
  width: 100%;
  height: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: -0.72px;
  color: #1a1a1a;
}

/* Statistics label */
.stat-label {
  width: 100%;
  height: 19px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #7a7974;
}

/* Supplier table container */
.table-container {
  width: 100%;
  margin-top: 10px;
}
</style>

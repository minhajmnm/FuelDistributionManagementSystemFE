<template>
  <!-- Confirmation Dialog -->
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
    persistent
  >
    <!-- Confirmation Modal Card -->
    <v-card class="confirmation-modal rounded-xl overflow-hidden">
      <!-- Modal Header -->
      <div class="modal-header d-flex align-center justify-center pt-8 pb-4">
        <!-- Icon Circle -->
        <div class="icon-circle d-flex align-center justify-center">
          <v-icon size="32" color="white">{{ icon }}</v-icon>
        </div>
      </div>

      <!-- Modal Text Content -->
      <v-card-text class="text-center pt-6 pb-4 px-6">
        <h2 class="text-h5 font-weight-bold mb-3 text-grey-darken-4">
          {{ title }}
        </h2>

        <p class="text-body-1 text-grey-darken-1 mb-6">
          {{ message }}
        </p>
      </v-card-text>

      <!-- Modal Action Buttons -->
      <v-card-actions class="justify-center pb-8 px-6 gap-4">
        <!-- Cancel Button -->
        <v-btn
          variant="flat"
          color="#EEEEEE"
          class="text-none px-8 rounded-lg flex-grow-1"
          height="45"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </v-btn>

        <!-- Confirm Button -->
        <v-btn
          variant="flat"
          :color="confirmColor"
          class="text-none px-8 rounded-lg text-white flex-grow-1"
          height="45"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  // Component Name
  name: 'ConfirmationModal',

  // Props received from parent component
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Are you sure?',
    },
    message: {
      type: String,
      default: 'This action cannot be undone.',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    icon: {
      type: String,
      default: 'mdi-alert-outline',
    },
    confirmColor: {
      type: String,
      default: '#B60106',
    },
  },

  // Events emitted to parent component
  emits: ['update:modelValue', 'confirm', 'cancel'],
}
</script>

<style scoped>
/* Main confirmation modal card */
.confirmation-modal {
  background-color: white !important;
}

/* Modal gradient header */
.modal-header {
  background: linear-gradient(180deg, #d32f2f 0%, #b60106 100%);
  position: relative;
  min-height: 120px;
}

/* Circle wrapper for modal icon */
.icon-circle {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

/* Gap utility for action buttons */
.gap-4 {
  gap: 16px;
}
</style>

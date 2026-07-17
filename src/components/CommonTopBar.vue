<template>
  <v-app-bar app fixed elevation="0" color="#FFFFFF" height="69" class="common-topbar">
    <template #prepend>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="$emit('toggle-drawer')" />
    </template>

    <div class="common-topbar__content">
      <div class="common-topbar__titles">
        <div class="common-topbar__page-title">
          {{ title }}
        </div>

        <div class="common-topbar__breadcrumb">
          {{ breadcrumb }}
        </div>
      </div>
      <div v-if="showProfile" class="common-topbar__profile">
        <div class="common-topbar__email">
          {{ email }}
        </div>

        <v-avatar size="42">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </div>
    </div>
  </v-app-bar>
</template>
<script>
export default {
  name: 'CommonTopBar',

  props: {
    title: String,
    breadcrumb: String,
    email: {
      type: String,
      default: '',
    },
    showProfile: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style scoped>
.common-topbar {
  border-bottom: 1px solid #e5e7eb;
}

.common-topbar__content {
  width: 100%;
  height: 69px;
  padding: 0 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.common-topbar__titles {
  flex: 1;
  min-width: 0;
}

.common-topbar__page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .common-topbar__content {
    padding: 0 12px;
  }

  .common-topbar__email {
    display: none;
  }

  .common-topbar__page-title {
    font-size: 14px;
  }
}

.common-topbar__breadcrumb {
  font-size: 12px;
  color: #8a8a8a;
  margin-top: 2px;
}

.common-topbar__profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.common-topbar__email {
  font-size: 14px;
  color: #000;
}
</style>

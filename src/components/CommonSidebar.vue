<template>
  <v-navigation-drawer
    v-model="localDrawer"
    app
    width="280"
    class="common-sidebar"
    elevation="0"
    :permanent="$vuetify.display.mdAndUp"
    :temporary="!$vuetify.display.mdAndUp"
  >
    <div class="common-sidebar__header">
      <img :src="logo" alt="FuelFlow Logo" class="common-sidebar__logo" />
      <div v-if="panelTitle" class="common-sidebar__panel">{{ panelTitle }}</div>
    </div>

    <div v-if="userName || userInfo" class="common-sidebar__user">
      <div class="common-sidebar__user-name">{{ userName }}</div>
      <div class="common-sidebar__user-info">{{ userInfo }}</div>
    </div>

    <div class="common-sidebar__line"></div>

    <v-list dense nav class="common-sidebar__menu">
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.route"
        class="common-sidebar__item"
        active-class="common-sidebar__item--active"
      >
        <template #prepend>
          <v-icon size="22">{{ item.icon }}</v-icon>
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <button class="common-sidebar__logout" @click="$emit('logout')">
      <v-icon size="22">mdi-logout</v-icon>
      <span>Log Out</span>
    </button>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'CommonSidebar',

  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      required: true,
    },
    panelTitle: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    userInfo: {
      type: String,
      default: '',
    },
    menuItems: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:modelValue', 'logout'],

  computed: {
    localDrawer: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>

<style scoped>
.common-sidebar {
  background: linear-gradient(180deg, #b60106 0%, #820000 100%) !important;
  color: #ffffff;
}

.common-sidebar__header {
  width: 100%;
  padding: 24px 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}



.common-sidebar__logo {
  width: 120px;
  height: auto;
  margin-left: 0;
}

.common-sidebar__panel {
  margin-top: 10px;
  margin-left: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #ffffff;
}

.common-sidebar__user {
  padding: 14px 24px;
  text-align: left;
}

.common-sidebar__user-name {
  font-weight: 700;
  font-size: 14px;
    margin-left:20px;
}

.common-sidebar__user-info {
  margin-top: 4px;
  margin-left:20px;
  font-size: 12px;
  opacity: 0.9;
}

.common-sidebar__line {
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  margin: 0 20px 14px;
}

.common-sidebar__menu {
  padding: 0 14px;
}

.common-sidebar__item {
  color: #ffffff !important;
  border-radius: 10px;
  margin-bottom: 8px;
  min-height: 44px;
}

.common-sidebar__item--active {
  background: rgba(255, 255, 255, 0.22) !important;
  border-left: 4px solid #ffffff;
}

.common-sidebar__logout {
  position: absolute;
  left: 24px;
  bottom: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 960px) {
  .common-sidebar__logout {
    position: static;
    margin: 20px 24px;
  }
}
</style>
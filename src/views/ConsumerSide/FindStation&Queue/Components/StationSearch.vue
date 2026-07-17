<template>
  <!-- Station Search Component -->
  <div class="station-search">
    <!-- Filter and Search Section -->
    <div class="station-search__filters">
      <!-- Fuel Type Dropdown -->
      <div class="filter-select-wrapper">
        <select v-model="selectedFuelType" class="filter-select">
          <option disabled value="">Select Fuel Type (required)</option>

          <option v-for="fuel in fuelTypes" :key="fuel.id" :value="fuel.name">
            {{ fuel.name }}
          </option>
        </select>

        <!-- Dropdown Arrow Icon -->
        <v-icon class="select-arrow" size="16">mdi-chevron-down</v-icon>
      </div>

      <!-- Station Search Input -->
      <div class="search-input-wrapper">
        <v-icon class="search-icon" size="16" color="#555">mdi-magnify</v-icon>

        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search by station name or area . . ."
          @input="emitFilter"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Component Name
  name: 'StationSearch',

  // Props received from parent component
  props: {
    fuelTypes: {
      type: Array,
      default: () => [],
    },
  },

  // Component State
  data() {
    return {
      selectedFuelType: '',
      searchQuery: '',
    }
  },

  watch: {
    // Emit filter data when fuel type changes
    selectedFuelType() {
      this.emitFilter()
    },
  },

  methods: {
    // Send selected filter values to parent component
    emitFilter() {
      this.$emit('filter-change', {
        fuelType: this.selectedFuelType,
        query: this.searchQuery,
      })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@300;400;500;700&display=swap');

/* Filter section container */
.station-search__filters {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* Fuel type select wrapper */
.filter-select-wrapper {
  position: relative;
  flex: 0 0 279px;
}

/* Fuel type select field */
.filter-select {
  width: 100%;
  height: 41px;
  padding: 8px 40px 8px 16px;
  appearance: none;
  -webkit-appearance: none;
  border: none;
  border-radius: 11px;
  background: rgba(235, 204, 204, 0.32);
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: #000;
  cursor: pointer;
}

/* Select focus state */
.filter-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(123, 30, 43, 0.25);
}

/* Select dropdown arrow */
.select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #555;
  font-size: 13px;
}

/* Search input wrapper */
.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

/* Search icon */
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
}

/* Search input field */
.search-input {
  width: 100%;
  box-sizing: border-box;
  height: 41px;
  padding: 8px 16px 8px 38px;
  border: none;
  border-radius: 11px;
  background: rgba(235, 204, 204, 0.32);
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: #000;
}

/* Search placeholder text */
.search-input::placeholder {
  color: #000;
  opacity: 0.45;
}

/* Search focus state */
.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(123, 30, 43, 0.25);
}

/* Tablet responsive layout */
@media (max-width: 960px) {
  .station-search__filters {
    flex-direction: column;
  }

  .filter-select-wrapper {
    width: 100%;
    flex: unset;
  }
}
</style>

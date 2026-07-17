<template>
  <!-- Current Queue Card -->
  <v-card class="queue-card card" elevation="0">
    <!-- Card Header -->
    <div class="card-head">
      <span class="card-title">Current Queue</span>

      <!-- Live Badge -->
      <span class="badge badge-warn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Live
      </span>
    </div>

    <!-- Card Body -->
    <v-card-text class="card-body">
      <!-- Active Queue Details -->
      <div v-if="hasActiveQueue" class="queue-hero" style="--remove-bg: none">
        <div style="display: none"></div>

        <div class="queue-hero-label">Your token number</div>

        <div class="queue-number">{{ queue.tokenNumber }}</div>

        <div class="queue-station">{{ queue.fuelType }} {{ queue.stationName }}</div>

        <!-- Queue Waiting Information -->
        <div class="queue-ahead">
          <span class="queue-dot"></span>
          <span>
            <strong>{{ queue.peopleAhead }} people</strong> ahead of you Est. wait:
            <strong>~{{ queue.estimatedWait }} min</strong>
          </span>
        </div>
      </div>

      <!-- Empty Queue State -->
      <div v-else class="queue-empty">
        <v-icon size="36" color="grey-lighten-1"> mdi-gas-station </v-icon>

        <p>You are not in any queue</p>

        <v-btn class="btn btn-primary btn-sm" elevation="0" @click="$emit('join-queue')">
          Join a Queue
        </v-btn>
      </div>

      <!-- Queue Action Buttons -->
      <div v-if="hasActiveQueue" class="queue-actions">
        <!-- Refresh Button -->
        <v-btn
          class="btn btn-outline btn-sm"
          elevation="0"
          @click="handleRefresh"
          :disabled="refreshing"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :class="{ spinning: refreshing }"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.84" />
          </svg>

          {{ refreshing ? 'Refreshing' : 'Refresh' }}
        </v-btn>

        <!-- Leave Queue Button -->
        <v-btn
          v-if="queue.queueStatus === 'Waiting'"
          class="btn btn-outline btn-sm btn-danger"
          elevation="0"
          @click="$emit('leave-queue')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>

          Leave Queue
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // Component Name
  name: 'QueueCard',

  // Events sent to parent component
  emits: ['join-queue', 'leave-queue', 'refresh'],

  // Props received from parent component
  props: {
    queue: {
      type: Object,
      default: () => ({}),
    },

    hasActiveQueue: {
      type: Boolean,
      default: true,
    },
  },

  // Component State
  data() {
    return {
      refreshing: false,
    }
  },

  methods: {
    // Refresh queue details
    async handleRefresh() {
      this.refreshing = true
      this.$emit('refresh')

      await new Promise((r) => setTimeout(r, 1000))

      this.refreshing = false
    },
  },
}
</script>

<style scoped>
/* Main card container */
.card {
  background: #ffffff;
  border-radius: 11px;
  border: 1px solid #820000;
  box-shadow:
    0 2px 8px rgba(123, 30, 43, 0.07),
    0 8px 28px rgba(123, 30, 43, 0.08);
  overflow: hidden;
}

/* Card header */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e8d8cc;
}

/* Card title */
.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #2a1a1e;
}

/* Card body */
.card-body {
  padding: 1.25rem;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

/* Badge icon */
.badge svg {
  width: 9px;
  height: 9px;
}

/* Live warning badge */
.badge-warn {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fcd34d;
}

/* Active queue hero section */
.queue-hero {
  background: linear-gradient(135deg, #4e1119, #7b1e2b 55%, #8b2535);
  border-radius: 10px;
  padding: 1.375rem 1.5rem;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
}

/* Disable queue hero pseudo elements */
.queue-hero::before,
.queue-hero::after {
  display: none;
}

/* Queue hero background circle */
.queue-hero::after {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

/* Queue hero background circle */
.queue-hero::before {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 35%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  pointer-events: none;
}

/* Queue token label */
.queue-hero-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 0.25rem;
}

/* Queue token number */
.queue-number {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
}

/* Queue hash symbol */
.queue-hash {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  vertical-align: super;
  margin-right: 2px;
}

/* Queue station details */
.queue-station {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 0.25rem;
}

/* Queue people ahead text */
.queue-ahead {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Queue ahead strong text */
.queue-ahead strong {
  color: #fff;
}

/* Queue live dot */
.queue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0a93c;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(224, 169, 60, 0.25);
  animation: pulse 2s infinite;
}

/* Queue dot pulse animation */
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px rgba(224, 169, 60, 0.25);
  }

  50% {
    box-shadow: 0 0 0 6px rgba(224, 169, 60, 0.1);
  }
}

/* Empty queue state */
.queue-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  gap: 0.875rem;
  text-align: center;
  color: #b89fa5;
}

/* Empty queue icon */
.queue-empty svg {
  width: 36px;
  height: 36px;
  opacity: 0.4;
}

/* Empty queue text */
.queue-empty p {
  font-size: 0.8rem;
  color: #7a5c62;
}

/* Queue action buttons container */
.queue-actions {
  display: flex;
  gap: 0.625rem;
}

/* Common button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 7px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  border: none;
}

/* Button icon */
.btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Small button */
.btn-sm {
  padding: 0.4rem 0.875rem;
  font-size: 0.775rem;
}

/* Primary button */
.btn-primary {
  background: linear-gradient(104.47deg, #4e1119 0%, #7b1e2b 55%, #9b2d3e 100%);
  color: #fff;
  box-shadow: 0 2px 10px rgba(123, 30, 43, 0.25);
}

/* Primary button hover */
.btn-primary:hover {
  box-shadow: 0 4px 18px rgba(123, 30, 43, 0.38);
  transform: translateY(-1px);
}

/* Outline button */
.btn-outline {
  flex: 1;
  background: transparent;
  color: #7b1e2b;
  border: 1px solid rgba(123, 30, 43, 0.5);
}

/* Outline button hover */
.btn-outline:hover {
  background: #f9eced;
}

/* Danger button */
.btn-danger {
  color: #c0392b;
  border-color: #f5b8b2;
}

/* Danger button hover */
.btn-danger:hover {
  background: #fdf0ee;
}

/* Disabled button */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Spinning refresh icon */
.spinning {
  animation: spin 0.8s linear infinite;
}

/* Refresh icon spin animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

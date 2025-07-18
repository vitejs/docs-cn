<template>
  <div class="difficulty-indicator">
    <div class="difficulty-header">
      <span class="difficulty-label">{{ label || 'Implementation Difficulty' }}</span>
      <div class="difficulty-rating">
        <span 
          v-for="i in 5" 
          :key="i" 
          class="difficulty-star"
          :class="{ 'filled': i <= difficulty, 'empty': i > difficulty }"
        >
          ★
        </span>
      </div>
    </div>
    <div v-if="time" class="difficulty-time">
      <span class="time-icon">⏱️</span> {{ time }}
    </div>
    <div v-if="prerequisites && prerequisites.length" class="difficulty-prerequisites">
      <div class="prerequisites-header">Prerequisites:</div>
      <ul class="prerequisites-list">
        <li v-for="(prereq, index) in prerequisites" :key="index">{{ prereq }}</li>
      </ul>
    </div>
    <div v-if="$slots.default" class="difficulty-description">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  difficulty: {
    type: Number,
    default: 3,
    validator: (value) => value >= 1 && value <= 5
  },
  label: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  prerequisites: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.difficulty-indicator {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.difficulty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.difficulty-label {
  font-weight: 600;
  font-size: 1rem;
}

.difficulty-rating {
  display: flex;
}

.difficulty-star {
  font-size: 1.2rem;
  margin-left: 2px;
}

.filled {
  color: var(--vp-c-brand);
}

.empty {
  color: var(--vp-c-gray-light-3);
}

.difficulty-time {
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.time-icon {
  margin-right: 5px;
}

.difficulty-prerequisites {
  margin-top: 10px;
  font-size: 0.9rem;
}

.prerequisites-header {
  font-weight: 600;
  margin-bottom: 5px;
}

.prerequisites-list {
  margin: 0;
  padding-left: 20px;
}

.difficulty-description {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>

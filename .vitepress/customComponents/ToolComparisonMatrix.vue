<template>
  <div class="comparison-matrix">
    <div class="matrix-table-container">
      <table class="matrix-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" 
                :class="{ 'highlight': column.highlight }">
              {{ column.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in tools" :key="tool.name">
            <td v-for="column in columns" :key="column.key" 
                :class="{ 'highlight': column.highlight }">
              <div v-if="column.key === 'name'" class="tool-name">
                <div class="tool-name-wrapper">
                  {{ tool.name }}
                  <a v-if="tool.url" :href="tool.url" target="_blank" class="tool-link">
                    <span class="link-icon">↗</span>
                  </a>
                </div>
              </div>
              <div v-else-if="column.key === 'features'" class="feature-list">
                <template v-if="Array.isArray(tool.features)">
                  <div v-for="(feature, index) in tool.features" :key="index" class="feature-item">
                    • {{ feature }}
                  </div>
                </template>
                <template v-else>
                  {{ tool.features }}
                </template>
              </div>
              <div v-else-if="column.key === 'bestFor'" class="feature-list">
                <template v-if="Array.isArray(tool.bestFor)">
                  <div v-for="(item, index) in tool.bestFor" :key="index" class="feature-item">
                    • {{ item }}
                  </div>
                </template>
                <template v-else>
                  {{ tool.bestFor }}
                </template>
              </div>
              <div v-else-if="column.key === 'languages'" class="language-list">
                <template v-if="Array.isArray(tool.languages)">
                  {{ tool.languages.join(", ") }}
                </template>
                <template v-else>
                  {{ tool.languages }}
                </template>
              </div>
              <div v-else-if="column.type === 'boolean'" class="boolean-value">
                <span v-if="tool[column.key]" class="value-yes">✓</span>
                <span v-else class="value-no">✗</span>
              </div>
              <div v-else>{{ tool[column.key] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  tools: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.comparison-matrix {
  margin: 20px 0;
  font-size: 0.9rem;
  width: 100%;
}

.matrix-table-container {
  overflow-x: auto;
  max-width: 100%; /* Ensure it adapts to the wider content area */
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--vp-c-divider);
  table-layout: fixed; /* For better control of column widths */
}

.matrix-table th,
.matrix-table td {
  padding: 12px 15px;
  border: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
  word-break: break-word; /* Better handling of long text */
}

.matrix-table th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
}

.matrix-table tr:nth-child(even) {
  background-color: var(--vp-c-bg-soft);
}

.tool-name {
  font-weight: 600;
}

.tool-name-wrapper {
  display: flex;
  align-items: center;
}

.tool-link {
  margin-left: 5px;
  color: var(--vp-c-brand);
  text-decoration: none;
}

.link-icon {
  font-size: 0.8rem;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-item {
  display: block;
  padding-left: 5px;
}

.boolean-value {
  text-align: center;
  font-weight: bold;
}

.value-yes {
  color: var(--vp-c-green);
}

.value-no {
  color: var(--vp-c-red);
}

.highlight {
  background-color: rgba(var(--vp-c-brand-rgb), 0.1);
}

@media (max-width: 640px) {
  .matrix-table th,
  .matrix-table td {
    padding: 8px 10px;
    font-size: 0.8rem;
  }
  
  .language-list {
    max-width: 150px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }
}
</style>

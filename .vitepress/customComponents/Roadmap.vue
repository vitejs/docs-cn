<template>
  <div class="roadmap-container">
    <!-- Simplified Control Panel -->
    <div class="roadmap-controls">
      <div class="control-section">
        <label>🎯 Learning Path Progress</label>
        <div class="progress-info">
          <span class="node-count">{{ nodes.length }} Learning Modules</span>
          <span class="category-count">{{ categories.length }} Categories</span>
        </div>
      </div>
      
      <div class="control-actions">
        <button @click="resetView" class="btn btn-reset">
          🔄 Reset View
        </button>
        <button @click="fitToScreen" class="btn btn-fit">
          📐 Fit to Screen
        </button>
      </div>
    </div>

    <!-- ArgoCD-style Viewport -->
    <div class="roadmap-viewport">
      <div 
        ref="cytoscapeEl" 
        class="cytoscape-canvas"
        :style="{ height: containerHeight }"
      ></div>
      
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Building learning roadmap...</p>
      </div>
    </div>

    <!-- ArgoCD-style Node Details Panel -->
    <transition name="slide-in">
      <div v-if="activeNode" class="node-details-panel">
        <div class="panel-header">
          <div class="node-status">
            <div class="status-indicator" :class="getNodeStatus(activeNode)"></div>
            <h3>{{ activeNode.data.label }}</h3>
          </div>
          <button @click="closeDetails" class="close-btn">✕</button>
        </div>
        
        <div class="panel-content">
          <!-- Category Section -->
          <div class="detail-section">
            <div class="section-header">
              <span class="section-icon">📂</span>
              <span class="section-title">Category</span>
            </div>
            <span 
              class="category-badge"
              :style="{ backgroundColor: getCategoryColor(activeNode.data.category) }"
            >
              {{ activeNode.data.category }}
            </span>
          </div>

          <!-- Description Section -->
          <div v-if="activeNode.data.description" class="detail-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Description</span>
            </div>
            <p class="description-text">{{ activeNode.data.description }}</p>
          </div>

          <!-- Metrics Section -->
          <div class="detail-section">
            <div class="section-header">
              <span class="section-icon">📊</span>
              <span class="section-title">Learning Metrics</span>
            </div>
            <div class="metrics-grid">
              <div v-if="activeNode.data.difficulty" class="metric-item">
                <span class="metric-label">Difficulty</span>
                <div class="difficulty-indicator">
                  <div 
                    class="difficulty-bar"
                    :style="{ 
                      width: `${(activeNode.data.difficulty / 5) * 100}%`,
                      backgroundColor: getDifficultyColor(activeNode.data.difficulty)
                    }"
                  ></div>
                  <span class="difficulty-text">{{ activeNode.data.difficulty }}/5</span>
                </div>
              </div>
              <div v-if="activeNode.data.estimatedTime" class="metric-item">
                <span class="metric-label">Duration</span>
                <span class="metric-value">{{ activeNode.data.estimatedTime }}</span>
              </div>
            </div>
          </div>

          <!-- Prerequisites Section -->
          <div v-if="activeNode.data.prerequisites?.length" class="detail-section">
            <div class="section-header">
              <span class="section-icon">🔗</span>
              <span class="section-title">Prerequisites</span>
            </div>
            <div class="prereq-list">
              <div 
                v-for="prereq in activeNode.data.prerequisites" 
                :key="prereq"
                class="prereq-item"
              >
                {{ prereq }}
              </div>
            </div>
          </div>

          <!-- Actions Section -->
          <div class="detail-section">
            <div class="section-header">
              <span class="section-icon">🚀</span>
              <span class="section-title">Actions</span>
            </div>
            <div class="action-buttons">
              <a 
                v-if="activeNode.data.url" 
                :href="activeNode.data.url" 
                class="action-btn primary"
                target="_blank"
              >
                📖 Start Learning
              </a>
              <button 
                @click="showConnections" 
                class="action-btn secondary"
              >
                🔗 Show Dependencies
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'

// Register Cytoscape extensions
cytoscape.use(dagre)

/**
 * Props definition - simplified for ArgoCD-style usage
 */
const props = defineProps({
  nodes: {
    type: Array,
    required: true,
    default: () => []
  },
  edges: {
    type: Array,
    required: true,
    default: () => []
  },
  height: {
    type: String,
    default: '700px'
  },
  theme: {
    type: String,
    default: 'light'
  },
  colorScheme: {
    type: Object,
    default: () => ({
      primary: '#1976d2',
      secondary: '#424242',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    })
  }
})

/**
 * Reactive state
 */
const cytoscapeEl = ref(null)
const cyInstance = ref(null)
const isLoading = ref(true)
const activeNode = ref(null)
const containerHeight = ref(props.height)

/**
 * ArgoCD-inspired color palette
 */
const argoCDColors = {
  'Foundation': '#2196f3',      // Blue
  'Core': '#4caf50',            // Green  
  'Configuration': '#ff9800',   // Orange
  'Security': '#f44336',        // Red
  'Operations': '#9c27b0',      // Purple
  'Advanced': '#607d8b',        // Blue Grey
  'DevOps': '#795548',          // Brown
  'Enterprise': '#e91e63',      // Pink
  'Prerequisites': '#00bcd4',   // Cyan
  'Development': '#8bc34a',     // Light Green
  'Cloud Managed': '#3f51b5',   // Indigo
  'Self-Managed': '#ff5722'     // Deep Orange
}

/**
 * Computed categories
 */
const categories = computed(() => {
  const categoryMap = new Map()
  
  props.nodes.forEach(node => {
    const category = node.data?.category || 'Uncategorized'
    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        id: category,
        name: category,
        color: argoCDColors[category] || '#757575'
      })
    }
  })
  
  return Array.from(categoryMap.values())
})

/**
 * ArgoCD-style Cytoscape configuration
 */
const getArgoCDStyles = () => [
  // Base node styling - ArgoCD card style
  {
    selector: 'node',
    style: {
      'background-color': '#ffffff',
      'border-color': 'data(borderColor)',
      'border-width': '2px',
      'color': '#424242',
      'font-family': 'Roboto, sans-serif',
      'font-size': '12px',
      'font-weight': '500',
      'label': 'data(label)',
      'text-wrap': 'wrap',
      'text-max-width': '120px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': '140px',
      'height': '60px',
      'shape': 'roundrectangle',
      'overlay-opacity': 0,
      'box-shadow-blur': '4px',
      'box-shadow-color': 'rgba(0,0,0,0.1)',
      'box-shadow-offset-x': '0px',
      'box-shadow-offset-y': '2px',
      'transition-property': 'border-color, box-shadow-color',
      'transition-duration': '200ms'
    }
  },
  
  // Node hover - ArgoCD hover effect
  {
    selector: 'node:hover',
    style: {
      'border-width': '3px',
      'cursor': 'pointer',
      'box-shadow-color': 'rgba(0,0,0,0.2)',
      'box-shadow-blur': '8px'
    }
  },
  
  // Selected node - ArgoCD selected state
  {
    selector: 'node:selected',
    style: {
      'border-width': '3px',
      'border-color': props.colorScheme.primary,
      'box-shadow-color': 'rgba(25,118,210,0.3)',
      'box-shadow-blur': '12px'
    }
  },
  
  // Edges - ArgoCD flow style
  {
    selector: 'edge',
    style: {
      'width': '2px',
      'line-color': '#bdbdbd',
      'target-arrow-color': '#bdbdbd',
      'target-arrow-shape': 'triangle',
      'target-arrow-size': '10px',
      'curve-style': 'bezier',
      'source-endpoint': 'outside-to-node',
      'target-endpoint': 'outside-to-node',
      'transition-property': 'line-color, target-arrow-color, width',
      'transition-duration': '200ms'
    }
  },
  
  // Highlighted edges - ArgoCD dependency highlight
  {
    selector: 'edge.highlighted',
    style: {
      'width': '4px',
      'line-color': props.colorScheme.primary,
      'target-arrow-color': props.colorScheme.primary,
      'z-index': 10
    }
  },
  
  // Node status classes
  {
    selector: '.completed',
    style: {
      'border-color': '#4caf50',
      'background-color': '#e8f5e8'
    }
  },
  {
    selector: '.in-progress',
    style: {
      'border-color': '#ff9800',
      'background-color': '#fff3e0'
    }
  },
  {
    selector: '.not-started',
    style: {
      'border-color': '#9e9e9e',
      'background-color': '#fafafa'
    }
  }
]

/**
 * Dagre layout configuration - ArgoCD style
 */
const getDagreLayout = () => ({
  name: 'dagre',
  rankDir: 'TB',
  align: 'UL',
  nodeSep: 60,
  rankSep: 100,
  edgeSep: 30,
  marginX: 40,
  marginY: 40,
  animate: true,
  animationDuration: 300,
  fit: true,
  padding: 30
})

/**
 * Process nodes with ArgoCD styling
 */
const processNodes = () => {
  return props.nodes.map(node => {
    const category = node.data?.category || 'Uncategorized'
    const categoryColor = getCategoryColor(category)
    
    return {
      ...node,
      data: {
        ...node.data,
        borderColor: categoryColor,
        categoryColor: categoryColor
      }
    }
  })
}

/**
 * Helper functions
 */
const getCategoryColor = (categoryName) => {
  return argoCDColors[categoryName] || '#757575'
}

const getNodeStatus = (node) => {
  // Default status logic - can be customized
  return 'not-started'
}

const getDifficultyColor = (difficulty) => {
  if (difficulty <= 2) return '#4caf50'  // Easy - Green
  if (difficulty <= 3) return '#ff9800'  // Medium - Orange  
  return '#f44336'                       // Hard - Red
}

/**
 * Initialize Cytoscape with ArgoCD styling
 */
const initializeCytoscape = () => {
  if (!cytoscapeEl.value) return

  isLoading.value = true
  
  try {
    const processedNodes = processNodes()
    
    cyInstance.value = cytoscape({
      container: cytoscapeEl.value,
      elements: {
        nodes: processedNodes,
        edges: props.edges
      },
      style: getArgoCDStyles(),
      layout: getDagreLayout(),
      
      // Interaction settings
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      selectionType: 'single',
      wheelSensitivity: 0.1,
      minZoom: 0.3,
      maxZoom: 2
    })

    setupEventHandlers()
    
    // Initial view setup
    setTimeout(() => {
      cyInstance.value?.fit()
      isLoading.value = false
    }, 100)
    
  } catch (error) {
    console.error('Failed to initialize Cytoscape:', error)
    isLoading.value = false
  }
}

/**
 * Event handlers
 */
const setupEventHandlers = () => {
  if (!cyInstance.value) return

  // Node selection
  cyInstance.value.on('tap', 'node', (event) => {
    const node = event.target
    activeNode.value = node
    highlightConnections(node)
  })

  // Background click to deselect
  cyInstance.value.on('tap', (event) => {
    if (event.target === cyInstance.value) {
      activeNode.value = null
      clearHighlights()
    }
  })
}

/**
 * Highlight node connections
 */
const highlightConnections = (node) => {
  clearHighlights()
  
  const connectedEdges = node.connectedEdges()
  connectedEdges.addClass('highlighted')
}

/**
 * Clear highlights
 */
const clearHighlights = () => {
  if (!cyInstance.value) return
  cyInstance.value.elements().removeClass('highlighted')
}

/**
 * Control functions
 */
const resetView = () => {
  if (!cyInstance.value) return
  
  cyInstance.value.fit()
  cyInstance.value.center()
}

const fitToScreen = () => {
  if (!cyInstance.value) return
  cyInstance.value.fit()
}

const closeDetails = () => {
  activeNode.value = null
  clearHighlights()
}

const showConnections = () => {
  if (!activeNode.value) return
  highlightConnections(activeNode.value)
}

/**
 * Lifecycle
 */
onMounted(() => {
  nextTick(() => {
    initializeCytoscape()
  })
})

onUnmounted(() => {
  if (cyInstance.value) {
    cyInstance.value.destroy()
  }
})

/**
 * Watchers
 */
watch(() => [props.nodes, props.edges], () => {
  if (cyInstance.value) {
    const processedNodes = processNodes()
    cyInstance.value.elements().remove()
    cyInstance.value.add({ nodes: processedNodes, edges: props.edges })
    cyInstance.value.layout(getDagreLayout()).run()
  }
}, { deep: true })
</script>

<style scoped>
/* ArgoCD-inspired styling */
.roadmap-container {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin: 24px 0;
  font-family: 'Roboto', sans-serif;
}

/* Control Panel - ArgoCD header style */
.roadmap-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.control-section label {
  font-size: 1rem;
  font-weight: 600;
  color: #424242;
  margin-bottom: 4px;
  display: block;
}

.progress-info {
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  color: #757575;
}

.node-count,
.category-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-actions {
  display: flex;
  gap: 12px;
}

/* ArgoCD-style buttons */
.btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #424242;
}

.btn:hover {
  background: #f5f5f5;
  border-color: #bdbdbd;
}

.btn-reset {
  color: #1976d2;
  border-color: #1976d2;
}

.btn-fit {
  color: #388e3c;
  border-color: #388e3c;
}

/* Viewport */
.roadmap-viewport {
  position: relative;
  background: #ffffff;
}

.cytoscape-canvas {
  width: 100%;
  background: #ffffff;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 1000;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ArgoCD-style Node Details Panel */
.node-details-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 360px;
  max-height: calc(100% - 32px);
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.node-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #9e9e9e;
}

.status-indicator.completed {
  background: #4caf50;
}

.status-indicator.in-progress {
  background: #ff9800;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #424242;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #757575;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #424242;
}

.panel-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* Detail sections */
.detail-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon {
  font-size: 1rem;
}

.section-title {
  font-weight: 600;
  color: #424242;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description-text {
  margin: 0;
  color: #616161;
  line-height: 1.5;
  font-size: 0.875rem;
}

/* Metrics grid */
.metrics-grid {
  display: grid;
  gap: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-weight: 500;
  color: #757575;
  font-size: 0.875rem;
}

.metric-value {
  font-weight: 600;
  color: #424242;
  font-size: 0.875rem;
}

.difficulty-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 120px;
}

.difficulty-bar {
  height: 4px;
  border-radius: 2px;
  background: #e0e0e0;
  position: relative;
  flex: 1;
}

.difficulty-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #424242;
}

/* Prerequisites */
.prereq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prereq-item {
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #616161;
  border-left: 3px solid #e0e0e0;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.action-btn.primary {
  background: #1976d2;
  color: white;
}

.action-btn.primary:hover {
  background: #1565c0;
}

.action-btn.secondary {
  background: #ffffff;
  color: #424242;
  border: 1px solid #e0e0e0;
}

.action-btn.secondary:hover {
  background: #f5f5f5;
}

/* Animations */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .roadmap-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .progress-info {
    justify-content: center;
  }
  
  .control-actions {
    justify-content: center;
  }
  
  .node-details-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    max-height: none;
    border-radius: 0;
  }
}
</style>
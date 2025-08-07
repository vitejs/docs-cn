<template>
  <div class="roadmap-container">
    <!-- Milestone Progress Header -->
    <div class="roadmap-controls">
      <div class="milestone-progress">
        <div class="progress-header">
          <h3>🎯 Kubernetes Learning Roadmap</h3>
          <p>Master Kubernetes through structured milestones and learning units</p>
        </div>
        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-number">{{ milestoneCount }}</span>
            <span class="stat-label">Milestones</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ unitCount }}</span>
            <span class="stat-label">Learning Units</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalSubjects }}</span>
            <span class="stat-label">Total Subjects</span>
          </div>
        </div>
      </div>
      
      <div class="control-actions">
        <button @click="resetView" class="btn btn-reset">
          🔄 Reset View
        </button>
        <button @click="fitToScreen" class="btn btn-fit">
          📐 Fit to Screen
        </button>
        <button @click="toggleOrientation" class="btn btn-orientation">
          {{ isVertical ? '↔️ Horizontal' : '↕️ Vertical' }}
        </button>
      </div>
    </div>

    <!-- Learning Roadmap Viewport -->
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

    <!-- Enhanced Learning Unit Details Panel -->
    <transition name="slide-in">
      <div v-if="activeNode" class="unit-details-panel">
        <div class="panel-header">
          <div class="unit-info">
            <div class="unit-type" :class="getUnitType(activeNode)">
              {{ getUnitTypeLabel(activeNode) }}
            </div>
            <h3>{{ activeNode.data.label }}</h3>
            <div class="unit-meta">
              <span class="difficulty-badge" :class="getDifficultyClass(activeNode.data.difficulty)">
                {{ getDifficultyLabel(activeNode.data.difficulty) }}
              </span>
              <span class="time-estimate">{{ activeNode.data.estimatedTime }}</span>
            </div>
          </div>
          <button @click="closeDetails" class="close-btn">✕</button>
        </div>
        
        <div class="panel-content">
          <!-- Description Section -->
          <div v-if="activeNode.data.description" class="detail-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Description</span>
            </div>
            <p class="description-text">{{ activeNode.data.description }}</p>
          </div>

          <!-- Learning Progress -->
          <div v-if="!isMilestone(activeNode)" class="detail-section">
            <div class="section-header">
              <span class="section-icon">📊</span>
              <span class="section-title">Learning Progress</span>
            </div>
            <div class="progress-metrics">
              <div class="progress-item">
                <label>Subjects Completed</label>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '0%' }"></div>
                  <span class="progress-text">0 / {{ getSubjectCount(activeNode) }}</span>
                </div>
              </div>
              <div class="progress-item">
                <label>Tasks Completed</label>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '0%' }"></div>
                  <span class="progress-text">0 / {{ getTaskCount(activeNode) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Prerequisites -->
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
                <span class="prereq-status">✓</span>
                {{ prereq }}
              </div>
            </div>
          </div>

          <!-- Learning Path -->
          <div class="detail-section">
            <div class="section-header">
              <span class="section-icon">🛤️</span>
              <span class="section-title">Learning Path</span>
            </div>
            <div class="learning-path">
              <div class="path-item current">
                <span class="path-status">📍</span>
                <span class="path-label">{{ activeNode.data.label }}</span>
              </div>
              <div v-for="next in getNextUnits(activeNode)" :key="next" class="path-item next">
                <span class="path-status">→</span>
                <span class="path-label">{{ next }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
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
                @click="showLearningPath" 
                class="action-btn secondary"
              >
                🗺️ Show Path
              </button>
              <button 
                v-if="!isMilestone(activeNode)"
                @click="markComplete" 
                class="action-btn success"
              >
                ✅ Mark Complete
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
    default: '800px'
  },
  theme: {
    type: String,
    default: 'light'
  },
  colorScheme: {
    type: Object,
    default: () => ({
      primary: '#326ce5',
      secondary: '#51a3f5',
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
const isVertical = ref(true)

/**
 * Milestone and Unit specific color scheme
 */
const roadmapColors = {
  'Milestone': '#ffd54f',        // Yellow for milestones
  'Unit 01': '#81c784',          // Light Green for Unit 01
  'Unit 02': '#64b5f6',          // Light Blue for Unit 02  
  'Unit 03': '#ffb74d',          // Light Orange for Unit 03
  'Unit 04': '#f06292',          // Light Pink for Unit 04
  'Prerequisites': '#90a4ae',    // Blue Grey for prerequisites
  'Foundation': '#a5d6a7',       // Pale Green
  'Core': '#90caf9',            // Pale Blue
  'Security': '#ffcdd2',        // Pale Red
  'Operations': '#d1c4e9',      // Pale Purple
  'Advanced': '#ffecb3'         // Pale Amber
}

/**
 * Computed properties for roadmap statistics
 */
const milestoneCount = computed(() => {
  return props.nodes.filter(node => node.data?.category === 'Milestone').length
})

const unitCount = computed(() => {
  return props.nodes.filter(node => 
    node.data?.category && node.data.category.startsWith('Unit')
  ).length
})

const totalSubjects = computed(() => {
  return props.nodes.reduce((total, node) => {
    if (node.data?.subjects) {
      return total + node.data.subjects
    }
    return total + (node.data?.category?.startsWith('Unit') ? 4 : 0)
  }, 0)
})

/**
 * Enhanced Cytoscape styling for educational roadmap
 */
const getRoadmapStyles = () => [
  // Milestone nodes - Large yellow rectangles
  {
    selector: 'node[category="Milestone"]',
    style: {
      'background-color': '#fff59d',
      'border-color': '#fbc02d',
      'border-width': '4px',
      'color': '#f57f17',
      'font-family': 'Inter, sans-serif',
      'font-size': '16px',
      'font-weight': '700',
      'label': 'data(label)',
      'text-wrap': 'wrap',
      'text-max-width': '200px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': '280px',
      'height': '100px',
      'shape': 'round-rectangle',
      'shadow-blur': '12px',
      'shadow-color': 'rgba(251, 192, 45, 0.3)',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px'
    }
  },

  // Unit nodes - Medium colored rectangles
  {
    selector: 'node[category^="Unit"]',
    style: {
      'background-color': 'data(unitColor)',
      'border-color': 'data(unitBorderColor)',
      'border-width': '3px',
      'color': '#2c3e50',
      'font-family': 'Inter, sans-serif',
      'font-size': '14px',
      'font-weight': '600',
      'label': 'data(label)',
      'text-wrap': 'wrap',
      'text-max-width': '180px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': '220px',
      'height': '80px',
      'shape': 'round-rectangle',
      'shadow-blur': '8px',
      'shadow-color': 'rgba(0,0,0,0.15)',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '3px'
    }
  },

  // Regular nodes - Smaller rectangles
  {
    selector: 'node:not([category="Milestone"]):not([category^="Unit"])',
    style: {
      'background-color': '#ffffff',
      'border-color': 'data(borderColor)',
      'border-width': '2px',
      'color': '#2c3e50',
      'font-family': 'Inter, sans-serif',
      'font-size': '12px',
      'font-weight': '500',
      'label': 'data(label)',
      'text-wrap': 'wrap',
      'text-max-width': '140px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': '160px',
      'height': '60px',
      'shape': 'round-rectangle',
      'shadow-blur': '6px',
      'shadow-color': 'rgba(0,0,0,0.1)',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px'
    }
  },

  // Hover effects
  {
    selector: 'node:hover',
    style: {
      'border-width': '5px',
      'cursor': 'pointer',
      'shadow-blur': '16px',
      'shadow-color': 'rgba(0,0,0,0.25)',
      'z-index': 10
    }
  },

  // Selected state
  {
    selector: 'node:selected',
    style: {
      'border-width': '6px',
      'border-color': props.colorScheme.primary,
      'shadow-blur': '20px',
      'shadow-color': 'rgba(50, 108, 229, 0.4)',
      'z-index': 15
    }
  },

  // Taxi-style edges for clean orthogonal connections
  {
    selector: 'edge',
    style: {
      'width': '4px',
      'line-color': '#bdbdbd',
      'target-arrow-color': '#757575',
      'target-arrow-shape': 'triangle',
      'target-arrow-size': '12px',
      'curve-style': 'taxi',
      'taxi-direction': isVertical.value ? 'downward' : 'rightward',
      'taxi-turn': '50%',
      'taxi-turn-min-distance': '20px',
      'source-endpoint': 'outside-to-node',
      'target-endpoint': 'outside-to-node',
      'edge-distances': 'node-position',
      'transition-property': 'line-color, target-arrow-color, width',
      'transition-duration': '200ms'
    }
  },

  // Highlighted path edges
  {
    selector: 'edge.highlighted',
    style: {
      'width': '6px',
      'line-color': props.colorScheme.primary,
      'target-arrow-color': props.colorScheme.primary,
      'z-index': 20
    }
  },

  // Milestone connection edges - Special styling
  {
    selector: 'edge[source$="milestone"]',
    style: {
      'width': '6px',
      'line-color': '#fbc02d',
      'target-arrow-color': '#f57f17',
      'target-arrow-size': '16px'
    }
  }
]

/**
 * Dagre layout optimized for educational roadmap
 */
const getRoadmapLayout = () => ({
  name: 'dagre',
  rankDir: isVertical.value ? 'TB' : 'LR',
  align: 'UL',
  nodeSep: isVertical.value ? 100 : 120,
  rankSep: isVertical.value ? 150 : 180,
  edgeSep: 30,
  marginX: 60,
  marginY: 60,
  animate: true,
  animationDuration: 600,
  fit: true,
  padding: 40
})

/**
 * Process nodes with roadmap-specific styling
 */
const processNodes = () => {
  return props.nodes.map(node => {
    const category = node.data?.category || 'Default'
    const baseColor = roadmapColors[category] || '#e0e0e0'
    const borderColor = darkenColor(baseColor, 0.3)
    
    return {
      ...node,
      data: {
        ...node.data,
        borderColor: borderColor,
        unitColor: baseColor,
        unitBorderColor: borderColor,
        category: category
      }
    }
  })
}

/**
 * Utility functions
 */
const darkenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent * 100)
  const R = Math.max(0, (num >> 16) - amt)
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt)
  const B = Math.max(0, (num & 0x0000FF) - amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const isMilestone = (node) => {
  return node?.data?.category === 'Milestone'
}

const getUnitType = (node) => {
  const category = node?.data?.category
  if (category === 'Milestone') return 'milestone'
  if (category?.startsWith('Unit')) return 'unit'
  return 'topic'
}

const getUnitTypeLabel = (node) => {
  const category = node?.data?.category
  if (category === 'Milestone') return 'MILESTONE'
  if (category?.startsWith('Unit')) return category.toUpperCase()
  return 'TOPIC'
}

const getDifficultyClass = (difficulty) => {
  if (difficulty <= 2) return 'easy'
  if (difficulty <= 3) return 'medium'
  return 'hard'
}

const getDifficultyLabel = (difficulty) => {
  if (difficulty <= 2) return 'Beginner'
  if (difficulty <= 3) return 'Intermediate'
  return 'Advanced'
}

const getSubjectCount = (node) => {
  return node?.data?.subjects || 4
}

const getTaskCount = (node) => {
  return node?.data?.tasks || 7
}

const getNextUnits = (node) => {
  // Find connected nodes that come after this one
  if (!cyInstance.value) return []
  
  const connectedEdges = cyInstance.value.$(`#${node.data.id}`).outgoers('edge')
  return connectedEdges.targets().map(target => target.data('label')).slice(0, 2)
}

/**
 * Initialize Cytoscape with roadmap layout
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
      style: getRoadmapStyles(),
      layout: getRoadmapLayout(),
      
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
    
    setTimeout(() => {
      cyInstance.value?.fit()
      isLoading.value = false
    }, 300)
    
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

  cyInstance.value.on('tap', 'node', (event) => {
    const node = event.target
    activeNode.value = node
    highlightLearningPath(node)
  })

  cyInstance.value.on('tap', (event) => {
    if (event.target === cyInstance.value) {
      activeNode.value = null
      clearHighlights()
    }
  })
}

const highlightLearningPath = (node) => {
  clearHighlights()
  
  // Highlight the learning path from this node
  const connectedEdges = node.connectedEdges()
  connectedEdges.addClass('highlighted')
  
  // Also highlight prerequisite path
  const predecessors = node.predecessors()
  predecessors.edges().addClass('highlighted')
}

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

const toggleOrientation = () => {
  isVertical.value = !isVertical.value
  if (cyInstance.value) {
    cyInstance.value.layout(getRoadmapLayout()).run()
  }
}

const closeDetails = () => {
  activeNode.value = null
  clearHighlights()
}

const showLearningPath = () => {
  if (!activeNode.value) return
  highlightLearningPath(activeNode.value)
}

const markComplete = () => {
  if (!activeNode.value) return
  // Add completion logic here
  console.log('Marking complete:', activeNode.value.data.label)
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

watch(() => [props.nodes, props.edges], () => {
  if (cyInstance.value) {
    const processedNodes = processNodes()
    cyInstance.value.elements().remove()
    cyInstance.value.add({ nodes: processedNodes, edges: props.edges })
    cyInstance.value.layout(getRoadmapLayout()).run()
  }
}, { deep: true })
</script>

<style scoped>
/* Enhanced roadmap styling */
.roadmap-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  margin: 24px 0;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

/* Milestone Progress Header */
.roadmap-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.milestone-progress {
  flex: 1;
}

.progress-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.progress-header p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  color: white;
}

.progress-stats {
  display: flex;
  gap: 32px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #ffd54f;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 4px;
}

.control-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.5);
  transform: translateY(-2px);
}

/* Viewport */
.roadmap-viewport {
  position: relative;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
}

.cytoscape-canvas {
  width: 100%;
  background: transparent;
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

/* Enhanced Unit Details Panel */
.unit-details-panel {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 400px;
  max-height: calc(100% - 48px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 1000;
  border: 1px solid #e0e0e0;
}

.panel-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.unit-info h3 {
  margin: 8px 0 12px 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.unit-type {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.unit-type.milestone {
  background: #ffd54f;
  color: #f57f17;
}

.unit-type.unit {
  background: rgba(255,255,255,0.2);
  color: white;
}

.unit-type.topic {
  background: rgba(255,255,255,0.15);
  color: white;
}

.unit-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.difficulty-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.difficulty-badge.easy {
  background: #4caf50;
  color: white;
}

.difficulty-badge.medium {
  background: #ff9800;
  color: white;
}

.difficulty-badge.hard {
  background: #f44336;
  color: white;
}

.time-estimate {
  font-size: 0.875rem;
  opacity: 0.9;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.125rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255,255,255,0.3);
}

.panel-content {
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}

/* Progress metrics */
.progress-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-item label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #424242;
  margin-bottom: 8px;
}

.progress-bar {
  position: relative;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 8px;
  top: 12px;
  font-size: 0.75rem;
  color: #757575;
}

/* Learning path */
.learning-path {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.path-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.path-item.current {
  background: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.path-item.next {
  background: #f5f5f5;
  opacity: 0.7;
}

.path-status {
  font-size: 1rem;
}

.path-label {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Enhanced prerequisite styling */
.prereq-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #e8f5e8;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #2e7d32;
  border-left: 3px solid #4caf50;
}

.prereq-status {
  color: #4caf50;
  font-weight: 600;
}

/* Action buttons with enhanced styling */
.action-btn.success {
  background: #4caf50;
  color: white;
  border: none;
}

.action-btn.success:hover {
  background: #43a047;
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

/* Enhanced control panel */
.layout-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.layout-section label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #424242;
}

.layout-selector {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #ffffff;
  color: #424242;
  font-size: 0.875rem;
  min-width: 160px;
}

.layout-selector:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  .roadmap-controls {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .progress-stats {
    justify-content: center;
    gap: 24px;
  }
  
  .unit-details-panel {
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
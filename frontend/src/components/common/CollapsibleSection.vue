<template>
  <div class="collapsible-section">
    <div 
      class="section-header" 
      @click="toggleCollapse"
      :class="{ 'collapsed': isCollapsed }"
    >
      <div class="header-content">
        <div class="header-left">
          <span class="collapse-icon">{{ isCollapsed ? '▶' : '▼' }}</span>
          <h3 class="section-title">{{ title }}</h3>
        </div>
        <div class="header-right">
          <div class="score-display" v-if="score !== null">
            <span class="score-value">{{ score }}</span>
            <span class="score-max">/{{ maxScore }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div 
      class="section-content" 
      :class="{ 'collapsed': isCollapsed }"
      ref="content"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  score: {
    type: [Number, String],
    default: null
  },
  maxScore: {
    type: [Number, String],
    default: null
  },
  defaultCollapsed: {
    type: Boolean,
    default: false
  }
})

const isCollapsed = ref(props.defaultCollapsed)
const content = ref(null)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  nextTick(() => {
    updateContentHeight()
  })
}

const updateContentHeight = () => {
  if (content.value) {
    if (isCollapsed.value) {
      content.value.style.maxHeight = '0px'
    } else {
      content.value.style.maxHeight = content.value.scrollHeight + 'px'
    }
  }
}

onMounted(() => {
  updateContentHeight()
})

watch(() => props.score, () => {
  nextTick(() => {
    updateContentHeight()
  })
})
</script>

<style scoped>
.collapsible-section {
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  margin-bottom: 15px;
}

.section-header {
  background: #f8f9fa;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e9ecef;
}

.section-header:hover {
  background: #e9ecef;
}

.section-header.collapsed {
  border-bottom: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-icon {
  font-size: 0.8rem;
  color: #6c757d;
  transition: transform 0.3s ease;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(102, 126, 234, 0.15);
  padding: 8px 15px;
  border-radius: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.score-value {
  font-weight: bold;
  color: #667eea;
  font-size: 1.1rem;
}

.score-max {
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
}

.section-content {
  padding: 20px;
  max-height: 1000px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.section-content.collapsed {
  max-height: 0;
  padding: 0 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-right {
    align-self: flex-end;
  }
  
  .section-title {
    font-size: 1rem;
  }
}
</style> 
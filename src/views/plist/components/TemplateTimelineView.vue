<template>
  <el-timeline class="custom-timeline">
    <el-timeline-item
      v-for="(entry, index) in timelineData"
      :key="index"
      :timestamp="entry.date"
      :type="index === 0 ? 'primary' : 'info'"
      :hollow="index !== 0"
      :size="index === 0 ? 'large' : 'normal'"
    >
      <el-card class="timeline-card" shadow="hover">
        <div class="timeline-content">
          <div class="timeline-header">
            <h4 class="timeline-date">{{ entry.date }}</h4>
            <span class="item-count">{{ entry.items.length }} 项检查</span>
          </div>
          <div class="timeline-items">
            <div 
              v-for="item in entry.items" 
              :key="`${item.template_code}-${item.case_code}-${item.time}`"
              class="timeline-item"
            >
              <div class="item-info" @click="$emit('open-template-detail', item.template_code, item.case_code, item.time)">
                <span class="item-name">{{ item.label }}</span>
                <span class="item-time">{{ formatTime(item.time) }}</span>
              </div>
              <div class="item-meta">
                <el-tag size="small" type="info">{{ item.case_code }}</el-tag>
                <el-button 
                  type="danger" 
                  size="small" 
                  link 
                  @click.stop="$emit('delete-template', item.label, [item])"
                  style="margin-left: 8px;"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
                <el-icon class="click-icon"><Right /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElTimeline, ElTimelineItem, ElCard, ElTag, ElButton, ElIcon } from 'element-plus'
import { Right, Delete } from '@element-plus/icons-vue'

defineProps({
  timelineData: {
    type: Array,
    required: true
  }
})

defineEmits(['open-template-detail', 'delete-template'])

// 格式化时间显示
const formatTime = (dateTimeStr) => {
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  } catch {
    return dateTimeStr
  }
}
</script>

<style scoped>
/* 时间轴样式优化 */
.custom-timeline {
  padding: 10px 0;
}

.custom-timeline :deep(.el-timeline-item__wrapper) {
  padding-left: 25px;
}

.custom-timeline :deep(.el-timeline-item__tail) {
  border-left: 2px solid #e4e7ed;
}

.custom-timeline :deep(.el-timeline-item__node) {
  width: 12px;
  height: 12px;
  left: -6px;
}

.custom-timeline :deep(.el-timeline-item__node--large) {
  width: 14px;
  height: 14px;
  left: -7px;
}

.timeline-card {
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
}

.timeline-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.12);
  transform: translateY(-1px);
}

.timeline-content {
  padding: 0;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px 8px 16px;
  border-bottom: 1px solid #f0f2f5;
  background: linear-gradient(90deg, #409eff 0%, #36c5f0 100%);
  border-radius: 8px 8px 0 0;
  color: white;
  margin: -16px -16px 0 -16px;
}

.timeline-date {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.item-count {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
}

.timeline-items {
  padding: 12px 16px 14px 16px;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: white;
  border: 1px solid #f0f2f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #409eff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-item:hover {
  border-color: #409eff;
  background: #f8fcff;
  transform: translateX(4px);
}

.timeline-item:hover::before {
  opacity: 1;
}

.item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  font-size: 11px;
  color: #909399;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.click-icon {
  color: #c0c4cc;
  transition: all 0.3s ease;
  transform: translateX(0);
}

.timeline-item:hover .click-icon {
  color: #409eff;
  transform: translateX(4px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-timeline {
    padding: 8px 0;
  }
  
  .custom-timeline :deep(.el-timeline-item__wrapper) {
    padding-left: 20px;
  }
  
  .timeline-header {
    padding: 8px 12px 6px 12px;
    margin: -12px -12px 0 -12px;
  }
  
  .timeline-date {
    font-size: 13px;
  }
  
  .item-count {
    font-size: 10px;
    padding: 2px 4px;
  }
  
  .timeline-items {
    padding: 10px 12px 12px 12px;
  }
  
  .timeline-item {
    padding: 6px 10px;
    margin-bottom: 4px;
  }
  
  .item-name {
    font-size: 12px;
  }
  
  .item-time {
    font-size: 10px;
  }
}
</style> 
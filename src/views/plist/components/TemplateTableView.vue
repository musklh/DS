<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card v-for="section in leftSections" :key="section.title" class="mb-4">
        <template #header>
          <div class="section-title-header">
            <strong>{{ section.title }}</strong>
          </div>
        </template>
        <el-table :data="section.items" border stripe size="small" :show-header="false">
          <el-table-column prop="label" label="项目" width="180">
            <template #default="{ row }">
              <el-button type="primary" link @click="$emit('open-template-detail', row.template_code, row.case_code, row.time)">
                {{ row.label }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="检查时间" />
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button 
                type="danger" 
                size="small" 
                link 
                @click="$emit('delete-template', row.label, [row])"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card v-for="section in rightSections" :key="section.title" class="mb-4">
        <template #header>
          <div class="section-title-header">
            <strong>{{ section.title }}</strong>
          </div>
        </template>
        <el-table :data="section.items" border stripe size="small" :show-header="false">
          <el-table-column prop="label" label="项目" width="180">
            <template #default="{ row }">
              <el-button type="primary" link @click="$emit('open-template-detail', row.template_code, row.case_code, row.time)">
                {{ row.label }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="检查时间" />
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button 
                type="danger" 
                size="small" 
                link 
                @click="$emit('delete-template', row.label, [row])"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElRow, ElCol, ElCard, ElTable, ElTableColumn, ElButton, ElIcon } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

defineProps({
  leftSections: {
    type: Array,
    required: true
  },
  rightSections: {
    type: Array,
    required: true
  }
})

defineEmits(['open-template-detail', 'delete-template'])
</script>

<style scoped>
.mb-4 {
  margin-bottom: 32px;
}

.section-title-header {
  background: #F0F0F0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.7;
}

.el-card.mb-4 {
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  transition: box-shadow 0.3s;
  border: none;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
  position: relative;
}

.el-card.mb-4:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.16);
}

.el-card.mb-4::before {
  content: '';
  display: block;
  height: 5px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 14px 14px 0 0;
}

:deep(.el-card__body) {
  padding: 28px 24px 20px 24px;
  font-size: 16px;
  color: #333;
  line-height: 1.7;
}
</style> 
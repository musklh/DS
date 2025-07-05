<template>
  <el-form-item label="检查时间" prop="checkTime">
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-date-picker
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        type="datetime"
        placeholder="请选择"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="flex: 1"
      />
      <el-button 
        type="primary" 
        size="small" 
        @click="resetToCurrentTime"
        title="重置为当前时间"
      >
        当前时间
      </el-button>
    </div>
  </el-form-item>
</template>

<script setup>
import { ElFormItem, ElDatePicker, ElButton } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  getCurrentTime: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const resetToCurrentTime = () => {
  emit('update:modelValue', props.getCurrentTime())
}
</script>

<style scoped>
/* 组件样式继承自父组件 */
</style> 
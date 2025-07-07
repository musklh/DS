<template>
  <div class="form-actions">
    <el-button 
      type="primary" 
      @click="emit('save')"
      :loading="isLoading"
      :disabled="!isFormValid"
    >
      保存
    </el-button>
    <el-button 
      @click="emit('cancel')"
      :disabled="isLoading"
    >
      取消
    </el-button>
    <el-button 
      type="info" 
      @click="emit('reset')"
      :disabled="isLoading"
    >
      重置
    </el-button>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus'

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  isFormValid: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save', 'cancel', 'reset'])
</script>

<style scoped>
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.form-actions .el-button {
  min-width: 80px;
}
</style> 
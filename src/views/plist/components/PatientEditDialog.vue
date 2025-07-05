<template>
  <el-dialog v-model="visible" title="编辑患者信息" width="500px">
    <el-form :model="editForm" label-width="140px">
      <el-form-item label="姓名">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="性别">
        <span>{{ editForm.gender === 1 ? '男' : '女' }}</span>
      </el-form-item>
      <el-form-item label="年龄">
        <span>{{ editForm.age }}</span>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="editForm.phone_number" />
      </el-form-item>
      <el-form-item label="是否做过移植手术">
        <el-input v-model="editForm.has_transplant_surgery" />
      </el-form-item>
      <el-form-item label="是否在移植排队">
        <el-select v-model="editForm.is_in_transplant_queue" placeholder="请选择">
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>
      <el-form-item label="主要诊断">
        <el-input v-model="editForm.main_diagnosis" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="$emit('save')">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editForm: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
:deep(.el-dialog .el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-dialog .el-form-item__label) {
  white-space: nowrap;
}
</style> 
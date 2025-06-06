<template>
    <el-select
      v-model="selectedCase"
      placeholder="请选择专病档案"
      @change="handleChange"
      filterable
      clearable
      class="case-selector"
      style="width: 260px"
    >
      <el-option
        v-for="item in caseOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const emit = defineEmits(['caseSelected'])
  
  const selectedCase = ref('')
  const caseOptions = [
    { value: 'liver-transplant', label: '肝移植手术档案' },
    { value: 'kidney-transplant', label: '肾移植手术档案' },
    { value: 'cardiac-case', label: '心脏病病例档案' },
  ]
  
  const handleChange = (value) => {
    emit('caseSelected', value)
  }
  </script>
  
  <style scoped>
  .case-selector .el-input__inner {
    border-radius: 8px;
    font-size: 15px;
    padding: 10px 12px;
  }
  </style>
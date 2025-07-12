<template>
  <el-dialog v-model="visible" title="模板详情" width="800px">
    <div v-if="currentTemplateDetail">
      <p><strong>模板名称: </strong>{{ currentTemplateDetail.template_name }}</p>
      <p><strong>检查时间: </strong>{{ currentTemplateDetail.check_time }}</p>
      <el-divider />
      <el-table :data="currentTemplateDetail.items" border stripe size="small">
        <el-table-column prop="word_name" label="词条名称" width="180" />
        <el-table-column label="值" width="350">
          <template #default="{ row }">
            <span v-if="!row.isEditing" v-html="formatDisplayValue(row)"></span>
            <DynamicFormField
              v-else
              :modelValue="row.editingValue"
              :inputType="row.input_type"
              :wordCode="row.word_code"
              :getOptions="getOptions"
              :hasFollowupForOption="hasFollowupForOption"
              :getFollowupType="getFollowupType"
              :getFollowupOptions="getFollowupOptions"
              :getFollowupLabel="getFollowupLabel"
              :getFollowupFields="getFollowupFields"
              :getFieldOptions="getFieldOptions"
              @update:modelValue="row.editingValue = $event"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div v-if="row.isEditing">
              <el-button type="success" size="small" @click="$emit('save-item', row)">保存</el-button>
              <el-button type="info" size="small" @click="$emit('cancel-edit', row)">取消</el-button>
            </div>
            <div v-else>
              <el-button type="primary" size="small" link @click="$emit('start-edit', row)">编辑</el-button>
              <el-button type="danger" size="small" link @click="$emit('delete-item', row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-alert type="info" :closable="false">暂无模板详情数据</el-alert>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { ElDialog, ElTable, ElTableColumn, ElButton, ElDivider, ElAlert } from 'element-plus'
import DynamicFormField from '../../../components/form/DynamicFormField.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentTemplateDetail: {
    type: Object,
    default: null
  },
  formatDisplayValue: {
    type: Function,
    required: true
  },
  getOptions: {
    type: Function,
    required: true
  },
  hasFollowupForOption: {
    type: Function,
    required: true
  },
  getFollowupType: {
    type: Function,
    required: true
  },
  getFollowupOptions: {
    type: Function,
    required: true
  },
  getFollowupLabel: {
    type: Function,
    required: true
  },
  getFollowupFields: {
    type: Function,
    required: true
  },
  getFieldOptions: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'start-edit', 'cancel-edit', 'save-item', 'delete-item'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
/* 对话框样式可以根据需要调整 */
</style> 
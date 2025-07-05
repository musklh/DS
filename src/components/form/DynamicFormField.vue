<template>
  <el-form-item :prop="`values.${item.word_code}`">
    <template #label>
      <el-tooltip v-if="item.word_name.length > 8" :content="item.word_name" placement="top">
        <span class="form-label">{{ item.word_name }}</span>
      </el-tooltip>
      <span v-else>{{ item.word_name }}</span>
    </template>
    <!-- 文本输入框 -->
    <template v-if="isTextField(item)">
      <el-input 
        v-model="modelValue[item.word_code]" 
        placeholder="请输入"
        :suffix-icon="item.word_short ? '' : undefined"
      />
      <span v-if="item.word_short" class="unit-label">{{ item.word_short }}</span>
    </template>

    <!-- 日期选择器 -->
    <el-date-picker 
      v-else-if="isDateField(item)"
      v-model="modelValue[item.word_code]" 
      type="date" 
      placeholder="请选择日期" 
      value-format="YYYY-MM-DD" 
      style="width: 100%;" 
    />

    <!-- 数值输入 -->
    <template v-else-if="isNumberField(item)">
      <el-input-number 
        v-model="modelValue[item.word_code]" 
        :controls="false" 
        placeholder="请输入数值" 
        style="width: 100%;" 
      />
      <span v-if="item.word_short" class="unit-label">{{ item.word_short }}</span>
    </template>

    <!-- 单选 -->
    <el-radio-group v-else-if="isSingleSelectField(item)" v-model="modelValue[item.word_code]">
      <el-radio v-for="option in getOptionsArray(item.options)" :key="option" :label="option" />
    </el-radio-group>

    <!-- 单选（含其他） -->
    <div v-else-if="isSingleWithOtherField(item)" class="single-with-other-container">
      <el-radio-group v-model="modelValue[item.word_code].selected">
        <el-radio v-for="option in getOptionsArray(item.options)" :key="option" :label="option" />
        <el-radio label="__other__">其他</el-radio>
      </el-radio-group>
      <el-input
        v-if="modelValue[item.word_code] && modelValue[item.word_code].selected === '__other__'"
        v-model="modelValue[item.word_code].other"
        placeholder="请输入"
        size="small"
        class="other-input"
      />
    </div>

    <!-- 多选 / 多选带时间 / 级联选择 -->
    <el-checkbox-group v-else-if="isMultiSelectField(item)" v-model="modelValue[item.word_code].selected">
      <div v-for="option in getOptionsArray(item.options)" :key="option" class="checkbox-time-item">
        <el-checkbox :label="option" />
        
        <!-- 多选带时间 -->
        <el-date-picker
          v-if="item.input_type === 'multi_with_date' && isOptionSelected(modelValue, item.word_code, option)"
          v-model="modelValue[item.word_code].times[option]"
          type="datetime"
          placeholder="选择时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          style="margin-left: 10px;"
        />

        <!-- 级联子问题 -->
        <div v-if="isOptionSelected(modelValue, item.word_code, option) && item.followup_options && item.followup_options[option]">
          <div class="followup-container">
            <span class="followup-label">{{ item.followup_options[option].label || option }}:</span>
            <!-- Level 1 Followup Input -->
            <el-radio-group v-if="item.followup_options[option].input_type === 'single'" v-model="modelValue[item.word_code].followup[option]">
              <el-radio v-for="fu_option in getOptionsArray(item.followup_options[option].options)" :key="fu_option" :label="fu_option" />
            </el-radio-group>
            <el-input v-else-if="item.followup_options[option].input_type === 'text'" v-model="modelValue[item.word_code].followup[option]" size="small" placeholder="请输入" style="width: 150px;"/>
            <el-input-number v-else-if="item.followup_options[option].input_type === 'number'" v-model="modelValue[item.word_code].followup[option]" size="small" :controls="false" placeholder="请输入数值" style="width: 150px;"/>
            <el-date-picker v-else-if="item.followup_options[option].input_type === 'date'" v-model="modelValue[item.word_code].followup[option]" type="date" size="small" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 150px;"/>
          </div>

          <!-- Level 2 Followup (Nested) -->
          <div v-if="isNestedFollowupVisible(item, option, modelValue)" class="followup-container-nested">
            <template v-if="getNestedFollowup(item, option, modelValue)">
               <span class="followup-label">{{ getNestedFollowup(item, option, modelValue).label }}:</span>
               <el-radio-group v-if="getNestedFollowup(item, option, modelValue).input_type === 'single'" v-model="modelValue[item.word_code].followup[getNestedFollowupKey(option, modelValue[item.word_code].followup[option])]">
                  <el-radio v-for="fu2_option in getOptionsArray(getNestedFollowup(item, option, modelValue).options)" :key="fu2_option" :label="fu2_option" />
               </el-radio-group>
               <el-input v-else-if="getNestedFollowup(item, option, modelValue).input_type === 'text'" v-model="modelValue[item.word_code].followup[getNestedFollowupKey(option, modelValue[item.word_code].followup[option])]" size="small" placeholder="请输入" style="width: 150px;"/>
               <el-input-number v-else-if="getNestedFollowup(item, option, modelValue).input_type === 'number'" v-model="modelValue[item.word_code].followup[getNestedFollowupKey(option, modelValue[item.word_code].followup[option])]" size="small" :controls="false" placeholder="请输入数值" style="width: 150px;"/>
               <el-date-picker v-else-if="getNestedFollowup(item, option, modelValue).input_type === 'date'" v-model="modelValue[item.word_code].followup[getNestedFollowupKey(option, modelValue[item.word_code].followup[option])]" type="date" size="small" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 150px;"/>
            </template>
          </div>
        </div>
      </div>
    </el-checkbox-group>
  </el-form-item>
</template>

<script setup>
import { 
  ElFormItem, 
  ElInput, 
  ElDatePicker, 
  ElInputNumber, 
  ElRadioGroup, 
  ElRadio, 
  ElCheckboxGroup, 
  ElCheckbox,
  ElTooltip
} from 'element-plus'

import { 
  isTextField,
  isDateField,
  isNumberField,
  isSingleSelectField,
  isSingleWithOtherField,
  isMultiSelectField,
  isOptionSelected,
  getOptionsArray,
  isNestedFollowupVisible,
  getNestedFollowup,
  getNestedFollowupKey
} from '../../utils/formHelpers'

defineProps({
  item: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.form-label {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}

.unit-label {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 14px;
  pointer-events: none;
  z-index: 10;
}

.single-with-other-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.other-input {
  width: 150px !important;
}

.checkbox-time-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.followup-container {
  display: inline-flex;
  align-items: center;
  margin-left: 20px;
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.followup-label {
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
}

.followup-container-nested {
  display: inline-flex;
  align-items: center;
  margin-left: 40px;
  margin-top: 8px;
  background-color: #f0f2f5;
  padding: 4px 8px;
  border-radius: 4px;
}
</style> 
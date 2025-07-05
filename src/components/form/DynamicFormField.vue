<template>
  <div>
    <!-- Text (default) -->
    <el-input 
      v-if="!inputType || inputType === 'text'" 
      :modelValue="modelValue" 
      @update:modelValue="$emit('update:modelValue', $event)"
      size="small" 
      placeholder="请输入"
    />
    
    <!-- Date -->
    <el-date-picker 
      v-else-if="inputType === 'date'" 
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      type="date" 
      placeholder="选择日期" 
      value-format="YYYY-MM-DD" 
      size="small" 
      style="width: 100%"
    />
    
    <!-- Number -->
    <el-input-number 
      v-else-if="inputType === 'number'" 
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :controls="false" 
      placeholder="请输入数值" 
      size="small" 
      style="width: 100%"
    />
    
    <!-- Single Select -->
    <el-radio-group 
      v-else-if="inputType === 'single'" 
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <el-radio v-for="option in getOptions(wordCode)" :key="option" :value="option">
        {{ option }}
      </el-radio>
    </el-radio-group>
    
    <!-- Single With Other -->
    <div v-else-if="inputType === 'single_with_other'">
      <el-radio-group 
        :modelValue="modelValue.selected"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, selected: $event })"
      >
        <el-radio v-for="option in getOptions(wordCode)" :key="option" :value="option">
          {{ option }}
        </el-radio>
        <el-radio value="__other__">其他</el-radio>
      </el-radio-group>
      <el-input
        v-if="modelValue.selected === '__other__'"
        :modelValue="modelValue.other"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, other: $event })"
        placeholder="请输入"
        size="small"
        style="margin-top: 5px;"
      />
    </div>
    
    <!-- Multi Select -->
    <el-checkbox-group 
      v-else-if="inputType === 'multi'" 
      :modelValue="modelValue.selected"
      @update:modelValue="$emit('update:modelValue', { ...modelValue, selected: $event })"
    >
      <div v-for="option in getOptions(wordCode)" :key="option" style="margin-bottom: 8px;">
        <el-checkbox :value="option">{{ option }}</el-checkbox>
        <!-- Show followup input if this option is selected and has a followup value -->
        <div v-if="modelValue.selected.includes(option) && hasFollowupForOption(wordCode, option)" style="margin-left: 25px; margin-top: 5px;">
          <span style="font-size: 12px; color: #666; margin-right: 8px;">{{ getFollowupLabel(wordCode, option) }}:</span>
          <!-- Check if it's a select type followup -->
          <el-select 
            v-if="getFollowupType(wordCode, option) === 'single'"
            :modelValue="modelValue.followup[option]"
            @update:modelValue="updateFollowup(option, $event)"
            size="small" 
            style="width: 120px;"
            placeholder="请选择"
          >
            <el-option 
              v-for="subOption in getFollowupOptions(wordCode, option)" 
              :key="subOption" 
              :label="subOption" 
              :value="subOption" 
            />
          </el-select>
          <!-- Default to text input for other types -->
          <el-input 
            v-else
            :modelValue="modelValue.followup[option]"
            @update:modelValue="updateFollowup(option, $event)"
            size="small" 
            style="width: 120px;" 
            placeholder="请输入" 
          />
        </div>
      </div>
    </el-checkbox-group>
    
    <!-- Multi With Date -->
    <div v-else-if="inputType === 'multi_with_date'">
      <el-checkbox-group 
        :modelValue="modelValue.selected"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, selected: $event })"
      >
        <div v-for="option in getOptions(wordCode)" :key="option" style="display: flex; align-items: center; margin-bottom: 5px;">
          <el-checkbox :value="option">{{ option }}</el-checkbox>
          <el-date-picker
            v-if="modelValue.selected.includes(option)"
            :modelValue="modelValue.times[option]"
            @update:modelValue="updateTime(option, $event)"
            type="datetime"
            placeholder="选择时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="small"
            style="margin-left: 10px; width: 180px;"
          />
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import { 
  ElInput, 
  ElDatePicker, 
  ElInputNumber, 
  ElRadioGroup, 
  ElRadio, 
  ElCheckboxGroup, 
  ElCheckbox,
  ElSelect,
  ElOption
} from 'element-plus'

const props = defineProps({
  modelValue: {
    required: true
  },
  inputType: {
    type: String,
    default: 'text'
  },
  wordCode: {
    type: String,
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
  }
})

const emit = defineEmits(['update:modelValue'])

// 更新 followup 数据的方法
const updateFollowup = (option, value) => {
  const newValue = { 
    ...props.modelValue, 
    followup: { 
      ...props.modelValue.followup, 
      [option]: value 
    } 
  }
  emit('update:modelValue', newValue)
}

// 更新时间数据的方法
const updateTime = (option, value) => {
  const newValue = { 
    ...props.modelValue, 
    times: { 
      ...props.modelValue.times, 
      [option]: value 
    } 
  }
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
/* 样式可以根据需要调整 */
</style> 
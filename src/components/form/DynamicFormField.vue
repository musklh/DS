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
      <el-radio v-for="option in getOptions(wordCode)" :key="option" :label="option">{{ option }}</el-radio>
    </el-radio-group>
    
    <!-- Single With Other -->
    <div v-else-if="inputType === 'single_with_other'">
      <el-radio-group 
        :modelValue="modelValue.selected"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, selected: $event })"
      >
        <el-radio v-for="option in getOptions(wordCode)" :key="option" :label="option">{{ option }}</el-radio>
        <el-radio label="__other__">其他</el-radio>
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
      <div v-for="option in getOptions(wordCode)" :key="option" class="checkbox-item">
        <el-checkbox :label="option">{{ option }}</el-checkbox>
        <!-- Show followup input if this option is selected and has a followup value -->
        <div v-if="modelValue.selected.includes(option) && hasFollowupForOption(wordCode, option)" class="followup-container">
          <span class="followup-label">{{ getFollowupLabel(wordCode, option) }}:</span>
          
          <!-- Group type followup - RENDER MULTIPLE FIELDS -->
          <div v-if="getFollowupType(wordCode, option) === 'group'" class="followup-group">
            <div v-for="field in getFollowupFields(wordCode, option)" :key="field.label" class="followup-group-field">
              <label class="followup-field-label">{{ field.label }}:</label>
              <!-- Select field -->
              <el-select 
                v-if="field.input_type === 'select'"
                :modelValue="modelValue.followup[option][field.label]"
                @update:modelValue="updateFollowupGroup(option, field.label, $event)"
                size="small" 
                style="width: 120px; margin-left: 8px;"
                placeholder="请选择">
                <el-option 
                  v-for="selectOption in getFieldOptions(field)" 
                  :key="selectOption" 
                  :label="selectOption" 
                  :value="selectOption" />
              </el-select>
              <!-- Date field -->
              <el-date-picker 
                v-else-if="field.input_type === 'date'"
                :modelValue="modelValue.followup[option][field.label]"
                @update:modelValue="updateFollowupGroup(option, field.label, $event)"
                type="date"
                size="small"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                style="width: 120px; margin-left: 8px;"
              />
              <!-- Number field -->
              <el-input-number 
                v-else-if="field.input_type === 'number'"
                :modelValue="modelValue.followup[option][field.label]"
                @update:modelValue="updateFollowupGroup(option, field.label, $event)"
                size="small"
                :controls="false"
                placeholder="请输入数值"
                style="width: 120px; margin-left: 8px;"
              />
              <!-- Text field -->
              <el-input 
                v-else
                :modelValue="modelValue.followup[option][field.label]"
                @update:modelValue="updateFollowupGroup(option, field.label, $event)"
                size="small" 
                style="width: 120px; margin-left: 8px;" 
                placeholder="请输入" />
            </div>
          </div>
          
          <!-- Single type followup -->
          <el-select 
            v-else-if="getFollowupType(wordCode, option) === 'single'"
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

          <!-- Date type followup -->
           <el-date-picker 
            v-else-if="getFollowupType(wordCode, option) === 'date'"
            :modelValue="modelValue.followup[option]"
            @update:modelValue="updateFollowup(option, $event)"
            type="date"
            size="small"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 150px;"
          />
          
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
          <el-checkbox :label="option">{{ option }}</el-checkbox>
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
  },
  // ADDED PROPS FOR GROUP
  getFollowupFields: {
    type: Function,
    default: () => []
  },
  getFieldOptions: {
    type: Function,
    default: () => []
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

// ADDED: 更新 group followup 数据的方法
const updateFollowupGroup = (option, fieldLabel, value) => {
  const newFollowupOptionValue = {
    ...props.modelValue.followup[option],
    [fieldLabel]: value
  };
  const newValue = {
    ...props.modelValue,
    followup: {
      ...props.modelValue.followup,
      [option]: newFollowupOptionValue
    }
  };
  emit('update:modelValue', newValue);
};

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
.checkbox-item {
  margin-bottom: 8px;
}

.followup-container {
  display: inline-flex;
  align-items: center;
  margin-left: 20px;
  margin-top: 5px;
  background-color: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
}

.followup-label {
    margin-right: 8px;
    font-size: 14px;
    color: #606266;
}

.followup-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.followup-group-field {
  display: flex;
  align-items: center;
  gap: 5px;
}

.followup-field-label {
  font-size: 14px;
  color: #606266;
  min-width: 60px;
}
</style> 
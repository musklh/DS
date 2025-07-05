// 表单相关的工具函数

// Helper function to check if an option is selected for multi_with_date
export const isOptionSelected = (formData, wordCode, option) => {
  // 处理两种情况：formData.values[wordCode] 或直接传入 values 对象
  if (!formData) return false
  
  const fieldData = formData.values ? formData.values[wordCode] : formData[wordCode]
  if (!fieldData || !fieldData.selected || !Array.isArray(fieldData.selected)) {
    return false
  }
  
  return fieldData.selected.includes(option)
}

// 获取选项数组
export const getOptionsArray = (optionsStr) => {
  if (optionsStr && typeof optionsStr === 'string') {
    return optionsStr.split(',').map(o => o.trim()).filter(o => o)
  }
  return []
}

// --- 级联选择辅助函数 ---
export const isNestedFollowupVisible = (item, option, formData) => {
  if (!formData || !item) return false
  
  const wordCode = item.word_code
  // 处理两种情况：formData.values[wordCode] 或直接传入 values 对象
  const fieldData = formData.values ? formData.values[wordCode] : formData[wordCode]
  if (!fieldData || !fieldData.followup) return false
  
  const fu1_answer = fieldData.followup[option]
  if (!fu1_answer) return false

  const fu1 = item.followup_options?.[option]
  return fu1?.input_type === 'single' && fu1.followup_options?.[fu1_answer]
}

export const getNestedFollowup = (item, option, formData) => {
  if (!formData || !item) return null
  
  const wordCode = item.word_code
  // 处理两种情况：formData.values[wordCode] 或直接传入 values 对象
  const fieldData = formData.values ? formData.values[wordCode] : formData[wordCode]
  if (!fieldData || !fieldData.followup) return null
  
  const fu1_answer = fieldData.followup[option]
  if (!fu1_answer) return null
  
  return item.followup_options?.[option]?.followup_options?.[fu1_answer]
}

export const getNestedFollowupKey = (option, fu1_answer) => {
  return `${option}_${fu1_answer}`
}

// 表单字段类型判断
export const isTextField = (item) => {
  return !item.input_type || item.input_type === 'text' || item.input_type === null
}

export const isDateField = (item) => {
  return item.input_type === 'date'
}

export const isNumberField = (item) => {
  return item.input_type === 'number'
}

export const isSingleSelectField = (item) => {
  return item.input_type === 'single'
}

export const isSingleWithOtherField = (item) => {
  return item.input_type === 'single_with_other'
}

export const isMultiSelectField = (item) => {
  return item.input_type === 'multi' || item.input_type === 'multi_with_date'
} 
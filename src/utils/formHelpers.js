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
export const getOptions = (wordCode, selectedTemplate) => {
  if (!selectedTemplate?.dictionaryList) return []
  
  const item = selectedTemplate.dictionaryList.find(i => i.word_code === wordCode)
  if (item && item.options && typeof item.options === 'string') {
    return item.options.split(',').map(o => o.trim()).filter(o => o)
  }
  return []
}

// 检查某个选项是否有二级选项
export const hasFollowupForOption = (wordCode, option, selectedTemplate) => {
  if (!selectedTemplate?.dictionaryList) return false
  
  const item = selectedTemplate.dictionaryList.find(i => i.word_code === wordCode)
  return item?.followup_options?.[option] !== undefined
}

// 获取二级选项的类型
export const getFollowupType = (wordCode, option, selectedTemplate) => {
  if (!selectedTemplate?.dictionaryList) return 'text'
  
  const item = selectedTemplate.dictionaryList.find(i => i.word_code === wordCode)
  const followup = item?.followup_options?.[option]
  return followup?.input_type || 'text'
}

// 获取二级选项的选项列表
export const getFollowupOptions = (wordCode, option, selectedTemplate) => {
  if (!selectedTemplate?.dictionaryList) return []
  
  const item = selectedTemplate.dictionaryList.find(i => i.word_code === wordCode)
  const followup = item?.followup_options?.[option]
  if (followup && followup.options && typeof followup.options === 'string') {
    return followup.options.split(',').map(o => o.trim()).filter(o => o)
  }
  return []
}

// 获取二级选项的标签
export const getFollowupLabel = (wordCode, option, selectedTemplate) => {
  if (!selectedTemplate?.dictionaryList) return `${option}详情`
  
  const item = selectedTemplate.dictionaryList.find(i => i.word_code === wordCode)
  const followup = item?.followup_options?.[option]
  return followup?.label || `${option}详情`
}

// 获取选项数组（从字符串分割）
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
export const isTextField = (inputType) => {
  return !inputType || inputType === 'text' || inputType === null
}

export const isDateField = (inputType, wordName) => {
  return inputType === 'date' || (wordName && wordName.includes('时间') && inputType !== 'text')
}

export const isNumberField = (inputType) => {
  return inputType === 'number'
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
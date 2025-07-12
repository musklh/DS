// src/utils/formHelpers.js

/**
 * 获取词条定义
 * @param {string} wordCode - 词条代码
 * @param {object} template - 当前选择的模板
 * @returns {object|null} - 词条的定义
 */
const getDictInfo = (wordCode, template) => {
  return template?.dictionaryList?.find(item => item.word_code === wordCode) || null;
}

/**
 * 获取词条的选项列表 (用于 select, radio, checkbox)
 * @param {string} wordCode - 词条代码
 * @param {object} template - 当前选择的模板
 * @returns {string[]} - 选项数组
 */
export const getOptions = (wordCode, template) => {
  const dictInfo = getDictInfo(wordCode, template);
  if (dictInfo && dictInfo.options && typeof dictInfo.options === 'string') {
    return dictInfo.options.split(',').map(o => o.trim()).filter(o => o);
  }
  return [];
};

/**
 * 检查一个选项是否有后续问题
 * @param {string} wordCode - 词条代码
 * @param {string} option - 选项
 * @param {object} template - 当前选择的模板
 * @returns {boolean}
 */
export const hasFollowupForOption = (wordCode, option, template) => {
  const dictInfo = getDictInfo(wordCode, template);
  return !!dictInfo?.followup_options?.[option];
};

/**
 * 获取后续问题的完整定义
 * @param {string} wordCode - 词条代码
 * @param {string} option - 选项
 * @param {object} template - 当前选择的模板
 * @returns {object|null}
 */
const getFollowupDefinition = (wordCode, option, template) => {
  const dictInfo = getDictInfo(wordCode, template);
  return dictInfo?.followup_options?.[option] || null;
};

/**
 * 获取后续问题的输入类型
 * @param {string} wordCode - 词条代码
 * @param {string} option - 选项
 * @param {object} template - 当前选择的模板
 * @returns {string}
 */
export const getFollowupType = (wordCode, option, template) => {
  const followupDef = getFollowupDefinition(wordCode, option, template);
  // 兼容性处理：如果存在 fields 数组，即使 input_type 不是 group，也将其视为 group
  if (followupDef?.fields && Array.isArray(followupDef.fields)) {
    return 'group';
  }
  return followupDef?.input_type || 'text';
};

/**
 * 获取后续问题的选项列表 (仅用于 single 类型)
 * @param {string} wordCode - 词条代码
 * @param {string} option - 选项
 * @param {object} template - 当前选择的模板
 * @returns {string[]}
 */
export const getFollowupOptions = (wordCode, option, template) => {
  const followupDef = getFollowupDefinition(wordCode, option, template);
  if (followupDef && followupDef.options && typeof followupDef.options === 'string') {
    return followupDef.options.split(',').map(o => o.trim()).filter(o => o);
  }
  return [];
};

/**
 * 获取后续问题的标签
 * @param {string} wordCode - 词条代码
 * @param {string} option - 选项
 * @param {object} template - 当前选择的模板
 * @returns {string}
 */
export const getFollowupLabel = (wordCode, option, template) => {
  const followupDef = getFollowupDefinition(wordCode, option, template);
  return followupDef?.label || `${option}详情`;
};

/**
 * 获取后续问题的组合字段列表 (仅用于 group 类型)
 * @param {string} wordCode - 词条代码
 * @param {string} option - 选项
 * @param {object} template - 当前选择的模板
 * @returns {any[]}
 */
export const getFollowupFields = (wordCode, option, template) => {
  const followupDef = getFollowupDefinition(wordCode, option, template);
  return followupDef?.fields || [];
};

/**
 * 获取组合字段中 select 的选项列表
 * @param {object} field - 字段定义
 * @returns {string[]}
 */
export const getFieldOptions = (field) => {
  if (field && field.options && typeof field.options === 'string') {
    return field.options.split(',').map(o => o.trim()).filter(o => o);
  }
  if (field && Array.isArray(field.options)) {
    return field.options; // 直接返回数组
  }
  return [];
};

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
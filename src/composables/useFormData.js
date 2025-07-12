import { reactive, computed, watch } from 'vue'

// 获取当前时间的辅助函数
const getCurrentDateTime = () => {
  const now = new Date()
  // 获取本地时间（考虑时区偏移）
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localTime.toISOString().slice(0, 19).replace('T', ' ')
}

export function useFormData(selectedTemplate) {
  // 表单数据
  const formData = reactive({
    checkTime: getCurrentDateTime(),
    values: {},
  })

  // 初始化表单数据
  const initializeFormData = () => {
    // 设置默认检查时间为当前时间
    formData.checkTime = getCurrentDateTime()
    const newValues = {}
    
    if (selectedTemplate.value?.dictionaryList) {
      selectedTemplate.value.dictionaryList.forEach(item => {
        if (item.input_type === 'group') {
          // 为主词条的 group 类型初始化对象
          const groupObj = {};
          if (item.fields) {
            item.fields.forEach(field => {
              groupObj[field.label] = '';
            });
          }
          newValues[item.word_code] = groupObj;
        } else if (item.input_type === 'multi' || item.input_type === 'multi_with_date') {
          const followupObj = {};
          // 为有 group 类型 followup 的选项初始化嵌套对象
          if (item.followup_options) {
            Object.keys(item.followup_options).forEach(option => {
              const fu = item.followup_options[option];
              if (fu.input_type === 'group') {
                const groupFields = {};
                if (fu.fields && Array.isArray(fu.fields)) {
                  fu.fields.forEach(field => {
                    groupFields[field.label] = ''; 
                  });
                }
                followupObj[option] = groupFields;
              }
            });
          }
          newValues[item.word_code] = { selected: [], times: {}, followup: followupObj };
        } else if (item.input_type === 'single') {
          newValues[item.word_code] = ''
        } else if (item.input_type === 'single_with_other') {
          newValues[item.word_code] = { selected: '', other: '' }
        } else if (item.input_type === 'number') {
          newValues[item.word_code] = undefined
        } else if (item.input_type === 'date') {
          newValues[item.word_code] = ''
        } else {
          newValues[item.word_code] = '' // text
        }
      })
    }
    formData.values = newValues
  }

  // 动态生成表单校验规则
  const formRules = computed(() => {
    const rules = {
      checkTime: [
        { required: true, message: '请选择检查时间', trigger: 'change' }
      ]
    }

    // 为每个模板字段添加必填校验
    if (selectedTemplate.value?.dictionaryList) {
      selectedTemplate.value.dictionaryList.forEach(item => {
        const rule = { required: true, trigger: 'blur' }
        
        if (item.input_type === 'group') {
          rule.message = `请完成${item.word_name}的所有字段`;
          rule.trigger = 'change';
          rule.validator = (rule, value, callback) => {
            if (!value || typeof value !== 'object') {
              return callback(new Error(`请完成${item.word_name}的相关信息`));
            }
            // 校验组合字段是否都已填写
            if (item.fields) {
              for (const field of item.fields) {
                if (!value[field.label]) {
                  return callback(new Error(`请完成'${field.label}'`));
                }
              }
            }
            callback();
          };
        } else if (item.input_type === 'multi' || item.input_type === 'multi_with_date') {
          rule.message = `请选择${item.word_name}`
          rule.trigger = 'change'
          rule.validator = (rule, value, callback) => {
            if (!value || value.selected.length === 0) {
              return callback(new Error(`请至少选择一个${item.word_name}`))
            }
            
            // 校验 multi_with_date
            if (item.input_type === 'multi_with_date') {
              for (const option of value.selected) {
                if (!value.times[option]) {
                  return callback(new Error(`请为'${option}'选择时间`))
                }
              }
            }
            
            // 校验级联选项
            if (item.followup_options) {
              for (const option of value.selected) {
                const fu1 = item.followup_options[option]
                if (fu1) {
                  if (fu1.input_type === 'group') {
                    // 校验 group 类型的字段
                    if (!value.followup[option] || typeof value.followup[option] !== 'object') {
                      return callback(new Error(`请完成'${option}'的相关信息`));
                    }
                    if (fu1.fields) {
                      for (const field of fu1.fields) {
                        if (!value.followup[option][field.label]) {
                          return callback(new Error(`请完成'${option}'中的'${field.label}'`));
                        }
                      }
                    }
                  } else if (!value.followup[option]) {
                    return callback(new Error(`请完成'${option}'的后续选项`));
                  }
                  
                  // 校验二级级联
                  if (fu1.input_type === 'single' && value.followup[option]) {
                    const selected_fu1_option = value.followup[option];
                    const fu2 = fu1.followup_options && fu1.followup_options[selected_fu1_option];
                    const fu2_key = `${option}_${selected_fu1_option}`;
                    if (fu2 && !value.followup[fu2_key]) {
                      return callback(new Error(`请完成'${selected_fu1_option}'的后续选项`));
                    }
                  }
                }
              }
            }
            callback()
          }
        } else if (item.input_type === 'single') {
          rule.message = `请选择${item.word_name}`
          rule.trigger = 'change'
        } else if (item.input_type === 'single_with_other') {
          rule.message = `请选择${item.word_name}`
          rule.trigger = 'change'
          rule.validator = (rule, value, callback) => {
            if (!value || !value.selected) {
              return callback(new Error(`请选择${item.word_name}`))
            }
            if (value.selected === '__other__' && !value.other) {
              return callback(new Error('请输入其他内容'))
            }
            callback()
          }
        } else if (item.input_type === 'number' || item.input_type === 'date') {
          rule.message = `请输入${item.word_name}`
        } else {
          rule.message = `请输入${item.word_name}`
        }
        
        rules[`values.${item.word_code}`] = [rule]
      })
    }

    return rules
  })

  // 监听模板变化
  watch(
    selectedTemplate,
    (newTemplate) => {
      if (newTemplate && newTemplate.dictionaryList) {
        initializeFormData()
      }
    },
    { immediate: true, deep: true }
  )

  // 重置表单
  const resetFormData = () => {
    initializeFormData()
  }

  return {
    formData,
    formRules,
    initializeFormData,
    resetFormData,
    getCurrentDateTime
  }
} 
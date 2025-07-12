import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { caseTemplateDetailCreate } from '../api/caseTemplateDetail'
import { dictionaryList } from '../api/dictionary'
import { dataTableCrudUpdate, dataTableCrudDelete } from '../api/dataTableCrud'
import { escapeHtml } from '../utils/escapeHtml'

export function useTemplateDetail() {
  // 模板详情对话框状态
  const templateDetailDialogVisible = ref(false)
  const currentTemplateDetail = ref(null)
  const dictionaryMap = ref(new Map())
  
  // 当前上下文
  const currentCaseCode = ref('')
  const currentTemplateCode = ref('')
  const currentCheckTime = ref('')

  // 获取字典数据
  const fetchDictionary = async () => {
    try {
      const res = await dictionaryList({ page: 1, page_size: 99999 })
      if (res.data?.code === 200 && res.data?.data?.list) {
        res.data.data.list.forEach(item => {
          dictionaryMap.value.set(item.word_code, item)
        })
      }
    } catch (error) {
      console.error('Failed to fetch dictionary', error)
      ElMessage.error('获取系统词典失败')
    }
  }

  // 打开模板详情对话框
  const openTemplateDetailDialog = async (templateCode, caseCode, check_time) => {
    if (!caseCode) {
      ElMessage.warning('缺少病例编号信息，无法获取模板详情。')
      return
    }
    
    console.log(`正在获取模板详情 - 病例编号: ${caseCode}, 模板编号: ${templateCode}, 检查时间: ${check_time}`)
    currentCaseCode.value = caseCode
    currentTemplateCode.value = templateCode
    currentCheckTime.value = check_time
    
    try {
      const res = await caseTemplateDetailCreate({
        case_code: caseCode,
        template_code: templateCode,
        check_time: check_time
      })

      const apiResponse = res.data
      if (apiResponse?.code === 200) {
        const augmentedItems = apiResponse.data.items.map(item => {
          const dictInfo = dictionaryMap.value.get(item.word_code)
          // Correctly merge dictionary info
          const followup_options = item.followup_options || (dictInfo ? dictInfo.followup_options : undefined);
          const fields = item.fields || (dictInfo ? dictInfo.fields : undefined);

          return {
            ...item,
            input_type: item.input_type || (dictInfo ? dictInfo.input_type : 'text'),
            options: item.options || (dictInfo ? dictInfo.options : undefined),
            followup_options: followup_options,
            fields: fields,
            isEditing: false,
            editingValue: null, // Use null for better checks
          }
        })

        currentTemplateDetail.value = {
          ...apiResponse.data,
          items: augmentedItems
        }
        templateDetailDialogVisible.value = true
        console.log('模板详情获取成功:', currentTemplateDetail.value)
      } else {
        ElMessage.error(`获取模板详情失败: ${apiResponse?.msg || '未知错误'}`)
      }
    } catch (error) {
      console.error('获取模板详情失败:', error)
      ElMessage.error('获取模板详情失败')
    }
  }

  // 开始编辑
  const startEdit = (row) => {
    row.isEditing = true
    const inputType = row.input_type || 'text'

    // Helper to safely parse JSON
    const parseJson = (value) => {
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.warn('Failed to parse JSON value, using raw value:', value);
        }
      }
      return value;
    };

    const initialValue = parseJson(row.value);

    switch (inputType) {
      case 'group':
        row.editingValue = {};
        const fields = getMainGroupFields(row.word_code);
        fields.forEach((field) => {
          row.editingValue[field.label] = initialValue && initialValue[field.label] ? initialValue[field.label] : '';
        });
        break;
      case 'multi': {
        const allOptions = getOptions(row.word_code);
        const followup = {};

        // **CRITICAL FIX**: Initialize followup structure for ALL options first
        allOptions.forEach((option) => {
          // Use the getFollowupType function to correctly identify group type for compatibility
          if (getFollowupType(row.word_code, option) === 'group') {
            const followupDef = getFollowupDefinition(row.word_code, option);
            followup[option] = {};
            if (followupDef && followupDef.fields) {
              followupDef.fields.forEach((field) => {
                followup[option][field.label] = '';
              });
            }
          }
        });
        
        let selected = [];
        if (typeof initialValue === 'object' && initialValue !== null) {
          // Data is stored as an object: { "Option A": "followup_value", "Option B": true, ... }
          selected = Object.keys(initialValue);
          // Populate followup values for selected options
          Object.entries(initialValue).forEach(([key, val]) => {
            if (val !== true && val !== false && followup[key] !== undefined) {
               // If it is a group, val is an object
              if (typeof val === 'object' && val !== null) {
                 Object.assign(followup[key], val);
              } else {
                 followup[key] = val;
              }
            }
          });
        } else if (Array.isArray(initialValue)) {
          // Data is stored as a simple array: ["Option A", "Option B"]
          selected = initialValue;
        } else if (typeof initialValue === 'string' && initialValue) {
          // Data is a comma-separated string
          selected = initialValue.split(',').map(s => s.trim());
        }
        
        row.editingValue = { selected, followup };
        break;
      }
      case 'multi_with_date': {
        const selected = [];
        const times = {};
        if (typeof initialValue === 'object' && initialValue !== null) {
          Object.entries(initialValue).forEach(([key, val]) => {
            if (val) {
              selected.push(key);
              if (typeof val === 'string') {
                times[key] = val;
              }
            }
          });
        }
        row.editingValue = { selected, times };
        break;
      }
      case 'single_with_other': {
        const options = getOptions(row.word_code);
        if (initialValue && options.includes(initialValue)) {
          row.editingValue = { selected: initialValue, other: '' };
        } else {
          row.editingValue = { selected: '__other__', other: initialValue || '' };
        }
        break;
      }
      default:
        row.editingValue = row.value; // Keep original value for simple types
        break;
    }
  }

  // 取消编辑
  const cancelEdit = (row) => {
    row.isEditing = false
    row.editingValue = null
  }

  // 保存项目
  const saveItem = async (row) => {
    let formattedValue
    const value = row.editingValue
    const inputType = row.input_type || 'text'

    switch (inputType) {
      case 'group':
        formattedValue = JSON.stringify(value);
        break;
      case 'single_with_other':
        if (value && value.selected) {
          formattedValue = value.selected === '__other__' ? value.other : value.selected
        } else {
          formattedValue = ''
        }
        break
      case 'multi':
        if (!value || !value.selected || !value.selected.length) {
          formattedValue = ''
        } else {
          const submissionObject = {}
          value.selected.forEach((option) => {
            const followupDef = getFollowupDefinition(row.word_code, option);
            if (followupDef) {
              submissionObject[option] = value.followup[option];
            } else {
              submissionObject[option] = true;
            }
          });
          formattedValue = JSON.stringify(submissionObject)
        }
        break
      case 'multi_with_date':
        if (!value || !value.selected || !value.selected.length) {
          formattedValue = ''
        } else {
          const submissionObject = {}
          value.selected.forEach((option) => {
            if (value.times && value.times[option]) {
              submissionObject[option] = value.times[option]
            } else {
              submissionObject[option] = true // Should not happen if validation is correct
            }
          })
          formattedValue = JSON.stringify(submissionObject)
        }
        break
      default:
        formattedValue = value
        break
    }

    // Final check to ensure value is a string for the API
    if (typeof formattedValue !== 'string') {
      formattedValue = JSON.stringify(formattedValue)
    }

    try {
      const res = await dataTableCrudUpdate({
        case_code: currentCaseCode.value,
        template_code: currentTemplateCode.value,
        word_code: row.word_code,
        check_time: currentCheckTime.value,
        value: formattedValue,
      })
      
      const apiResponse = res.data
      if (apiResponse?.code === 200) {
        ElMessage.success('更新成功')
        row.value = formattedValue // Update local value with the stringified version
        row.isEditing = false
        row.editingValue = null
        return true // 表示需要刷新主视图
      } else {
        ElMessage.error(apiResponse?.msg || '更新失败')
        return false
      }
    } catch (error) {
      console.error('更新失败', error)
      ElMessage.error('更新操作失败')
      return false
    }
  }

  // 删除项目
  const deleteItem = async (row) => {
    try {
      await ElMessageBox.confirm('您确定要删除此项数据吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      const res = await dataTableCrudDelete({
        case_code: currentCaseCode.value,
        template_code: currentTemplateCode.value,
        word_code: row.word_code,
        check_time: currentCheckTime.value
      })
      
      if (res.data?.code === 200) {
        ElMessage.success('删除成功')
        if (currentTemplateDetail.value) {
          const index = currentTemplateDetail.value.items.findIndex(item => item.word_code === row.word_code)
          if (index > -1) {
            currentTemplateDetail.value.items.splice(index, 1)
          }
        }
        return true // 表示需要刷新主视图
      } else {
        ElMessage.error(res.data?.msg || '删除失败')
        return false
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
        ElMessage.error('删除操作失败')
      }
      return false
    }
  }

  // Helper to get the full followup definition
  const getFollowupDefinition = (word_code, option) => {
      const dictInfo = dictionaryMap.value.get(word_code);
      return dictInfo?.followup_options?.[option];
  };

  const getOptions = (word_code) => {
    const dictInfo = dictionaryMap.value.get(word_code)
    if (dictInfo && dictInfo.options && typeof dictInfo.options === 'string') {
      return dictInfo.options.split(',').map((o) => o.trim()).filter((o) => o)
    }
    return []
  }

  // 检查某个选项是否有二级选项
  const hasFollowupForOption = (word_code, option) => {
    const dictInfo = dictionaryMap.value.get(word_code)
    return dictInfo?.followup_options?.[option] !== undefined
  }

  // 获取二级选项的类型
  const getFollowupType = (word_code, option) => {
    const followupDef = getFollowupDefinition(word_code, option);
    // 兼容性处理：如果存在 fields 数组，即使 input_type 不是 group，也将其视为 group
    if (followupDef?.fields && Array.isArray(followupDef.fields)) {
        return 'group';
    }
    return followupDef?.input_type || 'text';
  }

  // 获取二级选项的选项列表
  const getFollowupOptions = (word_code, option) => {
    const followupDef = getFollowupDefinition(word_code, option);
    if (followupDef && followupDef.options && typeof followupDef.options === 'string') {
        return followupDef.options.split(',').map((o) => o.trim()).filter((o) => o);
    }
    return [];
  }

  // 获取二级选项的标签
  const getFollowupLabel = (word_code, option) => {
    const followupDef = getFollowupDefinition(word_code, option);
    return followupDef?.label || `${option}详情`;
  }

  // 新增：获取组合字段列表
  const getFollowupFields = (word_code, option) => {
      const followupDef = getFollowupDefinition(word_code, option);
      return followupDef?.fields || [];
  };

  // 新增：获取字段选项列表
  const getFieldOptions = (field) => {
      if (field && field.options && typeof field.options === 'string') {
          return field.options.split(',').map((o) => o.trim()).filter((o) => o);
      }
      return [];
  };

  // 新增：获取主词条组合字段列表
  const getMainGroupFields = (word_code) => {
      const dictInfo = dictionaryMap.value.get(word_code);
      return dictInfo?.fields || [];
  };


  // 新增：格式化显示值
  const formatDisplayValue = (item) => {
    // Helper to safely parse JSON
    const parseJson = (value) => {
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          return JSON.parse(value);
        } catch (e) { /* ignore */ }
      }
      return value;
    };
    
    const value = parseJson(item.value);

    // Helper to format key-value pairs from an object, used for both main group and followup groups
    const formatGroup = (groupObj) => {
      return Object.entries(groupObj)
        .map(([fieldKey, fieldVal]) => {
          const cleanKey = escapeHtml(String(fieldKey));
          const cleanVal = fieldVal === undefined || fieldVal === null || fieldVal === '' ? '未填写' : escapeHtml(String(fieldVal));
          return `<strong>${cleanKey}</strong>: ${cleanVal}`
        })
        .join(', ');
    };

    // Helper to format the main value object for multi-select etc.
    const formatObject = (obj) => {
      return Object.entries(obj)
        .map(([key, val]) => {
          const cleanKey = escapeHtml(String(key));
          if (val === true) {
            return `<strong>${cleanKey}</strong>`;
          }
          
          // Check if this is a group type followup
          if (typeof val === 'object' && val !== null) {
            return `<strong>${cleanKey}</strong>: [${formatGroup(val)}]`;
          }
          
          return `<strong>${cleanKey}</strong>: ${escapeHtml(String(val))}`;
        })
        .join('<br>');
    };

    if (value === null || value === undefined || value === '') {
      return '<span style="color: #909399;">未填写</span>';
    }

    // Case 1: Value is an object (already parsed or originally an object)
    if (typeof value === 'object' && !Array.isArray(value)) {
      // If it's a main group type, format it directly
      if (item.input_type === 'group') {
        return formatGroup(value);
      }
      // Otherwise, it's a complex object from multi-select etc.
      return formatObject(value);
    }
    
    // Case 2: It's a simple array (from a simple multi-select)
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // Case 3: It's a simple value (string, number)
    return value.toString();
  };


  return {
    templateDetailDialogVisible,
    currentTemplateDetail,
    fetchDictionary,
    openTemplateDetailDialog,
    startEdit,
    cancelEdit,
    saveItem,
    deleteItem,
    getOptions,
    hasFollowupForOption,
    getFollowupType,
    getFollowupOptions,
    getFollowupLabel,
    formatDisplayValue,
    getFollowupFields,
    getFieldOptions,
    getMainGroupFields
  }
} 
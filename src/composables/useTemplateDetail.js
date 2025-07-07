import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { caseTemplateDetailCreate } from '../api/caseTemplateDetail'
import { dictionaryList } from '../api/dictionary'
import { dataTableCrudUpdate, dataTableCrudDelete } from '../api/dataTableCrud'

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
          return {
            ...item,
            input_type: item.input_type || (dictInfo ? dictInfo.input_type : 'text'),
            options: item.options || (dictInfo ? dictInfo.options : undefined),
            followup_options: item.followup_options || (dictInfo ? dictInfo.followup_options : undefined),
            isEditing: false,
            editingValue: '',
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

    let initialValue = row.value
    if (typeof initialValue === 'string' && (initialValue.startsWith('{') || initialValue.startsWith('['))) {
      try {
        initialValue = JSON.parse(initialValue)
      } catch (e) {
        console.warn('Failed to parse JSON value:', initialValue)
        initialValue = row.value
      }
    }

    switch (inputType) {
      case 'multi':
        if (typeof initialValue === 'object' && initialValue !== null) {
          const selected = []
          const followup = {}
          
          Object.entries(initialValue).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
              selected.push(key)
              if (val !== true && val !== false) {
                followup[key] = val
              }
            }
          })
          row.editingValue = { selected, followup }
        } else if (Array.isArray(initialValue)) {
          row.editingValue = { selected: [...initialValue], followup: {} }
        } else {
          row.editingValue = { selected: [], followup: {} }
        }
        break
      case 'multi_with_date':
        const selected = []
        const times = {}
        if (typeof initialValue === 'object' && initialValue !== null) {
          Object.entries(initialValue).forEach(([key, val]) => {
            if (val) {
              selected.push(key)
              if (typeof val === 'string') {
                times[key] = val
              }
            }
          })
        }
        row.editingValue = { selected, times }
        break
      case 'single_with_other':
        const options = getOptions(row.word_code)
        if (initialValue && options.includes(initialValue)) {
          row.editingValue = { selected: initialValue, other: '' }
        } else {
          row.editingValue = { selected: '__other__', other: initialValue || '' }
        }
        break
      default:
        row.editingValue = initialValue
        break
    }
  }

  // 取消编辑
  const cancelEdit = (row) => {
    row.isEditing = false
    row.editingValue = ''
  }

  // 保存项目
  const saveItem = async (row) => {
    let formattedValue
    const value = row.editingValue
    const inputType = row.input_type || 'text'

    switch (inputType) {
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
            if (value.followup && value.followup[option] !== undefined && value.followup[option] !== '') {
              submissionObject[option] = value.followup[option]
            } else {
              submissionObject[option] = true
            }
          })
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
              submissionObject[option] = true
            }
          })
          formattedValue = JSON.stringify(submissionObject)
        }
        break
      default:
        formattedValue = value
        break
    }

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
      
      if (res.data?.code === 200) {
        ElMessage.success('更新成功')
        try {
          row.value = JSON.parse(formattedValue)
        } catch (e) {
          row.value = formattedValue
        }
        row.isEditing = false
        return true // 表示需要刷新主视图
      } else {
        ElMessage.error(res.data?.msg || '更新失败')
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

  // 获取选项列表
  const getOptions = (word_code) => {
    if (currentTemplateDetail.value?.items) {
      const item = currentTemplateDetail.value.items.find(i => i.word_code === word_code)
      if (item && item.options && typeof item.options === 'string') {
        return item.options.split(',').map((o) => o.trim()).filter((o) => o)
      }
    }
    const dictInfo = dictionaryMap.value.get(word_code)
    if (dictInfo && dictInfo.options && typeof dictInfo.options === 'string') {
      return dictInfo.options.split(',').map((o) => o.trim()).filter((o) => o)
    }
    return []
  }

  // 检查某个选项是否有二级选项
  const hasFollowupForOption = (word_code, option) => {
    if (currentTemplateDetail.value?.items) {
      const item = currentTemplateDetail.value.items.find(i => i.word_code === word_code)
      if (item && item.followup_options && item.followup_options[option]) {
        return true
      }
    }
    const dictInfo = dictionaryMap.value.get(word_code)
    return dictInfo?.followup_options?.[option] !== undefined
  }

  // 获取二级选项的类型
  const getFollowupType = (word_code, option) => {
    if (currentTemplateDetail.value?.items) {
      const item = currentTemplateDetail.value.items.find(i => i.word_code === word_code)
      if (item && item.followup_options && item.followup_options[option]) {
        return item.followup_options[option].input_type || 'text'
      }
    }
    const dictInfo = dictionaryMap.value.get(word_code)
    const followup = dictInfo?.followup_options?.[option]
    return followup?.input_type || 'text'
  }

  // 获取二级选项的选项列表
  const getFollowupOptions = (word_code, option) => {
    if (currentTemplateDetail.value?.items) {
      const item = currentTemplateDetail.value.items.find(i => i.word_code === word_code)
      if (item && item.followup_options && item.followup_options[option]) {
        const followup = item.followup_options[option]
        if (followup.options && typeof followup.options === 'string') {
          return followup.options.split(',').map((o) => o.trim()).filter((o) => o)
        }
      }
    }
    const dictInfo = dictionaryMap.value.get(word_code)
    const followup = dictInfo?.followup_options?.[option]
    if (followup && followup.options && typeof followup.options === 'string') {
      return followup.options.split(',').map((o) => o.trim()).filter((o) => o)
    }
    return []
  }

  // 获取二级选项的标签
  const getFollowupLabel = (word_code, option) => {
    if (currentTemplateDetail.value?.items) {
      const item = currentTemplateDetail.value.items.find(i => i.word_code === word_code)
      if (item && item.followup_options && item.followup_options[option]) {
        return item.followup_options[option].label || `${option}详情`
      }
    }
    const dictInfo = dictionaryMap.value.get(word_code)
    const followup = dictInfo?.followup_options?.[option]
    return followup?.label || `${option}详情`
  }

  // 格式化显示值
  const formatDisplayValue = (item) => {
    const { value } = item

    const formatObject = (obj) => {
      return Object.entries(obj)
        .map(([key, val]) => {
          if (val === true) {
            return key
          }
          return `${key}: ${val}`
        })
        .join('<br>')
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return formatObject(value)
    }

    if (value && typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      try {
        const data = JSON.parse(value)
        return formatObject(data)
      } catch (e) {
        // 解析失败，返回原始字符串
      }
    }

    return value
  }

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
    formatDisplayValue
  }
} 
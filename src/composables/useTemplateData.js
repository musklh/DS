import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { caseTemplateSummaryCreate } from '../api/caseTemplateSummary'

export function useTemplateData(patient, selectedCaseCodes) {
  // 模板数据
  const templateData = ref([])

  // 获取模板数据
  const fetchTemplateData = async () => {
    try {
      if (!patient.value.allCases?.length) return

      const caseTemplatePromises = patient.value.allCases.map(async (patientCase) => {
        try {
          const res = await caseTemplateSummaryCreate({ case_codes: [patientCase.case_code] })
          console.log(`病例 ${patientCase.case_code} 的模板数据:`, res.data)
          
          const apiResponse = res.data
          if (apiResponse?.code === 200) {
            const processedCategories = apiResponse.data.map((category) => ({
              ...category,
              templates: category.templates.map((template) => ({
                ...template,
                case_code: patientCase.case_code
              }))
            }))
            
            return {
              case_code: patientCase.case_code,
              template_categories: processedCategories
            }
          } else {
            console.error(`获取病例 ${patientCase.case_code} 的模板数据失败:`, apiResponse?.msg)
            return {
              case_code: patientCase.case_code,
              template_categories: []
            }
          }
        } catch (error) {
          console.error(`获取病例 ${patientCase.case_code} 的模板数据失败:`, error)
          return {
            case_code: patientCase.case_code,
            template_categories: []
          }
        }
      })
      
      const results = await Promise.all(caseTemplatePromises)
      templateData.value = results.filter(result => result.template_categories.length > 0)
      
      console.log('所有病例的模板数据:', templateData.value)
    } catch (error) {
      console.error('获取模板数据失败:', error)
      ElMessage.error('获取模板数据失败')
    }
  }

  // 处理选中病例的模板数据
  const getSelectedCaseTemplateData = () => {
    if (!templateData.value.length || !selectedCaseCodes.value.length) return []
    
    const selectedCaseData = templateData.value.filter(caseData => 
      selectedCaseCodes.value.includes(caseData.case_code)
    )
    
    const allCategories = []
    
    selectedCaseData.forEach((caseData) => {
      caseData.template_categories.forEach((category) => {
        const existingCategory = allCategories.find(cat => cat.template_category === category.template_category)
        if (existingCategory) {
          existingCategory.templates.push(...category.templates)
        } else {
          allCategories.push({
            template_category: category.template_category,
            templates: [...category.templates]
          })
        }
      })
    })
    
    return allCategories
  }

  // 左侧栏数据
  const leftSections = computed(() => {
    const allCategories = getSelectedCaseTemplateData()
    const midPoint = Math.ceil(allCategories.length / 2)
    
    return allCategories.slice(0, midPoint).map((category) => ({
      title: category.template_category,
      items: category.templates.map((template) => ({
        label: template.template_name,
        time: template.check_time,
        template_code: template.template_code,
        case_code: template.case_code
      }))
    }))
  })

  // 右侧栏数据
  const rightSections = computed(() => {
    const allCategories = getSelectedCaseTemplateData()
    const midPoint = Math.ceil(allCategories.length / 2)
    
    return allCategories.slice(midPoint).map((category) => ({
      title: category.template_category,
      items: category.templates.map((template) => ({
        label: template.template_name,
        time: template.check_time,
        template_code: template.template_code,
        case_code: template.case_code
      }))
    }))
  })

  // 时间轴数据
  const timelineData = computed(() => {
    const allSections = [...leftSections.value, ...rightSections.value]
    const data = []
    
    allSections.forEach((section) => {
      section.items.forEach((item) => {
        const found = data.find((t) => t.date === item.time)
        if (found) {
          found.items.push(item)
        } else {
          data.push({ date: item.time, items: [item] })
        }
      })
    })
    
    // 按日期排序（最新在前）
    data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 格式化时间轴日期
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return data.map(entry => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      let formattedDate = entry.date

      if (entryDate.getTime() === today.getTime()) {
        formattedDate = '今天'
      } else {
        formattedDate = new Date(entry.date).toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        })
      }
      return { ...entry, date: formattedDate }
    })
  })

  // 格式化时间显示
  const formatTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr)
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } catch {
      return dateTimeStr
    }
  }

  return {
    templateData,
    leftSections,
    rightSections,
    timelineData,
    fetchTemplateData,
    formatTime
  }
} 
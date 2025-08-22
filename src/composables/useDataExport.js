import { nextTick } from 'vue'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'

export function useDataExport() {
  // 导出图表为图片
  const exportChartToImage = async (chartRef, chartTitle) => {
    console.log('exportChartToImage 被调用')
    console.log('chartRef:', chartRef)
    console.log('chartTitle:', chartTitle)

    await nextTick()

    // chartRef 已经是 ref 对象，直接访问 $el
    const chartEl = chartRef?.$el
    console.log('chartEl:', chartEl)

    if (!chartEl) {
      console.log('chartEl 不存在，无法导出')
      return
    }

    html2canvas(chartEl, { backgroundColor: '#fff' }).then(canvas => {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${chartTitle || '图表'}.png`
      link.click()
      console.log('图表导出完成')
    }).catch(error => {
      console.error('图表导出失败:', error)
    })
  }

  // 导出表格为Excel表格
  const exportTableToExcel = (tableData, chartTitle) => {
    const ws = XLSX.utils.json_to_sheet(tableData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, chartTitle || 'Sheet1')
    XLSX.writeFile(wb, `${chartTitle || '表格'}.xlsx`)
  }

  // 处理模板数据，按时间段筛选和分类
  const processTemplateData = (params) => {
    const { templateData, selectedCaseCodes, dateRange } = params

    console.log('导出 - processTemplateData 开始')
    console.log('templateData 长度:', templateData.length)
    console.log('selectedCaseCodes:', selectedCaseCodes)

    // 直接使用 useTemplateData 的 getSelectedCaseTemplateData 逻辑
    const getSelectedCaseTemplateData = () => {
      if (!templateData.length || !selectedCaseCodes.length) return []

      const selectedCaseData = templateData.filter(caseData =>
        selectedCaseCodes.includes(caseData.case_code)
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

    const selectedCaseData = templateData.filter(caseData =>
      selectedCaseCodes.includes(caseData.case_code)
    )

    // 使用与渲染逻辑完全相同的处理方式
    const allCategories = getSelectedCaseTemplateData()

    console.log('合并后的分类数量:', allCategories.length)
    allCategories.forEach(category => {
      console.log(`- ${category.template_category}: ${category.templates.length} 个模板`)
    })

    // 按时间段筛选
    allCategories.forEach(category => {
      console.log(`处理分类 ${category.template_category} 的时间筛选`)
      const originalCount = category.templates.length

      if (!dateRange.exportAll && dateRange.startDate && dateRange.endDate) {
        const startTime = new Date(dateRange.startDate).getTime()
        const endTime = new Date(dateRange.endDate).getTime()

        console.log(`时间范围: ${dateRange.startDate} 到 ${dateRange.endDate}`)

        category.templates = category.templates.filter(template => {
          const templateTime = new Date(template.check_time).getTime()
          const inRange = templateTime >= startTime && templateTime <= endTime
          if (!inRange) {
            console.log(`模板 ${template.template_name} 时间 ${template.check_time} 不在范围内`)
          }
          return inRange
        })

        console.log(`分类 ${category.template_category}: 从 ${originalCount} 个模板筛选到 ${category.templates.length} 个`)
      } else {
        console.log(`分类 ${category.template_category}: 导出全部数据，保持 ${originalCount} 个模板`)
      }

      // 按时间倒序排序
      category.templates.sort((a, b) => new Date(b.check_time) - new Date(a.check_time))
    })

    // 过滤掉空分类
    return allCategories.filter(category => category.templates.length > 0)
  }

  // 获取模板详情数据
  const fetchTemplateDetails = async (templates) => {
    const { caseTemplateDetailCreate } = await import('../api/caseTemplateDetail')
    const { dictionaryList } = await import('../api/dictionary')

    // 获取字典数据
    const dictionaryMap = new Map()
    try {
      const dictRes = await dictionaryList({ page: 1, page_size: 99999 })
      if (dictRes.data?.code === 200 && dictRes.data?.data?.list) {
        dictRes.data.data.list.forEach(item => {
          dictionaryMap.set(item.word_code, item)
        })
      }
    } catch (error) {
      console.warn('获取字典数据失败:', error)
    }

    // 获取所有模板的详情
    const detailPromises = templates.map(async (template) => {
      try {
        const res = await caseTemplateDetailCreate({
          case_code: template.case_code,
          template_code: template.template_code,
          check_time: template.check_time
        })

        if (res.data?.code === 200) {
          const items = res.data.data.items || []
          const enhancedItems = items.map(item => {
            const dictInfo = dictionaryMap.get(item.word_code)
            return {
              ...item,
              word_name: dictInfo?.word_name || item.word_name || '',
              input_type: item.input_type || dictInfo?.input_type || 'text'
            }
          })

          return {
            ...template,
            details: enhancedItems
          }
        } else {
          return {
            ...template,
            details: []
          }
        }
      } catch (error) {
        console.warn(`获取模板详情失败 ${template.template_code}:`, error)
        return {
          ...template,
          details: []
        }
      }
    })

    return await Promise.all(detailPromises)
  }

  // 格式化词条详情值
  const formatDetailValue = (value, inputType) => {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    try {
      // 根据输入类型处理不同的值格式
      switch (inputType) {
        case 'multi':
          // 多选值可能是数组或字符串
          if (Array.isArray(value)) {
            return value.join(' | ')
          }
          if (typeof value === 'string') {
            return value
          }
          return JSON.stringify(value)

        case 'group':
          // 组类型的值可能是对象
          if (typeof value === 'object' && value !== null) {
            const entries = Object.entries(value)
            return entries.map(([key, val]) => `${key}: ${val || ''}`).join(' | ')
          }
          return String(value)

        default:
          // 其他类型直接转为字符串
          return String(value)
      }
    } catch (error) {
      console.warn('格式化词条值失败:', error)
      return String(value)
    }
  }

  // 导出模板数据到Excel
  const exportTemplateDataToExcel = async (params) => {
    try {
      const { patientData, dateRange, format } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      const wb = XLSX.utils.book_new()

      // 为每个模板分类创建工作表
      for (const category of processedData) {
        console.log(`正在处理分类: ${category.template_category}`)

        // 获取模板详情数据
        const templatesWithDetails = await fetchTemplateDetails(category.templates)
        console.log(`获取到 ${templatesWithDetails.length} 个模板的详情数据`)

        // 准备导出数据
        const exportData = []

        templatesWithDetails.forEach(template => {
          // 基本信息行
          const baseInfo = {
            '类型': '基本信息',
            '模板名称': template.template_name || '',
            '检查时间': template.check_time || '',
            '病例编号': template.case_code || '',
            '模板编码': template.template_code || '',
            '词条名称': '',
            '词条编码': '',
            '检查值': '',
            '输入类型': ''
          }
          exportData.push(baseInfo)

          // 词条详情行
          if (template.details && template.details.length > 0) {
            template.details.forEach(detail => {
              exportData.push({
                '类型': '词条详情',
                '模板名称': '',
                '检查时间': '',
                '病例编号': '',
                '模板编码': '',
                '词条名称': detail.word_name || '',
                '词条编码': detail.word_code || '',
                '检查值': formatDetailValue(detail.value, detail.input_type),
                '输入类型': detail.input_type || 'text'
              })
            })
          } else {
            // 如果没有词条详情，添加一个空行说明
            exportData.push({
              '类型': '词条详情',
              '模板名称': '',
              '检查时间': '',
              '病例编号': '',
              '模板编码': '',
              '词条名称': '暂无词条数据',
              '词条编码': '',
              '检查值': '',
              '输入类型': ''
            })
          }

          // 添加空行分隔不同模板
          exportData.push({
            '类型': '',
            '模板名称': '',
            '检查时间': '',
            '病例编号': '',
            '模板编码': '',
            '词条名称': '',
            '词条编码': '',
            '检查值': '',
            '输入类型': ''
          })
        })

        const ws = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(wb, ws, category.template_category.slice(0, 30)) // 工作表名称限制30字符
      }

      // 生成文件名
      const patientName = patientData.name || '患者'
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s]/g, '-')
      const fileName = `${patientName}_数据导出_${timeRange}.xlsx`

      XLSX.writeFile(wb, fileName)

      return { success: true, fileName }
    } catch (error) {
      console.error('导出Excel失败:', error)
      return { success: false, message: '导出Excel失败: ' + error.message }
    }
  }

  // 导出模板数据到CSV
  const exportTemplateDataToCsv = async (params) => {
    try {
      const { patientData, dateRange } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      let csvContent = '\uFEFF' // BOM for UTF-8

      // CSV 头部
      csvContent += '"类型","模板名称","检查时间","病例编号","模板编码","词条名称","词条编码","检查值","输入类型"\n'

      // 为每个分类添加数据
      for (const category of processedData) {
        // 添加分类标题
        csvContent += `"模板分类：${category.template_category}"\n`

        // 获取模板详情数据
        const templatesWithDetails = await fetchTemplateDetails(category.templates)

        templatesWithDetails.forEach(template => {
          // 基本信息行
          const baseRow = [
            '"基本信息"',
            `"${template.template_name || ''}"`,
            `"${template.check_time || ''}"`,
            `"${template.case_code || ''}"`,
            `"${template.template_code || ''}"`,
            '""',
            '""',
            '""',
            '""'
          ].join(',')
          csvContent += baseRow + '\n'

          // 词条详情行
          if (template.details && template.details.length > 0) {
            template.details.forEach(detail => {
              const detailRow = [
                '"词条详情"',
                '""',
                '""',
                '""',
                '""',
                `"${detail.word_name || ''}"`,
                `"${detail.word_code || ''}"`,
                `"${formatDetailValue(detail.value, detail.input_type)}"`,
                `"${detail.input_type || 'text'}"`
              ].join(',')
              csvContent += detailRow + '\n'
            })
          } else {
            // 如果没有词条详情，添加一个空行说明
            const emptyRow = [
              '"词条详情"',
              '""',
              '""',
              '""',
              '""',
              '"暂无词条数据"',
              '""',
              '""',
              '""'
            ].join(',')
            csvContent += emptyRow + '\n'
          }

          // 添加空行分隔不同模板
          csvContent += '"","","","","","","","",""\n'
        })
      }

      // 生成文件名
      const patientName = patientData.name || '患者'
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s]/g, '-')
      const fileName = `${patientName}_数据导出_${timeRange}.csv`

      // 创建下载链接
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()

      // 清理URL对象
      URL.revokeObjectURL(link.href)

      return { success: true, fileName }
    } catch (error) {
      console.error('导出CSV失败:', error)
      return { success: false, message: '导出CSV失败: ' + error.message }
    }
  }

  return {
    exportChartToImage,
    exportTableToExcel,
    exportTemplateDataToExcel,
    exportTemplateDataToCsv,
    processTemplateData
  }
} 
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

    // 筛选选中的病例数据
    const selectedCaseData = templateData.filter(caseData =>
      selectedCaseCodes.includes(caseData.case_code)
    )

    // 合并所有分类
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

    // 按时间段筛选
    allCategories.forEach(category => {
      if (!dateRange.exportAll && dateRange.startDate && dateRange.endDate) {
        const startTime = new Date(dateRange.startDate).getTime()
        const endTime = new Date(dateRange.endDate).getTime()

        category.templates = category.templates.filter(template => {
          const templateTime = new Date(template.check_time).getTime()
          return templateTime >= startTime && templateTime <= endTime
        })
      }

      // 按时间倒序排序
      category.templates.sort((a, b) => new Date(b.check_time) - new Date(a.check_time))
    })

    // 过滤掉空分类
    return allCategories.filter(category => category.templates.length > 0)
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
      processedData.forEach((category) => {
        const exportData = category.templates.map(template => ({
          '模板名称': template.template_name || '',
          '检查时间': template.check_time || '',
          '病例编号': template.case_code || '',
          '模板编码': template.template_code || ''
        }))

        const ws = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(wb, ws, category.template_category.slice(0, 30)) // 工作表名称限制30字符
      })

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

      // 为每个分类添加数据
      processedData.forEach((category, categoryIndex) => {
        // 添加分类标题
        if (categoryIndex > 0) {
          csvContent += '\n' // 在分类之间添加空行
        }
        csvContent += `"模板分类：${category.template_category}"\n`
        csvContent += '"模板名称","检查时间","病例编号","模板编码"\n'

        // 添加模板数据
        category.templates.forEach(template => {
          const row = [
            `"${template.template_name || ''}"`,
            `"${template.check_time || ''}"`,
            `"${template.case_code || ''}"`,
            `"${template.template_code || ''}"`
          ].join(',')
          csvContent += row + '\n'
        })
      })

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
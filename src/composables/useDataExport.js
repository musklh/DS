import { nextTick } from 'vue'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

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

  // 创建PDF内容HTML
  const createPDFContentHTML = (patientData, processedData, dateRange) => {
    const patientInfo = {
      name: patientData.identity_name || patientData.name || '',
      gender: patientData.gender || '',
      age: patientData.age || '',
      caseCode: patientData.case_code || patientData.id || '',
      printTime: new Date().toLocaleDateString('zh-CN'),
      timeRange: dateRange.exportAll ? '全部数据' : `${dateRange.startDate} ~ ${dateRange.endDate}`
    }

    let html = `
      <div style="font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          病人检验报告单
        </div>

        <div style="margin-bottom: 20px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>姓名: ${patientInfo.name}</span>
            <span>性别: ${patientInfo.gender}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>年龄: ${patientInfo.age}岁</span>
            <span>病历号: ${patientInfo.caseCode}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>打印时间: ${patientInfo.printTime}</span>
            <span>时间范围: ${patientInfo.timeRange}</span>
          </div>
        </div>
    `

    processedData.forEach(category => {
      html += `
        <div style="margin-bottom: 30px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
            ${category.template_category}
          </div>
      `

      category.templates.forEach(template => {
        const checkTime = new Date(template.check_time).toLocaleDateString('zh-CN')
        html += `
          <div style="margin-bottom: 20px; margin-left: 10px;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">
              检查时间: ${checkTime}
            </div>
            <div style="margin-left: 15px; font-size: 12px;">
        `

        // 这里先添加基础信息，稍后会通过JavaScript添加详细数据
        html += `
            </div>
          </div>
        `
      })

      html += `
        </div>
      `
    })

    html += `
      </div>
    </div>
    `

    return html
  }

  // 导出模板数据到PDF (使用html2canvas方式)
  const exportTemplateDataToPdf = async (params) => {
    try {
      const { patientData, dateRange } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      console.log('开始生成PDF文档...')

      // 创建临时HTML元素
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '800px'
      tempDiv.style.fontFamily = "'Microsoft YaHei', 'SimSun', Arial, sans-serif"

      const patientInfo = {
        name: patientData.identity_name || patientData.name || '',
        gender: patientData.gender || '',
        age: patientData.age || '',
        caseCode: patientData.case_code || patientData.id || '',
        printTime: new Date().toLocaleDateString('zh-CN'),
        timeRange: dateRange.exportAll ? '全部数据' : `${dateRange.startDate} ~ ${dateRange.endDate}`
      }

      tempDiv.innerHTML = `
        <div style="padding: 40px; line-height: 1.8; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif;">
          <div style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 15px;">
            病人检验报告单
          </div>

          <div style="margin-bottom: 30px; font-size: 16px; background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="flex: 1;">姓名: ${patientInfo.name}</span>
              <span style="flex: 1;">性别: ${patientInfo.gender}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="flex: 1;">年龄: ${patientInfo.age}岁</span>
              <span style="flex: 1;">病历号: ${patientInfo.caseCode}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="flex: 1;">打印时间: ${patientInfo.printTime}</span>
              <span style="flex: 1;">时间范围: ${patientInfo.timeRange}</span>
            </div>
          </div>
      `

      // 获取模板详情数据并添加到HTML
      for (const category of processedData) {
        console.log(`处理PDF分类: ${category.template_category}`)

        tempDiv.innerHTML += `
          <div style="margin-bottom: 40px; page-break-inside: avoid;">
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 8px; color: #333;">
              ${category.template_category}
            </div>
        `

        // 获取模板详情数据
        const templatesWithDetails = await fetchTemplateDetails(category.templates)

        for (const template of templatesWithDetails) {
          const checkTime = new Date(template.check_time).toLocaleDateString('zh-CN')
          const templateName = template.template_name || '未命名模板'

          tempDiv.innerHTML += `
            <div style="margin-bottom: 25px; margin-left: 15px; background: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #007bff; background: #e3f2fd; padding: 8px 12px; border-radius: 3px; margin: -15px -15px 15px -15px; border-left: 4px solid #007bff;">
                ${templateName}
              </div>
              <div style="font-size: 14px; margin-bottom: 15px; color: #666; padding-left: 5px;">
                检查时间: ${checkTime}
              </div>
              <div style="margin-left: 10px; font-size: 14px; line-height: 2;">
          `

          // 添加词条详情
          if (template.details && template.details.length > 0) {
            template.details.forEach(detail => {
              const value = formatDetailValue(detail.value, detail.input_type)
              tempDiv.innerHTML += `
                <div style="margin-bottom: 5px;">
                  <span style="font-weight: bold; color: #333;">${detail.word_name || ''}：</span>
                  <span style="color: #666;">${value}</span>
                </div>
              `
            })
          } else {
            tempDiv.innerHTML += `
              <div style="color: #999; font-style: italic;">暂无词条数据</div>
            `
          }

          tempDiv.innerHTML += `
              </div>
            </div>
          `
        }

        tempDiv.innerHTML += `
          </div>
        `
      }

      tempDiv.innerHTML += `
        </div>
      `

      document.body.appendChild(tempDiv)

      // 使用html2canvas转换为图片
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      })

      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // 添加第一页
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // 如果内容超过一页，添加更多页面
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // 清理临时元素
      document.body.removeChild(tempDiv)

      // 生成文件名
      const patientName = patientInfo.name || '患者'
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s]/g, '-')
      const fileName = `${patientName}_检验报告_${timeRange}.pdf`

      // 保存PDF
      pdf.save(fileName)

      console.log('PDF生成完成')
      return { success: true, fileName }
    } catch (error) {
      console.error('导出PDF失败:', error)
      return { success: false, message: '导出PDF失败: ' + error.message }
    }
  }

  return {
    exportChartToImage,
    exportTableToExcel,
    exportTemplateDataToExcel,
    exportTemplateDataToCsv,
    exportTemplateDataToPdf,
    processTemplateData
  }
} 
import { nextTick } from 'vue'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import MarkdownIt from 'markdown-it'
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

  // 创建Markdown内容
  const createMarkdownContent = (patientData, processedData, dateRange) => {
    const patientInfo = {
      name: patientData.identity_name || patientData.name || '',
      gender: patientData.gender || '',
      age: patientData.age || '',
      caseCode: patientData.case_code || patientData.id || '',
      printTime: new Date().toLocaleDateString('zh-CN'),
      timeRange: dateRange.exportAll ? '全部数据' : `${dateRange.startDate} ~ ${dateRange.endDate}`
    }

    let markdown = `# 病人检验报告单\n\n`
    
    // 患者基本信息
    markdown += `## 患者信息\n\n`
    markdown += `| 项目 | 信息 |\n`
    markdown += `|------|------|\n`
    markdown += `| 姓名 | ${patientInfo.name} |\n`
    markdown += `| 性别 | ${patientInfo.gender} |\n`
    markdown += `| 年龄 | ${patientInfo.age}岁 |\n`
    markdown += `| 病历号 | ${patientInfo.caseCode} |\n`
    markdown += `| 打印时间 | ${patientInfo.printTime} |\n`
    markdown += `| 时间范围 | ${patientInfo.timeRange} |\n\n`

    // 检验数据
    markdown += `## 检验数据\n\n`
    
    processedData.forEach((category, categoryIndex) => {
      markdown += `### ${category.template_category}\n\n`
      
      category.templates.forEach((template, templateIndex) => {
        const checkTime = new Date(template.check_time).toLocaleDateString('zh-CN')
        const templateName = template.template_name || '未命名模板'
        
        markdown += `#### ${templateName}\n\n`
        markdown += `**检查时间:** ${checkTime}\n\n`
        
        if (template.details && template.details.length > 0) {
          markdown += `| 词条名称 | 检查值 |\n`
          markdown += `|----------|--------|\n`
          
          template.details.forEach(detail => {
            const value = formatDetailValue(detail.value, detail.input_type)
            const wordName = (detail.word_name || '').replace(/\|/g, '\\|')
            const displayValue = value.replace(/\|/g, '\\|')
            markdown += `| ${wordName} | ${displayValue} |\n`
          })
          markdown += `\n`
        } else {
          markdown += `*暂无词条数据*\n\n`
        }
      })
    })

    return markdown
  }

  // 使用更好的PDF生成方式 (基于Markdown渲染)
  const exportTemplateDataToPdfImproved = async (params) => {
    try {
      const { patientData, dateRange } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      console.log('开始生成基于Markdown的PDF文档...')

      // 获取模板详情数据
      const processedDataWithDetails = []
      for (const category of processedData) {
        const templatesWithDetails = await fetchTemplateDetails(category.templates)
        processedDataWithDetails.push({
          ...category,
          templates: templatesWithDetails
        })
      }

      // 创建Markdown内容
      const markdownContent = createMarkdownContent(patientData, processedDataWithDetails, dateRange)
      
      // 初始化Markdown解析器
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })

      // 渲染为HTML
      const htmlContent = md.render(markdownContent)

      // 创建完整的HTML文档，使用更简洁的样式
      const styledHtml = `
        <div style="font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; font-size: 12px;">
          ${htmlContent.replace(/<h1>/g, '<h1 style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; font-size: 18px;">')
                      .replace(/<h2>/g, '<h2 style="border-bottom: 1px solid #666; padding-bottom: 5px; margin-top: 20px; margin-bottom: 15px; font-size: 16px;">')
                      .replace(/<h3>/g, '<h3 style="color: #007bff; border-left: 3px solid #007bff; padding-left: 10px; margin-top: 15px; margin-bottom: 10px; font-size: 14px;">')
                      .replace(/<h4>/g, '<h4 style="color: #666; margin-top: 15px; margin-bottom: 8px; font-size: 13px;">')
                      .replace(/<table>/g, '<table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px;">')
                      .replace(/<th>/g, '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; font-weight: bold; text-align: left;">')
                      .replace(/<td>/g, '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;">')
                      .replace(/<p>/g, '<p style="margin: 8px 0;">')
                      .replace(/<strong>/g, '<strong style="font-weight: bold;">')}
        </div>
      `

      // 创建临时HTML元素
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '800px'
      tempDiv.style.backgroundColor = '#ffffff'
      tempDiv.innerHTML = styledHtml
      document.body.appendChild(tempDiv)

      // 等待内容渲染
      await new Promise(resolve => setTimeout(resolve, 100))

      // 使用html2canvas生成图片，然后转为PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0
      })

      // 清理临时元素
      document.body.removeChild(tempDiv)

      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      
      // 计算图片在PDF中的尺寸
      const pdfWidth = 210 // A4宽度
      const pdfHeight = 297 // A4高度
      const imgWidth = pdfWidth - 20 // 留出边距
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let yPosition = 0
      let remainingHeight = imgHeight

      // 添加第一页
      if (remainingHeight <= pdfHeight - 20) {
        // 内容可以放在一页内
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      } else {
        // 需要分页
        let pageHeight = pdfHeight - 20
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, pageHeight)
        remainingHeight -= pageHeight
        yPosition = -pageHeight

        // 添加后续页面
        while (remainingHeight > 0) {
          pdf.addPage()
          pageHeight = Math.min(remainingHeight, pdfHeight - 20)
          pdf.addImage(imgData, 'PNG', 10, yPosition + 10, imgWidth, imgHeight)
          remainingHeight -= (pdfHeight - 20)
          yPosition -= (pdfHeight - 20)
        }
      }

      // 生成文件名
      const patientName = (patientData.identity_name || patientData.name || '患者').replace(/[^\w\u4e00-\u9fa5]/g, '_')
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s-]/g, '_')
      const fileName = `${patientName}_检验报告_优化版_${timeRange}.pdf`

      // 保存PDF
      pdf.save(fileName)

      console.log('基于Markdown的优化PDF生成完成')
      return { success: true, fileName }
    } catch (error) {
      console.error('导出优化PDF失败:', error)
      return { success: false, message: '导出优化PDF失败: ' + error.message }
    }
  }

  // 导出模板数据到PDF (使用html2canvas方式，优化分页)
  const exportTemplateDataToPdf = async (params) => {
    try {
      const { patientData, dateRange } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      console.log('开始生成优化版PDF文档...')

      // 获取模板详情数据
      const processedDataWithDetails = []
      for (const category of processedData) {
        const templatesWithDetails = await fetchTemplateDetails(category.templates)
        processedDataWithDetails.push({
          ...category,
          templates: templatesWithDetails
        })
      }

      const patientInfo = {
        name: patientData.identity_name || patientData.name || '',
        gender: patientData.gender || '',
        age: patientData.age || '',
        caseCode: patientData.case_code || patientData.id || '',
        printTime: new Date().toLocaleDateString('zh-CN'),
        timeRange: dateRange.exportAll ? '全部数据' : `${dateRange.startDate} ~ ${dateRange.endDate}`
      }

      // 创建分页内容数组
      const pageContents = []
      let currentPageContent = []
      let currentPageHeight = 0
      const maxPageHeight = 1000 // 估算的页面最大高度（像素）
      
      // 添加标题和患者信息（始终在第一页）
      const headerContent = {
        type: 'header',
        html: `
          <div style="padding: 40px; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif;">
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
        `,
        estimatedHeight: 200
      }
      
      currentPageContent.push(headerContent)
      currentPageHeight += headerContent.estimatedHeight

      // 处理每个分类和模板
      for (const category of processedDataWithDetails) {
        // 分类标题
        const categoryContent = {
          type: 'category',
          html: `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 8px; color: #333; margin-top: 20px;">
              ${category.template_category}
            </div>
          `,
          estimatedHeight: 50
        }

        // 检查是否需要新页面
        if (currentPageHeight + categoryContent.estimatedHeight > maxPageHeight && currentPageContent.length > 1) {
          pageContents.push([...currentPageContent])
          currentPageContent = []
          currentPageHeight = 0
        }

        currentPageContent.push(categoryContent)
        currentPageHeight += categoryContent.estimatedHeight

        // 处理每个模板
        for (const template of category.templates) {
          const checkTime = new Date(template.check_time).toLocaleDateString('zh-CN')
          const templateName = template.template_name || '未命名模板'
          
          let templateHtml = `
            <div style="margin-bottom: 25px; margin-left: 15px; background: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; page-break-inside: avoid;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #007bff; background: #e3f2fd; padding: 8px 12px; border-radius: 3px; margin: -15px -15px 15px -15px; border-left: 4px solid #007bff;">
                ${templateName}
              </div>
              <div style="font-size: 14px; margin-bottom: 15px; color: #666; padding-left: 5px;">
                检查时间: ${checkTime}
              </div>
              <div style="margin-left: 10px; font-size: 14px; line-height: 2;">
          `

          if (template.details && template.details.length > 0) {
            template.details.forEach(detail => {
              const value = formatDetailValue(detail.value, detail.input_type)
              templateHtml += `
                <div style="margin-bottom: 5px;">
                  <span style="font-weight: bold; color: #333;">${detail.word_name || ''}：</span>
                  <span style="color: #666;">${value}</span>
                </div>
              `
            })
          } else {
            templateHtml += `<div style="color: #999; font-style: italic;">暂无词条数据</div>`
          }

          templateHtml += `
              </div>
            </div>
          `

          const templateContent = {
            type: 'template',
            html: templateHtml,
            estimatedHeight: Math.max(100, (template.details?.length || 1) * 25 + 80) // 根据词条数量估算高度
          }

          // 检查是否需要新页面（模板作为整体不能分割）
          if (currentPageHeight + templateContent.estimatedHeight > maxPageHeight && currentPageContent.length > 0) {
            pageContents.push([...currentPageContent])
            currentPageContent = []
            currentPageHeight = 0
          }

          currentPageContent.push(templateContent)
          currentPageHeight += templateContent.estimatedHeight
        }
      }

      // 添加最后一页
      if (currentPageContent.length > 0) {
        pageContents.push(currentPageContent)
      }

      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // 为每页生成内容
      for (let pageIndex = 0; pageIndex < pageContents.length; pageIndex++) {
        const pageContent = pageContents[pageIndex]
        
        if (pageIndex > 0) {
          pdf.addPage()
        }

        // 创建当前页面的HTML
        const pageHtml = pageContent.map(content => content.html).join('')
        const fullPageHtml = `
          <div style="padding: 40px; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8;">
            ${pageHtml}
          </div>
        `

        // 创建临时HTML元素
        const tempDiv = document.createElement('div')
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        tempDiv.style.top = '-9999px'
        tempDiv.style.width = '800px'
        tempDiv.style.backgroundColor = '#ffffff'
        tempDiv.innerHTML = fullPageHtml
        document.body.appendChild(tempDiv)

        // 等待渲染
        await new Promise(resolve => setTimeout(resolve, 100))

        // 使用html2canvas转换为图片
        const canvas = await html2canvas(tempDiv, {
          scale: 1.5, // 降低分辨率减少文件大小
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 800,
          height: tempDiv.scrollHeight,
          scrollX: 0,
          scrollY: 0
        })

        // 清理临时元素
        document.body.removeChild(tempDiv)

        // 添加图片到PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.8) // 使用JPEG减少文件大小
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        // 如果图片高度超过页面，进行裁剪
        if (imgHeight > 297) {
          const maxHeight = 270 // 留出边距
          pdf.addImage(imgData, 'JPEG', 0, 10, imgWidth, maxHeight)
        } else {
          pdf.addImage(imgData, 'JPEG', 0, 10, imgWidth, imgHeight)
        }
      }

      // 生成文件名
      const patientName = (patientInfo.name || '患者').replace(/[^\w\u4e00-\u9fa5]/g, '_')
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s-]/g, '_')
      const fileName = `${patientName}_检验报告_传统版_${timeRange}.pdf`

      // 保存PDF
      pdf.save(fileName)

      console.log('优化版PDF生成完成')
      return { success: true, fileName }
    } catch (error) {
      console.error('导出PDF失败:', error)
      return { success: false, message: '导出PDF失败: ' + error.message }
    }
  }

  // 导出模板数据为Markdown
  const exportTemplateDataToMarkdown = async (params) => {
    try {
      const { patientData, dateRange } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      console.log('开始生成Markdown文档...')

      // 获取模板详情数据
      const processedDataWithDetails = []
      for (const category of processedData) {
        const templatesWithDetails = await fetchTemplateDetails(category.templates)
        processedDataWithDetails.push({
          ...category,
          templates: templatesWithDetails
        })
      }

      // 创建Markdown内容
      const markdownContent = createMarkdownContent(patientData, processedDataWithDetails, dateRange)

      // 生成文件名
      const patientName = (patientData.identity_name || patientData.name || '患者').replace(/[^\w\u4e00-\u9fa5]/g, '_')
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s-]/g, '_')
      const fileName = `${patientName}_检验报告_${timeRange}.md`

      // 创建Blob并下载
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log('Markdown文档生成完成')
      return { success: true, fileName }
    } catch (error) {
      console.error('导出Markdown失败:', error)
      return { success: false, message: '导出Markdown失败: ' + error.message }
    }
  }

  // 专门的Markdown样式PDF导出 (使用html2canvas解决中文渲染问题)
  const exportTemplateDataToPdfMarkdownStyle = async (params) => {
    try {
      const { patientData, dateRange } = params
      const processedData = processTemplateData(params)

      if (processedData.length === 0) {
        return { success: false, message: '没有找到符合条件的数据' }
      }

      console.log('开始生成Markdown样式的PDF文档...')

      // 获取模板详情数据
      const processedDataWithDetails = []
      for (const category of processedData) {
        const templatesWithDetails = await fetchTemplateDetails(category.templates)
        processedDataWithDetails.push({
          ...category,
          templates: templatesWithDetails
        })
      }

      // 创建Markdown内容
      const markdownContent = createMarkdownContent(patientData, processedDataWithDetails, dateRange)
      
      // 初始化Markdown解析器
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })

      // 渲染为HTML
      const htmlContent = md.render(markdownContent)

      // 创建GitHub风格的Markdown样式HTML
      const markdownStyledHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', '微软雅黑', 'SimSun', '宋体', Arial, sans-serif; 
                    max-width: 800px; margin: 0 auto; padding: 30px; line-height: 1.6; color: #24292f; background-color: #ffffff; font-size: 14px;">
          <style>
            h1 { font-size: 28px; font-weight: 600; padding-bottom: 0.3em; border-bottom: 2px solid #d1d9e0; margin: 0 0 24px 0; text-align: center; }
            h2 { font-size: 20px; font-weight: 600; padding-bottom: 0.3em; border-bottom: 1px solid #d1d9e0; margin: 32px 0 16px 0; }
            h3 { font-size: 18px; font-weight: 600; margin: 24px 0 16px 0; color: #0969da; border-left: 4px solid #0969da; padding-left: 16px; }
            h4 { font-size: 16px; font-weight: 600; margin: 20px 0 12px 0; color: #656d76; }
            table { border-spacing: 0; border-collapse: collapse; margin: 16px 0; width: 100%; page-break-inside: avoid; }
            table th { font-weight: 600; background-color: #f6f8fa; }
            table th, table td { padding: 8px 12px; border: 1px solid #d1d9e0; text-align: left; font-size: 13px; }
            table tr { background-color: #ffffff; }
            table tr:nth-child(2n) { background-color: #f6f8fa; }
            p { margin: 0 0 16px 0; }
            strong { font-weight: 600; }
          </style>
          ${htmlContent}
        </div>
      `

      // 创建临时HTML元素
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '800px'
      tempDiv.style.backgroundColor = '#ffffff'
      tempDiv.innerHTML = markdownStyledHtml
      document.body.appendChild(tempDiv)

      // 等待内容渲染
      await new Promise(resolve => setTimeout(resolve, 200))

      // 使用html2canvas转换为图片
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        letterRendering: true,
        foreignObjectRendering: true
      })

      // 清理临时元素
      document.body.removeChild(tempDiv)

      // 创建PDF并添加图片
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      
      // 计算图片在PDF中的尺寸
      const pdfWidth = 210
      const pdfHeight = 297
      const margin = 10
      const imgWidth = pdfWidth - (margin * 2)
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      if (imgHeight <= pdfHeight - (margin * 2)) {
        // 内容可以放在一页内
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight)
      } else {
        // 需要分页处理
        const pageHeight = pdfHeight - (margin * 2)
        let yOffset = 0
        
        while (yOffset < imgHeight) {
          if (yOffset > 0) {
            pdf.addPage()
          }
          
          const sourceY = (yOffset * canvas.width) / imgWidth
          const sourceHeight = Math.min((pageHeight * canvas.width) / imgWidth, canvas.height - sourceY)
          
          // 创建页面片段
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = canvas.width
          pageCanvas.height = sourceHeight
          const pageCtx = pageCanvas.getContext('2d')
          
          pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)
          
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.85)
          const pageImgHeight = (sourceHeight * imgWidth) / canvas.width
          
          pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, pageImgHeight)
          
          yOffset += pageHeight
        }
      }

      // 生成文件名
      const patientName = (patientData.identity_name || patientData.name || '患者').replace(/[^\w\u4e00-\u9fa5]/g, '_')
      const timeRange = dateRange.exportAll ? '全部数据' :
        `${dateRange.startDate}_${dateRange.endDate}`.replace(/[:\s-]/g, '_')
      const fileName = `${patientName}_检验报告_Markdown样式_${timeRange}.pdf`

      // 保存PDF
      pdf.save(fileName)

      console.log('Markdown样式PDF生成完成')
      return { success: true, fileName }
    } catch (error) {
      console.error('导出Markdown样式PDF失败:', error)
      return { success: false, message: '导出Markdown样式PDF失败: ' + error.message }
    }
  }

  return {
    exportChartToImage,
    exportTableToExcel,
    exportTemplateDataToExcel,
    exportTemplateDataToCsv,
    exportTemplateDataToPdf: exportTemplateDataToPdfImproved, // 使用改进版作为主要方法
    exportTemplateDataToPdfLegacy: exportTemplateDataToPdf, // 保留旧版本作为备选
    exportTemplateDataToPdfMarkdownStyle, // 新增Markdown样式PDF
    exportTemplateDataToMarkdown,
    processTemplateData
  }
} 
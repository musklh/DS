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

  return {
    exportChartToImage,
    exportTableToExcel
  }
} 
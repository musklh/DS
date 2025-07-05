import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { caseTemplateDetailCreate } from '../api/caseTemplateDetail'
import { dataTableCrudDelete } from '../api/dataTableCrud'

export function useTemplateActions() {
  const router = useRouter()

  // 删除模板
  const deleteTemplate = async (templateName, items, onSuccess) => {
    try {
      await ElMessageBox.confirm(`您确定要删除模板 "${templateName}" 的所有数据吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      const templateCode = items[0].template_code
      const caseCode = items[0].case_code
      const checkTime = items[0].time
      
      // 获取模板详情，包含所有词条数据
      const templateDetailRes = await caseTemplateDetailCreate({
        case_code: caseCode,
        template_code: templateCode,
        check_time: checkTime
      })

      const apiResponse = templateDetailRes.data
      if (apiResponse?.code === 200 && apiResponse.data?.items) {
        const deletePromises = apiResponse.data.items.map((item) => 
          dataTableCrudDelete({
            case_code: caseCode,
            template_code: templateCode,
            word_code: item.word_code,
            check_time: checkTime
          })
        )
        
        await Promise.all(deletePromises)
        ElMessage.success(`成功删除模板 "${templateName}" 的 ${apiResponse.data.items.length} 条数据`)
        
        // 调用成功回调
        if (onSuccess) {
          await onSuccess()
        }
      } else {
        ElMessage.warning('未找到该模板的数据记录')
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除模板失败:', error)
        ElMessage.error('删除操作失败')
      }
    }
  }

  // 跳转到数据可视化页面
  const goToVisualization = async (patient, selectedCaseCodes) => {
    if (selectedCaseCodes.length === 0) {
      ElMessage.warning('请至少选择一个病例')
      return
    }
    
    if (selectedCaseCodes.length > 1) {
      ElMessage.warning('数据可视化目前只支持单个病例，请选择一个病例')
      return
    }
    
    try {
      const selectedCaseCode = selectedCaseCodes[0]
      const patientData = {
        name: patient.identity_name,
        gender: patient.gender === 1 ? '男' : '女',
        age: patient.age.toString(),
        idCard: patient.idCard,
        caseId: selectedCaseCode
      }
      
      console.log('准备跳转到数据可视化页面，患者数据:', patientData)
      
      // 通过localStorage传递数据到可视化页面
      localStorage.setItem('visualizationPatientData', JSON.stringify(patientData))
      
      // 设置来源标记
      sessionStorage.setItem('fromPatientDetail', 'true')
      
      // 跳转到数据可视化页面
      await router.push('/dashboard/DataAnalysisView')
      
      ElMessage.success('正在跳转到数据可视化页面...')
    } catch (error) {
      console.error('跳转到数据可视化页面失败:', error)
      ElMessage.error('跳转失败，请重试')
    }
  }

  return {
    deleteTemplate,
    goToVisualization
  }
} 
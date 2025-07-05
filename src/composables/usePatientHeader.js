import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { caseIdentityCases } from '../api/openApiCase'

export function usePatientHeader(patientData) {
  const router = useRouter()
  
  // 检测是否从患者详情页面进入
  const isFromPatientDetail = ref(false)
  const backButtonText = computed(() => 
    isFromPatientDetail.value ? '返回患者详情' : '返回选择'
  )

  // 检测进入来源并设置返回行为
  const checkEntrySource = () => {
    const fromPatientDetail = sessionStorage.getItem('fromPatientDetail')
    if (fromPatientDetail) {
      isFromPatientDetail.value = true
      sessionStorage.removeItem('fromPatientDetail')
    }
  }

  // 处理返回导航
  const handleBackNavigation = (emit) => {
    if (isFromPatientDetail.value) {
      router.push('/dashboard/patient-list')
    } else {
      emit('go-back-to-selection')
    }
  }

  // 跳转到病例详情页面
  const goToPatientDetail = async () => {
    try {
      console.log('准备跳转到病例详情页，患者身份证号:', patientData.value.idCard)
      
      const res = await caseIdentityCases({ identity_id: patientData.value.idCard })
      console.log('获取病例信息响应:', res.data)
      
      if (res.data?.code === 200) {
        const caseList = res.data.data.list || []
        
        if (caseList.length === 0) {
          ElMessage.warning('该患者暂无病例信息')
          return
        }
        
        // 构造患者详情数据
        const patientDetail = {
          identity_name: patientData.value.name,
          gender: patientData.value.gender === '男' ? 1 : 0,
          age: parseInt(patientData.value.age) || 0,
          idCard: patientData.value.idCard,
          phone_number: '',
          home_address: '',
          blood_type: '',
          rh: '',
          has_transplant_surgery: '',
          is_in_transplant_queue: '',
          main_diagnosis: '',
          allCases: caseList,
          ...(caseList[0] || {})
        }
        
        console.log('构造的患者详情数据:', patientDetail)
        
        localStorage.setItem('selectedPatientDetail', JSON.stringify(patientDetail))
        await router.push('/dashboard/patient-list')
        ElMessage.success('正在跳转到病例详情页面...')
      } else {
        ElMessage.error('获取病例信息失败: ' + (res.data?.msg || '未知错误'))
      }
    } catch (error) {
      console.error('跳转到病例详情页面失败:', error)
      ElMessage.error('跳转失败，请重试')
    }
  }

  // 组件挂载时检测进入来源
  onMounted(() => {
    checkEntrySource()
  })

  return {
    isFromPatientDetail,
    backButtonText,
    handleBackNavigation,
    goToPatientDetail
  }
} 
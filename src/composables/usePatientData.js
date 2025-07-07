import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { caseUpdate } from '../api/openApiCase'

export function usePatientData(patient) {
  // 编辑对话框状态
  const editDialogVisible = ref(false)
  const editForm = reactive({
    name: '',
    gender: 1,
    age: '',
    phone_number: '',
    has_transplant_surgery: '',
    is_in_transplant_queue: '',
    main_diagnosis: '',
  })

  // 选中的病例编号列表
  const selectedCaseCodes = ref([])

  // 初始化编辑表单
  const initializeEditForm = () => {
    editForm.name = patient.value.identity_name
    editForm.gender = patient.value.gender
    editForm.age = String(patient.value.age)
    editForm.phone_number = patient.value.phone_number
    editForm.has_transplant_surgery = patient.value.has_transplant_surgery
    editForm.is_in_transplant_queue = patient.value.is_in_transplant_queue
    editForm.main_diagnosis = patient.value.main_diagnosis
  }

  // 打开编辑对话框
  const openEditDialog = () => {
    initializeEditForm()
    editDialogVisible.value = true
  }

  // 保存编辑
  const saveEdit = async () => {
    if (selectedCaseCodes.value.length !== 1) {
      ElMessage.warning('请选择一个且仅一个病例以进行信息编辑。')
      return
    }

    const caseCodeToUpdate = selectedCaseCodes.value[0]

    try {
      const params = { case_code: caseCodeToUpdate }
      
      const body = {
        name: editForm.name,
        phone_number: editForm.phone_number,
        main_diagnosis: editForm.main_diagnosis,
        has_transplant_surgery: editForm.has_transplant_surgery,
        is_in_transplant_queue: editForm.is_in_transplant_queue,
        identity: patient.value.idCard,
        gender: patient.value.gender,
        home_address: patient.value.home_address,
        blood_type: patient.value.blood_type,
        rh: patient.value.rh,
      }

      const res = await caseUpdate(params, body)

      if (res.data?.code === 200) {
        ElMessage.success('患者信息更新成功！')
        editDialogVisible.value = false
        
        // 更新本地患者数据
        patient.value.identity_name = editForm.name
        patient.value.phone_number = editForm.phone_number
        patient.value.main_diagnosis = editForm.main_diagnosis
        patient.value.has_transplant_surgery = editForm.has_transplant_surgery
        patient.value.is_in_transplant_queue = editForm.is_in_transplant_queue
        
        return true // 表示需要刷新模板数据
      } else {
        ElMessage.error(res.data?.msg || '更新患者信息失败。')
        return false
      }
    } catch (error) {
      console.error('更新患者信息失败:', error)
      ElMessage.error('更新操作失败。')
      return false
    }
  }

  // 切换病例选择
  const toggleCaseSelection = (caseCode) => {
    const index = selectedCaseCodes.value.indexOf(caseCode)
    if (index > -1) {
      selectedCaseCodes.value.splice(index, 1)
    } else {
      selectedCaseCodes.value.push(caseCode)
    }
    console.log('当前选中的病例:', selectedCaseCodes.value)
  }

  // 初始化选中的病例（默认选中第一个）
  const initializeSelectedCases = () => {
    if (patient.value.allCases?.length && selectedCaseCodes.value.length === 0) {
      selectedCaseCodes.value = [patient.value.allCases[0].case_code]
    }
  }

  return {
    editDialogVisible,
    editForm,
    selectedCaseCodes,
    openEditDialog,
    saveEdit,
    toggleCaseSelection,
    initializeSelectedCases
  }
} 
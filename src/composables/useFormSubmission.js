import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { dataCreate } from '../api/data'

export function useFormSubmission() {
  const submitting = ref(false)

  // 格式化表单数据用于提交
  const formatFormDataForSubmission = (formData, selectedTemplate) => {
    const dataToSubmit = []
    
    for (const word_code in formData.values) {
      const value = formData.values[word_code]
      const item = selectedTemplate.dictionaryList.find(i => i.word_code === word_code)
      
      if (!item) continue // 安全起见，如果找不到词条定义则跳过

      let formattedValue

      if (item.input_type === 'single_with_other') {
        if (value && value.selected) {
          formattedValue = value.selected === '__other__' ? value.other : value.selected
        } else {
          formattedValue = ''
        }
      } else if (typeof value === 'object' && value !== null && value.hasOwnProperty('selected')) {
        // 处理多选、多选带时间、级联等复杂类型
        if (!value.selected || value.selected.length === 0) {
          formattedValue = ''
        } else if (item.input_type === 'multi' && !item.followup_options) {
          // 1. 如果是简单的多选（没有后续问题），则格式化为逗号分隔的字符串
          formattedValue = value.selected.join(',')
        } else {
          // 2. 如果是多选带时间或带后续问题，则格式化为JSON对象
          const submissionObject = {}
          value.selected.forEach(option => {
            const fu1 = item.followup_options && item.followup_options[option]

            if (item.input_type === 'multi_with_date' && value.times && value.times[option]) {
              submissionObject[option] = value.times[option]
            } else if (fu1) {
              const fu1_answer = value.followup[option]
              const fu2 = fu1.input_type === 'single' && fu1_answer && fu1.followup_options && fu1.followup_options[fu1_answer]
              
              if (fu2) {
                const fu2_key = `${option}_${fu1_answer}`
                const fu2_answer = value.followup[fu2_key]
                submissionObject[option] = { [fu1_answer]: fu2_answer }
              } else {
                submissionObject[option] = fu1_answer
              }
            } else {
              submissionObject[option] = true // 对于没有值的多选项，标记为true
            }
          })
          formattedValue = JSON.stringify(submissionObject)
        }
      } else {
        // 处理文本、单选等简单类型
        formattedValue = value
      }
      
      // 只提交有意义的数据
      if (formattedValue && formattedValue !== '{}' && formattedValue !== '[]' && formattedValue !== '') {
        dataToSubmit.push({
          word_code: word_code,
          value: formattedValue,
          check_time: formData.checkTime,
        })
      }
    }

    return dataToSubmit
  }

  // 提交表单
  const submitForm = async (formRef, formData, selectedTemplate, patientData, emit) => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        submitting.value = true
        try {
          const dataToSubmit = formatFormDataForSubmission(formData, selectedTemplate)

          if (dataToSubmit.length === 0) {
            ElMessage.warning('没有需要提交的数据。')
            submitting.value = false
            return
          }

          const payload = {
            case_code: patientData.caseId,
            template_code: selectedTemplate.code,
            data_list: dataToSubmit,
          }

          const res = await dataCreate(payload)
          if (res.data.code === 200 || res.data.code === 201) {
            ElMessage.success('数据录入成功！')
            emit('data-submitted', formData)
          } else {
            ElMessage.error(res.data.msg || '数据录入失败')
          }
        } catch (error) {
          console.error('Submit form error:', error)
          ElMessage.error('数据录入失败，请检查网络或联系管理员。')
        } finally {
          submitting.value = false
        }
      } else {
        ElMessage.error('请检查表单是否填写完整。')
      }
    })
  }

  return {
    submitting,
    formatFormDataForSubmission,
    submitForm
  }
} 
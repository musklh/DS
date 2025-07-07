import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ocrUpload } from '../api/ocr'
import { 
  matchOcrWithTemplate, 
  convertMatchesToFormData, 
  getMatchStatistics
} from '../utils/ocrMatcher'

export function useOcrRecognition(selectedTemplate) {
  // 图片上传相关
  const fileInput = ref(null)
  const uploadedImage = ref('')
  const hasCamera = ref(false)
  const ocrResults = ref([])
  const isProcessingOcr = ref(false)
  const matchResults = ref([])
  const matchStatistics = ref(null)

  // 检查是否有摄像头
  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      hasCamera.value = devices.some(device => device.kind === 'videoinput')
    } catch (error) {
      console.log('无法检测摄像头:', error)
      hasCamera.value = false
    }
  }

  // 触发文件上传
  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  // 处理文件上传
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      processImage(file)
    }
  }

  // 打开摄像头拍照
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // 这里可以打开一个拍照对话框，或者直接使用文件上传
      // 为了简化，我们直接触发文件上传
      triggerFileUpload()
    } catch (error) {
      ElMessage.error('无法访问摄像头')
      console.error('摄像头访问失败:', error)
    }
  }

  // 处理图片
  const processImage = (file) => {
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target.result
      // 开始OCR识别过程，传入文件和模板
      performOcrRecognition(file, selectedTemplate.value)
    }
    reader.readAsDataURL(file)
  }

  // 删除图片
  const removeImage = () => {
    uploadedImage.value = ''
    ocrResults.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  // OCR识别处理
  const performOcrRecognition = async (file, selectedTemplate) => {
    isProcessingOcr.value = true
    
    try {
      ElMessage.info('正在进行OCR识别...')
      
      // 调用真实OCR接口
      const response = await ocrUpload({ file })

      console.log("OCR原始响应:", response.data)

      if (response.data.code === 200) {
        // 解析msg字段，因为OCR服务返回的是JSON字符串
        let msgData
        try {
          msgData = typeof response.data.msg === 'string' ? JSON.parse(response.data.msg) : response.data.msg
        } catch (parseError) {
          console.error('解析OCR响应数据失败:', parseError)
          throw new Error('OCR响应数据格式错误')
        }
        
        const testResults = msgData.test_results
        
        if (!testResults || !Array.isArray(testResults)) {
          throw new Error('OCR识别结果格式错误')
        }
        
        console.log("解析后的OCR数据:", msgData)
        console.log("检测结果数组:", testResults)
        
        // 检查是否有选择的模板
        if (!selectedTemplate || !selectedTemplate.dictionaryList) {
          ElMessage.warning('请先选择模板')
          return null
        }
        
        // 将模板字段转换为匹配器需要的格式
        const templateFields = selectedTemplate.dictionaryList.map(item => ({
          word_code: item.word_code,
          word_name: item.word_name,
          word_short: item.word_short
        }))
        
        // 进行智能匹配
        const matches = matchOcrWithTemplate(templateFields, testResults, 0.6)
        matchResults.value = matches
        
        // 获取匹配统计信息
        const stats = getMatchStatistics(templateFields, matches)
        matchStatistics.value = stats
        
        // 将匹配结果转换为表单数据格式
        const matchedFormData = convertMatchesToFormData(matches)
        
        // 显示匹配结果
        ocrResults.value = matches.map(match => ({
          field: match.word_name,
          value: match.result,
          word_code: match.word_code,
          confidence: match.confidence,
          ocr_item: match.ocr_item
        }))
        
        ElMessage.success(`OCR识别完成！成功匹配 ${stats.matchedFields}/${stats.totalFields} 个字段`)
        
        console.log('匹配统计:', stats)
        console.log('匹配结果:', matches)

        return matchedFormData
      } else {
        throw new Error('OCR识别失败')
      }
    } catch (error) {
      console.error('OCR识别错误:', error)
      ElMessage.error('OCR识别失败，请重试')
      return null
    } finally {
      isProcessingOcr.value = false
    }
  }

  // 检查是否可以应用OCR结果
  const canApplyOcrResult = (result, selectedTemplate) => {
    return selectedTemplate?.dictionaryList?.some(item => 
      item.word_code === result.word_code
    )
  }

  // 应用OCR结果到表单
  const applyOcrResult = (result, formData, selectedTemplate) => {
    if (canApplyOcrResult(result, selectedTemplate)) {
      formData.values[result.word_code] = result.value
      ElMessage.success(`已应用 ${result.field} 的值: ${result.value}`)
    } else {
      ElMessage.warning(`无法应用 ${result.field}，字段不匹配`)
    }
  }

  // 批量应用所有OCR结果
  const applyAllOcrResults = (formData, selectedTemplate) => {
    let appliedCount = 0
    ocrResults.value.forEach(result => {
      if (canApplyOcrResult(result, selectedTemplate)) {
        formData.values[result.word_code] = result.value
        appliedCount++
      }
    })
    
    if (appliedCount > 0) {
      ElMessage.success(`已批量应用 ${appliedCount} 个字段的值`)
    } else {
      ElMessage.warning('没有可应用的字段')
    }
  }

  // 获取置信度样式类
  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.9) return 'confidence-high'
    if (confidence >= 0.7) return 'confidence-medium'
    return 'confidence-low'
  }

  // 清空OCR相关状态
  const clearOcrState = () => {
    uploadedImage.value = ''
    ocrResults.value = []
    matchResults.value = []
    matchStatistics.value = null
  }

  return {
    // 响应式数据
    fileInput,
    uploadedImage,
    hasCamera,
    ocrResults,
    isProcessingOcr,
    matchResults,
    matchStatistics,
    
    // 方法
    checkCamera,
    triggerFileUpload,
    handleFileUpload,
    openCamera,
    processImage,
    removeImage,
    performOcrRecognition,
    canApplyOcrResult,
    applyOcrResult,
    applyAllOcrResults,
    getConfidenceClass,
    clearOcrState
  }
} 
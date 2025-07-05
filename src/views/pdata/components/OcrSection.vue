<template>
  <div class="right-ocr-section">
    <div class="ocr-placeholder" @click="handleTriggerUpload">
      <div v-if="!uploadedImage" class="ocr-icon-box">
        <img src="../../../assets/s.png" alt="" />
        <div class="upload-hint">点击上传图片或拍照</div>
      </div>
      <div v-else class="image-preview">
        <img :src="uploadedImage" alt="上传的图片" />
        <div class="image-overlay">
          <el-button type="primary" size="small" @click.stop="handleTriggerUpload">重新上传</el-button>
          <el-button type="danger" size="small" @click.stop="emit('remove-image')">删除</el-button>
        </div>
      </div>
    </div>
    
    <!-- 隐藏的文件上传输入框 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="emit('handle-upload', $event)"
    />
    
    <!-- 拍照按钮 -->
    <div class="camera-section">
      <el-button type="primary" @click="emit('open-camera')" :disabled="!hasCamera">
        <el-icon><Camera /></el-icon>
        拍照
      </el-button>
      <el-button @click="handleTriggerUpload">
        <el-icon><Upload /></el-icon>
        上传图片
      </el-button>
    </div>
    
    <div class="ocr-hint">
      <el-icon><InfoFilled /></el-icon>
      <span>拍照或者上传图片后OCR会自动识别字段。</span>
    </div>
    
    <!-- OCR识别结果展示 -->
    <div v-if="ocrResults.length > 0" class="ocr-results">
      <div class="ocr-results-header">
        <h4>OCR识别结果：</h4>
        <div class="ocr-stats" v-if="matchStatistics">
          <span class="match-rate">匹配率: {{ Math.round(matchStatistics.matchRate * 100) }}%</span>
          <span class="match-count">({{ matchStatistics.matchedFields }}/{{ matchStatistics.totalFields }})</span>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          @click="emit('apply-all')"
          :disabled="ocrResults.length === 0"
        >
          批量应用
        </el-button>
      </div>
      <div class="ocr-result-list">
        <div v-for="result in ocrResults" :key="result.field" class="ocr-result-item">
          <div class="result-info">
            <span class="field-name">{{ result.field }}:</span>
            <span class="field-value">{{ result.value }}</span>
            <span class="confidence-badge" :class="getConfidenceClass(result.confidence)">
              {{ Math.round(result.confidence * 100) }}%
            </span>
          </div>
          <div class="result-actions">
            <span v-if="result.ocr_item !== result.field" class="ocr-source">
              来源: {{ result.ocr_item }}
            </span>
            <el-button 
              type="primary" 
              size="small" 
              @click="emit('apply-result', result)"
              :disabled="!canApplyResult(result)"
            >
              应用
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { Camera, Upload, InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  fileInput: Object,
  uploadedImage: String,
  hasCamera: Boolean,
  ocrResults: Array,
  isProcessing: Boolean,
  matchStatistics: Object,
  getConfidenceClass: Function,
  canApplyResult: Function
})

const emit = defineEmits([
  'trigger-upload',
  'handle-upload', 
  'open-camera',
  'remove-image',
  'apply-result',
  'apply-all'
])

const fileInputRef = ref(null)

// 将内部的 fileInputRef 赋值给父组件传入的 fileInput
onMounted(() => {
  if (props.fileInput) {
    props.fileInput.value = fileInputRef.value
  }
})

// 重写 trigger-upload 事件处理
const handleTriggerUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  } else {
    emit('trigger-upload')
  }
}
</script>

<style scoped>
.right-ocr-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ocr-placeholder {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  width: 100%;
  max-width: 450px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #c0c4cc;
  font-size: 24px;
  text-align: center;
  background-color: #fafafa;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ocr-placeholder:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.upload-hint {
  margin-top: 10px;
  font-size: 14px;
  color: #909399;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.camera-section {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.camera-section .el-button {
  min-width: 100px;
}

.ocr-hint {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.ocr-hint .el-icon {
  margin-right: 5px;
}

.ocr-results {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  max-width: 100%;
}

.ocr-results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.ocr-results-header h4 {
  margin: 0;
  color: #495057;
  font-size: 14px;
}

.ocr-stats {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6c757d;
}

.match-rate {
  font-weight: 500;
  color: #28a745;
}

.match-count {
  color: #6c757d;
}

.ocr-result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.ocr-result-item {
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.field-name {
  font-weight: 500;
  color: #495057;
  min-width: 80px;
  font-size: 13px;
}

.field-value {
  flex: 1;
  color: #6c757d;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 13px;
  min-width: 60px;
}

.confidence-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  min-width: 35px;
  text-align: center;
}

.confidence-high {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.confidence-medium {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.confidence-low {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.result-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ocr-source {
  font-size: 11px;
  color: #868e96;
  font-style: italic;
  flex: 1;
}

.ocr-result-item .el-button {
  min-width: 60px;
  height: 28px;
  font-size: 12px;
}
</style> 
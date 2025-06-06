<template>
    <div class="blood-routine-entry-container">
      <div class="patient-case-header">
        <span class="patient-name">{{ patientData.name }}</span>
        <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
        <span class="patient-id-card">{{ patientData.idCard }}</span>
        <el-divider direction="vertical"></el-divider>
        <span class="case-id">病例: {{ patientData.caseId }}</span>
        <el-icon class="refresh-icon"><Refresh /></el-icon>
      </div>
  
      <el-card class="content-card">
        <template #header>
          <div class="card-header-content">
            <span class="in-progress-text">正在录入:</span>
            <span class="template-name">{{ selectedTemplate }}</span>
            <el-icon class="refresh-icon"><Refresh /></el-icon>
            <el-button
              class="back-to-template-btn"
              size="small"
              @click="emit('go-back-to-template')"
            >
              返回模板选择
            </el-button>
          </div>
        </template>
  
        <div class="entry-form-layout">
          <div class="left-form-section">
            <el-form :model="bloodRoutineForm" label-width="90px" label-position="left">
              <el-form-item label="检查时间">
                <el-date-picker
                  v-model="bloodRoutineForm.checkTime"
                  type="datetime"
                  placeholder="请选择"
                  value-format="YYYY-MM-DD HH:mm"
                  style="width: 100%;"
                />
              </el-form-item>
              <el-form-item label="临床信息">
                <el-select v-model="bloodRoutineForm.clinicalInfo" placeholder="请选择" style="width: 100%;">
                  <el-option label="感染" value="infection"></el-option>
                  <el-option label="炎症" value="inflammation"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </el-form-item>
  
              <el-form-item label="白细胞计数">
                <el-input v-model="bloodRoutineForm.wbcCount" placeholder="请输入"></el-input>
                <span class="unit-label">WBC</span>
              </el-form-item>
              <el-form-item label="中性粒细胞计数">
                <el-input v-model="bloodRoutineForm.neutrophilCount" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="中性粒细胞比值">
                <el-input v-model="bloodRoutineForm.neutrophilRatio" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="淋巴细胞计数">
                <el-input v-model="bloodRoutineForm.lymphocyteCount" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="淋巴细胞比值">
                <el-input v-model="bloodRoutineForm.lymphocyteRatio" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="单核细胞计数">
                <el-input v-model="bloodRoutineForm.monocyteCount" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="单核细胞比值">
                <el-input v-model="bloodRoutineForm.monocyteRatio" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="红细胞计数">
                <el-input v-model="bloodRoutineForm.rbcCount" placeholder="请输入"></el-input>
                <span class="unit-label">RBC</span>
              </el-form-item>
              <el-form-item label="血红蛋白">
                <el-input v-model="bloodRoutineForm.hemoglobin" placeholder="请输入"></el-input>
                <span class="unit-label">HGB</span>
              </el-form-item>
              <el-form-item label="血小板计数">
                <el-input v-model="bloodRoutineForm.plateletCount" placeholder="请输入"></el-input>
                <span class="unit-label">PLT</span>
              </el-form-item>
              <el-form-item label="网织红细胞计数">
                <el-input v-model="bloodRoutineForm.reticulocyteCount" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="网织红细胞比值">
                <el-input v-model="bloodRoutineForm.reticulocyteRatio" placeholder="请输入"></el-input>
              </el-form-item>
            </el-form>
          </div>
  
          <div class="right-ocr-section">
            <div class="ocr-placeholder">
              <div class="ocr-icon-box">
                <img src="../../assets/s.png" alt="">
              </div>
            </div>
            <div class="ocr-hint">
              <el-icon><InfoFilled /></el-icon>
              <span>拍照或者上传图片后OCR会自动识别字段。</span>
            </div>
          </div>
        </div>
  
        <div class="form-actions">
          <el-button type="primary" @click="submitForm">录入</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import {
    ElDivider,
    ElIcon,
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElButton,
    ElMessage,
  } from 'element-plus';
  import { Refresh, InfoFilled } from '@element-plus/icons-vue';
  
  const props = defineProps({
    patientData: Object, // Patient and case data from parent
    selectedTemplate: String, // Selected template name from parent
  });
  
  const emit = defineEmits(['data-submitted', 'go-back-to-template']);
  
  // Form data (pre-filled with a date as per image)
  const bloodRoutineForm = reactive({
    checkTime: '2024-05-31 13:20', // Using current date for realistic example
    clinicalInfo: '',
    wbcCount: '',
    neutrophilCount: '',
    neutrophilRatio: '',
    lymphocyteCount: '',
    lymphocyteRatio: '',
    monocyteCount: '',
    monocyteRatio: '',
    rbcCount: '',
    hemoglobin: '',
    plateletCount: '',
    reticulocyteCount: '',
    reticulocyteRatio: '',
  });
  
  const submitForm = () => {
    ElMessage.success('表单已提交 (示意)');
    console.log('Form data:', bloodRoutineForm);
    emit('data-submitted', { ...bloodRoutineForm, patientData: props.patientData, template: props.selectedTemplate });
    // In a real application, you'd send bloodRoutineForm data to your backend
  };
  
  const resetForm = () => {
    ElMessage.info('表单已重置 (示意)');
    // Reset reactive form data
    Object.assign(bloodRoutineForm, {
      checkTime: '2024-05-31 13:20', // Reset to default or current date
      clinicalInfo: '',
      wbcCount: '',
      neutrophilCount: '',
      neutrophilRatio: '',
      lymphocyteCount: '',
      lymphocyteRatio: '',
      monocyteCount: '',
      monocyteRatio: '',
      rbcCount: '',
      hemoglobin: '',
      plateletCount: '',
      reticulocyteCount: '',
      reticulocyteRatio: '',
    });
  };
  </script>
  
  <style scoped>
  .blood-routine-entry-container {
    padding: 0; /* Remove padding here, handled by parent workflow container */
    background-color: #f5f7fa;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .patient-case-header {
    background-color: #fff;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #303133;
  }
  
  .patient-case-header span {
    margin-right: 15px;
  }
  
  .patient-case-header .patient-name {
    font-weight: bold;
  }
  
  .refresh-icon {
    margin-left: 5px;
    cursor: pointer;
    color: #409eff;
  }
  
  .content-card {
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-grow: 1; /* Allow card to fill space */
    display: flex;
    flex-direction: column;
  }
  
  .content-card :deep(.el-card__header) {
    padding: 15px 20px; /* Adjust header padding to match image */
    display: flex;
    align-items: center;
    justify-content: space-between; /* To push the button to the right */
  }
  
  .content-card .card-header-content {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 18px;
    color: #303133;
    flex-grow: 1; /* Allow content to take space */
  }
  
  .content-card .in-progress-text {
    color: #909399; /* Greyed out text */
    margin-right: 8px;
    font-size: 16px;
  }
  
  .content-card .template-name {
    margin-right: 15px;
  }
  
  .content-card .card-header-content .refresh-icon {
    margin-left: 0; /* Adjust margin for icon within header */
    margin-right: 10px;
  }
  
  .back-to-template-btn {
    margin-left: auto; /* Push button to the far right */
  }
  
  .entry-form-layout {
    display: flex;
    gap: 30px; /* Space between form and OCR section */
    padding: 20px; /* Add padding to the layout */
    flex-grow: 1; /* Allow layout to fill space */
  }
  
  .left-form-section {
    flex: 0 0 450px; /* Fixed width for the form section as per image */
    max-width: 450px;
  }
  
  .left-form-section .el-form-item {
    margin-bottom: 18px; /* Adjust spacing between form items */
    position: relative; /* For unit label positioning */
  }
  
  .unit-label {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #909399;
    font-size: 14px;
    margin-right: 10px; /* Space from input field */
  }
  
  .right-ocr-section {
    flex: 1; /* Takes remaining space */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .ocr-placeholder {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    width: 100%;
    max-width: 450px; /* Max width to control its size */
    height: 300px; /* Fixed height for the placeholder */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #c0c4cc;
    font-size: 24px;
    text-align: center;
    background-color: #fafafa;
    margin-bottom: 20px;
  }
  
  .ocr-icon-box .el-icon {
    font-size: 50px; /* Larger icon */
    margin-bottom: 5px;
  }
  
  .ocr-icon-box span {
    font-size: 20px;
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
  
  .form-actions {
    margin-top: auto; /* Push buttons to the bottom of the card */
    padding: 20px; /* Add padding around buttons */
    text-align: center;
    border-top: 1px solid #ebeef5; /* Separator line */
  }
  
  .form-actions .el-button {
    width: 100px; /* Fixed width for buttons */
    margin: 0 10px;
  }
  </style>
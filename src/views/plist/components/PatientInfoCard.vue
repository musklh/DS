<template>
  <el-card class="mb-4">
    <div class="patient-info-grid">
      <p><strong>当前患者: </strong>{{ patient.identity_name }}</p>
      <p><strong>性别: </strong>{{ patient.gender === 1 ? '男' : '女' }}</p>
      <p><strong>年龄: </strong>{{ patient.age }}</p>
      <p><strong>身份证号: </strong>{{ patient.idCard }}</p>
      <div class="case-selector">
        <strong>病例号: </strong>
        <div class="case-buttons">
          <el-button
            v-for="(caseItem, index) in patient.allCases"
            :key="caseItem.case_code"
            :type="selectedCaseCodes.includes(caseItem.case_code) ? 'primary' : 'default'"
            size="small"
            @click="$emit('toggle-case', caseItem.case_code)"
          >
            {{ caseItem.case_code }}
          </el-button>
        </div>
      </div>
    </div>
    <el-divider />
    <div class="patient-contact-info-grid">
      <p><strong>联系电话: </strong>{{ patient.phone_number }}</p>
      <p><strong>家庭住址: </strong>{{ patient.home_address }}</p>
    </div>
    <div class="patient-medical-info-grid">
      <p><strong>血型: </strong>{{ patient.blood_type }}</p>
      <p><strong>RH: </strong>{{ patient.rh || "阴性" }}</p>
      <p><strong>是否做过移植手术: </strong>{{ patient.has_transplant_surgery }}</p>
      <p><strong>是否在移植排队: </strong>{{ patient.is_in_transplant_queue }}</p>
    </div>
    <p><strong>主要诊断: </strong>{{ patient.main_diagnosis }}</p>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElCard, ElButton, ElDivider } from 'element-plus'

defineProps({
  patient: {
    type: Object,
    required: true
  },
  selectedCaseCodes: {
    type: Array,
    required: true
  }
})

defineEmits(['toggle-case'])
</script>

<style scoped>
.mb-4 {
  margin-bottom: 32px;
}

/* 默认3列 */
.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  font-size: 20px;
}

/* 默认4列 */
.patient-medical-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 16px;
  font-size: 18px;
}

/* 默认2列 */
.patient-contact-info-grid {
  display: grid;
  grid-template-columns: 1.5fr 3fr;
  gap: 20px;
  margin-top: 16px;
  font-size: 18px;
}

/* 平板及以下：2列 */
@media (max-width: 900px) {
  .patient-info-grid {
    grid-template-columns: repeat(2, 1fr);
    font-size: 18px;
  }
  .patient-medical-info-grid {
    grid-template-columns: repeat(2, 1fr);
    font-size: 16px;
  }
}

/* 手机：1列 */
@media (max-width: 600px) {
  .patient-info-grid,
  .patient-medical-info-grid,
  .patient-contact-info-grid {
    grid-template-columns: 1fr;
    font-size: 15px;
    gap: 10px;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
}

.patient-info-grid p,
.patient-contact-info-grid p,
.patient-medical-info-grid p {
  margin: 0;
  padding: 0;
}

.el-divider {
  margin-top: 16px;
  margin-bottom: 16px;
}

/* 病例选择器样式 */
.case-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.case-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.case-buttons .el-button {
  margin: 0;
  min-width: 80px;
}

/* 响应式调整 */
@media (max-width: 900px) {
  .case-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .case-buttons {
    gap: 6px;
  }
  
  .case-buttons .el-button {
    min-width: 70px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .case-buttons .el-button {
    min-width: 60px;
    font-size: 11px;
    padding: 4px 8px;
  }
}

.el-card.mb-4 {
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  transition: box-shadow 0.3s;
  border: none;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
  position: relative;
}

.el-card.mb-4:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.16);
}

.el-card.mb-4::before {
  content: '';
  display: block;
  height: 5px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 14px 14px 0 0;
}

:deep(.el-card__body) {
  padding: 28px 24px 20px 24px;
  font-size: 16px;
  color: #333;
  line-height: 1.7;
}
</style> 
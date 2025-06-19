<template>
  <div class="blood-routine-entry-container">
    <div class="patient-case-header">
      <span class="patient-name">{{ patientData.name }}</span>
      <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
      <span class="patient-id-card">{{ patientData.identity_id }}</span>
      <el-divider direction="vertical" />
      <span class="case-id">病例: {{ patientData.caseId }}</span>
      <el-icon class="refresh-icon">
        <Refresh />
      </el-icon>
    </div>

    <el-card class="content-card">
      <template #header>
        <div class="card-header-content">
          <span class="in-progress-text">正在录入:</span>
          <span class="template-name">{{ selectedTemplate.name }}</span>
          <el-icon class="refresh-icon">
            <Refresh />
          </el-icon>
          <el-button class="back-to-template-btn" size="small" @click="emit('go-back-to-template')">
            返回模板选择
          </el-button>
        </div>
      </template>

      <div class="entry-form-layout">
        <div class="left-form-section">
          <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px" label-position="left">
            <el-form-item label="检查时间" prop="checkTime">
              <el-date-picker
                v-model="formData.checkTime"
                type="datetime"
                placeholder="请选择"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>

            <template v-for="item in selectedTemplate.dictionaryList" :key="item.word_code">
              <el-form-item :label="item.word_name" :prop="`values.${item.word_code}`">
                <el-input v-model="formData.values[item.word_code]" placeholder="请输入" />
                <span v-if="item.word_short" class="unit-label">{{ item.word_short }}</span>
              </el-form-item>
            </template>
          </el-form>
        </div>

        <div class="right-ocr-section">
          <div class="ocr-placeholder">
            <div class="ocr-icon-box">
              <img src="../../assets/s.png" alt="" />
            </div>
          </div>
          <div class="ocr-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>拍照或者上传图片后OCR会自动识别字段。</span>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm" :loading="submitting"> 录入 </el-button>
        <el-button @click="resetForm"> 重置 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import {
  ElDivider,
  ElIcon,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElButton,
  ElMessage,
} from 'element-plus';
import { Refresh, InfoFilled } from '@element-plus/icons-vue';
import { dataCreate } from '../../api/data';

const props = defineProps({
  patientData: Object,
  selectedTemplate: Object,
});

const emit = defineEmits(['data-submitted', 'go-back-to-template']);

// 表单引用
const formRef = ref(null);
const submitting = ref(false);

// 表单数据
const formData = reactive({
  checkTime: '',
  values: {},
});

// 动态生成表单校验规则
const formRules = computed(() => {
  const rules = {
    checkTime: [
      { required: true, message: '请选择检查时间', trigger: 'change' }
    ]
  };
  //这里少一个词条单位，目前用的是英文缩写代替。。。。。。
  console.log(props.selectedTemplate.dictionaryList)
  // 为每个模板字段添加必填校验
  if (props.selectedTemplate?.dictionaryList) {
    props.selectedTemplate.dictionaryList.forEach(item => {
      rules[`values.${item.word_code}`] = [
        { required: true, message: `请输入${item.word_name}`, trigger: 'blur' }
      ];
    });
  }

  return rules;
});

// 提交表单
const submitForm = async () => {
  try {
    // 表单校验
    const valid = await formRef.value.validate();
    if (!valid) {
      ElMessage.warning('请完善所有必填字段');
      return;
    }

    submitting.value = true;

    // 确保 checkTime 是完整格式（加上秒）
    let checkTime = formData.checkTime;
      checkTime += ':00'; // 自动补全秒


    // 构建批量录入数据
    const dataList = props.selectedTemplate.dictionaryList.map(item => ({
      word_code: item.word_code,
      check_time: checkTime,
      value: formData.values[item.word_code] || ''
    }));

    const submitData = {
      case_code: props.patientData.caseId,
      template_code: props.selectedTemplate.code,
      data_list: dataList
    };

    console.log('提交的数据:', submitData);

    // 调用 API
    const response = await dataCreate(submitData);
    console.log('API响应:', response);

    // 判断响应是否成功
    if (response?.data?.code === 200) {
      ElMessage.success('数据录入成功，即将跳转到患者列表');
      emit('data-submitted', submitData);
    } else {
      ElMessage.error(`数据提交失败: ${response?.data?.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('数据提交异常:', error);
    if (error.message && error.message.includes('validation')) {
      ElMessage.warning('请完善所有必填字段');
    } else {
      ElMessage.error('数据提交异常');
    }
  } finally {
    submitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formData.checkTime = '';
  formData.values = {};
  // 清除表单校验状态
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  ElMessage.info('表单已重置');
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

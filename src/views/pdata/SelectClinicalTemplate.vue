<template>
  <div class="select-template-container">
    <div class="patient-case-header">
      <span class="patient-name">{{ patientData.name }}</span>
      <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age}}岁</span>
      <span class="patient-id-card">{{ patientData.identity_id }}</span>
      <el-divider direction="vertical" />
      <span class="case-id">病例: {{ patientData.caseId }}</span>
      <el-icon class="refresh-icon" @click="fetchTemplates">
        <Refresh />
      </el-icon>
    </div>

    <el-card class="template-selection-card" shadow="never">
      <template #header>
        <div class="card-header-content">
          <el-icon><Tickets /></el-icon>
          <span>选择临床模板</span>
          <el-button class="back-to-patient-btn" size="small" @click="emit('go-back-to-case')">
            返回患者选择
          </el-button>
        </div>
      </template>
      <div class="info-message">
        <el-alert type="info" :closable="false" show-icon> 请选择录入的临床模板 </el-alert>
      </div>
      <div class="template-content">
        <el-table :data="templates" style="width: 100%" @row-click="handleTemplateSelect" border>
          <el-table-column prop="template_code" label="模板编号" width="120" />
          <el-table-column prop="template_name" label="模板名称" />
          <el-table-column prop="template_description" label="模板描述" show-overflow-tooltip />
          <el-table-column prop="category_name" label="分类" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click.stop="handleTemplateSelect(row, $index)">
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  ElDivider,
  ElIcon,
  ElCard,
  ElAlert,
  ElButton,
  ElTable,
  ElTableColumn,
  ElMessage,
} from 'element-plus';
import { Refresh, Tickets } from '@element-plus/icons-vue';

import { dataTemplateList } from '../../api/dataTemplate';

const props = defineProps({
  patientData: Object,
});

const emit = defineEmits(['template-selected', 'go-back-to-patient']);

const templates = ref([]);

// 获取模板列表
const fetchTemplates = async () => {
  try {
    // 先检查本地缓存
    const cachedTemplates = localStorage.getItem('clinicalTemplates');
    if (cachedTemplates) {
      const parsedTemplates = JSON.parse(cachedTemplates);
      const cacheTime = parsedTemplates.timestamp;
      const now = Date.now();
      // 如果缓存时间在1小时内，直接使用缓存
      if (now - cacheTime < 60 * 60 * 1000) {
        templates.value = parsedTemplates.data;
        console.log('使用缓存的模板列表');
        return;
      }
    }

    const res = await dataTemplateList({
      page: 1,
      page_size: 100
    });
    console.log('获取到的模板列表:', res);
    if (res?.data?.code === 200) {
      templates.value = res.data.data.list;

      // 缓存到本地存储
      const cacheData = {
        data: res.data.data.list,
        timestamp: Date.now()
      };
      localStorage.setItem('clinicalTemplates', JSON.stringify(cacheData));
    }
  } catch (error) {
    console.error('获取模板列表失败:', error);
    ElMessage.error('获取模板列表失败');
  }
};

// 选择模板
const handleTemplateSelect = (template, index) => {
  console.log('选择的模板:', template);
  const templateIndex = index !== undefined ? index : templates.value.indexOf(template);
  emit('template-selected', {
    templateId: template.id,
    templateCode: template.template_code,
    templateName: template.template_name,
    dictionaryList: template.dictionary_list,
    templatesList: templates.value, // 传递整个模板列表
    currentIndex: templateIndex // 传递当前选择的模板索引
  });
};

onMounted(() => {
  fetchTemplates();
});
</script>

<style scoped>
.select-template-container {
  padding: 0;
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

.template-selection-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex-grow: 1;
}

.template-selection-card :deep(.el-card__header) {
  padding: 15px 20px;
}

.template-selection-card .card-header-content {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  width: 100%;
}

.template-selection-card .card-header-content .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.template-selection-card .info-message {
  margin-bottom: 20px;
  padding: 0 20px;
}

.template-content {
  padding: 20px;
}

.back-to-patient-btn {
  margin-left: auto;
}
</style>

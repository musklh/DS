<template>
  <div class="patient-detail">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button icon="Back" @click="goBack">返回列表</el-button>
      <div class="right-toolbar">
        <el-button icon="Edit" type="primary" @click="openEditDialog">编辑信息</el-button>
        <el-button icon="DataAnalysis" type="success" @click="handleVisualization">数据可视化</el-button>
        <div class="view-switch">
          <el-button
            :type="viewMode === 'table' ? 'danger' : 'default'"
            square
            @click="viewMode = 'table'"
            class="square-btn"
          >
            <img src="@/assets/table.png" alt="表格视图" class="icon-img" />
          </el-button>
          <el-button
            :type="viewMode === 'timeline' ? 'danger' : 'default'"
            square
            @click="viewMode = 'timeline'"
            class="square-btn"
          >
            <img src="@/assets/time.png" alt="时间轴视图" class="icon-img" />
          </el-button>
        </div>
      </div>
    </div>

    <!-- 患者信息卡片 -->
    <PatientInfoCard
      :patient="patient"
      :selected-case-codes="selectedCaseCodes"
      @toggle-case="toggleCaseSelection"
    />

    <!-- 模板数据视图 -->
    <TemplateTableView
      v-if="viewMode === 'table'"
      :left-sections="leftSections"
      :right-sections="rightSections"
      @open-template-detail="openTemplateDetailDialog"
      @delete-template="handleDeleteTemplate"
    />

    <TemplateTimelineView
      v-else
      :timeline-data="timelineData"
      @open-template-detail="openTemplateDetailDialog"
      @delete-template="handleDeleteTemplate"
    />

    <!-- 患者编辑对话框 -->
    <PatientEditDialog
      v-model="editDialogVisible"
      :edit-form="editForm"
      @save="handleSaveEdit"
    />

    <!-- 模板详情对话框 -->
    <TemplateDetailDialog
      v-model="templateDetailDialogVisible"
      :current-template-detail="currentTemplateDetail"
      :format-display-value="formatDisplayValue"
      :get-options="getOptions"
      :has-followup-for-option="hasFollowupForOption"
      :get-followup-type="getFollowupType"
      :get-followup-options="getFollowupOptions"
      :get-followup-label="getFollowupLabel"
      @start-edit="startEdit"
      @cancel-edit="cancelEdit"
      @save-item="handleSaveItem"
      @delete-item="handleDeleteItem"
    />
  </div>
</template>

<script setup>
import { ref, toRef, onMounted } from 'vue'
import { ElButton } from 'element-plus'

// 组合式函数
import { usePatientData } from '../../composables/usePatientData'
import { useTemplateData } from '../../composables/useTemplateData'
import { useTemplateDetail } from '../../composables/useTemplateDetail'
import { useTemplateActions } from '../../composables/useTemplateActions'

// 子组件
import PatientInfoCard from './components/PatientInfoCard.vue'
import PatientEditDialog from './components/PatientEditDialog.vue'
import TemplateTableView from './components/TemplateTableView.vue'
import TemplateTimelineView from './components/TemplateTimelineView.vue'
import TemplateDetailDialog from './components/TemplateDetailDialog.vue'

// Props
const props = defineProps({
  patient: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['back'])

// 响应式引用
const patient = toRef(props, 'patient')
const viewMode = ref('timeline') // 'table' or 'timeline'

// 使用组合式函数
const {
  editDialogVisible,
  editForm,
  selectedCaseCodes,
  openEditDialog,
  saveEdit,
  toggleCaseSelection,
  initializeSelectedCases
} = usePatientData(patient)

const {
  leftSections,
  rightSections,
  timelineData,
  fetchTemplateData
} = useTemplateData(patient, selectedCaseCodes)

const {
  templateDetailDialogVisible,
  currentTemplateDetail,
  fetchDictionary,
  openTemplateDetailDialog,
  startEdit,
  cancelEdit,
  saveItem,
  deleteItem,
  getOptions,
  hasFollowupForOption,
  getFollowupType,
  getFollowupOptions,
  getFollowupLabel,
  formatDisplayValue
} = useTemplateDetail()

const {
  deleteTemplate,
  goToVisualization
} = useTemplateActions()

// 事件处理函数
const goBack = () => {
  emit('back')
}

const handleSaveEdit = async () => {
  const needsRefresh = await saveEdit()
  if (needsRefresh) {
    await fetchTemplateData()
  }
}

const handleDeleteTemplate = async (templateName, items) => {
  await deleteTemplate(templateName, items, fetchTemplateData)
}

const handleVisualization = async () => {
  await goToVisualization(patient.value, selectedCaseCodes.value)
}

const handleSaveItem = async (row) => {
  const needsRefresh = await saveItem(row)
  if (needsRefresh) {
    await fetchTemplateData()
  }
}

const handleDeleteItem = async (row) => {
  const needsRefresh = await deleteItem(row)
  if (needsRefresh) {
    await fetchTemplateData()
  }
}

// 组件挂载时的初始化
onMounted(async () => {
  initializeSelectedCases()
  await Promise.all([
    fetchTemplateData(),
    fetchDictionary()
  ])
})
</script>

<style scoped>
.patient-detail {
  padding: 32px;
  width: 100vw;
  max-width: 100vw;
  min-width: 0;
  margin: 0;
  box-sizing: border-box;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.right-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-switch {
  display: flex;
  gap: 12px;
}

.square-btn {
  width: 35px;
  height: 35px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 25px;
  height: 25px;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .patient-detail {
    padding: 8px;
  }
}
</style> 
<template>
  <div class="template-container">
    <!-- 头部区域：包含按钮和搜索框 -->
    <TemplateHeader
      v-model:search-keyword="searchKeyword"
      @add-template="handleAddCustomTemplate"
      @show-all="handleShowAll"
    />

    <!-- 编辑表单区域 -->
    <div v-if="showEditForm" class="edit-form-section">
      <TemplateEditDialog
        :dialog-title="dialogTitle"
        :form-data="formData"
        :rules="rules"
        @submit-form="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <!-- 模板列表区域 -->
    <div v-else class="template-content">
      <el-collapse v-model="activeNames">
        <!-- 基础临床模板 -->
        <TemplateCollapseSection
          section-title="基础临床模板"
          section-name="1"
          :table-data="filteredBasicTemplates"
        />

        <!-- 临床检验模版 -->
        <TemplateCollapseSection
          section-title="临床检验模版"
          section-name="2"
          :table-data="filteredLabTemplates"
        />

        <!-- 评分模版 -->
        <TemplateCollapseSection
          section-title="评分模版"
          section-name="3"
          :table-data="filteredScoreTemplates"
        />

        <!-- 临床随访模版 -->
        <TemplateCollapseSection
          section-title="临床随访模版"
          section-name="4"
          :table-data="filteredFollowUpTemplates"
        />

        <!-- 辅助检查模版 -->
        <TemplateCollapseSection
          section-title="辅助检查模版"
          section-name="6"
          :table-data="filteredAuxiliaryTemplates"
        />

        <!-- 自定义临床模版 (显示操作按钮) -->
        <TemplateCollapseSection
          section-title="自定义临床模版"
          section-name="5"
          :table-data="filteredCustomTemplates"
          :show-actions="true"
          @edit-template="handleEdit"
          @delete-template="handleDelete"
        />
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

// 导入拆分后的组件
import TemplateHeader from './TemplateHeader.vue';
import TemplateCollapseSection from './TemplateCollapseSection.vue';
import TemplateEditDialog from './TemplateEditDialog.vue';

import {
    dataTemplateList,
    dataTemplateCreate,
    dataTemplateUpdate,
    dataTemplateDelete,
} from '../../api/dataTemplate';


// 定义 TemplateItem 接口，用于模板数据类型
// 与 TemplateEditDialog.vue 中的 TemplateItem 保持一致，并与后端 API.DataTemplate 类型对齐
interface TemplateItem {
  template_name: string;
  template_code: string; // 模版编号，可以是可选的，但为了和编辑、删除的 API 保持一致，这里先定义为 string
  template_description: string;
  category: number; // 0 for basic, 1 for custom, etc.
  dictionaries: number[];
  type: string; // Frontend type for dropdown (e.g., 'basic', 'custom')
}

// 搜索关键字
const searchKeyword = ref('');
// 展开的折叠面板名称，默认全部展开
const activeNames = ref<string[]>(['1', '2', '3', '4', '5', '6']); // 初始时默认展开所有面板

// 模拟的模板数据 (这些数据通常从后端获取，现在我们将尝试从 API 获取自定义模板)
// 为了与新的 TemplateItem 接口兼容，这里将 'type' 改为 'category'
const basicTemplates = ref<TemplateItem[]>([
  { template_name: '一般情况', template_code: 'PRS98754612', template_description: '记录疾病一般情况，包括年龄、性别、体重、身高、血型等信息', category: 0, dictionaries: [], type: 'basic' },
]);

const labTemplates = ref<TemplateItem[]>([
  { template_name: '血常规', template_code: 'BL598495468', template_description: '包括白细胞、红细胞、中性粒细胞、血红蛋白等常规项目', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: '生化', template_code: 'CH888468421', template_description: '记录肝功能蛋白、总胆红素、转氨酶等肝功能指标', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: '血气分析', template_code: 'BG578481354', template_description: '记录动脉血分析情况', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: '传染病', template_code: 'CR487121848', template_description: '记录乙肝表面抗原、抗体、丙肝、艾滋病等情况', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: '凝血', template_code: 'NX897823151', template_description: '记录凝血酶原时间、活动部分凝血活酶时间、国际标准化比值等', category: 0, dictionaries: [], type: 'basic'  },
]);

const auxiliaryTemplates = ref<TemplateItem[]>([
  { template_name: '心肺彩超', template_code: 'CC159756125', template_description: '记录辅助检查信息，心肺彩超情况', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: '胸部CT', template_code: 'CT059789515', template_description: '记录辅助检查信息，胸部CT检查情况', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: '腹部CT', template_code: 'CT189756125', template_description: '记录辅助检查信息，腹部CT检查情况', category: 0, dictionaries: [], type: 'basic'  },
]);

const scoreTemplates = ref<TemplateItem[]>([
  { template_name: 'Child-pugh评分', template_code: 'PFS89486251', template_description: '对肝硬化患者的肝功能储备进行量化评估的分级', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: 'MELD评分', template_code: 'PIK294856245', template_description: '对终末期肝病的严重程度的评分', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: 'CLIF-CAD评分', template_code: 'PPS84896523', template_description: '用于评估慢加急性肝衰竭（ACLF）患者预后', category: 0, dictionaries: [], type: 'basic'  },
  { template_name: 'EASL-ACLF评分', template_code: 'PR158946598', template_description: '评估慢加急性肝衰竭（ACLF）患者病情严重程度和预后', category: 0, dictionaries: [], type: 'basic'  },
]);

const followUpTemplates = ref<TemplateItem[]>([
  { template_name: '目前治疗情况', template_code: 'IOS894785214', template_description: '记录患者治疗过程的情况，如介入、化疗、放疗等', category: 0, dictionaries: [], type: 'basic'  },
]);

// 自定义模板列表 (可以由用户添加和管理，现在将从 API 获取)
const customTemplates = ref<TemplateItem[]>([]);

// 根据搜索关键字过滤模板列表的计算属性
const filterTemplates = (templates: TemplateItem[]) => {
  if (!searchKeyword.value) return templates;
  const keyword = searchKeyword.value.toLowerCase();
  return templates.filter(
    (template) =>
      template.template_name.toLowerCase().includes(keyword) ||
      template.template_code.toLowerCase().includes(keyword) ||
      template.template_description.toLowerCase().includes(keyword)
  );
};

const filteredBasicTemplates = computed(() => filterTemplates(basicTemplates.value));
const filteredLabTemplates = computed(() => filterTemplates(labTemplates.value));
const filteredAuxiliaryTemplates = computed(() => filterTemplates(auxiliaryTemplates.value));
const filteredScoreTemplates = computed(() => filterTemplates(scoreTemplates.value));
const filteredFollowUpTemplates = computed(() => filterTemplates(followUpTemplates.value));
const filteredCustomTemplates = computed(() => filterTemplates(customTemplates.value));

// 替换 dialogVisible 为 showEditForm
const showEditForm = ref(false);
const dialogTitle = ref('');
// 用于弹窗表单的数据，初始化为空或默认值
const formData = reactive<TemplateItem>({
  template_name: '',
  template_code: '',
  template_description: '',
  category: 1, // 默认自定义模板 (category: 1)
  dictionaries: [],
  type: 'custom', // 默认前端显示类型为 'custom'
});
// 表单引用，用于表单验证
const formRef = ref<FormInstance>();

// 表单验证规则
const rules = reactive<FormRules>({
  template_name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
  template_code: [{ required: true, message: '请输入模版编号', trigger: 'blur' }],
  template_description: [{ required: true, message: '请输入模版描述', trigger: 'blur' }],
  category: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
  type: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
});

/**
 * 处理添加自定义模板的点击事件
 */
const handleAddCustomTemplate = () => {
  dialogTitle.value = '添加自定义临床模版';
  // 重置表单数据为初始状态
  Object.assign(formData, { template_name: '', template_code: '', template_description: '', category: 1, dictionaries: [], type: 'custom' });
  showEditForm.value = true;
};

/**
 * 处理编辑模板的点击事件
 * @param row 被编辑的模板数据
 */
const handleEdit = (row: TemplateItem) => {
  dialogTitle.value = '编辑模版';
  // 复制当前行数据到表单，以便在弹窗中编辑
  Object.assign(formData, row);
  showEditForm.value = true;
};

/**
 * 处理取消编辑
 */
const handleCancel = () => {
  showEditForm.value = false;
  // 重置表单数据
  Object.assign(formData, { template_name: '', template_code: '', template_description: '', category: 1, dictionaries: [], type: 'custom' });
};

/**
 * 处理删除模板的点击事件
 * @param row 被删除的模板数据
 */
const handleDelete = (row: TemplateItem) => {
  ElMessageBox.confirm(`确定删除模版 "${row.template_name}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      if (row.template_code) { // 使用 template_code 作为唯一标识
        // 在实际应用中，这里会调用 API 删除后端数据
        await dataTemplateDelete({ template_code: row.template_code }); // API 需要 template_code
        customTemplates.value = customTemplates.value.filter(
          (item) => item.template_code !== row.template_code
        );
        ElMessage.success(`模版 "${row.template_name}" 删除成功!`);
      } else {
        ElMessage.error('无法删除，模版编号不存在。');
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

/**
 * 处理表单提交（添加或编辑）
 * @param data 从 TemplateEditDialog 组件传递过来的表单数据
 */
const handleSubmit = async (data: TemplateItem) => {
  try {
    if (data.template_code) { // 如果有 template_code，则为编辑现有模板
      // 编辑现有模板
      // 确保发送给后端的 data 是符合 API.DataTemplate 类型的
      const apiData: API.DataTemplate = {
        template_name: data.template_name,
        template_code: data.template_code,
        template_description: data.template_description,
        category: data.category,
        dictionaries: data.dictionaries,
      };
      await dataTemplateUpdate({ template_code: data.template_code }, apiData);
      const index = customTemplates.value.findIndex((item) => item.template_code === data.template_code);
      if (index !== -1) {
        customTemplates.value[index] = { ...data }; // 更新本地数据
        ElMessage.success('模版更新成功!');
      }
    } else {
      // 添加新模板
      // 确保发送给后端的 data 是符合 API.DataTemplate 类型的
      const apiData: API.DataTemplate = {
        template_name: data.template_name,
        template_description: data.template_description,
        category: data.category,
        dictionaries: data.dictionaries,
        // template_code 由后端自动生成，所以这里不传
      };
      await dataTemplateCreate(apiData);
      // 在成功创建后，重新获取模板列表以刷新数据
      await fetchTemplates();
      ElMessage.success('自定义模版添加成功!');
    }
    showEditForm.value = false;
    // 提交成功后，重置表单
    Object.assign(formData, { template_name: '', template_code: '', template_description: '', category: 1, dictionaries: [], type: 'custom' });
  } catch (error) {
    ElMessage.error('操作失败');
    console.error('表单提交失败:', error);
  }
};

/**
 * 处理显示全部模板的点击事件
 */
const handleShowAll = () => {
  showEditForm.value = false;
  // 重置表单数据
  Object.assign(formData, { template_name: '', template_code: '', template_description: '', category: 1, dictionaries: [], type: 'custom' });
};

// 新增函数，用于获取模板列表
const fetchTemplates = async () => {
  try {
    const res = await dataTemplateList({});

    // 检查 res.code 是否为 200 且 res.data.list 存在且是数组
    if (res?.data?.code === 200 && res.data?.data?.list) {
      // 假设 category 1 是自定义模板
      const fetchedCustomTemplates = res.data.data.list // <-- 主要修复点：从 res.data.list 获取
        .filter((apiItem: any) => apiItem.category === 1) // 使用 any 避免 API.DataTemplate 未知类型错误，或者确保 API.DataTemplate 包含 category
        .map((apiItem: any) => ({
          template_name: apiItem.template_name,
          template_code: apiItem.template_code || '',
          template_description: apiItem.template_description || '',
          category: apiItem.category,
          dictionaries: apiItem.dictionary_list || [], // <-- 注意：这里是 dictionary_list 而不是 dictionaries
          type: apiItem.category === 1 ? 'custom' : 'basic',
        }));
      customTemplates.value = fetchedCustomTemplates;
      
      // console.log('Filtered custom templates from API:', fetchedCustomTemplates);
      // console.log('customTemplates.value after assignment:', customTemplates.value);

      // 如果需要从 API 获取其他分类的模板，可以继续在这里进行过滤和赋值
      // 比如，初始化 basicTemplates 等
      // 注意：目前你的 basicTemplates, labTemplates 等是本地模拟数据，
      // 如果你也想从 API 获取这些，需要类似地过滤并赋值
      // const fetchedBasicTemplates = res.data.list
      //   .filter((apiItem: any) => apiItem.category === 0) // 假设 category 0 是基础临床模板
      //   .map((apiItem: any) => ({
      //     template_name: apiItem.template_name,
      //     template_code: apiItem.template_code || '',
      //     template_description: apiItem.template_description || '',
      //     category: apiItem.category,
      //     dictionaries: apiItem.dictionary_list || [],
      //     type: 'basic',
      //   }));
      // 这里你需要将这些数据赋值给对应的 ref，例如：
      // basicTemplates.value = fetchedBasicTemplates;
      // ... 类似地处理其他 category

    } else {
      customTemplates.value = [];
      console.log('API response does not contain valid template data or list is empty.', res);
    }
  } catch (error) {
    console.error('获取模板列表失败:', error);
    customTemplates.value = [];
  }
};

onMounted(async () => {
  // 在组件挂载时获取初始数据
  await fetchTemplates();
});
</script>

<style scoped lang="scss">
.template-container {
  padding: 20px;
  background-color: #f5f7fa; /* Light grey background */
  min-height: 100vh;
  box-sizing: border-box; /* Include padding in element's total width and height */

  .edit-form-section {
    max-width: 800px;
    margin: 20px auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .template-content {
    padding: 0px; /* Remove padding here, let el-collapse handle it */
  }

  .el-collapse {
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-bottom: 20px; /* Space below the entire collapse component */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    :deep(.el-collapse-item) {
      border-bottom: 1px solid #e9e9e9;

      &:last-child {
        border-bottom: none;
      }

      :deep(.el-collapse-item__header) {
        font-size: 16px;
        color: #333;
        padding: 15px 20px;
        background-color: #f9f9f9;
        border-bottom: 1px solid #e9e9e9;
        font-weight: bold;

        .el-collapse-item__arrow {
            margin-right: 8px;
        }
      }

      :deep(.el-collapse-item__content) {
        padding: 15px 20px;
      }
    }
  }
}
</style>
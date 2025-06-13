<template>
  <div class="template-container">
    <div class="template-header">
      <div class="header-left">
        <el-button-group class="custom-button-group">
          <el-button type="primary" plain>
            <img src="@/assets/2-1.png" class="button-icon" alt="All Templates Icon" />
            全部临床模版
          </el-button>
          <el-button @click="handleAddCustomTemplate">
            <img src="@/assets/2-2.png" class="button-icon" alt="Add Custom Template Icon" />
            添加自定义临床模版
          </el-button>
        </el-button-group>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入模版名称关键字"
          :prefix-icon="Search"
          @input="filterTemplates"
        />
      </div>
    </div>

    <div class="template-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础临床模板" name="1">
          <el-table :data="filteredBasicTemplates" style="width: 100%" border stripe>
            <el-table-column prop="name" label="模版名称" width="200" />
            <el-table-column prop="code" label="模版编号" width="200" />
            <el-table-column prop="description" label="模版描述" />
          </el-table>
        </el-collapse-item>

        <el-collapse-item title="临床检验模版" name="2">
          <el-table :data="filteredLabTemplates" style="width: 100%" border stripe>
            <el-table-column prop="name" label="模版名称" width="200" />
            <el-table-column prop="code" label="模版编号" width="200" />
            <el-table-column prop="description" label="模版描述" />
          </el-table>
        </el-collapse-item>

        <el-collapse-item title="评分模版" name="3">
          <el-table :data="filteredScoreTemplates" style="width: 100%" border stripe>
            <el-table-column prop="name" label="模版名称" width="200" />
            <el-table-column prop="code" label="模版编号" width="200" />
            <el-table-column prop="description" label="模版描述" />
          </el-table>
        </el-collapse-item>

        <el-collapse-item title="临床随访模版" name="4">
          <el-table :data="filteredFollowUpTemplates" style="width: 100%" border stripe>
            <el-table-column prop="name" label="模版名称" width="200" />
            <el-table-column prop="code" label="模版编号" width="200" />
            <el-table-column prop="description" label="模版描述" />
          </el-table>
        </el-collapse-item>

        <el-collapse-item title="辅助检查模版" name="6">
          <el-table :data="filteredAuxiliaryTemplates" style="width: 100%" border stripe>
            <el-table-column prop="name" label="模版名称" width="200" />
            <el-table-column prop="code" label="模版编号" width="200" />
            <el-table-column prop="description" label="模版描述" />
          </el-table>
        </el-collapse-item>

        <el-collapse-item title="自定义临床模版" name="5">
          <el-table :data="filteredCustomTemplates" style="width: 100%" border stripe>
            <el-table-column prop="name" label="模版名称" width="200" />
            <el-table-column prop="code" label="模版编号" width="200" />
            <el-table-column prop="description" label="模版描述" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>

      </el-collapse>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版编号" prop="code">
          <el-input v-model="formData.code" placeholder="请输入模版编号" />
        </el-form-item>
        <el-form-item label="模版描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入模版描述" />
        </el-form-item>
        <el-form-item label="模板类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择模板类型">
            <el-option label="基础临床模板" value="basic" />
            <el-option label="自定义模板" value="custom" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'; // Import the specific icon

// Assuming these API imports are correct for your project structure
// import {
//   dataTemplateList,
//   dataTemplateCreate,
//   dataTemplateUpdate,
//   dataTemplateDelete,
// } from '../../api/dataTemplates';
//
interface TemplateItem {
  id?: number;
  name: string;
  code: string;
  description: string;
  type: string;
  category_id?: number;
  used_n?: number;
}

export default defineComponent({
  name: 'TemplateComponent',
  setup() {
    const searchKeyword = ref('');
    // Initialize activeNames with all panel names to have them expanded by default
    const activeNames = ref(['1', '2', '3', '4', '5', '6']);

    // Mock Data based on provided images
    const basicTemplates = ref<TemplateItem[]>([
      { name: '一般情况', code: 'PRS98754612', description: '记录疾病一般情况，包括年龄、性别、体重、身高、血型等信息', type: 'basic', id: 1 },
    ]);

    const labTemplates = ref<TemplateItem[]>([
      { name: '血常规', code: 'BL598495468', description: '包括白细胞、红细胞、中性粒细胞、血红蛋白等常规项目', type: 'basic', id: 2 },
      { name: '生化', code: 'CH888468421', description: '记录肝功能蛋白、总胆红素、转氨酶等肝功能指标', type: 'basic', id: 3 },
      { name: '血气分析', code: 'BG578481354', description: '记录动脉血分析情况', type: 'basic', id: 4 },
      { name: '传染病', code: 'CR487121848', description: '记录乙肝表面抗原、抗体、丙肝、艾滋病等情况', type: 'basic', id: 5 },
      { name: '凝血', code: 'NX897823151', description: '记录凝血酶原时间、活动部分凝血活酶时间、国际标准化比值等', type: 'basic', id: 6 },
    ]);

    const auxiliaryTemplates = ref<TemplateItem[]>([
      { name: '心肺彩超', code: 'CC159756125', description: '记录辅助检查信息，心肺彩超情况', type: 'basic', id: 7 },
      { name: '胸部CT', code: 'CT059789515', description: '记录辅助检查信息，胸部CT检查情况', type: 'basic', id: 8 },
      { name: '腹部CT', code: 'CT189756125', description: '记录辅助检查信息，腹部CT检查情况', type: 'basic', id: 9 },
    ]);

    const scoreTemplates = ref<TemplateItem[]>([
      { name: 'Child-pugh评分', code: 'PFS89486251', description: '对肝硬化患者的肝功能储备进行量化评估的分级', type: 'basic', id: 10 },
      { name: 'MELD评分', code: 'PIK294856245', description: '对终末期肝病的严重程度的评分', type: 'basic', id: 11 },
      { name: 'CLIF-CAD评分', code: 'PPS84896523', description: '用于评估慢加急性肝衰竭（ACLF）患者预后', type: 'basic', id: 12 },
      { name: 'EASL-ACLF评分', code: 'PR158946598', description: '评估慢加急性肝衰竭（ACLF）患者病情严重程度和预后', type: 'basic', id: 13 },
    ]);

    const followUpTemplates = ref<TemplateItem[]>([
      { name: '目前治疗情况', code: 'IOS894785214', description: '记录患者治疗过程的情况，如介入、化疗、放疗等', type: 'basic', id: 14 },
    ]);

    // Custom templates can be added via the dialog
    const customTemplates = ref<TemplateItem[]>([]);

    // Filtered template lists based on search keyword
    const filteredBasicTemplates = computed(() =>
      basicTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    );

    const filteredLabTemplates = computed(() =>
      labTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    );

    const filteredAuxiliaryTemplates = computed(() =>
      auxiliaryTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    );

    const filteredScoreTemplates = computed(() =>
      scoreTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    );

    const filteredFollowUpTemplates = computed(() =>
      followUpTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    );

    const filteredCustomTemplates = computed(() =>
      customTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    );

    // Dialog and form management
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const formData = ref<TemplateItem>({
      name: '',
      code: '',
      description: '',
      type: 'custom', // Default type for new additions
    });
    const formRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
      name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
      code: [{ required: true, message: '请输入模版编号', trigger: 'blur' }],
      description: [{ required: true, message: '请输入模版描述', trigger: 'blur' }],
      type: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
    });

    const handleAddCustomTemplate = () => {
      dialogTitle.value = '添加自定义临床模版';
      formData.value = { name: '', code: '', description: '', type: 'custom' };
      dialogVisible.value = true;
    };

    const handleEdit = (row: TemplateItem) => {
      dialogTitle.value = '编辑模版';
      formData.value = { ...row }; // Copy row data to form
      dialogVisible.value = true;
    };

    const handleDelete = (row: TemplateItem) => {
      ElMessageBox.confirm('确定删除该模版吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // In a real application, you would call your API here to delete
          customTemplates.value = customTemplates.value.filter(
            (item) => item.id !== row.id
          );
          ElMessage({
            type: 'success',
            message: `模版 "${row.name}" 删除成功!`,
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          });
        });
    };

    const handleSubmit = () => {
      formRef.value?.validate((valid) => {
        if (valid) {
          if (formData.value.id) {
            // Update existing custom template
            const index = customTemplates.value.findIndex((item) => item.id === formData.value.id);
            if (index !== -1) {
              customTemplates.value[index] = { ...formData.value };
              ElMessage.success('模版更新成功!');
            }
          } else {
            // Add new custom template
            const newItem = { ...formData.value, id: Date.now() }; // Assign a unique ID for mock purposes
            customTemplates.value.push(newItem);
            ElMessage.success('自定义模版添加成功!');
          }
          dialogVisible.value = false;
          // Reset form after submission
          formData.value = { name: '', code: '', description: '', type: 'custom' };
        } else {
          return false;
        }
      });
    };

    const filterTemplates = () => {
      // Filtering is handled automatically by computed properties as `searchKeyword` changes.
    };

    return {
      searchKeyword,
      activeNames,
      filteredBasicTemplates,
      filteredLabTemplates,
      filteredAuxiliaryTemplates,
      filteredScoreTemplates,
      filteredFollowUpTemplates,
      filteredCustomTemplates,
      dialogVisible,
      dialogTitle,
      formData,
      formRef,
      rules,
      handleAddCustomTemplate,
      handleEdit,
      handleDelete,
      handleSubmit,
      filterTemplates,
      Search, // Make the imported icon available in the template
    };
  },
});
</script>

<style scoped lang="scss">
.custom-button-group {
  .el-button {
    display: flex;
    align-items: center;
    padding: 8px 15px; // Adjust padding to match visual
    height: 40px; // Standard button height
  }

  .button-icon {
    width: 20px; // Smaller icon size
    height: 20px;
    margin-right: 6px; // Adjust margin
  }
}

.template-container {
  padding: 20px;
  background-color: #f5f7fa; /* Light grey background */
  min-height: 100vh;
  box-sizing: border-box; /* Include padding in element's total width and height */

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: #fff; /* White header background */
    padding: 10px 20px;
    border-bottom: 1px solid #e9e9e9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
    border-radius: 4px; /* Rounded corners for the header */

    .header-left {
      display: flex; /* Ensure button group is aligned */
      align-items: center;
    }

    .header-right {
      width: 300px;
      .el-input {
        --el-input-height: 40px; // Match button height
      }
    }
  }

  .template-content {
    padding: 0px; /* Remove padding here, let el-collapse handle it */
  }

  .el-collapse {
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-bottom: 20px; /* Space below the entire collapse component */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Shadow for the content area */

    .el-collapse-item {
      border-bottom: 1px solid #e9e9e9;

      &:last-child {
        border-bottom: none; /* No border for the last item */
      }

      .el-collapse-item__header {
        font-size: 16px;
        color: #333;
        padding: 15px 20px;
        background-color: #f9f9f9; // Light background for headers
        border-bottom: 1px solid #e9e9e9;
        font-weight: bold; // Make header titles bold

        .el-collapse-item__arrow {
            margin-right: 8px; // Space between arrow and title
        }
      }

      .el-collapse-item__content {
        padding: 15px 20px; // Padding inside the collapsed content
      }
    }
  }

  .el-table {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e9e9e9; // Border for the table
    // margin-bottom: 15px; // This margin is now handled by the el-collapse-item__content padding

    /* Ensure table cells are aligned and have consistent padding */
    :deep(.el-table__cell) {
      padding: 10px 12px;
      font-size: 14px;
      color: #606266;
    }

    :deep(.el-table__header-wrapper) {
      .el-table__header {
        .el-table__cell {
          background-color: #f5f7fa; /* Header background for table */
          color: #303133;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
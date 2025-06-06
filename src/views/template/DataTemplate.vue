<template>
  <div class="template-container">
    <!-- 顶部导航区域 -->
    <div class="template-header">
      <div class="header-left">
        <el-button-group class="custom-button-group">
          <el-button type="primary" plain>
            <img src="@/assets/2-1.png" class="button-icon" />
            全部数据模版
          </el-button>
          <el-button @click="handleAddBasicTemplate">
            <img src="@/assets/2-2.png" class="button-icon" />
            添加基础数据模版
          </el-button>
          <el-button @click="handleAddCustomTemplate">
            <img src="@/assets/2-2.png" class="button-icon" />
            添加自定义数据模版
          </el-button>
        </el-button-group>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入模版名称关键字"
          prefix-icon="el-icon-search"
          @input="filterTemplates"
        />
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="template-content">
      <!-- 基础数据模板 -->
      <div class="template-section">
        <h3>基础数据模板</h3>
        <el-table :data="filteredBasicTemplates" style="width: 100%" border stripe>
          <el-table-column prop="name" label="模版名称" width="200" />
          <el-table-column prop="code" label="模版编号" width="200" />
          <el-table-column prop="description" label="模版描述" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 自定义数据模板 -->
      <div class="template-section">
        <h3>自定义数据模板</h3>
        <el-table :data="filteredCustomTemplates" style="width: 100%" border stripe>
          <el-table-column prop="name" label="模版名称" width="200" />
          <el-table-column prop="code" label="模版编号" width="200" />
          <el-table-column prop="description" label="模版描述" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 对话框 - 添加/编辑模板 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版编号" prop="code">
          <el-input v-model="formData.code" placeholder="请输入模版编号" />
        </el-form-item>
        <el-form-item label="模版描述" prop="description">
          <el-input
            type="textarea"
            v-model="formData.description"
            placeholder="请输入模版描述"
          />
        </el-form-item>
        <el-form-item label="模板类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择模板类型">
            <el-option label="基础数据模板" value="basic" />
            <el-option label="自定义数据模板" value="custom" />
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
import { defineComponent, ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  dataTemplatesList, 
  dataTemplatesCreate, 
  dataTemplatesUpdate, 
  dataTemplatesDelete 
} from '../../api/dataTemplates'

interface TemplateItem {
  id?: number
  name: string
  code: string
  description: string
  type: string
  category_id?: number
  used_n?: number
}

export default defineComponent({
  name: 'DataTemplate',
  setup() {
    const searchKeyword = ref('')
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref<FormInstance>()
    const formData = ref<TemplateItem>({
      name: '',
      code: '',
      description: '',
      type: 'basic'
    })
    const templateList = ref<TemplateItem[]>([])

    // 静态数据中的 code 和 type 选项
    const codeOptions = [
      'PR598754612', 'OP784548420', 'BL598495468', 'CH888468421', 'BG578481354',
      'CR487121848', 'NX897823151', 'CC159756125', 'CT059789515', 'CT189756125'
    ]
    const typeOptions = ['basic', 'custom']

    // 随机选择函数
    const getRandomItem = (array: string[]) => {
      return array[Math.floor(Math.random() * array.length)]
    }

    const rules: FormRules = {
      name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
      code: [{ required: true, message: '请输入模版编号', trigger: 'blur' }],
      description: [{ required: true, message: '请输入模版描述', trigger: 'blur' }],
      type: [{ required: true, message: '请选择模板类型', trigger: 'change' }]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑模板' : '添加模板')

    const filteredBasicTemplates = computed(() => {
      return templateList.value.filter(item => item.type === 'basic' && 
        (item.name.includes(searchKeyword.value) || item.code.includes(searchKeyword.value)))
    })

    const filteredCustomTemplates = computed(() => {
      return templateList.value.filter(item => item.type === 'custom' && 
        (item.name.includes(searchKeyword.value) || item.code.includes(searchKeyword.value)))
    })

    const fetchTemplates = async () => {
      try {
        const response = await dataTemplatesList({})
        console.log(JSON.stringify(response.data.data))
        // 从后端数据中补充 code 和 type
        templateList.value = (response.data.data.list || []).map((item: { code: any; type: any }) => ({
          ...item,
          code: item.code || getRandomItem(codeOptions), // 如果后端无 code，随机选择
          type: item.type || getRandomItem(typeOptions)  // 如果后端无 type，随机选择
        }))
      } catch (error) {
        ElMessage.error('获取模板列表失败')
        templateList.value = []
        console.error(error)
      }
    }

    fetchTemplates()

    const handleAddBasicTemplate = () => {
      isEdit.value = false
      formData.value = {
        name: '',
        code: getRandomItem(codeOptions), // 默认随机 code
        description: '',
        type: 'basic'
      }
      dialogVisible.value = true
    }

    const handleAddCustomTemplate = () => {
      isEdit.value = false
      formData.value = {
        name: '',
        code: getRandomItem(codeOptions), // 默认随机 code
        description: '',
        type: 'custom'
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: TemplateItem) => {
      isEdit.value = true
      formData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = async (row: TemplateItem) => {
      try {
        await ElMessageBox.confirm('确定要删除该模板吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await dataTemplatesDelete({ id: row.id! })
        templateList.value = templateList.value.filter(item => item.id !== row.id)
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
          console.error(error)
        }
      }
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            if (isEdit.value) {
              const response = await dataTemplatesUpdate(
                { id: formData.value.id! },
                formData.value
              )
              const index = templateList.value.findIndex(item => item.id === formData.value.id)
              if (index > -1) {
                templateList.value[index] = { ...response.data, code: formData.value.code, type: formData.value.type }
              }
              ElMessage.success('编辑成功')
            } else {
              const response = await dataTemplatesCreate(formData.value)
              templateList.value.push({ ...response.data, code: formData.value.code, type: formData.value.type })
              ElMessage.success('添加成功')
            }
            dialogVisible.value = false
          } catch (error) {
            ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
            console.error(error)
          }
        }
      })
    }

    const filterTemplates = () => {
      // 本地过滤已通过 computed 属性实现
    }

    return {
      searchKeyword,
      templateList,
      filteredBasicTemplates,
      filteredCustomTemplates,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      handleAddBasicTemplate,
      handleAddCustomTemplate,
      handleEdit,
      handleDelete,
      handleSubmit,
      filterTemplates
    }
  }
})
</script>

<style scoped lang="scss">
.custom-button-group {
  .el-button {
    display: flex;
    align-items: center;
  }

  .button-icon {
    width: 25px;
    height: 25px;
    margin-right: 8px;
  }
}

.template-container {
  padding: 20px;
  background-color: #DEDCC7;
  min-height: 100vh;

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: #f5f5f5;
    padding: 10px 20px;
    prioritizing-bottom: 1px solid #e9e9e9;

    .header-left {
      .el-button-group {
        .el-button {
          margin-right: 10px;
        }
      }
    }

    .header-right {
      width: 300px;
    }
  }

  .template-content {
    padding: 20px;

    .template-section {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
      }

      .el-table {
        background: #fff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
      }
    }
  }
}
</style>
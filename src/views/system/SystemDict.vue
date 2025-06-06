<template>
  <div class="dict-container">

    <!-- 内容区域 -->
    <div class="content">
      <!-- 右侧主内容 -->
      <div class="main-content">
        <div class="dict-header">
          <div class="button-group">
            <el-button type="primary" plain>
              <img src="@/assets/1-1.png" class="menu-icon" />
              全部词条
            </el-button>

            <el-button type="primary" plain @click="handleAdd">
              <img src="@/assets/1-2.png" class="menu-icon" />
              添加词条
            </el-button>
            
            <!-- 添加批量删除按钮 -->
            <el-button 
              type="danger" 
              plain 
              :disabled="selectedItems.length === 0"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
            
            <!-- 添加批量导入按钮 -->
            <el-upload
              class="upload-btn"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".csv"
              :on-change="handleFileChange"
              :disabled="uploading"
            >
              <el-button type="primary" plain :loading="uploading">
                <el-icon><Upload /></el-icon>
                {{ uploading ? '导入中...' : '批量导入' }}
              </el-button>
            </el-upload>
            
            <!-- 添加下载模板按钮 -->
            <el-button type="primary" plain @click="downloadTemplate" :disabled="uploading">
              <el-icon><Download /></el-icon>
              下载模板
            </el-button>
          </div>

          <el-input
            v-model="searchKeyword"
            placeholder="请输入关键字搜索"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 现有表格内容 -->
        <el-table 
          :data="dictList" 
          style="width: 100%" 
          border 
          stripe 
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="word_name" label="中文名称" width="120" />
          <el-table-column prop="word_eng" label="英文名称" width="150" />
          <el-table-column prop="word_short" label="英文缩写" width="100" />
          <el-table-column prop="word_code" label="词条编号" width="120" />
          <el-table-column prop="word_class" label="词条类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.word_class)">{{ row.word_class }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="word_apply" label="词条应用" width="120" />
          <el-table-column prop="word_belong" label="从属别名" width="120" />
          <el-table-column prop="actions" label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 添加分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 现有对话框 -->
        <el-dialog
          :title="dialogTitle"
          v-model="dialogVisible"
          width="500px"
        >
          <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="中文名称" prop="word_name">
              <el-input v-model="formData.word_name" placeholder="请输入中文名称" />
            </el-form-item>
            <el-form-item label="英文名称" prop="word_eng">
              <el-input v-model="formData.word_eng" placeholder="请输入英文名称" />
            </el-form-item>
            <el-form-item label="英文缩写" prop="word_short">
              <el-input v-model="formData.word_short" placeholder="请输入英文缩写" />
            </el-form-item>
            <el-form-item label="词条编号" prop="word_code">
              <el-input v-model="formData.word_code" placeholder="请输入词条编号" />
            </el-form-item>
            <el-form-item label="词条类型" prop="word_class">
              <el-select v-model="formData.word_class" placeholder="请选择词条类型">
                <el-option label="模板类别" value="template" />
                <el-option label="临床信息" value="clinical" />
                <el-option label="检验指标" value="indicator" />
              </el-select>
            </el-form-item>
            <el-form-item label="词条应用" prop="word_apply">
              <el-input v-model="formData.word_apply" placeholder="请输入词条应用" />
            </el-form-item>
            <el-form-item label="从属别名" prop="word_belong">
              <el-input v-model="formData.word_belong" placeholder="请输入从属别名" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 简化的导入结果对话框 -->
        <el-dialog
          title="导入结果"
          v-model="importResultVisible"
          width="500px"
        >
          <div class="import-result">
            <!-- 显示加载中 -->
            <div v-if="uploading" class="loading-container">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>正在导入数据，请稍候...</p>
            </div>
            
            <!-- 导入成功或失败提示 -->
            <div v-if="!uploading" class="result-container">
              <el-alert
                v-if="importResult.success"
                type="success"
                :title="importResult.message"
                :closable="false"
                show-icon
              />
              <el-alert
                v-else
                type="error"
                :title="importResult.message || '导入失败'"
                :closable="false"
                show-icon
              />
              
              <!-- 错误列表 -->
              <div v-if="importResult.errors && importResult.errors.length > 0" class="error-list-container">
                <p class="error-list-title">错误详情：</p>
                <ul class="error-list">
                  <li v-for="(error, index) in importResult.errors" :key="index" class="error-item">
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="importResultVisible = false" v-if="!uploading">关闭</el-button>
              <el-button type="primary" @click="refreshAfterImport" v-if="!uploading && importResult.success">
                确定并刷新
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, computed, onMounted, watch} from 'vue'
import { Plus, Search, Upload, Download, Loading, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dictionaryList, dictionaryCreate, dictionaryUpdate, dictionaryDelete } from '@/api/dictionary'
import axios from 'axios'

interface DictItem {
  id?: number
  word_name: string
  word_eng: string
  word_short: string
  word_code: string
  word_class: string
  word_apply: string
  word_belong: string
}

export default defineComponent({
  name: 'SystemDict',
  components: {
    Plus,
    Search,
    Upload,
    Download,
    Loading,
    Delete
  },
  setup() {
    const searchKeyword = ref('')
    const dialogVisible = ref(false)
    const importResultVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const tableLoading = ref(false)
    
    // 分页相关
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalItems = ref(0)
    const selectedItems = ref<DictItem[]>([])
    
    // 上传状态相关
    const uploading = ref(false)

    const formData = ref<DictItem>({
      word_name: '',
      word_eng: '',
      word_short: '',
      word_code: '',
      word_class: '',
      word_apply: '',
      word_belong: ''
    })

    const dictList = ref<DictItem[]>([])

    const importResult = ref<{
      success?: boolean;
      message: string;
      errors?: string[];
    }>({
      success: false,
      message: '',
      errors: []
    })

    const rules = {
      word_name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
      word_eng: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
      word_short: [{ required: true, message: '请输入英文缩写', trigger: 'blur' }],
      word_code: [{ required: true, message: '请输入词条编号', trigger: 'blur' }],
      word_class: [{ required: true, message: '请选择词条类型', trigger: 'change' }],
      word_apply: [{ required: true, message: '请输入词条应用', trigger: 'blur' }],
      word_belong: [{ required: true, message: '请输入从属别名', trigger: 'blur' }]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑词条' : '添加词条')

    const filteredDictList = computed(() => {
      if (!searchKeyword.value) return dictList.value
      return dictList.value.filter(item =>
          item.word_name.includes(searchKeyword.value) ||
          item.word_eng.includes(searchKeyword.value) ||
          item.word_short.includes(searchKeyword.value) ||
          item.word_code.includes(searchKeyword.value) ||
          item.word_belong.includes(searchKeyword.value)
      )
    })

    // 分页相关计算属性
    const pagedDictList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredDictList.value.slice(start, end)
    })

    // 处理多选变化
    const handleSelectionChange = (selection: DictItem[]) => {
      selectedItems.value = selection
    }

    // 处理每页显示数量变化
    const handleSizeChange = (size: number) => {
      pageSize.value = size
      currentPage.value = 1 // 重置到第一页
      fetchDictList() // 重新请求数据
    }

    // 处理页码变化
    const handleCurrentChange = (page: number) => {
      currentPage.value = page
      fetchDictList() // 重新请求数据
    }

    // 批量删除
    const handleBatchDelete = async () => {
      if (selectedItems.value.length === 0) {
        return
      }

      try {
        await ElMessageBox.confirm(
          `确定要批量删除选中的 ${selectedItems.value.length} 条词条吗？`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        tableLoading.value = true
        let successCount = 0;
        let failCount = 0;
        
        // 修改为更可靠的删除方式：逐个调用删除API
        for (const item of selectedItems.value) {
          if (item.id) {
            try {
              console.log('发送批量删除请求，ID:', item.id);
              // 使用现有的单个删除API，确保每个删除请求都能正确发送
              await dictionaryDelete({ id: item.id })
              successCount++;
            } catch (e) {
              console.error(`删除词条${item.word_name}(ID:${item.id})失败:`, e)
              failCount++;
            }
          }
        }
        
        // 刷新数据列表
        await fetchDictList()
        ElMessage.success(`成功删除 ${successCount} 条记录` + (failCount > 0 ? `，${failCount} 条记录删除失败` : ''))
        selectedItems.value = [] // 清空选中项
        
      } catch (error) {
        console.error('批量删除失败:', error)
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败')
        }
      } finally {
        tableLoading.value = false
      }
    }

    const getTagType = (word_class: string) => {
      const typeMap: Record<string, string> = {
        template: 'warning',
        clinical: 'success',
        indicator: 'danger'
      }
      return typeMap[word_class] || 'info'
    }

    // 获取词条列表
    const fetchDictList = async () => {
      tableLoading.value = true
      try {
        // 修改为使用后端分页
        const params = {
          page: currentPage.value,
          page_size: pageSize.value
        }
        
        // 如果有搜索关键词，添加到请求参数
        if (searchKeyword.value) {
          params['search'] = searchKeyword.value
        }
        
        const res = await dictionaryList(params)
        console.log('获取词条列表响应:', res.data)
        
        // 修正为解析正确的嵌套数据结构
        if (res.data && res.data.data && res.data.data.results) {
          // 正确的数据格式: { code: 200, data: { count: x, results: [...] }, msg: "success" }
          dictList.value = res.data.data.results
          totalItems.value = res.data.data.count || 0
          console.log('总条数:', totalItems.value)
          console.log('当前数据:', dictList.value)
        } else if (res.data.results) {
          // 备用格式1
          dictList.value = res.data.results
          totalItems.value = res.data.count || 0
        } else if (res.data.list) {
          // 备用格式2
          dictList.value = res.data.list
          totalItems.value = res.data.total || 0
        } else {
          // 兜底处理
          dictList.value = Array.isArray(res.data) ? res.data : []
          totalItems.value = dictList.value.length
        }
        
      } catch (error) {
        console.error('获取词条列表失败:', error)
        ElMessage.error('获取词条列表失败')
        dictList.value = []
        totalItems.value = 0
      } finally {
        tableLoading.value = false
      }
    }

    const handleAdd = () => {
      isEdit.value = false
      formData.value = {
        word_name: '',
        word_eng: '',
        word_short: '',
        word_code: '',
        word_class: '',
        word_apply: '',
        word_belong: ''
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: DictItem) => {
      isEdit.value = true
      formData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = async (row: DictItem) => {
      try {
        await ElMessageBox.confirm(
            '确定要删除该词条吗？',
            '警告',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        )

        if (row.id) {
          tableLoading.value = true
          try {
            console.log('发送删除请求，ID:', row.id)
            const response = await dictionaryDelete({ id: row.id })
            console.log('删除响应:', response)
            ElMessage.success('删除成功')
            await fetchDictList() // 刷新列表
          } catch (error) {
            console.error('删除请求失败:', error)
            ElMessage.error('删除失败，请重试')
          } finally {
            tableLoading.value = false
          }
        } else {
          ElMessage.warning('该记录没有ID，无法删除')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除词条失败:', error)
        }
      }
    }

    const handleSubmit = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate(async (valid: boolean) => {
          if (valid) {
            if (isEdit.value && formData.value.id) {
              // 编辑词条
              await dictionaryUpdate({
                id: formData.value.id
              }, formData.value)
              ElMessage.success('编辑成功')
            } else {
              // 添加词条
              await dictionaryCreate(formData.value)
              ElMessage.success('添加成功')
            }
            await fetchDictList()
            dialogVisible.value = false
          }
        })
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleFileChange = async (file: any) => {
      // 检查文件类型
      if (!file.raw.name.endsWith('.csv')) {
        ElMessage.error('只支持上传CSV文件格式')
        return
      }
      
      // 检查文件大小（限制为2MB）
      if (file.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('文件大小不能超过2MB')
        return
      }
      
      // 重置导入结果
      importResult.value = {
        success: false,
        message: '',
        errors: []
      }
      
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', file.raw)
      
      // 开始上传流程
      uploading.value = true
      importResultVisible.value = true
      tableLoading.value = true
      
      try {
        // 发送请求
        const response = await axios.post('/api/dictionary/import/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        console.log('导入响应原始数据:', response)
        console.log('导入响应数据:', response.data)
        
        // 修复导入结果解析逻辑
        if (response.data) {
          // 正确解析导入结果
          if (response.data.success === true || (response.status === 200 && !response.data.error)) {
            importResult.value = {
              success: true,
              message: response.data.message || '导入成功完成',
              errors: response.data.errors || []
            }
            
            // 添加成功提示
            ElMessage.success(importResult.value.message)
            
            // 立即刷新数据列表
            await fetchDictList()
          } else {
            // 处理导入失败的情况
            importResult.value = {
              success: false,
              message: response.data.error || '导入失败',
              errors: response.data.errors || []
            }
            ElMessage.error(importResult.value.message)
          }
        }
      } catch (error: any) {
        console.error('导入出错:', error)
        importResult.value = {
          success: false,
          message: error.response?.data?.error || '导入失败，请重试',
          errors: error.response?.data?.errors || []
        }
        ElMessage.error(importResult.value.message)
      } finally {
        // 上传完成
        uploading.value = false
        tableLoading.value = false
      }
    }

    // 下载导入模板
    const downloadTemplate = () => {
      // 创建下载链接
      const link = document.createElement('a')
      link.href = '/api/dictionary/import-template/'
      link.download = 'dictionary_import_template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 刷新数据并关闭对话框
    const refreshAfterImport = async () => {
      tableLoading.value = true
      try {
        await fetchDictList()
        importResultVisible.value = false
        ElMessage.success('数据已刷新')
      } catch (error) {
        console.error('刷新数据失败:', error)
      } finally {
        tableLoading.value = false
      }
    }

    onMounted(() => {
      fetchDictList()
    })

    return {
      searchKeyword,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      dictList,
      filteredDictList,
      getTagType,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
      importResult,
      importResultVisible,
      uploading,
      handleFileChange,
      downloadTemplate,
      refreshAfterImport,
      tableLoading,
      pagedDictList,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalItems,
      handleBatchDelete,
      selectedItems
    }
  }
})
</script>

<style scoped lang="scss">
.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.button-group {
  display: flex;
  gap: 10px; // 控制按钮之间的间距
}

.button-icon {
  margin-right: 5px;
}



.dict-container {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .sub-title {
      font-size: 12px;
      color: #666;
    }
  }

  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .main-content {
      width: 100%;

      .dict-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;

        .search-input {
          width: 300px;
        }
      }
    }
  }

  .el-table {
    margin-top: 10px;
    background-color: #fff;
    border: 1px solid #e9e9e9;
  }
  
  // 添加导入相关样式
  .upload-btn {
    display: inline-block;
  }
  
  .import-result {
    .progress-container {
      margin-bottom: 20px;
      
      .progress-text {
        margin-top: 10px;
        color: #606266;
        text-align: center;
        font-size: 14px;
      }
    }
    
    .success-container, .error-container {
      padding: 0 0 20px;
    }
    
    .stats-container {
      display: flex;
      justify-content: center;
      margin-top: 15px;
      
      .stat-item {
        display: flex;
        align-items: center;
        margin: 0 15px;
        font-size: 16px;
        
        .el-icon {
          margin-right: 5px;
          font-size: 18px;
        }
        
        &.success {
          color: #67c23a;
        }
        
        &.error {
          color: #f56c6c;
        }
      }
    }
    
    .result-message {
      font-size: 16px;
      margin-bottom: 15px;
      font-weight: 500;
    }
    
    .error-details {
      margin-top: 20px;
    }
    
    .error-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 10px;
      background-color: #fafafa;
      
      .error-item {
        color: #f56c6c;
        margin-bottom: 5px;
        line-height: 1.5;
      }
    }
  }
}
.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
</style>

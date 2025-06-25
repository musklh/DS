<template>
  <div class="dict-container">

    <!-- 内容区域1 -->
    <div class="content">
      <!-- 右侧主内容 -->
      <div class="main-content">
        <div class="dict-header">
          <div class="button-group">
            <el-button word_class="primary" plain>
            <img src="@/assets/1-1.png" class="menu-icon" />
            全部词条
          </el-button>

          <el-button word_class="primary" plain @click="handleAdd">
            <img src="@/assets/1-2.png" class="menu-icon" />
            添加词条
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

        <el-table :data="paginatedDictList" style="width: 100%" border stripe>
          <el-table-column prop="word_name" label="中文名称" width="120" />
          <el-table-column prop="word_eng" label="英文名称" width="150" />
          <el-table-column prop="word_short" label="英文缩写" width="100" />
          <el-table-column prop="word_code" label="词条编号" width="120" />
          <el-table-column prop="word_class" label="词条类型" width="120">
            <template #default="{ row }">
              <el-tag :word_class="getTagword_class(row.word_class)">{{ row.word_class }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="word_apply" label="词条应用" width="120" />
          <el-table-column prop="word_belong" label="从属别名" width="120" />
          <el-table-column prop="data_type" label="数值类型" width="120" />
          <el-table-column prop="actions" label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" word_class="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 使用原生分页组件 -->
        <el-pagination
          style="margin-top: 20px; text-align: right;"
          background
          layout="->, sizes, total, prev, pager, next, jumper"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />

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
            <el-form-item label="词条类型" prop="word_class">
              <el-select v-model="formData.word_class" placeholder="请选择词条类型">
                <el-option label="数据类型" value="数据类型" />
                <el-option label="字典词条" value="字典词条" />
                <el-option label="模板类别" value="模板类别" /> 
                <el-option label="临床信息" value="临床信息" /> 
                <el-option label="信息类型" value="信息类型" /> 
                <el-option label="检验类型" value="检验类型" />
                <el-option label="信息名称" value="信息名称" />
                <el-option label="检验名称" value="检验名称" />
                <el-option label="检查名称" value="检查名称" />
                <el-option label="检验类型" value="检验类型" />
              </el-select>
            </el-form-item>
            <el-form-item label="词条应用" prop="word_apply">
              <el-input v-model="formData.word_apply" placeholder="请输入词条应用" />
            </el-form-item>
            <el-form-item label="从属别名" prop="word_belong">
              <el-input v-model="formData.word_belong" placeholder="请输入从属别名" />
            </el-form-item>
            <el-form-item label="是否数值类型" prop="data_type">
              <el-select v-model="formData.data_type" :placeholder="formData.data_type === '' ? '否' : '请选择'">
                <el-option label="是" value="数值类型" />
                <el-option label="否" value="" />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button word_class="primary" @click="handleSubmit">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dictionaryList, dictionaryCreate, dictionaryUpdate, dictionaryDelete } from '../../api/dictionary'
//
interface DictItem {
  word_name: string     // 中文名称
  word_eng?: string     // 英文名称
  word_short?: string   // 英文缩写
  word_code?: string    // 词条编号
  word_class: string    // 词条类型
  word_apply: string    // 词条应用
  word_belong?: string  // 从属别名
  data_type?: string | null // 新增：数据类型
}
const generateWordCode = (): string => {
  const randomDigits = Math.floor(Math.random() * 1_000_000) // 0 ~ 999999
  return 'I' + randomDigits.toString().padStart(6, '0')
}


export default defineComponent({
  name: 'SystemDict',
  components: { Plus, Search },
  setup() {
    // 基础数据
    const searchKeyword = ref('')
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const allDictList = ref<DictItem[]>([])

    // 表单数据
    const formData = ref<DictItem>({
      word_name: '',
      word_eng: '',
      word_short: '',
      word_code: '',
      word_class: '',
      word_apply: '',
      word_belong: '',
      data_type: null // 默认值设为 null
    })

    // 表单验证规则
    const rules = {
      word_name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
      word_class: [{ required: true, message: '请选择词条类型', trigger: 'change' }],
      word_apply: [{ required: true, message: '请输入词条应用', trigger: 'blur' }]
    }

    // 分页状态
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 计算属性
    const dialogTitle = computed(() => isEdit.value ? '编辑词条' : '添加词条')
    const filteredDictList = computed(() => {
      if (!searchKeyword.value) {
        return allDictList.value
      }
      const keyword = searchKeyword.value.toLowerCase()
      return allDictList.value.filter(item =>
        item.word_name?.toLowerCase().includes(keyword) ||
        item.word_eng?.toLowerCase().includes(keyword) ||
        item.word_short?.toLowerCase().includes(keyword) ||
        item.word_code?.toLowerCase().includes(keyword) ||
        item.word_belong?.toLowerCase().includes(keyword) ||
        (item.data_type && item.data_type.toLowerCase().includes(keyword))
      )
    })

    const paginatedDictList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredDictList.value.slice(start, end)
    })

    const total = computed(() => filteredDictList.value.length)

    // 监听搜索关键词变化，重置到第一页
    watch(searchKeyword, () => {
      currentPage.value = 1
    })

    // 获取词条列表函数
    const fetchDictList = async () => {
      try {
        const res = await dictionaryList({
          page: 1, // 获取所有数据
          page_size: 99999
        })
        if (res?.data?.code === 200 && res.data?.data) {
          allDictList.value = res.data.data.list.map((item: any) => ({
            ...item,
            data_type: item.data_type === '数值类型' ? '是' : '否'
          }))
        } else {
          allDictList.value = []
          ElMessage.warning('暂无数据')
        }
      } catch (error) {
        ElMessage.error('获取词条列表失败')
      }
    }

    // 分页切换
    const handlePageChange = (page: number) => {
      currentPage.value = page
    }
    // 每页条数切换
    const handlePageSizeChange = (size: number) => {
      pageSize.value = size
      currentPage.value = 1
    }

    // 添加词条
    const handleAdd = () => {
      isEdit.value = false
      formData.value = {
        word_name: '',
        word_eng: '',
        word_short: '',
        word_code: generateWordCode(),
        word_class: '',
        word_apply: '',
        word_belong: '',
        data_type: '' // 默认值设为 null
      }
      dialogVisible.value = true
    }

    // 编辑词条
    const handleEdit = (row: DictItem) => {
      isEdit.value = true
      // 确保 data_type 转换回后端期望的 '数值类型' 或 ""
      formData.value = { ...row, data_type: row.data_type === '是' ? '数值类型' : "" }
      dialogVisible.value = true
    }

    // 删除词条
    const handleDelete = async (row: DictItem) => {
      try {
        await ElMessageBox.confirm('确定要删除该词条吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        if (row.word_code) {
          await dictionaryDelete({ word_code: row.word_code })
          ElMessage.success('删除成功')
          await fetchDictList()
        }
      } catch (error) {
        ElMessage.error('删除失败')
      }
    }

    // 提交表单
    const handleSubmit = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate(async (valid: boolean) => {
          if (valid) {
            const submitData = { 
              ...formData.value,
              data_type: formData.value.data_type || "" // 确保 data_type 为 null 或 undefined 时传空字符串
            }

            if (isEdit.value && submitData.word_code) {
              await dictionaryUpdate({ word_code: submitData.word_code }, submitData as API.Dictionary)
              ElMessage.success('编辑成功')
            } else {
              delete submitData.word_code // 新增时不需要 word_code
              await dictionaryCreate(submitData as API.Dictionary)
              ElMessage.success('添加成功')
            }

            await fetchDictList()
            dialogVisible.value = false
          }
        })
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }

    // 词条类型标签样式
    const getTagword_class = (word_class: string) => {
      const word_classMap: Record<string, string> = {
        '模板类别': 'warning',
        '临床信息': 'success',
        '检验指标': 'danger'
      }
      return word_classMap[word_class] || 'info'
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
      paginatedDictList,
      getTagword_class,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
      currentPage,
      pageSize,
      total,
      handlePageChange,
      handlePageSizeChange
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
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

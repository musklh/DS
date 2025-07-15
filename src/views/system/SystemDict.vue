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
          <el-table-column prop="has_unit" label="有单位" width="80">
            <template #default="{ row }">
              <span>{{ row.has_unit === 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="100" />
          <el-table-column prop="is_score" label="是评分" width="80">
            <template #default="{ row }">
              <span>{{ row.is_score === 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="score_func" label="评分方式" width="150" />
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
                <el-option label="数值类型" value="数值类型" />
                <el-option label="文本类型" value="文本类型" />
              </el-select>
            </el-form-item>
            <el-form-item label="填写方式" prop="input_type">
              <el-select v-model="formData.input_type" placeholder="请选择填写方式" style="width: 100%;">
                <el-option label="文本输入" value="text" />
                <el-option label="数值输入" value="number" />
                <el-option label="日期选择" value="date" />
                <el-option label="单选" value="single" />
                <el-option label="单选(含其他)" value="single_with_other" />
                <el-option label="多选" value="multi" />
                <el-option label="多选并填写时间" value="multi_with_date" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否有单位" prop="has_unit">
                <el-radio-group v-model="formData.has_unit">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formData.has_unit === 1" label="词条单位" prop="unit">
              <el-input v-model="formData.unit" placeholder="请输入单位" />
            </el-form-item>
            <el-form-item label="是否为评分" prop="is_score">
              <el-radio-group v-model="formData.is_score">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formData.is_score === 1" label="评分计算方式" prop="score_func">
              <el-input v-model="formData.score_func" type="textarea" placeholder="请输入评分计算方式" />
            </el-form-item>
            <el-form-item v-if="['single', 'multi', 'multi_with_date', 'single_with_other'].includes(formData.input_type)" label="主选项" prop="options">
                <el-input v-model="formData.options" type="textarea" placeholder="多个选项请用英文逗号(,)隔开" />
            </el-form-item>

            <!-- 主词条组合输入字段配置 -->
            <div v-if="formData.input_type === 'group'" class="main-group-fields-config">
              <el-divider>组合字段配置</el-divider>
              <div v-if="!formData.fields">
                <el-button size="small" type="success" @click="initMainGroupFields()" icon="Plus">
                  初始化组合字段
                </el-button>
              </div>
              <div v-else>
                <div v-for="(field, fieldIndex) in formData.fields" :key="fieldIndex" class="group-field-item">
                  <div class="group-field-header">
                    <span>字段 {{ fieldIndex + 1 }}</span>
                    <el-button size="small" type="danger" @click="removeMainGroupField(fieldIndex)" icon="Minus">
                      删除字段
                    </el-button>
                  </div>
                  <div class="group-field-form">
                    <el-form-item label="字段标签">
                      <el-input v-model="field.label" size="small" placeholder="例如：第几次" />
                    </el-form-item>
                    <el-form-item label="字段类型">
                      <el-select v-model="field.input_type" size="small" placeholder="请选择">
                        <el-option label="文本" value="text" />
                        <el-option label="数值" value="number" />
                        <el-option label="日期" value="date" />
                        <el-option label="单选" value="select" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="field.input_type === 'select'" label="选项">
                      <el-input v-model="field.options" size="small" placeholder="用英文逗号(,)隔开" />
                    </el-form-item>
                  </div>
                </div>
                <el-button size="small" type="primary" @click="addMainGroupField()" icon="Plus">
                  添加字段
                </el-button>
              </div>
            </div>

            <!-- 动态后续问题生成器 -->
            <div v-if="mainOptionsArray.length > 0" class="followup-builder">
              <el-divider>后续问题设置</el-divider>
              <div v-for="option in mainOptionsArray" :key="option" class="followup-item">
                <div class="followup-item-header">
                  <span>主选项: <strong>{{ option }}</strong></span>
                  <el-button
                    v-if="!formData.followup_options || !formData.followup_options[option]"
                    size="small"
                    type="primary"
                    plain
                    icon="Plus"
                    @click="addFollowUp(option, formData)"
                  >
                    添加后续问题
                  </el-button>
                  <el-button v-else size="small" type="danger" plain icon="Minus" @click="removeFollowUp(option, formData)">
                    删除后续问题
                  </el-button>
                </div>
                <div v-if="formData.followup_options && formData.followup_options[option]" class="followup-item-form">
                  <el-form-item label="问题标签">
                    <el-input v-model="formData.followup_options[option].label" size="small" placeholder="例如：程度" />
                  </el-form-item>
                  <el-form-item label="问题类型">
                    <el-select v-model="formData.followup_options[option].input_type" size="small" placeholder="请选择">
                      <el-option label="单选" value="single" />
                      <el-option label="文本" value="text" />
                      <el-option label="数值" value="number" />
                      <el-option label="日期" value="date" />
                      <el-option label="组合输入" value="group" />
                    </el-select>
                  </el-form-item>
                  
                  <!-- 常规单选选项 -->
                  <el-form-item v-if="formData.followup_options[option].input_type === 'single'" label="问题选项">
                    <el-input v-model="formData.followup_options[option].options" size="small" placeholder="用英文逗号(,)隔开" />
                  </el-form-item>

                  <!-- 组合输入字段配置 -->
                  <div v-if="formData.followup_options[option].input_type === 'group'" class="group-fields-config">
                    <el-divider style="margin: 10px 0;">组合字段配置</el-divider>
                    <div v-if="!formData.followup_options[option].fields">
                      <el-button size="small" type="success" @click="initGroupFields(option)" icon="Plus">
                        初始化组合字段
                      </el-button>
                    </div>
                    <div v-else>
                      <div v-for="(field, fieldIndex) in formData.followup_options[option].fields" :key="fieldIndex" class="group-field-item">
                        <div class="group-field-header">
                          <span>字段 {{ fieldIndex + 1 }}</span>
                          <el-button size="small" type="danger" @click="removeGroupField(option, fieldIndex)" icon="Minus">
                            删除字段
                          </el-button>
                        </div>
                        <div class="group-field-form">
                          <el-form-item label="字段标签">
                            <el-input v-model="field.label" size="small" placeholder="例如：第几次" />
                          </el-form-item>
                          <el-form-item label="字段类型">
                            <el-select v-model="field.input_type" size="small" placeholder="请选择">
                              <el-option label="文本" value="text" />
                              <el-option label="数值" value="number" />
                              <el-option label="日期" value="date" />
                              <el-option label="单选" value="select" />
                            </el-select>
                          </el-form-item>
                          <el-form-item v-if="field.input_type === 'select'" label="选项">
                            <el-input v-model="field.options" size="small" placeholder="用英文逗号(,)隔开" />
                          </el-form-item>
                        </div>
                      </div>
                      <el-button size="small" type="primary" @click="addGroupField(option)" icon="Plus">
                        添加字段
                      </el-button>
                    </div>
                  </div>

                  <!-- LEVEL 2 FOLLOWUP (原有的二级选项逻辑，仅对单选类型) -->
                  <div v-if="formData.followup_options[option].input_type === 'single' && formData.followup_options[option].options">
                    <div v-for="sub_option in getOptionsArray(formData.followup_options[option].options || '')" :key="sub_option" class="followup-item-nested">
                      <div class="followup-item-header">
                        <span>子选项: <strong>{{ sub_option }}</strong></span>
                         <el-button
                            v-if="!formData.followup_options[option].followup_options || !formData.followup_options[option].followup_options[sub_option]"
                            size="small"
                            type="primary"
                            plain
                            icon="Plus"
                            @click="addFollowUp(sub_option, formData.followup_options[option])"
                          >
                            添加后续问题
                          </el-button>
                          <el-button v-else size="small" type="danger" plain icon="Minus" @click="removeFollowUp(sub_option, formData.followup_options[option])">
                            删除后续问题
                          </el-button>
                      </div>
                      <div v-if="formData.followup_options[option].followup_options && formData.followup_options[option].followup_options[sub_option]" class="followup-item-form">
                          <el-form-item label="问题标签">
                            <el-input v-model="formData.followup_options[option].followup_options[sub_option].label" size="small" placeholder="例如：程度" />
                          </el-form-item>
                          <el-form-item label="问题类型">
                            <el-select v-model="formData.followup_options[option].followup_options[sub_option].input_type" size="small" placeholder="请选择">
                              <el-option label="单选" value="single" />
                              <el-option label="文本" value="text" />
                              <el-option label="数值" value="number" />
                              <el-option label="日期" value="date" />
                            </el-select>
                          </el-form-item>
                          <el-form-item v-if="formData.followup_options[option].followup_options[sub_option].input_type === 'single'" label="问题选项">
                            <el-input v-model="formData.followup_options[option].followup_options[sub_option].options" size="small" placeholder="用英文逗号(,)隔开" />
                          </el-form-item>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
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
import { Plus, Search, Minus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dictionaryList, dictionaryCreate, dictionaryUpdate, dictionaryDelete } from '../../api/dictionary'

interface GroupField {
  label: string
  input_type: string
  options?: string
}

interface FollowUp {
  label: string
  input_type: string
  options?: string
  fields?: GroupField[]  // 新增：组合字段
  followup_options?: Record<string, FollowUp>
}

interface DictItem {
  word_name: string     // 中文名称
  word_eng?: string     // 英文名称
  word_short?: string   // 英文缩写
  word_code?: string    // 词条编号
  word_class: string    // 词条类型
  word_apply: string    // 词条应用
  word_belong?: string  // 从属别名
  data_type?: string | null // 新增：数据类型
  input_type: string
  options: string
  fields?: GroupField[]  // 新增：主词条组合字段
  followup_options?: Record<string, FollowUp>
  followup_options_str?: string; // 用于UI绑定
  has_unit?: number
  unit?: string
  is_score?: number
  score_func?: string
}
const generateWordCode = (): string => {
  const randomDigits = Math.floor(Math.random() * 1_000_000) // 0 ~ 999999
  return 'I' + randomDigits.toString().padStart(6, '0')
}


export default defineComponent({
  name: 'SystemDict',
  components: { Plus, Search, Minus },
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
      data_type: null, // 默认值设为 null
      input_type: '',
      options: '',
      fields: [],
      followup_options: {},
      followup_options_str: '{}',
      has_unit: 0,
      unit: '',
      is_score: 0,
      score_func: ''
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

    const mainOptionsArray = computed(() => {
      if (formData.value.options) {
        return formData.value.options.split(',').map(o => o.trim()).filter(o => o);
      }
      return [];
    });

    // 监视 followup_options_str 的变化，并尝试解析它
    watch(() => formData.value.followup_options_str, (newVal) => {
      try {
        if (newVal) {
          formData.value.followup_options = JSON.parse(newVal);
        } else {
          formData.value.followup_options = {};
        }
      } catch (e) {
        // 如果JSON无效，可以提示用户或保持 followup_options 不变
        console.error("Invalid JSON format for followup_options_str");
      }
    });

    // 获取词条列表函数
    const fetchDictList = async () => {
      try {
        const res = await dictionaryList({
          page: 1, // 获取所有数据
          page_size: 99999
        })
        // @ts-ignore
        if (res?.data?.code === 200 && res.data?.data?.list) {
          // @ts-ignore
          allDictList.value = res.data.data.list.map((item: any) => ({
            ...item,
            data_type: item.data_type === '数值类型' ? '是' : '否',
            followup_options_str: JSON.stringify(item.followup_options || {}, null, 2)
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
        data_type: '', // 默认值设为 null
        input_type: 'text',
        options: '',
        fields: [],
        followup_options: {},
        followup_options_str: '{}',
        has_unit: 0,
        unit: '',
        is_score: 0,
        score_func: ''
      }
      dialogVisible.value = true
    }

    // 编辑词条
    const handleEdit = (row: DictItem) => {
      isEdit.value = true
      // 确保 data_type 转换回后端期望的 '数值类型' 或 ""
      formData.value = { 
        ...row, 
        data_type: row.data_type === '是' ? '数值类型' : "",
        fields: row.fields || [],
        followup_options_str: JSON.stringify(row.followup_options || {}, null, 2)
      }
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
            if (submitData.has_unit === 0) {
              submitData.unit = ''
            }
            if (submitData.is_score === 0) {
              submitData.score_func = ''
            }
            delete submitData.followup_options_str;

            if (isEdit.value && submitData.word_code) {
              const res = await dictionaryUpdate({ word_code: submitData.word_code }, submitData as any)
              // @ts-ignore
              if (res.data?.code === 200) {
                ElMessage.success('编辑成功')
                await fetchDictList()
                dialogVisible.value = false
              } else {
                // @ts-ignore
                ElMessage.error((res.data as any)?.msg || '编辑失败')
              }
            } else {
              delete submitData.word_code // 新增时不需要 word_code
              const res = await dictionaryCreate(submitData as any)
              // @ts-ignore
              if (res.data?.code === 200) {
                ElMessage.success('添加成功')
                await fetchDictList()
                dialogVisible.value = false
              } else {
                 // @ts-ignore
                 console.log(res.data);
                 ElMessage.error((res.data as any)?.msg || '添加失败')
              }
            }
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

    const addFollowUp = (option: string, parent: { followup_options?: Record<string, FollowUp> }) => {
      if (!parent.followup_options) {
        parent.followup_options = {};
      }
      parent.followup_options[option] = {
        label: '',
        input_type: 'single',
        options: ''
      };
    };

    const removeFollowUp = (option: string, parent: { followup_options?: Record<string, FollowUp> }) => {
      if (parent.followup_options && parent.followup_options[option]) {
        delete parent.followup_options[option];
      }
    };

    // 新增：组合字段相关函数
    const initGroupFields = (option: string) => {
      if (!formData.value.followup_options) {
        formData.value.followup_options = {};
      }
      if (!formData.value.followup_options[option].fields) {
        formData.value.followup_options[option].fields = [
          { label: '第几次', input_type: 'select', options: '第1次,第2次,第3次,第4次,第5次,第6次,第7次,第8次,第9次,第10次' },
          { label: '时间', input_type: 'date' }
        ];
      }
    };

    const addGroupField = (option: string) => {
      if (!formData.value.followup_options) {
        formData.value.followup_options = {};
      }
      if (!formData.value.followup_options[option].fields) {
        formData.value.followup_options[option].fields = [];
      }
      formData.value.followup_options[option].fields.push({
        label: '',
        input_type: 'text'
      });
    };

    const removeGroupField = (option: string, fieldIndex: number) => {
      if (formData.value.followup_options && formData.value.followup_options[option].fields) {
        formData.value.followup_options[option].fields.splice(fieldIndex, 1);
      }
    };

    // 新增：主词条组合字段相关函数
    const initMainGroupFields = () => {
      if (!formData.value.fields) {
        formData.value.fields = [
          { label: '第几次', input_type: 'select', options: '第1次,第2次,第3次,第4次,第5次,第6次,第7次,第8次,第9次,第10次' },
          { label: '时间', input_type: 'date' }
        ];
      }
    };

    const addMainGroupField = () => {
      if (!formData.value.fields) {
        formData.value.fields = [];
      }
      formData.value.fields.push({
        label: '',
        input_type: 'text'
      });
    };

    const removeMainGroupField = (fieldIndex: number) => {
      if (formData.value.fields) {
        formData.value.fields.splice(fieldIndex, 1);
      }
    };

    const getOptionsArray = (optionsStr: string) => {
      if (optionsStr) {
        return optionsStr.split(',').map(o => o.trim()).filter(o => o)
      }
      return []
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
      handlePageSizeChange,
      mainOptionsArray,
      addFollowUp,
      removeFollowUp,
      getOptionsArray,
      initGroupFields,
      addGroupField,
      removeGroupField,
      initMainGroupFields,
      addMainGroupField,
      removeMainGroupField,
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

.followup-builder {
  border-top: 1px solid #e9ecef;
  margin-top: 20px;
  padding-top: 15px;
}

.followup-item {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 10px;
}

.followup-item-nested {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 10px;
}

.followup-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.followup-item-form {
  padding-left: 20px;
  border-left: 3px solid #ced4da;
  padding-top: 10px;
  padding-bottom: 1px; /* To contain margins of form items */
}

.followup-item-form .el-form-item {
    margin-bottom: 18px;
}

/* 新增：组合字段配置样式 */
.group-fields-config,
.main-group-fields-config {
  background-color: #f0f4f8;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  padding: 12px;
  margin-top: 10px;
}

.group-field-item {
  background-color: white;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
}

.group-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 500;
  color: #303133;
}

.group-field-form {
  padding-left: 15px;
  border-left: 2px solid #409eff;
}

.group-field-form .el-form-item {
  margin-bottom: 12px;
}
</style>

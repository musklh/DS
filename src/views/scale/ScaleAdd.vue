<template>
  <div style="padding: 40px 20px">
    <!-- 返回按钮 -->
    <div style="margin-bottom: 20px;">
      <el-button @click="goBack" type="primary" plain>
        <el-icon><ArrowLeft /></el-icon>
        返回量表列表
      </el-button>
    </div>
    
    <div class="" style="padding-left: 40px">
      <el-form-item label="词条编号" required>
        <el-input v-model="form.word_code" placeholder="当前词条编号" readonly />
      </el-form-item>

      <el-form-item label="词条名称" required>
        <el-input v-model="form.word_name" placeholder="当前词条名称" readonly />
      </el-form-item>


    </div>
    <!-- 这里可以添加实际表单内容 -->
    <ratingRules
      :selectionRules="selectionRules"
      :nitialRules="mockInitialRules"
      @settings="onSettings"
      @save="onSave"
      :applyTitle="saving ? '保存中...' : '保存评分规则'"
      :buttonAlign="'left'"
      :loading="saving"
      :showSaveButton="true"
      :saveButtonText="saving ? '保存中...' : '保存评分规则'"
      :saving="saving"
      :currentItem="props.currentItem"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { ElMessage, ElButton, ElIcon } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import ratingRules from '@/components/ratingRules/index.vue';
import { dictionaryList, dictionaryPartialUpdate } from '../../api/dictionary';

// 定义词条数据类型
interface DictionaryItem {
  id?: number;
  word_code?: string;
  word_name: string;
  word_eng?: string;
  word_short?: string;
  word_class: string;
  word_apply: string;
  word_belong?: string;
  data_type?: string;
  input_type?: string;
  options?: string;
  followup_options?: Record<string, any>;
  has_unit?: number;
  unit?: string;
  is_score?: number;
  score_func?: string;
}



// 定义props
interface Props {
  currentItem?: DictionaryItem | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['goBack']);

// 词条列表数据
const selectionRules = ref<DictionaryItem[]>([]);
const saving = ref(false);

// 初始规则数据，根据当前词条的score_func字段解析
const mockInitialRules = ref<any[]>([]);

const form = reactive({
  word_code: '',
  word_name: '',
});



// 获取词条列表
const fetchDictionaryList = async () => {
  try {
    const response = await dictionaryList({});
    
    // 根据实际返回的数据结构获取词条列表
    // 实际响应格式: { code: 200, msg: "操作成功", data: { list: [...] } }
    const responseData = response as any;
    selectionRules.value = responseData.data?.data?.list || [];
  } catch (error) {
    console.error('获取词条列表失败:', error);
  }
};



// 监听props变化，更新表单数据和评分规则
watch(() => props.currentItem, (newItem) => {
  if (newItem) {
    form.word_code = newItem.word_code || '';
    form.word_name = newItem.word_name || '';
    
    // 解析已有的评分规则
    if (newItem.score_func) {
      try {
        const parsedRules = JSON.parse(newItem.score_func);
        console.log('解析的评分规则:', parsedRules);
        mockInitialRules.value = Array.isArray(parsedRules) ? parsedRules : [];
        console.log('设置mockInitialRules:', mockInitialRules.value);
      } catch (error) {
        console.error('解析评分规则失败:', error);
        mockInitialRules.value = [];
      }
    } else {
      mockInitialRules.value = [];
    }
  } else {
    form.word_code = '';
    form.word_name = '';
    mockInitialRules.value = [];
  }
}, { immediate: true });

// 保存逻辑
const onSettings = async (data: any) => {
  if (saving.value) return;
  
  if (!props.currentItem) {
    ElMessage.error('请先选择要编辑的词条');
    return;
  }
  
  saving.value = true;
  console.log('保存评分规则数据:', data);
  
  try {
    const scoreFunc = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 更新现有词条的评分规则
    await dictionaryPartialUpdate(
      { word_code: props.currentItem.word_code! },
      {
        is_score: 1, // 标记为评分词条
        score_func: scoreFunc, // 保存评分规则
      } as any
    );
    
    ElMessage.success(`保存成功！词条：${form.word_name}(${form.word_code})`);
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

// 保存评分规则
const onSave = async (data: any) => {
  if (saving.value) return;
  
  if (!props.currentItem) {
    ElMessage.error('请先选择要编辑的词条');
    return;
  }
  
  saving.value = true;
  console.log('保存评分规则数据:', data);
  
  try {
    const scoreFunc = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 更新现有词条的评分规则
    await dictionaryPartialUpdate(
      { word_code: props.currentItem.word_code! },
      {
        is_score: 1, // 标记为评分词条
        score_func: scoreFunc, // 保存评分规则
      } as any
    );
    
    ElMessage.success(`保存成功！词条：${form.word_name}(${form.word_code})`);
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

// 返回量表列表
const goBack = () => {
  emit('goBack');
};

onMounted(() => {
  fetchDictionaryList();
});
</script>

<style scoped lang="scss">
.scale-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-input,
.el-textarea {
  width: 400px;
}
</style>

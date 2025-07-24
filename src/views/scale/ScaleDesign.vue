<template>
  <div class="scale-design-container">
    <div class="scale-header">
      <div class="button-group">
        <el-button
          v-for="(tag, index) in tags"
          type="primary"
          :plain="isScaleListActive != index + 1"
          @click="switchTab(index + 1)"
          :class="{ active: isScaleListActive === index + 1 }"
        >
          <img :src="tag.iconName" class="menu-icon" />{{ tag.title }}
        </el-button>
      </div>
      <div class="search-area" v-if="isScaleListActive === 1 && !currentEditItem">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索量表名称"
          clearable
          style="width: 300px; margin-right: 10px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <div class="scale-content">
      <ScaleList v-if="isScaleListActive === 1 && !currentEditItem" @editRules="onEditRules" />
      <ScaleAdd v-if="currentEditItem && isScaleListActive === 1" :currentItem="currentEditItem" @goBack="onGoBack" />
      <ScoreSheet v-if="isScaleListActive === 2" />
      <ChildRating v-if="isScaleListActive === 3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ScaleList from './ScaleList.vue';
import ScaleAdd from './ScaleAdd.vue';
import table from '@/assets/table.png';
import tag2 from '@/assets/1-2.png';
import ScoreSheet from './scoreSheet.vue';
import ChildRating from './childRating.vue';

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

const tags = ref([
  {
    title: '全部量表',
    iconName: table,
  },
  {
    title: '评分表',
    iconName: tag2,
  },
  {
    title: '从模板中规则评分',
    iconName: tag2,
  },
]);

const isScaleListActive = ref(1);
const searchKeyword = ref('');
const loading = ref(false);
const currentPage = ref(1);
const total = ref(0);
const currentEditItem = ref<DictionaryItem | null>(null);

const fetchScaleList = async () => {
  loading.value = true;
  try {
    // 此处应有实际数据请求逻辑
  } catch (error) {
    // 错误处理
  } finally {
    loading.value = false;
  }
};

const switchTab = (tabIndex: number) => {
  isScaleListActive.value = tabIndex;
  // 注意：由于删除了"添加量表"标签，现在的索引对应关系是：
  // 1: 全部量表, 2: 评分表, 3: 从模板中规则评分
  
  // 如果切换到其他标签页，清空编辑状态
  if (tabIndex !== 1) {
    currentEditItem.value = null;
  }
};

const showScaleList = () => {
  isScaleListActive.value = 1;
  fetchScaleList();
};

const goToAddScale = () => {
  currentEditItem.value = null; // 清空编辑项，进入新建模式
  isScaleListActive.value = 2;
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchScaleList();
};

// 处理编辑规则事件
const onEditRules = (row: DictionaryItem) => {
  currentEditItem.value = row; // 保存当前编辑的词条，这会自动显示编辑页面
  console.log('进入编辑模式，编辑词条:', row.word_name);
};

// 处理返回事件
const onGoBack = () => {
  currentEditItem.value = null; // 清空编辑项，返回到列表页面
  // 确保当前激活的标签是"全部量表"
  isScaleListActive.value = 1;
};

onMounted(() => {
  fetchScaleList();
});
</script>

<style scoped lang="scss">
.scale-design-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  .scale-header {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button-group {
      display: flex;
      gap: 16px;
      .el-button {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        font-size: 14px;
        border-radius: 6px;
        .menu-icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        &.active {
          background-color: #409eff;
          color: #fff;
          border-color: #409eff;
        }
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
        }
      }
    }
    .search-area {
      display: flex;
      align-items: center;
    }
  }
  .scale-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>

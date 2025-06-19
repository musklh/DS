<template>
  <el-select
    v-model="selectedCaseCode"
    :disabled="disabled"
    placeholder="请选择专病档案"
    filterable
    clearable
    class="case-selector"
    style="width: 260px"
    @change="handleChange"
  >
    <el-option
      v-for="item in caseOptions"
      :key="item.archive_code"
      :label="`${item.archive_name}（${item.archive_code}）`"
      :value="item.archive_code"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'; // Import watch
import { archiveList } from '@/api/archive';
import { ElSelect, ElOption } from 'element-plus'; // Explicitly import Element Plus components

interface ArchiveItem {
  id: number;
  archive_code: string;
  archive_name: string;
  archive_description?: string;
  case_count: number;
}

const emit = defineEmits(['caseSelected']);

const selectedCaseCode = ref<string | null>(null); // Change v-model to bind to string (archive_code)
const caseOptions = ref<ArchiveItem[]>([]
);

const props = defineProps<{
  disabled?: boolean
  initialSelectedCode?: string
}>();

watch(() => props.initialSelectedCode, (newCode) => {
  if (newCode) {
    selectedCaseCode.value = newCode;
  }
}, { immediate: true });

const fetchArchives = async () => {
  try {
    const response = await archiveList({
      page: 1,
      page_size: 9999});
    const resData = response.data;

    if (resData.code === 200 && resData.data && Array.isArray(resData.data.list)) {
      caseOptions.value = resData.data.list;
    } else {
      console.error('数据结构错误:', resData);
    }
  } catch (error) {
    console.error('获取档案列表失败:', error);
  }
};

const handleChange = (code: string) => {
  // Find the full archive item based on the selected code
  const selectedArchive = caseOptions.value.find(item => item.archive_code === code);
  if (selectedArchive) {
    emit('caseSelected', {
      archive_code: selectedArchive.archive_code,
      archive_name: selectedArchive.archive_name,
    });
  } else {
    // Handle case where selection is cleared
    emit('caseSelected', { archive_code: '', archive_name: '' });
  }
};

onMounted(() => {
  fetchArchives();
});
</script>

<style scoped>
.case-selector .el-input__inner {
  border-radius: 8px;
  font-size: 15px;
  padding: 10px 12px;
}
</style>
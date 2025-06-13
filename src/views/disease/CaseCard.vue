<template>
  <div v-if="archives.length">
    <div
      v-for="archive in archives"
      :key="archive.id"
      class="case-panel-card"
    >
      <div>
        <div class="card-title">{{ archive.archive_name }}</div>
        <div class="card-desc">
          {{ archive.archive_description || '暂无详细描述。' }}
        </div>
      </div>
      <div class="card-count">
        <div class="count-label">总共病例数</div>
        <div class="count-num">{{ archive.case_count ?? 0 }}</div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>正在加载档案数据...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { archiveList } from '@/api/archive'; // ✅ 根据你的路径调整
//
interface ArchiveItem {
  id: number;
  archive_code: string;
  archive_name: string;
  archive_description?: string;
  case_count: number;
}

const archives = ref<ArchiveItem[]>([]);

const fetchArchives = async () => {
  try {
    const response = await archiveList({});
    const resData = response.data;

    if (resData.code === 200 && resData.data && Array.isArray(resData.data.list)) {
      archives.value = resData.data.list;

      // ✅ 提取档案编号数组
      const archiveCodes = resData.data.list.map((item: ArchiveItem) => item.archive_code);

      // ✅ 存储到浏览器本地缓存（localStorage）
      localStorage.setItem('archiveCodes', JSON.stringify(archiveCodes));

      console.log('档案编号已缓存:', archiveCodes);
    } else {
      console.error('数据结构错误:', resData);
    }
  } catch (error) {
    console.error('获取档案列表失败:', error);
  }
};


onMounted(() => {
  fetchArchives();
});
</script>

<style scoped lang="scss">
.case-panel-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 32px 40px;
  display: flex;
  align-items: center;
  min-width: 480px;
  margin-bottom: 20px;

  .card-title {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
  }

  .card-desc {
    color: #888;
    font-size: 16px;
    max-width: 420px;
  }

  .card-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 40px;

    .count-label {
      color: #888;
      font-size: 15px;
      margin-bottom: 6px;
    }

    .count-num {
      color: #a94442;
      font-size: 48px;
      font-weight: bold;
    }
  }
}
</style>

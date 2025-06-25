<template>
  <div v-if="archives.length">
    <div
      v-for="archive in archives"
      :key="archive.id"
      class="case-panel-card"
    >
      <div class="card-actions">
        <el-button size="small" @click="openEditDialog(archive)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(archive)">删除</el-button>
      </div>
      <div class="card-main">
        <div class="card-info">
          <div class="card-title">{{ archive.archive_name }}</div>
          <!-- ✅ 添加档案编号显示 -->
          <div class="card-code">档案号：{{ archive.archive_code }}</div>
          <div class="card-desc">
            {{ archive.archive_description || '暂无详细描述。' }}
          </div>
          <div class="case-count-highlight">
            <div class="count-label">总共病例数</div>
            <div class="count-num">{{ archive.case_count ?? 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="editDialogVisible" title="编辑档案" width="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="档案名称">
          <el-input v-model="editForm.archive_name" />
        </el-form-item>
        <el-form-item label="档案描述">
          <el-input v-model="editForm.archive_description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
  <div v-else>
    <p>暂无档案数据，请先创建档案。</p>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { archiveList, archiveDelete, archiveUpdate } from '@/api/archive'; // 
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

// 编辑相关
const editDialogVisible = ref(false);
const editForm = ref({
  archive_code: '',
  archive_name: '',
  archive_description: ''
});

function openEditDialog(archive: ArchiveItem) {
  editForm.value = {
    archive_code: archive.archive_code,
    archive_name: archive.archive_name,
    archive_description: archive.archive_description || ''
  };
  editDialogVisible.value = true;
}

async function submitEdit() {
  try {
    await archiveUpdate(
      { archive_code: editForm.value.archive_code },
      {
        archive_code: editForm.value.archive_code,
        archive_name: editForm.value.archive_name,
        archive_description: editForm.value.archive_description
      }
    );
    ElMessage.success('编辑成功');
    editDialogVisible.value = false;
    fetchArchives();
  } catch (e) {
    ElMessage.error('编辑失败');
  }
}

// 删除
async function handleDelete(archive: ArchiveItem) {
  try {
    await ElMessageBox.confirm('确定要删除该档案吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await archiveDelete({ archive_code: archive.archive_code });
    ElMessage.success('删除成功');
    fetchArchives();
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败');
  }
}

onMounted(() => {
  fetchArchives();
});
</script>

<style scoped lang="scss">
.card-code {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.case-panel-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 32px 40px;
  min-width: 480px;
  margin-bottom: 20px;
  position: relative;

  .card-actions {
    position: absolute;
    right: 24px;
    top: 18px;
    display: flex;
    gap: 8px;
    z-index: 2;
  }

  .card-main {
    display: flex;
    align-items: flex-start;
  }

  .card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card-title {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .card-desc {
    color: #888;
    font-size: 16px;
    max-width: 420px;
  }

  .case-count-highlight {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .count-label {
      color: #409EFF;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .count-num {
      color: #e53935;
      font-size: 40px;
      font-weight: bold;
      line-height: 1.1;
      letter-spacing: 2px;
      text-shadow: 0 2px 8px rgba(229,57,53,0.08);
    }
  }
}
</style>

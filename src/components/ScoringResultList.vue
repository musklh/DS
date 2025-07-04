<template>
  <el-card>
    <template #header>评分结果</template>
    <div class="scoring-toolbar">
      <el-select v-model="selectedSystem" placeholder="选择评分系统" @change="fetchResults">
        <el-option v-for="sys in systems" :key="sys.code" :label="sys.name" :value="sys.code" />
      </el-select>
      <el-button icon="Download" size="small" @click="exportExcel" :disabled="!results.length">导出明细</el-button>
    </div>
    <el-table :data="filteredResults" style="width: 100%">
      <el-table-column prop="scoring_system_name" label="评分系统" />
      <el-table-column prop="total_score" label="总分" />
      <el-table-column prop="grade" label="分级" />
      <el-table-column prop="risk_level" label="风险" />
      <el-table-column prop="check_time" label="评分时间" />
      <el-table-column label="明细">
        <template #default="scope">
          <el-button size="small" @click="showDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-alert v-if="missingItems.length" type="warning" show-icon class="mt-2">
      缺失项：{{ missingItems.join('，') }}，请补全后再试。
    </el-alert>
    <el-dialog v-model="dialogVisible" title="评分明细" width="800px">
      <div v-if="detailList.length > 0">
        <el-table :data="detailList" stripe border>
          <el-table-column prop="scoring_indicator" label="指标" width="180">
            <template #default="{ row }">
              {{ row.scoring_indicator?.name || row.indicator_name }}
            </template>
          </el-table-column>
          <el-table-column prop="raw_value" label="原始值" width="120" />
          <el-table-column prop="score" label="得分" width="100">
            <template #default="{ row }">
              <span :class="{
                'score-max': row.score === row.max_score,
                'score-zero': row.score === 0,
                'score-missing': row.score === null || row.score === undefined
              }">
                {{ row.score ?? '缺失' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="criteria_used" label="评分标准">
            <template #default="{ row }">
              {{ row.criteria_used?.description || row.criteria_description || '无' }}
            </template>
          </el-table-column>
          <el-table-column prop="check_time" label="评分时间" width="150" />
        </el-table>
      </div>
      <div v-else>
        <el-alert type="info" :closable="false">
          暂无评分明细数据，可能是因为该评分记录尚未生成详细信息。
        </el-alert>
      </div>
      <template #footer>
        <el-button @click="exportExcel(detailList)" :disabled="!detailList.length">导出明细</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-card v-if="filteredResults.length" class="mt-4">
      <template #header>评分历史趋势</template>
      <v-chart :option="chartOption" autoresize style="height:300px;" />
    </el-card>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineExpose, computed } from 'vue';
import { getScoringResults, getScoringSystems, getScoringResultDetail } from '../api/scoring';
import request from '../request';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import VChart from 'vue-echarts';

const props = defineProps<{ caseCode: string }>();
const results = ref<any[]>([]);
const systems = ref<any[]>([]);
const selectedSystem = ref<string>('');
const dialogVisible = ref(false);
const detailList = ref<any[]>([]);
const missingItems = ref<string[]>([]);

async function showDetail(row: any) {
  try {
    const res = await getScoringResultDetail(row.id);
    if (res.data?.code === 200) {
      const resultData = res.data.data;
      detailList.value = resultData.details || [];
      dialogVisible.value = true;
      console.log('获取评分明细成功:', detailList.value);
    } else {
      ElMessage.error('获取评分明细失败');
    }
  } catch (error) {
    console.error('获取评分明细失败:', error);
    ElMessage.error('获取评分明细失败');
  }
}

async function fetchResults() {
  if (!props.caseCode) return;
  const [res, sysRes] = await Promise.all([
    getScoringResults(props.caseCode),
    getScoringSystems()
  ]);
  results.value = res.data?.data?.list || res.data?.data || [];
  systems.value = sysRes.data?.data?.list || [];
  if (!selectedSystem.value && systems.value.length) {
    selectedSystem.value = systems.value[0].code;
  }
  // 缺失项提示
  const first = filteredResults.value[0];
  missingItems.value = first?.missing_items || [];
}

const selectedSystemObj = computed(() =>
  systems.value.find(s => s.code === selectedSystem.value)
);
const selectedSystemName = computed(() => selectedSystemObj.value?.name);

const filteredResults = computed(() => {
  if (!selectedSystem.value) return results.value;
  return results.value.filter(
    r => r.scoring_system_name === selectedSystemName.value
  );
});

// 支持外部调用刷新
function refresh() {
  fetchResults();
}
defineExpose({ refresh });

// 导出Excel
function exportExcel(data?: any[]) {
  let exportData: any[] = [];
  
  if (data && data.length > 0 && data[0].scoring_indicator) {
    // 如果是明细数据（从对话框导出）
    exportData = data.map((d: any) => ({
      指标: d.scoring_indicator?.name || d.indicator_name,
      原始值: d.raw_value,
      得分: d.score,
      评分标准: d.criteria_used?.description || d.criteria_description,
      评分时间: d.check_time
    }));
  } else {
    // 如果是汇总数据（从主表格导出）
    exportData = (data || filteredResults.value).map(r => ({
      评分系统: r.scoring_system_name,
      病例编号: r.case_code,
      患者姓名: r.case_name,
      总分: r.total_score,
      分级: r.grade,
      风险等级: r.risk_level,
      评分时间: r.check_time
    }));
  }
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '评分数据');
  XLSX.writeFile(wb, '评分数据.xlsx');
  ElMessage.success('导出成功');
}

// 趋势图配置
const chartOption = computed(() => {
  const data = filteredResults.value.map(r => ({
    time: r.check_time,
    score: r.total_score
  })).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return {
    xAxis: { type: 'category', data: data.map(d => d.time) },
    yAxis: { type: 'value' },
    series: [{ data: data.map(d => d.score), type: 'line', smooth: true }],
    tooltip: { trigger: 'axis' }
  };
});

onMounted(async () => {
  if (props.caseCode) {
    // 先补算评分
    await request.post('scoring-recalculate/', { case_code: props.caseCode });
    // 再拉取评分结果
    fetchResults();
  }
});
watch(() => props.caseCode, fetchResults);
</script>

<style scoped>
/* 明细高亮：满分/0分/缺失 */
.score-max {
  color: #d9001b;
  font-weight: bold;
}
.score-zero {
  color: #409EFF;
  font-weight: bold;
}
.score-missing {
  color: #999;
  font-style: italic;
}
.scoring-toolbar { display: flex; gap: 16px; margin-bottom: 12px; align-items: center; }
.mt-2 { margin-top: 12px; }
.mt-4 { margin-top: 24px; }
</style> 
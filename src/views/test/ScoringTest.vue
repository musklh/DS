<template>
  <el-card>
    <template #header>评分功能自动化测试与可视化</template>
    <el-form :inline="true" class="mb-4">
      <el-form-item label="选择病例号">
        <el-select v-model="caseCode" placeholder="请选择病例号" style="width: 200px">
          <el-option v-for="c in caseList" :key="c.case_code" :label="c.case_code" :value="c.case_code" />
        </el-select>
      </el-form-item>
      <el-form-item label="评分系统">
        <el-select v-model="scoringSystem" placeholder="请选择评分系统" style="width: 200px">
          <el-option v-for="sys in systems" :key="sys.code" :label="sys.name" :value="sys.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="runTest">一键补全数据并评分</el-button>
        <el-button type="success" @click="runAllTest">一键补全所有病例评分</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <el-alert v-if="testMsg" :title="testMsg" type="info" show-icon class="mb-2" />
    <el-card v-if="results.length">
      <template #header>评分结果趋势</template>
      <v-chart :option="chartOption" autoresize style="height:300px;" />
      <el-table :data="results" class="mt-4">
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
    </el-card>
    <el-dialog v-model="dialogVisible" title="评分明细" width="700px">
      <el-table :data="detailList">
        <el-table-column prop="indicator_name" label="指标" />
        <el-table-column prop="raw_value" label="原始值" />
        <el-table-column prop="score" label="得分" />
        <el-table-column prop="criteria_description" label="评分标准" />
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { getScoringResults, getScoringSystems } from '@/api/scoring';
import request from '@/request';
import VChart from 'vue-echarts';
import { ElMessage } from 'element-plus';

const caseList = ref<any[]>([]);
const caseCode = ref('');
const systems = ref<any[]>([]);
const scoringSystem = ref('');
const results = ref<any[]>([]);
const dialogVisible = ref(false);
const detailList = ref<any[]>([]);
const testMsg = ref('');

async function fetchCases() {
  // 假设有病例列表接口
  const res = await request.get('case/', { params: { page_size: 100 } });
  caseList.value = res.data?.data?.list || [];
}
async function fetchSystems() {
  const res = await getScoringSystems();
  systems.value = res.data?.data?.list || [];
}
async function fetchResults() {
  if (!caseCode.value) return;
  const res = await getScoringResults(caseCode.value);
  results.value = res.data?.data?.list?.filter((r:any) => !scoringSystem.value || r.scoring_system_code === scoringSystem.value) || [];
}
function showDetail(row: any) {
  detailList.value = row.details || [];
  dialogVisible.value = true;
}
const chartOption = computed(() => {
  const data = results.value.map(r => ({
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

async function runTest() {
  if (!caseCode.value) return ElMessage.warning('请选择病例号');
  testMsg.value = '正在补全数据并评分...';
  // 1. 补全模拟数据（如需，可扩展）
  // 2. 调用补算评分接口
  await request.post('scoring-recalculate/', { case_code: caseCode.value });
  // 3. 拉取评分结果
  await fetchResults();
  testMsg.value = results.value.length ? '评分成功，见下方明细' : '评分失败或无评分数据';
}

async function runAllTest() {
  if (!caseList.value.length) return ElMessage.warning('无病例数据');
  testMsg.value = '正在为所有病例补全评分...';
  let success = 0;
  for (const c of caseList.value) {
    try {
      await request.post('scoring-recalculate/', { case_code: c.case_code });
      success++;
      testMsg.value = `已完成 ${success}/${caseList.value.length}`;
    } catch (e) {
      // 可选：记录失败病例
    }
  }
  testMsg.value = `全部完成，共补全 ${success} 个病例评分。`;
  // 可选：自动刷新当前病例评分结果
  if (caseCode.value) await fetchResults();
}

onMounted(async () => {
  await fetchCases();
  await fetchSystems();
});
watch([caseCode, scoringSystem], fetchResults);
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 24px; }
</style> 
<template>
  <el-table :data="tableData" style="width: 100%" border v-loading="loading">
    <el-table-column prop="recordId" label="档案号" />
    <el-table-column prop="caseId" label="病例号" />
    <el-table-column prop="idNumber" label="身份证号" />
    <el-table-column prop="outpatientId" label="门诊号" />
    <el-table-column prop="inpatientId" label="住院号" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="gender" label="性别" />
    <el-table-column prop="age" label="年龄" />
    <el-table-column prop="diagnosis" label="主要诊断" />
  </el-table>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { caseList } from '../../api/openApiCase'; // 请替换成实际的 API 文件路径

// 表格数据
const tableData = ref<API.CaseList[]>([]);
const loading = ref(false);
//
// 获取数据函数
const fetchData = async () => {
  try {
    loading.value = true;
    const res = await caseList({});
    console.log('caseList 返回结果:', res); // 👈 添加这一行 // 可以传入分页参数等
    tableData.value = res.results.map((item: { archive_code: any; case_code: any; identity_id: any; opd_id: any; inhospital_id: any; name: any; gender: number; birth_date: string | undefined; main_diagnosis: any; }) => ({
      recordId: item.archive_code || '-',      // 档案编号
      caseId: item.case_code || '-',           // 病例编号
      idNumber: item.identity_id || '-',       // 身份证号
      outpatientId: item.opd_id || '-',        // 门诊号
      inpatientId: item.inhospital_id || '-',  // 住院号
      name: item.name || '-',
      gender: item.gender === 1 ? '男' : '女',
      age: getAgeFromBirth(item.birth_date),
      diagnosis: item.main_diagnosis || '-',
    }));
  } catch (error) {
    ElMessage.error('获取病例数据失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 出生日期转年龄
function getAgeFromBirth(birthDateStr?: string): number | '-' {
  if (!birthDateStr) return '-';
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

// 页面加载时请求数据
onMounted(() => {
  fetchData();
});
</script>


<style scoped>
.el-table {
  font-size: 14px;
}
</style>

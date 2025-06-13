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
////
// 获取数据函数
const fetchData = async () => {
  try {
    loading.value = true;
    const res = await caseList({});
    console.log('caseList 返回结果:', res);

    if (!res.data?.data?.list || !Array.isArray(res.data.data.list)) {
      throw new Error('返回数据格式错误：res.data.data.list 应为数组');
    }

    // 处理 archive_codes 为数组的情况
    tableData.value = res.data.data.list.flatMap((item: {
      archive_codes: string[];
      case_code: string;
      identity: string;
      opd_id: string;
      inhospital_id: string;
      name: string;
      gender: number;
      birth_date?: string;
      main_diagnosis: string;
    }) => {
      if (!item.archive_codes || item.archive_codes.length === 0) {
        return [{
          recordId: '-',
          caseId: item.case_code || '-',
          idNumber: item.identity || '-',
          outpatientId: item.opd_id || '-',
          inpatientId: item.inhospital_id || '-',
          name: item.name || '-',
          gender: item.gender === 1 ? '男' : '女',
          age: getAgeFromBirth(item.birth_date),
          diagnosis: item.main_diagnosis || '-',
        }];
      }

      return item.archive_codes.map(code => ({
        recordId: code || '-',
        caseId: item.case_code || '-',
        idNumber: item.identity || '-',
        outpatientId: item.opd_id || '-',
        inpatientId: item.inhospital_id || '-',
        name: item.name || '-',
        gender: item.gender === 1 ? '男' : '女',
        age: getAgeFromBirth(item.birth_date),
        diagnosis: item.main_diagnosis || '-',
      }));
    });
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

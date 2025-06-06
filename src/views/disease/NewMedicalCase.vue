<template>
  <el-card>
    <el-alert
      title="病例是用来记录患者的一次完整病程的所有临床资料，同一个身份证号码会被识别为同一个患者。"
      type="info"
      show-icon
      class="mb-4"
    />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="病例号">
        <el-input v-model="form.caseId" disabled />
        <el-link type="primary" class="ml-2" @click="generateCaseId"> 自动生成 </el-link>
      </el-form-item>

      <el-form-item label="档案号" prop="recordId">
        <el-select v-model="form.recordId" placeholder="请选择">
          <el-option v-for="item in recordOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        <el-icon class="ml-2">
          <el-tooltip content="首次录入的身份证会自动创建患者资料">
            <i class="el-icon-info" />
          </el-tooltip>
        </el-icon>
      </el-form-item>

      <el-form-item label="门诊号">
        <el-input v-model="form.outpatientId" />
      </el-form-item>

      <el-form-item label="住院号">
        <el-input v-model="form.inpatientId" />
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="出生年月">
        <el-date-picker
          v-model="form.birthDate"
          type="month"
          placeholder="选择年月"
          format="YYYY-MM"
          value-format="YYYY-MM"
        />
        <span class="ml-2">{{ calcAge(form.birthDate) }} 岁</span>
      </el-form-item>

      <el-form-item label="联系电话">
        <el-input v-model="form.phone" />
      </el-form-item>

      <el-form-item label="家庭地址">
        <el-input v-model="form.address" />
      </el-form-item>

      <el-form-item label="血型">
        <el-select v-model="form.bloodType" placeholder="请选择">
          <el-option label="A型" value="A" />
          <el-option label="B型" value="B" />
          <el-option label="AB型" value="AB" />
          <el-option label="O型" value="O" />
        </el-select>
      </el-form-item>

      <el-form-item label="主要诊断">
        <el-input v-model="form.diagnosis" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm"> 添加 </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'NewMedicalCase',
  setup() {
    const formRef = ref();
    const form = reactive({
      caseId: '',
      recordId: '',
      idCard: '',
      outpatientId: '',
      inpatientId: '',
      name: '',
      gender: '',
      birthDate: '',
      phone: '',
      address: '',
      bloodType: '',
      diagnosis: '',
    });

    const rules = {
      recordId: [{ required: true, message: '请选择档案号', trigger: 'change' }],
      idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    };

    const recordOptions = ['DA001001', 'DA001002', 'DA001003']; // 示例数据

    const generateCaseId = () => {
      const num = Math.floor(10000000 + Math.random() * 90000000);
      form.caseId = `C${num}`;
    };

    const calcAge = (birth: string) => {
      if (!birth) return '';
      const [year, month] = birth.split('-').map(Number);
      const now = new Date();
      let age = now.getFullYear() - year;
      if (now.getMonth() + 1 < month) age--;
      return age;
    };

    const submitForm = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          ElMessage.success('病例添加成功！');
          console.log('提交表单数据：', { ...form });
          // TODO: 发起后端提交请求
        }
      });
    };

    // 自动生成初始病例号
    generateCaseId();

    return {
      form,
      formRef,
      rules,
      recordOptions,
      generateCaseId,
      submitForm,
      calcAge,
    };
  },
});
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
.mb-4 {
  margin-bottom: 20px;
}
</style>

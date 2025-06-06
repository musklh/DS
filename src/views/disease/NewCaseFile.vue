<template>
  <el-card>
    <el-alert
      title="专病档案相当于病案室里的空间，录入病例之前需要新建专病档案。"
      type="info"
      show-icon
      class="mb-4"
    />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="档案号">
        <el-input v-model="form.code" disabled />
        <el-link type="primary" class="ml-2" @click="generateCode"> 自动生成 </el-link>
      </el-form-item>

      <el-form-item label="档案名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="档案描述" prop="desc">
        <el-input v-model="form.desc" type="textarea" placeholder="请输入" :rows="4" />
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
  name: 'NewCaseFile',
  setup() {
    const formRef = ref();
    const form = reactive({
      code: '', // 档案号
      name: '',
      desc: '',
    });

    const rules = {
      name: [{ required: true, message: '请输入档案名称', trigger: 'blur' }],
      desc: [{ required: true, message: '请输入档案描述', trigger: 'blur' }],
    };

    const generateCode = () => {
      // 生成 B + 6位随机数字
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      form.code = `B${randomNumber}`;
    };

    const submitForm = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          ElMessage.success('档案添加成功！');
          console.log('提交的表单数据：', { ...form });
          // TODO: 调接口或其他逻辑
        }
      });
    };

    // 初始化生成一个档案号
    generateCode();

    return { form, rules, formRef, generateCode, submitForm };
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

<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加模板分类"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { templateCategoryCreate } from '@/api/templateCategory';

const dialogVisible = ref(false);
const formRef = ref();

const form = reactive({
  name: '',
});

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
};

const emit = defineEmits(['success']);

const handleClose = () => {
  dialogVisible.value = false;
  form.name = '';
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    const response = await templateCategoryCreate({ name: form.name });
    if (response?.data?.code === 200) {
      ElMessage.success('添加成功');
      handleClose();
      emit('success');
    } else {
        console.log(response.data)
      ElMessage.error(response?.data?.msg || '添加失败');
    }
  } catch (error) {
    console.error('提交失败：', error);
    ElMessage.error('提交失败，请稍后重试');
  }
};

// 暴露方法给父组件
defineExpose({
  show: () => {
    dialogVisible.value = true;
  }
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 
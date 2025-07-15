<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
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
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { templateCategoryCreate, templateCategoryUpdate } from '../../api/templateCategory';

const dialogVisible = ref(false);
const formRef = ref();
const isEdit = ref(false);
const categoryId = ref<number | null>(null);

const form = reactive({
  name: '',
});

const dialogTitle = computed(() => (isEdit.value ? '编辑模板分类' : '添加模板分类'));

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
  isEdit.value = false;
  categoryId.value = null;
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    let response;
    if (isEdit.value && categoryId.value) {
      response = await templateCategoryUpdate({ id: categoryId.value }, { name: form.name });
    } else {
      response = await templateCategoryCreate({ name: form.name });
    }
    
    // @ts-ignore
    if (response?.data?.code === 200 || response?.status === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功');
      handleClose();
      emit('success');
    } else {
        // @ts-ignore
      ElMessage.error(response?.data?.msg || '操作失败');
    }
  } catch (error) {
    console.error('提交失败：', error);
    ElMessage.error('提交失败，请稍后重试');
  }
};

// 暴露方法给父组件
defineExpose({
  show: (category: { id: number; name: string } | null = null) => {
    if (category) {
      isEdit.value = true;
      categoryId.value = category.id;
      form.name = category.name;
    } else {
      isEdit.value = false;
      categoryId.value = null;
      form.name = '';
    }
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
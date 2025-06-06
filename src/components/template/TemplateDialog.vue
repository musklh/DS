<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="60%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="模版名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入模版名称"/>
      </el-form-item>
      
      <el-form-item label="模版编号" prop="code">
        <el-input v-model="formData.code" placeholder="请输入模版编号"/>
      </el-form-item>

      <el-form-item label="模版描述" prop="description">
        <el-input
          type="textarea"
          v-model="formData.description"
          placeholder="请输入模版描述"
        />
      </el-form-item>

      <el-form-item label="数据项">
        <div class="data-items">
          <div v-for="(item, index) in formData.items" :key="index" class="data-item">
            <el-input v-model="item.name" placeholder="数据项名称" />
            <el-select v-model="item.type" placeholder="数据类型">
              <el-option label="文本" value="text" />
              <el-option label="数字" value="number" />
              <el-option label="日期" value="date" />
              <el-option label="选择" value="select" />
            </el-select>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeItem(index)" />
          </div>
          <el-button type="primary" @click="addItem">添加数据项</el-button>
        </div>
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

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'

interface DataItem {
  name: string
  type: string
}

interface FormData {
  name: string
  code: string
  description: string
  items: DataItem[]
}

export default defineComponent({
  name: 'TemplateDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const formData = reactive<FormData>({
      name: '',
      code: '',
      description: '',
      items: []
    })

    const rules = {
      name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
      code: [{ required: true, message: '请输入模版编号', trigger: 'blur' }]
    }

    const dialogTitle = computed(() => props.type === 'add' ? '添加模版' : '编辑模版')

    const addItem = () => {
      formData.items.push({
        name: '',
        type: 'text'
      })
    }

    const removeItem = (index: number) => {
      formData.items.splice(index, 1)
    }

    const handleClose = () => {
      emit('update:visible', false)
    }

    const handleSubmit = () => {
      console.log('提交表单:', formData)
      handleClose()
    }

    return {
      formData,
      rules,
      dialogTitle,
      addItem,
      removeItem,
      handleClose,
      handleSubmit
    }
  }
})
</script>

<style scoped lang="scss">
.data-items {
  .data-item {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;

    .el-input {
      width: 200px;
    }

    .el-select {
      width: 150px;
    }
  }
}
</style> 
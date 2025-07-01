<template>
  <div class="pagination">
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  emits: ['update:currentPage', 'page-change'],
  setup(props, { emit }) {
    const handlePageChange = (page: number) => {
      emit('update:currentPage', page)
      emit('page-change', page)
    }

    return {
      handlePageChange
    }
  }
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 
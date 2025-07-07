<template>
  <div class="chart-section">
    <h3>图:</h3>
    <div class="chart-box">
      <h4 class="chart-title">{{ chartTitle }}</h4>
      <v-chart 
        :option="echartsOption" 
        autoresize 
        style="width: 100%; height: 260px;" 
        ref="chartRef" 
      />
    </div>
    <el-button size="small" @click="$emit('export-chart')">
      <el-icon><Download /></el-icon>
      保存为图片
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'

defineProps({
  chartTitle: {
    type: String,
    default: ''
  },
  echartsOption: {
    type: Object,
    required: true
  }
})

const chartRef = ref()

defineEmits(['export-chart'])

// 暴露 chartRef 给父组件
defineExpose({
  chartRef
})
</script>

<style scoped>
.chart-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}

.chart-box {
  border: 1px solid #409eff;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: #fdfdfd;
  box-sizing: border-box;
}

.chart-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}
</style> 
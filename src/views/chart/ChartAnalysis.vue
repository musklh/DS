<template>
  <div class="chart-create-container">
    <!-- 顶部导航区域 -->
    <div class="chart-header">
      <div class="chart-types">
        <el-radio-group v-model="currentChart" class="chart-selector">
          <el-radio-button label="bar">
            <img src="@/assets/5-1.png" class="chart-icon" />
            <span>柱状图</span>
          </el-radio-button>
          <el-radio-button label="bar-h">
            <img src="@/assets/5-2.png" class="chart-icon" />
            <span>水平柱状图</span>
          </el-radio-button>
          <el-radio-button label="line">
            <img src="@/assets/5-3.png" class="chart-icon" />
            <span>折线图</span>
          </el-radio-button>
          <el-radio-button label="scatter">
            <img src="@/assets/5-4.png" class="chart-icon" />
            <span>散点图</span>
          </el-radio-button>
          <el-radio-button label="heatmap">
            <img src="@/assets/5-5.png" class="chart-icon" />
            <span>热力图</span>
          </el-radio-button>
          <el-radio-button label="gri">
            <img src="@/assets/5-6.png" class="chart-icon" />
            <span>生存曲线图</span>
          </el-radio-button>
          <el-radio-button label="pie">
            <img src="@/assets/5-7.png" class="chart-icon" />
            <span>饼图</span>
          </el-radio-button>
          <el-radio-button label="grid">
            <img src="@/assets/5-8.png" class="chart-icon" />
            <span>统计三线表</span>
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart-actions">
        <el-button type="primary" @click="saveChart">保存图表</el-button>
        <el-button @click="exportChart">导出图表</el-button>
        <el-button type="danger" @click="resetChart">重置图表</el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="chart-content">
      <!-- 左侧导航 -->
      <div class="sidebar">
        <div class="sidebar-buttons">
          <el-button type="primary" @click="addChart">添加图表</el-button>
          <el-button type="danger" @click="selectCondition">选择病症</el-button>
        </div>
        <el-menu :default-active="activeMenu" class="sidebar-menu">
          <el-menu-item index="data">
            <span>数据</span>
          </el-menu-item>
          <el-submenu index="style">
            <template #title>样式</template>
            <el-menu-item index="style-1">标题样式</el-menu-item>
            <el-menu-item index="style-2">轴线样式</el-menu-item>
            <el-menu-item index="style-3">图形样式</el-menu-item>
          </el-submenu>
          <el-submenu index="attribute">
            <template #title>属性</template>
            <el-menu-item index="attribute-1">显示数值</el-menu-item>
            <el-menu-item index="attribute-2">显示标签</el-menu-item>
            <el-menu-item index="attribute-3">支持分析</el-menu-item>
          </el-submenu>
          <el-menu-item index="animation">
            <span>动画</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 图表预览 -->
      <div class="chart-preview">
        <div v-if="!chartConfig.title" class="preview-placeholder">
          图表预览将在生成后显示...
        </div>
        <component 
          v-else
          :is="currentChartComponent" 
          :config="chartConfig"
          :data="filteredChartData"
          ref="chartComponent"
        />
      </div>

      <!-- 右侧配置面板 -->
      <div class="chart-config">
        <div class="config-header">
          <el-button type="text" @click="toggleConfig('data')">数据</el-button>
          <el-button type="text" @click="toggleConfig('style')">样式</el-button>
          <el-button type="text" @click="toggleConfig('attribute')">属性</el-button>
        </div>
        <el-form label-position="top" v-if="currentConfigTab === 'data'">
          <el-form-item label="字段">
            <el-checkbox-group v-model="chartConfig.selectedFields">
              <el-checkbox label="显示数值" />
              <el-checkbox label="显示标签" />
              <el-checkbox label="支持分析" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="标签样式">
            <el-select v-model="chartConfig.labelStyle" placeholder="选择标签样式">
              <el-option label="学术大小" value="academic" />
              <el-option label="学术黑色" value="black" />
            </el-select>
          </el-form-item>
          <el-form-item label="位置">
            <el-checkbox-group v-model="chartConfig.position">
              <el-checkbox label="显示标记" />
              <el-checkbox label="图形管理" />
              <el-checkbox label="图形打开" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="标签颜色">
            <el-color-picker v-model="chartConfig.labelColor" />
          </el-form-item>
          <el-form-item label="友好样式">
            <el-checkbox-group v-model="chartConfig.friendlyStyle">
              <el-checkbox label="显示规则" />
              <el-checkbox label="图形管理" />
              <el-checkbox label="图形打开" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import BarChart from '../../components/charts/BarChart.vue'
import LineChart from '../../components/charts/LineChart.vue'
import PieChart from '../../components/charts/PieChart.vue'
import ScatterChart from '../../components/charts/ScatterChart.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ChartCreate',
  components: {
    BarChart,
    LineChart,
    PieChart,
    ScatterChart
  },
  setup() {
    const router = useRouter()
    const currentChart = ref('bar')
    const activeMenu = ref('data')
    const currentConfigTab = ref('data')
    const chartComponent = ref(null)

    const chartConfig = ref({
      title: '',
      xAxis: '',
      yAxis: '',
      selectedFields: [],
      labelStyle: 'academic',
      position: [],
      labelColor: '#000',
      friendlyStyle: []
    })

    const dataFields = ref([
      '年龄',
      '血压',
      '血糖',
      '胆固醇',
      '白细胞计数',
      '心率',
      '体重',
      '身高'
    ])

    const chartData = ref([
      { age: 25, bloodPressure: 120, glucose: 5.2, cholesterol: 180, wbc: 7.2, heartRate: 70, weight: 65, height: 170 },
      { age: 30, bloodPressure: 125, glucose: 5.5, cholesterol: 190, wbc: 6.8, heartRate: 72, weight: 70, height: 175 },
      { age: 35, bloodPressure: 130, glucose: 5.8, cholesterol: 200, wbc: 7.5, heartRate: 75, weight: 75, height: 180 },
      { age: 40, bloodPressure: 135, glucose: 6.0, cholesterol: 210, wbc: 8.0, heartRate: 78, weight: 80, height: 178 },
      { age: 45, bloodPressure: 140, glucose: 6.2, cholesterol: 220, wbc: 8.5, heartRate: 80, weight: 85, height: 182 }
    ])

    const filteredChartData = computed(() => {
      if (!chartConfig.value.xAxis || !chartConfig.value.yAxis) return chartData.value
      return chartData.value.map(item => ({
        [chartConfig.value.xAxis]: item[chartConfig.value.xAxis],
        [chartConfig.value.yAxis]: item[chartConfig.value.yAxis]
      }))
    })

    const currentChartComponent = computed(() => {
      const chartMap = {
        bar: 'BarChart',
        'bar-h': 'BarChart',
        line: 'LineChart',
        pie: 'PieChart',
        scatter: 'ScatterChart',
        heatmap: 'ScatterChart',
        grid: 'BarChart',
        gri: 'LineChart'
      }
      return chartMap[currentChart.value]
    })

    const toggleConfig = (tab: string) => {
      currentConfigTab.value = tab
    }

    const addChart = () => {
      if (!chartConfig.value.selectedFields.length) {
        alert('请至少选择一个字段！')
        return
      }
      chartConfig.value.title = '新图表'
      chartConfig.value.xAxis = 'age'
      chartConfig.value.yAxis = chartData.value[0] && Object.keys(chartData.value[0])[1] || 'bloodPressure'
    }

    const saveChart = async () => {
      if (!chartConfig.value.title) {
        alert('请先添加图表！')
        return
      }
      try {
        const response = await fetch('/api/save-chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: currentChart.value,
            config: chartConfig.value,
            data: filteredChartData.value
          })
        })
        if (response.ok) {
          alert('图表保存成功！')
          router.push('/chart-display')
        } else {
          throw new Error('保存失败')
        }
      } catch (error) {
        alert('保存图表失败：' + error.message)
      }
    }

    const exportChart = async () => {
      if (!chartConfig.value.title) {
        alert('请先添加图表！')
        return
      }
      try {
        // Assuming the chart component has a method to get the image URL
        const imageUrl = chartComponent.value?.getImageUrl?.()
        if (imageUrl) {
          const link = document.createElement('a')
          link.href = imageUrl
          link.download = `${chartConfig.value.title}.png`
          link.click()
        } else {
          throw new Error('无法导出图表')
        }
      } catch (error) {
        alert('导出图表失败：' + error.message)
      }
    }

    const resetChart = () => {
      chartConfig.value = {
        title: '',
        xAxis: '',
        yAxis: '',
        selectedFields: [],
        labelStyle: 'academic',
        position: [],
        labelColor: '#000',
        friendlyStyle: []
      }
    }

    const selectCondition = () => {
      alert('选择病症功能待实现！')
    }

    return {
      currentChart,
      activeMenu,
      currentConfigTab,
      chartConfig,
      dataFields,
      chartData,
      filteredChartData,
      currentChartComponent,
      toggleConfig,
      addChart,
      saveChart,
      exportChart,
      resetChart,
      selectCondition,
      chartComponent
    }
  }
})
</script>

<style scoped lang="scss">
.chart-selector {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  .el-radio-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 15px;
    min-width: 100px;

    span {
      display: block;
      width: 100%;
      text-align: center;
    }
  }

  .chart-icon {
    width: 64px;
    height: 64px;
    margin-top: 16px;
  }
}

.chart-create-container {
  padding: 20px;
  background: #DEDCC7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 20px;

    .chart-types {
      .el-radio-group {
        .el-radio-button {
          margin-right: 5px;
        }
      }
    }

    .chart-actions {
      .el-button {
        margin-left: 10px;
      }
    }
  }

  .chart-content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .sidebar {
      width: 200px;
      background: #fff;
      padding: 10px;
      border-right: 1px solid #e9e9e9;

      .sidebar-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;

        .el-button {
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          box-sizing: border-box;
          font-size: 14px;
          line-height: 1;
          margin: 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }

      .sidebar-menu {
        border-right: none;
      }
    }

    .chart-preview {
      flex: 1;
      background: #fff;
      padding: 20px;
      border: 1px solid #e9e9e9;
      margin: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      .preview-placeholder {
        color: #999;
        font-size: 16px;
      }
    }

    .chart-config {
      width: 200px;
      background: #fff;
      padding: 10px;
      border-left: 1px solid #e9e9e9;

      .config-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        .el-button {
          color: #333;
          &.is-active {
            color: #409EFF;
            border-bottom: 2px solid #409EFF;
          }
        }
      }

      .el-form-item {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
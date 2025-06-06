<template>
    <div class="case-panel-root">
      <!-- 顶部四个按钮改为组件 -->
      <TabSelector :activeTab="activeTab" @update:activeTab="goTab" />
  
    <!-- 根据 activeTab 动态切换组件 -->
    <component :is="currentComponent" />

    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import TabSelector from './TabSelector.vue'
  import CaseCard from './CaseCard.vue'
  import CaseTable from './CaseTable.vue'
  import NewCaseFile from './NewCaseFile.vue'
  import NewMedicalCase from './NewMedicalCase.vue'
  export default defineComponent({
    name: 'DiseaseCasePanel',
    components: {
      TabSelector,
      CaseCard,
      CaseTable,
      NewCaseFile,
      NewMedicalCase
    },
    setup() {
      const activeTab = ref(0)
  
      const goTab = (idx: number) => {
        activeTab.value = idx
        }
  
      // 动态组件映射
      const currentComponent = computed(() => {
        switch (activeTab.value) {
          case 0:
            return 'CaseCard'
          case 1:
            return 'NewCaseFile'
          case 2:
            return 'CaseTable'
          case 3:
            return 'NewMedicalCase'
          default:
            return 'CaseCard' // 其他 tab 也默认显示 Card，你可以扩展其他组件
        }
      })
  
      return { activeTab, goTab, currentComponent }
    }
  })
  </script>
  
  
  <style scoped lang="scss">
  .case-panel-root {
    width: 100%;
    min-height: 100vh;
    background: #f5f8f9;
    padding: 32px 40px;
  }
  .case-panel-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    min-width: 480px;
  
    .card-title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
    }
  
    .card-desc {
      color: #888;
      font-size: 16px;
      max-width: 420px;
    }
  
    .card-count {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 40px;
  
      .count-label {
        color: #888;
        font-size: 15px;
        margin-bottom: 6px;
      }
  
      .count-num {
        color: #a94442;
        font-size: 48px;
        font-weight: bold;
      }
    }
  }
  </style>
  
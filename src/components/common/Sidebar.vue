<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :router="true"
      @select="handleSelect"
    >
      <el-menu-item index="/dashboard/help">
        <img src="@/assets/1.png" class="menu-icon" />
        <span>使用帮助</span>
      </el-menu-item>

      <el-sub-menu index="data">
        <template #title>
          <img src="@/assets/2.png" class="menu-icon" />
          <span>数据维护</span>
        </template>
        <el-menu-item index="/dashboard/system"> 系统词条 </el-menu-item>
        <el-menu-item index="/dashboard/template"> 临床模板 </el-menu-item>
        <!--         <el-menu-item index="/dashboard/calculation">计算属性</el-menu-item>  -->
        <el-menu-item index="/dashboard/disease"> 专病数据 </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="patient">
        <template #title>
          <img src="@/assets/p.png" class="menu-icon" />
          <span>患者管理</span>
        </template>
        <el-menu-item index="/dashboard/patient-list"> 患者列表 </el-menu-item>
        <el-menu-item index="/dashboard/data-entry"> 数据录入 </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="data-analysis">
          <template #title>
            <img src="@/assets/4.png" class="menu-icon" />
            <span>数据分析</span>
          </template>
          <el-menu-item index="/dashboard/DataAnalysisView"> 数据可视化 </el-menu-item>
        </el-sub-menu>

    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const route = useRoute();
    const activeMenu = ref(route.path);

    const handleSelect = (index: string) => {
      activeMenu.value = index;
    };

    return {
      activeMenu,
      handleSelect,
    };
  },
});
</script>

<style scoped lang="scss">
.sidebar {
  width: 200px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e6e6e6;

  .sidebar-menu {
    border-right: none;

    :deep(.el-menu-item) {
      &.is-active {
        background-color: #ecf5ff;
      }
    }
  }
}
.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>

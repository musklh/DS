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
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/appStore'; // Import app store

export default defineComponent({
  name: 'Sidebar',
  emits: ['navigate'], // Declare the event
  setup(props, { emit }) { // Destructure emit from context
    const route = useRoute();
    const appStore = useAppStore();
    const activeMenu = ref(route.path);

    // Watch for route changes to update activeMenu, especially if navigation happens outside sidebar clicks
    watch(() => route.path, (newPath) => {
      activeMenu.value = newPath;
    });

    const handleSelect = (index: string) => {
      // activeMenu.value = index; // el-menu handles this internally when :default-active is bound
      // If el-menu :router="true", navigation is handled automatically.
      // If not, you would do router.push(index) here.
      if (appStore.isMobile) { // Only emit navigate if on mobile to close drawer
        emit('navigate');
      }
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
  width: 100%; // Take full width of its container (desktop-sidebar or drawer)
  height: 100%;
  background: var(--sidebar-background, #fff); // Use CSS variable
  border-right: 1px solid var(--border-color); // Use CSS variable

  .sidebar-menu {
    border-right: none; // el-menu's own border is not needed if sidebar div has one
    height: 100%; // Ensure menu takes full height for scrolling if needed

    :deep(.el-menu-item), :deep(.el-sub-menu__title) {
      &:hover {
        background-color: #f5f7fa; // A generic hover color
      }
    }

    :deep(.el-menu-item) {
      &.is-active {
        color: var(--primary-color); // Use primary color for active item text
        background-color: #e6f7ff; // A light blue background for active item
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

<template>
  <div class="app-wrapper" :class="{ 'mobile-layout': appStore.isMobile, 'sidebar-collapsed': !appStore.sidebarOpened && !appStore.isMobile }">
    <Header />
    <div class="main-container">
      <!-- Desktop Sidebar -->
      <Sidebar
        v-if="!appStore.isMobile && appStore.sidebarOpened"
        class="sidebar-container desktop-sidebar"
      />
      <!-- Mobile Drawer Sidebar -->
      <el-drawer
        v-if="appStore.isMobile"
        v-model="appStore.sidebarOpened"
        title="导航"
        direction="ltr"
        :with-header="false"
        size="240px"
        custom-class="mobile-sidebar-drawer"
        @close="appStore.closeSidebar"
      >
        <Sidebar @navigate="appStore.closeSidebar" />
      </el-drawer>

      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, computed } from 'vue';
import Header from '../components/common/Header.vue';
import Sidebar from '../components/common/Sidebar.vue';
import { useAppStore } from '@/stores/appStore'; // Assuming alias '@' is src

export default defineComponent({
  name: 'Layout',
  components: {
    Header,
    Sidebar,
  },
  setup() {
    const appStore = useAppStore();

    const handleResize = () => {
      appStore.checkIsMobile();
    };

    onMounted(() => {
      appStore.checkIsMobile(); // Initial check
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    // Expose store to template
    return {
      appStore,
    };
  },
});
</script>

<style scoped lang="scss">
.app-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.28s; // For desktop sidebar collapse animation

  .main-container {
    flex: 1;
    display: flex;
    overflow: hidden; // Important for main content scrolling

    .desktop-sidebar {
      width: 200px; // Default width for desktop sidebar
      height: 100%;
      transition: width 0.28s;
      flex-shrink: 0; // Prevent sidebar from shrinking
    }

    .main-content {
      flex: 1;
      overflow-y: auto; // Allow vertical scrolling for content
      overflow-x: hidden; // Prevent horizontal scrolling in main content by default
      // background: #f0f2f5; // Already set in global styles or can be here
      transition: margin-left 0.28s; // Match sidebar animation
      // padding: 20px; // Now in global style.scss for .main-content
    }
  }
}

// Styles for when desktop sidebar is collapsed (example, if you implement collapse feature)
.app-wrapper.sidebar-collapsed {
  .desktop-sidebar {
    width: 0; // Or a smaller width like 54px if showing icons only
  }
  // .main-content might need margin-left adjustment if sidebar is not display:none
}

// Styles specific to mobile layout
.app-wrapper.mobile-layout {
  .main-container {
    .desktop-sidebar {
      display: none; // Hide desktop sidebar container on mobile
    }
    .main-content {
      margin-left: 0; // Main content takes full width on mobile
      width: 100%;
    }
  }
}

// Element Plus Drawer Customization (if needed)
:global(.mobile-sidebar-drawer) {
  .el-drawer__body {
    padding: 0 !important; // Remove default padding if Sidebar component handles it
  }
}
</style>

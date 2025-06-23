<template>
  <header class="header">
    <div class="left-controls">
      <img
        v-if="appStore.isMobile"
        src="@/assets/m.png"
        alt="Menu"
        class="hamburger-icon menu-icon"
        @click="toggleMobileSidebar"
      />
      <div class="logo">
        <img src="@/assets/logo-1.png" alt="logo" class="logo-img"/>
        <span class="logo-text desktop-logo-text hidden-xs">临床专病信息管理系统</span>
        <span class="logo-text mobile-logo-text hidden-sm-up">专病系统</span>
      </div>
    </div>
    <div class="right-menu">
      <!-- <span class="username hidden-xs">{{ username }}</span> -->
      <img src="@/assets/out.png" alt="Logout" class="menu-icon logout-icon" @click="logout" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginUserStore } from '../../stores/LoginStore'; // 确保路径正确
import { useAppStore } from '@/stores/appStore'; // 引入 app store

export default defineComponent({
  name: 'Header',
  setup() {
    const router = useRouter();
    const loginUserStore = useLoginUserStore();
    const appStore = useAppStore(); // 使用 app store

    const username = computed(() => loginUserStore.loginUser);

    const logout = () => {
      loginUserStore.logoutUser();
      router.push('/login');
    };

    const toggleMobileSidebar = () => {
      appStore.toggleSidebar();
    };

    return {
      logout,
      username,
      appStore, // 暴露 appStore 以在模板中使用 isMobile
      toggleMobileSidebar,
    };
  },
});
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  background-color: var(--header-background, #fff); // Use CSS variable
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08); // Softer shadow
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px; // Adjusted padding for better mobile spacing
  border-bottom: 1px solid var(--border-color); // Consistent border
}

.left-controls {
  display: flex;
  align-items: center;
}

.hamburger-icon {
  cursor: pointer;
  margin-right: 10px; // Space between hamburger and logo
}

.logo {
  display: flex;
  align-items: center;
  .logo-img {
    height: 32px; // Slightly smaller logo for a sleeker look
    margin-right: 8px;
  }
  .logo-text {
    font-size: 18px; // Keep consistent font size
    font-weight: 600; // Consistent with global h styles
    color: var(--text-color);
  }
  .mobile-logo-text {
    font-size: 16px; // Slightly smaller for mobile if needed
  }
}

.right-menu {
  display: flex;
  align-items: center;
  gap: 15px; // Adjusted gap

  .username {
    color: var(--text-color);
    font-size: 14px;
  }
}

.menu-icon {
  width: 24px; // Smaller, more modern icon size
  height: 24px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
}
.logout-icon {
 // Specific styles if logout icon needs to be different from hamburger
}

// Use global utility classes for showing/hiding elements
// .hidden-xs is defined in style.scss for: @media (max-width: 767px) { display: none !important; }
// .hidden-sm-up is defined in style.scss for: @media (min-width: 768px) { display: none !important; }
</style>

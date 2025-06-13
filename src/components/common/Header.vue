<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logo-1.png" alt="logo" />
      <span>临床专病信息管理系统</span>
    </div>
    <div class="right-menu">
      <img src="@/assets/m.png" class="menu-icon" />
      <!--       <span class="username">{{ username }}</span> -->
      <img src="@/assets/out.png" class="menu-icon" @click="logout" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'; // Import computed
import { useRouter } from 'vue-router';
import { useLoginUserStore } from '@/stores/LoginStore.ts'; // 确保路径正确

export default defineComponent({
  name: 'Header',
  setup() {
    const router = useRouter();
    const loginUserStore = useLoginUserStore();

    // Expose username to the template, reactively
    const username = computed(() => loginUserStore.loginUser);

    //退出登录逻辑
    const logout = () => {
      loginUserStore.logoutUser(); // 调用封装好的 `logoutUser` 方法
      router.push('/login');
    };

    return {
      logout,
      username, // Return username
    };
  },
});
</script>

<style scoped lang="scss">
.menu-icon {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}

.header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .logo {
    display: flex;
    align-items: center;

    img {
      height: 40px;
      margin-right: 10px;
    }

    span {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .username {
      color: #666;
    }
  }
}
</style>

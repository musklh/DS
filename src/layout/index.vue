<template>
  <div class="app-wrapper">
    <Header />
    <div class="main-container">
      <Sidebar class="sidebar-container" />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../components/common/Header.vue'
import Sidebar from '../components/common/Sidebar.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    Header,
    Sidebar
  }
})
</script>

<style scoped lang="scss">
.app-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .main-container {
    flex: 1;
    display: flex;
    overflow: hidden;

    .sidebar-container {
      width: 200px;
      height: 100%;
    }

    .main-content {
      flex: 1;
      overflow: auto;
      background: #f0f2f5;
    }
  }
}
</style> 
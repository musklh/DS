<template>
  <div class="help-container">
    <el-card class="help-image-card">
      <img src="../assets/help.png" alt="帮助文档" class="help-image" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Help'
})
</script>

<style scoped lang="scss">
.help-container {
  padding: 20px;

  .help-image-card {
    text-align: center;
    padding: 20px;
  }

  .help-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>

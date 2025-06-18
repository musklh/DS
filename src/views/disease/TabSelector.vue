<template>
  <div class="case-panel-tabs">
    <el-button
      :type="activeTab === 0 ? 'primary' : 'default'"
      class="tab-btn"
      @click="handleClick(0)"
    >
      <span class="tab-icon"><img src="../../assets/d-1.png" alt="图标" /></span>
      专病档案
    </el-button>
    <el-button
      :type="activeTab === 1 ? 'primary' : 'default'"
      class="tab-btn"
      @click="handleClick(1)"
    >
      <span class="tab-icon"><img src="../../assets/d-2.png" alt="图标" /></span>
      新建档案
    </el-button>
    <el-button
      :type="activeTab === 2 ? 'primary' : 'default'"
      class="tab-btn"
      @click="handleClick(2)"
    >
      <span class="tab-icon"><img src="../../assets/d-3.png" alt="图标" /></span>
      全部病例
    </el-button>
    <el-button
      :type="activeTab === 3 ? 'primary' : 'default'"
      class="tab-btn"
      @click="handleClick(3)"
    >
      <span class="tab-icon"><img src="../../assets/d-4.png" alt="图标" /></span>
      新建病例
    </el-button>
    <!-- Removed extra closing </div> -->
  </div>
</template>

<script>
export default {
  name: 'TabSelector',
  props: {
    activeTab: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:activeTab'],
  methods: {
    handleClick(index) {
      this.$emit('update:activeTab', index);
    },
  },
};
</script>

<style scoped>
.case-panel-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.tab-btn {
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 12px;
}
.tab-icon {
  display: flex;
  align-items: center;
  margin-right: 6px;
}
.tab-icon img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
</style>

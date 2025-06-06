<template>
  <div class="case-panel-tabs">
    <el-button
      :type="activeTab === 0 ? 'primary' : 'default'"
      class="tab-btn"
      icon="el-icon-folder"
      @click="handleClick(0)"
    >
      专病档案
    </el-button>
    <el-button
      :type="activeTab === 1 ? 'primary' : 'default'"
      class="tab-btn"
      icon="el-icon-document-add"
      @click="handleClick(1)"
    >
      新建档案
    </el-button>
    <el-button
      :type="activeTab === 2 ? 'primary' : 'default'"
      class="tab-btn"
      icon="el-icon-files"
      @click="handleClick(2)"
    >
      全部病例
    </el-button>
    <el-button
      :type="activeTab === 3 ? 'primary' : 'default'"
      class="tab-btn"
      icon="el-icon-edit"
      @click="handleClick(3)"
    >
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
}
</style>

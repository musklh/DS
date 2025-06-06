<template>
    <div class="case-panel-card">
      <div>
        <div class="card-title">肝移植手术档案</div>
        <div class="card-desc">
          收录因各种原发性疾病导致肝功能衰竭，实施肝移植手术后的病情情况。对术前和术后、以及移植后生存预后进行系统性分析。
        </div>
      </div>
      <div class="card-count">
        <div class="count-label">总共病例数</div>
        <div class="count-num">78</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // 无需 props，静态写死数据
  </script>
  
  <style scoped lang="scss">
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
  
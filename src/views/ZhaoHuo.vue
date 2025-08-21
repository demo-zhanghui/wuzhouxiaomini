<template>
  <div class="zhaohuo-container">
    <div class="placeholder-content">
      <van-icon name="search" size="64" color="#667eea" />
      <h2>找货页面</h2>
      <p>货源搜索和筛选功能</p>
      <p class="sub-text">敬请期待...</p>
    </div>
  </div>
</template>

<script setup>
// 找货页面占位符
</script>

<style scoped>
.zhaohuo-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.placeholder-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.placeholder-content h2 {
  margin: 20px 0 10px;
  color: #323233;
  font-size: 24px;
  font-weight: bold;
}

.placeholder-content p {
  color: #646566;
  margin: 8px 0;
  font-size: 16px;
}

.sub-text {
  font-size: 14px;
  opacity: 0.7;
  margin-top: 20px;
}
</style>

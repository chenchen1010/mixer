<template>
  <div class="control-panel">
    <el-card class="control-card">
      <template #header>
        <div class="control-header">
          <h2>控制面板</h2>
        </div>
      </template>
      <div class="control-content">
        <el-button type="primary" :disabled="!hasSelectedFolder" @click="startMixing">
          开始混剪
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hasSelectedFolder = ref(false)

const startMixing = () => {
  // TODO: 实现混剪功能
}
</script>

<style scoped>
.control-panel {
  width: 100%;
}

.control-card {
  border-radius: 10px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.control-content {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style> 
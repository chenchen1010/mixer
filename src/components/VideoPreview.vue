<template>
  <div class="video-preview">
    <el-card class="preview-card">
      <template #header>
        <div class="preview-header">
          <h2>预览区域</h2>
        </div>
      </template>
      <div class="preview-content">
        <el-empty v-if="!hasVideos" description="暂无视频" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hasVideos = ref(false)
</script>

<style scoped>
.video-preview {
  width: 100%;
  min-height: 300px;
}

.preview-card {
  height: 100%;
  border-radius: 10px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.preview-content {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 
<template>
  <div class="folder-selector">
    <el-card class="folder-card">
      <div class="folder-header">
        <h2>选择素材文件夹</h2>
        <el-button type="primary" @click="selectFolder">
          选择文件夹
        </el-button>
      </div>
      <div v-if="selectedPath" class="selected-path">
        <el-icon><Folder /></el-icon>
        <span>{{ selectedPath }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const selectedPath = ref('')
const emit = defineEmits(['folder-selected'])

const selectFolder = async () => {
  try {
    const result = await window.electronAPI.selectFolder()
    if (result.canceled) return
    selectedPath.value = result.filePaths[0]
    emit('folder-selected', selectedPath.value)
    ElMessage.success('文件夹选择成功')
  } catch (error) {
    console.error('选择文件夹失败:', error)
    ElMessage.error('选择文件夹失败')
  }
}
</script>

<style scoped>
.folder-selector {
  width: 100%;
}

.folder-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.folder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.folder-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.selected-path {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: var(--app-background);
  border-radius: 6px;
  color: #666;
}
</style> 
<template>
  <div class="video-preview">
    <el-card class="preview-card">
      <template #header>
        <div class="preview-header">
          <h2>预览区域</h2>
          <span class="folder-count" v-if="folders.length">
            共 {{ folders.length }} 个文件夹
          </span>
        </div>
      </template>
      <div class="preview-content">
        <el-empty v-if="!folders.length" description="暂无文件夹" />
        <el-scrollbar v-else height="300px">
          <div class="folder-list">
            <div v-for="folder in folders" :key="folder.path" class="folder-item">
              <el-card shadow="hover" class="folder-card">
                <div class="folder-info">
                  <el-icon><Folder /></el-icon>
                  <span class="folder-name">{{ folder.name }}</span>
                  <el-tag size="small" type="info" class="video-count">
                    {{ folder.videoCount }} 个视频
                  </el-tag>
                </div>
              </el-card>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  selectedPath: {
    type: String,
    default: ''
  }
})

const folders = ref([])

watch(() => props.selectedPath, async (newPath) => {
  console.log('Selected path changed:', newPath)
  if (!newPath) {
    folders.value = []
    return
  }

  try {
    const result = await window.electronAPI.getFolderInfo(newPath)
    console.log('Folder info result:', result)
    folders.value = result
  } catch (error) {
    console.error('获取文件夹信息失败:', error)
    ElMessage.error('获取文件夹信息失败')
  }
}, { immediate: true })
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
}

.folder-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  width: 100%;
}

.folder-item {
  transition: transform 0.2s;
  width: 100%;
}

.folder-item:hover {
  transform: translateY(-2px);
}

.folder-card {
  width: 100%;
}

.folder-info {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.folder-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-count {
  margin-left: auto;
}
</style> 
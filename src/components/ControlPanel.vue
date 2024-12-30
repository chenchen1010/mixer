<template>
  <div class="control-panel">
    <el-card class="control-card">
      <template #header>
        <div class="control-header">
          <h2>控制面板</h2>
        </div>
      </template>
      <div class="control-content">
        <el-button 
          type="primary" 
          :loading="mixing" 
          :disabled="!folders.length"
          @click="startMixing"
        >
          {{ mixing ? `混剪中 ${progress}%` : '开始混剪' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  folders: {
    type: Array,
    required: true
  }
})

const mixing = ref(false)
const progress = ref(0)

// 创建进度监听器
let progressHandler = null

onMounted(() => {
  progressHandler = (data) => {
    progress.value = data.percent
  }
  window.electronAPI.onMixingProgress(progressHandler)
})

onUnmounted(() => {
  // 清理监听器
  if (progressHandler) {
    window.electronAPI.onMixingProgress(progressHandler)
  }
})

const startMixing = async () => {
  if (!props.folders.length) return
  
  mixing.value = true
  progress.value = 0
  
  try {
    // 只传递必要的路径信息
    const folderPaths = props.folders.map(folder => ({
      path: folder.path
    }))
    const outputPath = await window.electronAPI.startMixing(folderPaths)
    ElMessage.success(`混剪完成！输出文件：${outputPath}`)
  } catch (error) {
    console.error('混剪失败:', error)
    ElMessage.error('混剪失败')
  } finally {
    mixing.value = false
  }
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
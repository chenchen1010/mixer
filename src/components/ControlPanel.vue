<template>
  <div class="control-panel">
    <el-card class="control-card">
      <template #header>
        <div class="control-header">
          <h2>控制面板</h2>
        </div>
      </template>
      <div class="control-content">
        <div class="settings-section">
          <div class="output-section">
            <el-input
              v-model="outputPath"
              placeholder="输出文件夹路径"
              readonly
            >
              <template #append>
                <el-button @click="selectOutputPath">
                  选择输出位置
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="count-section">
            <span class="label">输出数量：</span>
            <el-input-number 
              v-model="outputCount" 
              :min="1" 
              size="default"
            />
            <el-tooltip 
              content="可以设置任意数量，视频可能会重复使用" 
              placement="top"
            >
              <el-icon class="info-icon"><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </div>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  folders: {
    type: Array,
    required: true
  }
})

const mixing = ref(false)
const progress = ref(0)
const outputPath = ref('')
const outputCount = ref(1)

// 计算最大可输出数量
const maxOutputCount = computed(() => {
  if (!props.folders.length) return 1
  return Math.min(...props.folders.map(f => f.videoCount))
})

// 监听输出数量变化，确保不超过最大值
watch(() => maxOutputCount.value, (newMax) => {
  if (outputCount.value > newMax) {
    outputCount.value = newMax
  }
})

const selectOutputPath = async () => {
  try {
    const result = await window.electronAPI.selectOutputFolder()
    if (!result.canceled) {
      outputPath.value = result.filePaths[0]
    }
  } catch (error) {
    console.error('选择输出文件夹失败:', error)
    ElMessage.error('选择输出文件夹失败')
  }
}

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
    const folderPaths = props.folders.map(folder => ({
      path: folder.path
    }))
    await window.electronAPI.startMixing(
      folderPaths, 
      outputPath.value,
      outputCount.value
    )
    ElMessage.success(`混剪完成！已输出 ${outputCount.value} 个视频`)
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

.settings-section {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.output-section {
  width: 100%;
}

.count-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  color: #606266;
  font-size: 14px;
}

.info-icon {
  color: #909399;
  cursor: help;
}

.control-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
}
</style> 
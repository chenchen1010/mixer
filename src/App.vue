<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="title-bar">
        <h1>Video Mixer</h1>
      </div>
    </el-header>
    
    <el-main class="app-main">
      <FolderSelector @folder-selected="handleFolderSelected" />
      <VideoPreview :selected-path="selectedFolder" />
      <ControlPanel />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import FolderSelector from './components/FolderSelector.vue'
import VideoPreview from './components/VideoPreview.vue'
import ControlPanel from './components/ControlPanel.vue'

const selectedFolder = ref('')

const handleFolderSelected = (path) => {
  selectedFolder.value = path
}
</script>

<style>
:root {
  --app-background: #f5f5f7;
  --header-background: rgba(255, 255, 255, 0.8);
  --border-color: #e4e4e4;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--app-background);
}

.app-container {
  height: 100vh;
  background-color: var(--app-background);
}

.app-header {
  backdrop-filter: blur(10px);
  background-color: var(--header-background);
  border-bottom: 1px solid var(--border-color);
  -webkit-app-region: drag;
}

.title-bar {
  text-align: center;
  padding: 8px 0;
}

.title-bar h1 {
  margin: 0;
  font-size: 16px;
  color: #1d1d1f;
  font-weight: 500;
}

.app-main {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

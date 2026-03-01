<template>
  <div class="app-container">
    <AppSidebar />

    <main class="main-content">
      <AppTopbar />

      <div class="content-area">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content-area {
  padding: 35px;
  overflow-y: auto;
  height: 100%;
}
</style>

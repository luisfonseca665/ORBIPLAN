<template>
  <header class="topbar">
    <div class="topbar-left">
      <span class="workspace-name">Espacio de Trabajo / Principal</span>
    </div>
    <div class="topbar-right">
      <div class="user-mini-profile">
        <span class="avatar-small">LF</span>
      </div>
      <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped>
.topbar {
  background-color: white;
  padding: 15px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}
.workspace-name {
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.avatar-small {
  background: #3b82f6;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}
.btn-logout {
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.btn-logout:hover {
  background: #fef2f2;
}
</style>

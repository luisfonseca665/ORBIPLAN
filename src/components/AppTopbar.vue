<template>
  <header class="topbar">
    <div class="topbar-left">
      <span class="workspace-name">Espacio de Trabajo / Principal</span>
    </div>
    <div class="topbar-right">
      <div class="user-mini-profile">
        <img v-if="usuarioFoto" :src="usuarioFoto" class="avatar-small-img" />
        <span v-else class="avatar-small">{{ iniciales }}</span>
      </div>
      <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const usuarioNombre = ref(localStorage.getItem('usuarioNombre') || '')
const usuarioFoto = ref(localStorage.getItem('usuarioFoto') || '')

const iniciales = computed(() => {
  if (!usuarioNombre.value) return '??'
  return usuarioNombre.value.split(' ').map(p => p[0]).join('').substring(0,2).toUpperCase()
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuarioNombre')
  localStorage.removeItem('usuarioRol')
  localStorage.removeItem('usuarioFoto')
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
  flex-shrink: 0;
}
.avatar-small-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
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

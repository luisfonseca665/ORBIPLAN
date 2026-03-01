<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="sidebar">
    <div class="logo">
      <h2>ORBIPLAN</h2>
    </div>
    <nav>
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/archivos">Mis Archivos</RouterLink>
      <RouterLink to="/tareas">Mis Tareas</RouterLink>
      <RouterLink to="/notas">Mis Notas</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0,0,0,0.05);
  z-index: 10;
}
.logo {
  padding: 25px 20px;
  text-align: center;
  border-bottom: 1px solid #334155;
}
.logo h2 { margin: 0; font-weight: 700; letter-spacing: 1px; }
nav { display: flex; flex-direction: column; padding: 20px 0; gap: 5px; }
nav a {
  color: #94a3b8;
  text-decoration: none;
  padding: 12px 25px;
  transition: all 0.2s;
  font-weight: 500;
  border-left: 4px solid transparent;
}
nav a:hover, nav a.router-link-exact-active {
  background-color: #334155;
  color: white;
  border-left: 4px solid #3b82f6;
}
</style>

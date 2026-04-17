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
/* Contenedor principal de la aplicación */
.app-container {
  display: flex;
  height: 100vh;
  /* Tipografía limpia y moderna */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  /* Fondo minimalista cálido para toda la interfaz */
  background-color: #FAFAF9;
  /* Color de texto principal (Espresso) */
  color: #3E2C25;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Área donde cambian las vistas (Dashboard, Notas, etc.) */
.content-area {
  padding: 40px; /* Un poco más de espacio para que "respire" el diseño */
  overflow-y: auto;
  height: 100%;
  scroll-behavior: smooth;
}

/* --- Scrollbar Minimalista para el contenido --- */
.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: transparent;
}

.content-area::-webkit-scrollbar-thumb {
  background-color: #E8E6E1;
  border-radius: 10px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background-color: #D1CEC7;
}

/* Responsividad para que no se vea apretado en móviles */
@media (max-width: 768px) {
  .content-area {
    padding: 24px 20px;
  }
}
</style>
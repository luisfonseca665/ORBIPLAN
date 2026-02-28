<script setup>
import { ref } from 'vue';

const mostrarModal = ref(false);
const nuevaNota = ref({ titulo: '', contenido: '' });

const guardarNota = () => {
  alert(`Nota creada: ${nuevaNota.value.titulo}`);
  mostrarModal.value = false;
  nuevaNota.value = { titulo: '', contenido: '' };
};
</script>

<template>
  <div class="notas-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Notas</h1>
        <p class="subtitle">Bloc digital para apuntes e ideas</p>
      </div>
      <button class="btn-primary" @click="mostrarModal = true">+ Nueva Nota</button>
    </div>

    <div class="grid-notas">
      <div class="nota-card">
        <h3>Idea de Proyecto</h3>
        <p>Necesitamos investigar librerías para gráficos estadísticos en Vue...</p>
        <span class="fecha">Hoy</span>
      </div>
    </div>

    <div class="modal-overlay" v-if="mostrarModal">
      <div class="modal-content">
        <h2>Crear Apunte</h2>
        
        <div class="form-group">
          <input type="text" v-model="nuevaNota.titulo" placeholder="Título de la nota" class="form-control input-titulo">
        </div>
        <div class="form-group">
          <textarea v-model="nuevaNota.contenido" placeholder="Escribe tus ideas aquí..." class="form-control textarea-nota" rows="6"></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn-text" @click="mostrarModal = false">Cancelar</button>
          <button class="btn-primary" @click="guardarNota">Guardar Nota</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { margin: 0; color: #0f172a; font-size: 1.8rem; }
.subtitle { margin: 5px 0 20px 0; color: #64748b; }
.header-actions { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
.btn-primary { background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }

.grid-notas { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.nota-card { background: #fef9c3; padding: 20px; border-radius: 12px; box-shadow: 2px 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #facc15; }
.nota-card h3 { margin: 0 0 10px 0; color: #1f2937; }
.nota-card p { font-size: 0.9rem; color: #4b5563; line-height: 1.5; }
.fecha { display: block; margin-top: 15px; font-size: 0.8rem; color: #9ca3af; font-weight: 600; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 50;}
.modal-content { background: white; padding: 30px; border-radius: 16px; width: 100%; max-width: 600px; }
.modal-content h2 { margin: 0 0 20px 0; color: #0f172a; }
.form-group { margin-bottom: 15px; }
.form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 1rem; box-sizing: border-box; }
.form-control:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.input-titulo { font-weight: bold; font-size: 1.1rem; }
.textarea-nota { resize: vertical; }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }
.btn-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
</style>
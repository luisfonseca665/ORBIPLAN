<script setup>
import { ref } from 'vue';

const mostrarModal = ref(false);
const nuevaTarea = ref({ titulo: '', prioridad: 'Media', fecha: '' });

const guardarTarea = () => {
  alert(`Tarea guardada: ${nuevaTarea.value.titulo} | Prioridad: ${nuevaTarea.value.prioridad}`);
  mostrarModal.value = false;
  nuevaTarea.value = { titulo: '', prioridad: 'Media', fecha: '' }; // Limpiar
};
</script>

<template>
  <div class="tareas-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Tareas</h1>
        <p class="subtitle">Control y seguimiento de actividades</p>
      </div>
      <button class="btn-primary" @click="mostrarModal = true">+ Nueva Tarea</button>
    </div>

    <div class="card">
      <div class="tarea-item">
        <input type="checkbox" />
        <div class="tarea-info">
          <h4>Revisar requerimientos del sistema</h4>
          <span class="badge badge-alta">Prioridad Alta</span>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="mostrarModal">
      <div class="modal-content">
        <h2>Crear Nueva Tarea</h2>
        
        <div class="form-group">
          <label>Título de la tarea</label>
          <input type="text" v-model="nuevaTarea.titulo" placeholder="Ej. Terminar diagrama de clases..." class="form-control">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Prioridad</label>
            <select v-model="nuevaTarea.prioridad" class="form-control">
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </div>
          <div class="form-group">
            <label>Fecha de Vencimiento</label>
            <input type="date" v-model="nuevaTarea.fecha" class="form-control">
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-text" @click="mostrarModal = false">Cancelar</button>
          <button class="btn-primary" @click="guardarTarea">Guardar Tarea</button>
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
.btn-primary:hover { background-color: #2563eb; }

.card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
.tarea-item { display: flex; align-items: center; gap: 15px; }
.tarea-info h4 { margin: 0 0 5px 0; color: #1e293b; }
.badge { font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; font-weight: 600; }
.badge-alta { background: #fee2e2; color: #dc2626; }


.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 50;}
.modal-content { background: white; padding: 30px; border-radius: 16px; width: 100%; max-width: 500px; }
.modal-content h2 { margin: 0 0 20px 0; color: #0f172a; }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
label { font-size: 0.9rem; font-weight: 600; color: #475569; margin-bottom: 8px; }
.form-control { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 1rem; }
.form-control:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }
.btn-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
</style>
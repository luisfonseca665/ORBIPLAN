<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/BaseModal.vue';

const mostrarModal = ref(false);
const listaTareas = ref([]);
const nuevaTarea = ref({ titulo: '', prioridad: 'MEDIA', fechaVencimiento: '' });
const isLoading = ref(false);
const token = localStorage.getItem('token');

const cargarTareas = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/tareas', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) listaTareas.value = await res.json();
  } catch (e) { console.error("Error al cargar tareas", e); }
};

const guardarTarea = async () => {
  if (!nuevaTarea.value.titulo) return alert("Escribe el nombre de la tarea");

  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:8080/api/tareas', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaTarea.value)
    });

    if (res.ok) {
      const data = await res.json();
      alert("✅ " + data.mensaje);
      mostrarModal.value = false;
      nuevaTarea.value = { titulo: '', prioridad: 'MEDIA', fechaVencimiento: '' };
      cargarTareas();
    } else {
      alert("❌ Error al guardar la tarea");
    }
  } catch (e) { alert("❌ Error de conexión"); }
  finally { isLoading.value = false; }
};

onMounted(cargarTareas);
</script>

<template>
  <div class="tareas-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Tareas</h1>
        <p class="subtitle">Control de actividades</p>
      </div>
      <button class="btn-primary" @click="mostrarModal = true">+ Nueva Tarea</button>
    </div>

    <div class="lista-tareas-container">
      <div v-for="tarea in listaTareas" :key="tarea.id" class="card tarea-card">
        <div class="tarea-item">
          <input type="checkbox" class="check-tarea" />
          <div class="tarea-info">
            <h4>{{ tarea.titulo }}</h4>
            <span :class="['badge', `badge-${tarea.prioridad.toLowerCase()}`]">
              Prioridad {{ tarea.prioridad }}
            </span>
            <span v-if="tarea.fechaVencimiento" class="fecha-venc"> 📅 {{ tarea.fechaVencimiento }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="listaTareas.length === 0" class="empty-state">
        Aún no tienes tareas pendientes.
      </div>
    </div>

    <BaseModal v-if="mostrarModal" width="500px" @close="mostrarModal = false">
      <h2>Crear Nueva Tarea</h2>
      <div class="form-group">
        <label>Título</label>
        <input type="text" v-model="nuevaTarea.titulo" class="form-control" placeholder="Ej. Estudiar para examen de Redes" :disabled="isLoading">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Prioridad</label>
          <select v-model="nuevaTarea.prioridad" class="form-control" :disabled="isLoading">
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>
        <div class="form-group">
          <label>Vencimiento</label>
          <input type="date" v-model="nuevaTarea.fechaVencimiento" class="form-control" :disabled="isLoading">
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-text" @click="mostrarModal = false">Cancelar</button>
        <button class="btn-primary" @click="guardarTarea" :disabled="isLoading">
          {{ isLoading ? 'Guardando...' : 'Guardar Tarea' }}
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.tarea-card { margin-bottom: 15px; background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
.tarea-item { display: flex; align-items: flex-start; gap: 15px; }
.check-tarea { width: 18px; height: 18px; margin-top: 4px; cursor: pointer; }
.tarea-info h4 { margin: 0 0 8px 0; color: #1e293b; font-size: 1.1rem; }
.badge { font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; font-weight: 700; text-transform: uppercase; }
.badge-alta { background: #fee2e2; color: #dc2626; }
.badge-media { background: #fef3c7; color: #d97706; }
.badge-baja { background: #dcfce7; color: #16a34a; }
.fecha-venc { font-size: 0.8rem; color: #64748b; margin-left: 10px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
label { font-size: 0.9rem; font-weight: 600; color: #475569; margin-bottom: 8px; }
.form-control { padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; }
.empty-state { text-align: center; color: #94a3b8; padding: 40px; }
</style>
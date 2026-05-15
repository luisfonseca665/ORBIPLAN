<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/BaseModal.vue';

const mostrarModal = ref(false);
const listaTareas = ref([]);
const nuevaTarea = ref({ titulo: '', prioridad: 'MEDIA', fechaVencimiento: '' });
const isLoading = ref(false);
const token = localStorage.getItem('token');
const mostrandoArchivados = ref(false);

const cargarTareas = async () => {
  try {
    const endpoint = mostrandoArchivados.value ? 'http://localhost:8080/api/tareas/archivadas' : 'http://localhost:8080/api/tareas';
    const res = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) listaTareas.value = await res.json();
  } catch (e) { console.error("Error al cargar tareas", e); }
};

const toggleVistaArchivados = () => {
  mostrandoArchivados.value = !mostrandoArchivados.value;
  cargarTareas();
};

const modoEdicion = ref(false);
const idEdicion = ref(null);

const abrirModalNueva = () => {
  modoEdicion.value = false;
  idEdicion.value = null;
  nuevaTarea.value = { titulo: '', prioridad: 'MEDIA', fechaVencimiento: '' };
  mostrarModal.value = true;
};

const editarTarea = (tarea) => {
  modoEdicion.value = true;
  idEdicion.value = tarea.id;
  nuevaTarea.value = { ...tarea };
  mostrarModal.value = true;
};

const eliminarTarea = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar esta tarea permanentemente?")) return;
  isLoading.value = true;
  try {
    const res = await fetch(`http://localhost:8080/api/tareas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) cargarTareas();
    else alert("Error al eliminar");
  } catch(e) { alert("Error de conexión"); }
  finally { isLoading.value = false; }
};

const alternarArchivoTarea = async (tarea) => {
  isLoading.value = true;
  const action = tarea.archivado ? 'desarchivar' : 'archivar';
  try {
    const res = await fetch(`http://localhost:8080/api/tareas/${tarea.id}/${action}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) cargarTareas();
    else alert(`Error al ${action} tarea`);
  } catch(e) { alert("Error de conexión"); }
  finally { isLoading.value = false; }
};

const guardarTarea = async () => {
  if (!nuevaTarea.value.titulo) return alert("Escribe el nombre de la tarea");

  isLoading.value = true;
  const url = modoEdicion.value ? `http://localhost:8080/api/tareas/${idEdicion.value}` : 'http://localhost:8080/api/tareas';
  const method = modoEdicion.value ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaTarea.value)
    });

    if (res.ok) {
      mostrarModal.value = false;
      nuevaTarea.value = { titulo: '', prioridad: 'MEDIA', fechaVencimiento: '' };
      modoEdicion.value = false;
      idEdicion.value = null;
      cargarTareas();
    } else {
      alert("❌ Error al guardar la tarea");
    }
  } catch { alert("❌ Error de conexión"); }
  finally { isLoading.value = false; }
};

onMounted(cargarTareas);
</script>

<template>
  <div class="tareas-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Tareas</h1>
        <p class="subtitle">{{ mostrandoArchivados ? 'Tareas Archivadas' : 'Control de actividades' }}</p>
      </div>
      <div class="header-buttons">
        <button class="btn-text" @click="toggleVistaArchivados">
          {{ mostrandoArchivados ? 'Ver Activas' : 'Ver Archivadas' }}
        </button>
        <button v-if="!mostrandoArchivados" class="btn-primary" @click="abrirModalNueva">+ Nueva Tarea</button>
      </div>
    </div>

    <div class="lista-tareas-container">
      <div v-for="tarea in listaTareas" :key="tarea.id" class="card tarea-card">
        <div class="tarea-item">
          <input type="checkbox" class="check-tarea" />
          <div class="tarea-info">
            <h4>{{ tarea.titulo }}</h4>
            <div class="tarea-meta">
              <span :class="['badge', `badge-${tarea.prioridad.toLowerCase()}`]">
                Prioridad {{ tarea.prioridad }}
              </span>
              <span v-if="tarea.fechaVencimiento" class="fecha-venc"> 📅 {{ tarea.fechaVencimiento }}</span>
            </div>
          </div>
          <div class="tarea-actions">
            <button v-if="!mostrandoArchivados" class="btn-icon btn-edit" @click="editarTarea(tarea)" title="Editar">✏️</button>
            <button class="btn-icon btn-archive" @click="alternarArchivoTarea(tarea)" :title="tarea.archivado ? 'Desarchivar' : 'Archivar'">
              {{ tarea.archivado ? '📤' : '🗃️' }}
            </button>
            <button class="btn-icon btn-delete" @click="eliminarTarea(tarea.id)" title="Eliminar">🗑️</button>
          </div>
        </div>
      </div>

      <div v-if="listaTareas.length === 0" class="empty-state">
        Aún no tienes tareas pendientes. ¡Todo al día!
      </div>
    </div>

    <BaseModal v-if="mostrarModal" width="500px" @close="mostrarModal = false">
      <h2 class="modal-title">{{ modoEdicion ? 'Editar Tarea' : 'Crear Nueva Tarea' }}</h2>

      <div class="form-group">
        <label>Título de la tarea</label>
        <input
          type="text"
          v-model="nuevaTarea.titulo"
          class="form-control"
          placeholder="Ej. Estudiar para examen de Redes"
          :disabled="isLoading"
        >
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
.page-title {
  margin: 0;
  color: #3E2C25;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.subtitle {
  margin: 6px 0 30px 0;
  color: #857D78;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 35px;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-primary {
  background-color: #728DA6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(114, 141, 166, 0.15);
}

.btn-primary:hover:not(:disabled) {
  background-color: #5A748A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(114, 141, 166, 0.25);
}

.btn-primary:disabled {
  background-color: #C0BBB6;
  box-shadow: none;
}

.lista-tareas-container {
  max-width: 800px; /* Evita que las tareas se estiren demasiado en pantallas grandes */
}

/* Rediseño de tarjeta de tarea */
.tarea-card {
  margin-bottom: 16px;
  background: #FFFFFF;
  padding: 22px 24px;
  border-radius: 12px;
  border: 1px solid #E8E6E1;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-shadow: 0 2px 10px rgba(62, 44, 37, 0.02);
}

.tarea-card:hover {
  box-shadow: 0 6px 20px rgba(62, 44, 37, 0.05);
  border-color: #D1CEC7;
}

.tarea-item {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

/* Checkbox estilizado */
.check-tarea {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #728DA6; /* Color del check al marcarse */
}

.tarea-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.tarea-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tarea-card:hover .tarea-actions {
  opacity: 1;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #F0EEEA;
}

.tarea-info h4 {
  margin: 0;
  color: #3E2C25;
  font-size: 1.1rem;
  font-weight: 600;
}

.tarea-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Etiquetas (Badges) con colores pastel estéticos */
.badge {
  font-size: 0.75rem;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-alta {
  background: #FDF3F1;
  color: #B36B5E; /* Terracota suave */
}

.badge-media {
  background: #FDF8ED;
  color: #A68A56; /* Mostaza suave */
}

.badge-baja {
  background: #F2F7F4;
  color: #6B8E7D; /* Salvia suave */
}

.fecha-venc {
  font-size: 0.85rem;
  color: #857D78;
  font-weight: 500;
}

/* Modal Estilos */
.modal-title {
  margin: 0 0 20px 0;
  color: #3E2C25;
  font-size: 1.4rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4A403B;
  margin-bottom: 8px;
}

.form-control {
  padding: 12px 16px;
  border: 1px solid #E8E6E1;
  border-radius: 8px;
  font-family: inherit;
  background: #FAFAF9;
  color: #3E2C25;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #728DA6;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(114, 141, 166, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}

.btn-text {
  background: none;
  border: none;
  color: #857D78;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-text:hover {
  color: #3E2C25;
}

/* Estado Vacío Estilizado */
.empty-state {
  text-align: center;
  color: #9A938E;
  padding: 50px;
  font-size: 1.05rem;
  font-weight: 500;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px dashed #D1CEC7;
}
</style>

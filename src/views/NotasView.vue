<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/BaseModal.vue';

const mostrarModal = ref(false);
const listaNotas = ref([]);
const nuevaNota = ref({ titulo: '', contenido: '' });
const isLoading = ref(false);
const token = localStorage.getItem('token');

const cargarNotas = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/notas', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) listaNotas.value = await res.json();
  } catch (e) { console.error("Error al cargar notas", e); }
};

const guardarNota = async () => {
  if (!nuevaNota.value.titulo) return alert("Ponle un título a tu nota");
  
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:8080/api/notas', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaNota.value)
    });

    if (res.ok) {
      const data = await res.json();
      alert("✅ " + data.mensaje);
      mostrarModal.value = false;
      nuevaNota.value = { titulo: '', contenido: '' };
      cargarNotas();
    } else {
      alert("❌ Error al guardar la nota");
    }
  } catch (e) { alert("❌ Error de conexión"); }
  finally { isLoading.value = false; }
};

onMounted(cargarNotas);
</script>

<template>
  <div class="notas-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Notas</h1>
        <p class="subtitle">Bloc digital de ORBIPLAN</p>
      </div>
      <button class="btn-primary" @click="mostrarModal = true">+ Nueva Nota</button>
    </div>

    <div class="grid-notas">
      <div v-for="nota in listaNotas" :key="nota.id" class="nota-card">
        <h3>{{ nota.titulo }}</h3>
        <p>{{ nota.contenido }}</p>
        <span class="fecha">Guardado</span>
      </div>
    </div>

    <BaseModal v-if="mostrarModal" width="600px" @close="mostrarModal = false">
      <h2>Crear Apunte</h2>
      <div class="form-group">
        <input type="text" v-model="nuevaNota.titulo" placeholder="Título" class="form-control input-titulo" :disabled="isLoading">
      </div>
      <div class="form-group">
        <textarea v-model="nuevaNota.contenido" placeholder="Escribe aquí..." class="form-control" rows="6" :disabled="isLoading"></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn-text" @click="mostrarModal = false">Cancelar</button>
        <button class="btn-primary" @click="guardarNota" :disabled="isLoading">
          {{ isLoading ? 'Guardando...' : 'Guardar Nota' }}
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.grid-notas { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.nota-card { background: #fef9c3; padding: 20px; border-radius: 12px; border-top: 4px solid #facc15; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.nota-card h3 { margin: 0 0 10px 0; color: #1f2937; }
.form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 10px; box-sizing: border-box; }
.input-titulo { font-weight: bold; }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }
.btn-primary { background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; }
.btn-primary:disabled { background-color: #94a3b8; }
.btn-text { background: none; border: none; color: #64748b; cursor: pointer; }
</style>
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
        <p class="nota-contenido">{{ nota.contenido }}</p>
        <div class="nota-footer">
          <span class="fecha">Guardado</span>
        </div>
      </div>
    </div>

    <BaseModal v-if="mostrarModal" width="600px" @close="mostrarModal = false">
      <h2 class="modal-title">Crear Apunte</h2>
      
      <div class="form-group">
        <input 
          type="text" 
          v-model="nuevaNota.titulo" 
          placeholder="Título de la nota" 
          class="form-control input-titulo" 
          :disabled="isLoading"
        >
      </div>
      
      <div class="form-group">
        <textarea 
          v-model="nuevaNota.contenido" 
          placeholder="Escribe aquí tus ideas..." 
          class="form-control textarea-custom" 
          rows="6" 
          :disabled="isLoading"
        ></textarea>
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
  cursor: not-allowed; 
}

.grid-notas { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 24px; 
}

/* Rediseño de la tarjeta de nota para hacerla más premium */
.nota-card { 
  background: #FFFFFF; 
  padding: 24px; 
  border-radius: 12px; 
  border: 1px solid #E8E6E1; 
  border-top: 4px solid #728DA6; /* Borde Chambray */
  box-shadow: 0 4px 16px rgba(62, 44, 37, 0.03); 
  display: flex; 
  flex-direction: column; 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
}

.nota-card:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 8px 24px rgba(62, 44, 37, 0.06); 
}

.nota-card h3 { 
  margin: 0 0 12px 0; 
  color: #3E2C25; 
  font-size: 1.15rem; 
  font-weight: 600; 
}

.nota-contenido { 
  color: #6A625D; 
  font-size: 0.95rem; 
  line-height: 1.6; 
  margin: 0; 
  flex-grow: 1; /* Empuja el footer hacia abajo */
  white-space: pre-wrap; /* Respeta los saltos de línea al escribir */
}

.nota-footer { 
  margin-top: 20px; 
  padding-top: 15px; 
  border-top: 1px dashed #E8E6E1; 
  display: flex;
  justify-content: flex-end;
}

.fecha { 
  font-size: 0.8rem; 
  color: #9A938E; 
  font-weight: 500; 
}

/* Estilos del Modal */
.modal-title { 
  margin: 0 0 20px 0; 
  color: #3E2C25; 
  font-size: 1.4rem; 
}

.form-group { 
  margin-bottom: 16px; 
}

.form-control { 
  width: 100%; 
  padding: 14px 16px; 
  border: 1px solid #E8E6E1; 
  border-radius: 8px; 
  box-sizing: border-box; 
  background: #FAFAF9; 
  font-family: inherit; 
  color: #3E2C25; 
  transition: all 0.2s ease; 
}

.form-control:focus { 
  outline: none; 
  border-color: #728DA6; 
  background: #FFFFFF; 
  box-shadow: 0 0 0 3px rgba(114, 141, 166, 0.1); 
}

.form-control::placeholder {
  color: #C0BBB6;
}

.input-titulo { 
  font-weight: 600; 
  font-size: 1.1rem; 
}

.textarea-custom { 
  resize: vertical; 
  line-height: 1.5; 
}

.modal-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 15px; 
  margin-top: 24px; 
}

.btn-text { 
  background: none; 
  border: none; 
  color: #857D78; 
  cursor: pointer; 
  font-weight: 500; 
  font-family: inherit;
  transition: color 0.2s ease; 
}

.btn-text:hover { 
  color: #3E2C25; 
}
</style>
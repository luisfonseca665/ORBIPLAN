<template>
  <div class="archivos-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Archivos</h1>
        <p class="subtitle">Gestiona tus documentos (Máx. 100MB)</p>
      </div>
      <div class="botones">
        <button class="btn-primary" @click="mostrarModal = true">+ Subir Archivo</button>
      </div>
    </div>

    <div class="grid-archivos">
      <div class="item-archivo carpeta">
        <div class="icono">📁</div>
        <p>Reportes ITSUR</p>
      </div>
      
      <div v-for="arc in listaArchivos" :key="arc" class="item-archivo documento">
        <div class="icono">📄</div>
        <p>{{ arc }}</p>
      </div>
    </div>

    <BaseModal v-if="mostrarModal" width="450px" @close="mostrarModal = false">
      <h2>Subir nuevo archivo</h2>
      <p class="modal-info">Selecciona un archivo de tu equipo.</p>

      <div class="file-upload-box">
        <input 
          type="file" 
          :accept="formatosPermitidos" 
          @change="manejarSeleccion" 
          class="file-input"
        >
      </div>

      <div class="modal-actions">
        <button class="btn-text" @click="mostrarModal = false">Cancelar</button>
        <button class="btn-primary" @click="confirmarSubida" :disabled="!archivoSeleccionado || isLoading">
          {{ isLoading ? 'Subiendo...' : 'Subir al servidor' }}
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/BaseModal.vue';

const mostrarModal = ref(false);
const archivoSeleccionado = ref(null);
const listaArchivos = ref([]);
const isLoading = ref(false);
const formatosPermitidos = ".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.gif";

// 1. Cargar la lista de archivos al entrar
const obtenerArchivos = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:8080/api/archivos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) listaArchivos.value = await res.json();
  } catch (e) {
    console.error("Error al obtener archivos", e);
  }
};

const manejarSeleccion = (event) => {
  archivoSeleccionado.value = event.target.files[0];
};

// 2. FUNCIÓN DE SUBIDA CORREGIDA
const confirmarSubida = async () => {
  if(!archivoSeleccionado.value) return;
  
  isLoading.value = true;
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', archivoSeleccionado.value); // 'file' coincide con @RequestParam en Java

  try {
    const res = await fetch('http://localhost:8080/api/archivos/upload', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}` 
        // IMPORTANTE: No pongas Content-Type aquí
      },
      body: formData 
    });

    if (res.ok) {
      const data = await res.json();
      alert("✅ " + data.mensaje);
      mostrarModal.value = false;
      archivoSeleccionado.value = null;
      obtenerArchivos(); // Refresca la lista automáticamente
    } else {
      alert("❌ Error al subir el archivo al servidor");
    }
  } catch (error) {
    console.error(error);
    alert("❌ Error de conexión con el backend");
  } finally {
    isLoading.value = false;
  }
};

onMounted(obtenerArchivos);
</script>

<style scoped>
.page-title { margin: 0; color: #0f172a; font-size: 1.8rem; }
.subtitle { margin: 5px 0 20px 0; color: #64748b; }
.header-actions { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
.btn-primary { background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background-color: #2563eb; }
.btn-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }

.grid-archivos { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
.item-archivo { background: white; padding: 25px 15px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0; }
.icono { font-size: 45px; margin-bottom: 12px; }

.file-upload-box { border: 2px dashed #cbd5e1; padding: 30px; border-radius: 10px; background: #f8fafc; }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 25px; }
.btn-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
</style>
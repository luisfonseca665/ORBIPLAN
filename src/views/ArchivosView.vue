<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';

const mostrarModal = ref(false);
const archivoSeleccionado = ref(null);
const formatosPermitidos = ".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.gif";

const manejarSeleccion = (event) => {
  archivoSeleccionado.value = event.target.files[0];
};

const confirmarSubida = () => {
  if(archivoSeleccionado.value) {
    alert(`Archivo subido de: ${archivoSeleccionado.value.name}`);
    mostrarModal.value = false;
    archivoSeleccionado.value = null;
  }
};
</script>

<template>
  <div class="archivos-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Archivos</h1>
        <p class="subtitle">Gestiona tus documentos e imágenes</p>
      </div>
      <div class="botones">
        <button class="btn-primary" @click="mostrarModal = true">+ Subir Archivo</button>
        <button class="btn-secondary">+ Crear Carpeta</button>
      </div>
    </div>

    <div class="grid-archivos">
      <div class="item-archivo carpeta"><div class="icono">📁</div><p>Reportes 2025</p></div>
      <div class="item-archivo documento"><div class="icono">📄</div><p>Informe_Ventas.pdf</p></div>
    </div>

    <BaseModal v-if="mostrarModal" width="450px" @close="mostrarModal = false">
      <h2>Subir nuevo archivo</h2>
      <p class="modal-info">Formatos permitidos: PDF, Word, Excel, PowerPoint, JPG, PNG, GIF.</p>

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
        <button class="btn-primary" @click="confirmarSubida" :disabled="!archivoSeleccionado">
          Subir al servidor
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.page-title { margin: 0; color: #0f172a; font-size: 1.8rem; }
.subtitle { margin: 5px 0 20px 0; color: #64748b; }
.header-actions { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
.botones button { padding: 10px 20px; margin-left: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; border: none; transition: 0.2s; }
.btn-primary { background-color: #3b82f6; color: white; }
.btn-primary:hover { background-color: #2563eb; }
.btn-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }
.btn-secondary { background-color: white; color: #334155; border: 1px solid #cbd5e1 !important; }
.btn-secondary:hover { background-color: #f8fafc; }

.grid-archivos { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
.item-archivo { background: white; padding: 25px 15px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; }
.item-archivo:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: #cbd5e1; }
.icono { font-size: 45px; margin-bottom: 12px; }
.item-archivo p { margin: 0; font-size: 0.9rem; color: #334155; font-weight: 500; word-wrap: break-word; }

h2 { margin: 0 0 10px 0; color: #0f172a; }
.modal-info { color: #64748b; font-size: 0.9rem; margin-bottom: 20px; }
.file-upload-box {
  border: 2px dashed #cbd5e1; padding: 30px; text-align: center;
  border-radius: 10px; margin-bottom: 25px; background: #f8fafc;
}
.file-input { width: 100%; }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; }
.btn-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
.btn-text:hover { color: #0f172a; }
</style>

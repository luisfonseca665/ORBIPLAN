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
        <p class="file-name">Reportes ITSUR</p>
      </div>
      
      <div v-for="arc in listaArchivos" :key="arc" class="item-archivo documento">
        <div class="icono">📄</div>
        <p class="file-name">{{ arc }}</p>
      </div>
    </div>

    <BaseModal v-if="mostrarModal" width="480px" @close="mostrarModal = false">
      <h2 class="modal-title">Subir nuevo archivo</h2>
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

.grid-archivos { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
  gap: 24px; 
}

.item-archivo { 
  background: #FFFFFF; 
  padding: 30px 20px; 
  border-radius: 12px; 
  text-align: center; 
  border: 1px solid #E8E6E1; 
  transition: all 0.2s ease; 
  box-shadow: 0 4px 16px rgba(62, 44, 37, 0.03); 
  cursor: pointer; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.item-archivo:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 8px 24px rgba(62, 44, 37, 0.08); 
  border-color: #D1CEC7; 
}

.icono { 
  font-size: 48px; 
  margin-bottom: 16px; 
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.04)); 
}

.file-name { 
  margin: 0; 
  color: #4A403B; 
  font-weight: 500; 
  font-size: 0.95rem; 
  word-break: break-word; 
}

.modal-title { 
  margin: 0 0 8px 0; 
  color: #3E2C25; 
  font-size: 1.4rem; 
}

.modal-info { 
  color: #857D78; 
  margin-bottom: 24px; 
  font-size: 0.95rem; 
}

.file-upload-box { 
  border: 2px dashed #D1CEC7; 
  padding: 40px 20px; 
  border-radius: 12px; 
  background: #FAFAF9; 
  text-align: center; 
  transition: background 0.3s ease, border-color 0.3s ease; 
}

.file-upload-box:hover { 
  background: #F4F7FA; 
  border-color: #728DA6; 
}

.file-input { 
  width: 100%; 
  color: #6A625D; 
  font-family: inherit; 
}

/* Estilo para el botón por defecto de "Seleccionar archivo" */
.file-input::file-selector-button { 
  background: white; 
  border: 1px solid #E8E6E1; 
  padding: 8px 16px; 
  border-radius: 6px; 
  color: #4A403B; 
  cursor: pointer; 
  font-weight: 500; 
  font-family: inherit;
  margin-right: 15px; 
  transition: all 0.2s ease; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.file-input::file-selector-button:hover { 
  background: #F0EEEA; 
}

.modal-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 15px; 
  margin-top: 30px; 
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
</style>
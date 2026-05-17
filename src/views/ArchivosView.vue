<template>
  <div class="archivos-view">
    <div class="header-actions">
      <div>
        <h1 class="page-title">Mis Archivos</h1>
        <p class="subtitle">{{ mostrandoArchivados ? 'Archivos Archivados' : 'Gestiona tus documentos (Máx. 100MB)' }}</p>
      </div>
      <div class="header-buttons">
        <button class="btn-text" @click="toggleVistaArchivados">
          {{ mostrandoArchivados ? 'Ver Activos' : 'Ver Archivados' }}
        </button>
        <button v-if="!mostrandoArchivados && !carpetaActual" class="btn-outline" @click="mostrarModalCarpeta = true">
          📁 Nueva Carpeta
        </button>
        <button v-if="!mostrandoArchivados" class="btn-primary" @click="mostrarModal = true">+ Subir Archivo</button>
      </div>
    </div>

    <!-- Breadcrumb de navegación -->
    <div v-if="carpetaActual" class="breadcrumb">
      <button class="breadcrumb-back" @click="salirDeCarpeta">
        ← Mis Archivos
      </button>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">📁 {{ carpetaActual.nombre }}</span>
    </div>

    <!-- Grid de carpetas (solo en raíz) -->
    <div v-if="!carpetaActual && !mostrandoArchivados && listaCarpetas.length > 0" class="seccion-carpetas">
      <h3 class="seccion-label">Carpetas</h3>
      <div class="grid-archivos">
        <div
          v-for="carpeta in listaCarpetas"
          :key="'c-' + carpeta.id"
          class="item-archivo carpeta-item"
          @click="entrarCarpeta(carpeta)"
        >
          <div class="archivo-header">
            <button class="btn-icon btn-delete" @click.stop="eliminarCarpeta(carpeta.id)" title="Eliminar carpeta">🗑️</button>
          </div>
          <div class="contenido-archivo">
            <div class="icono">📁</div>
            <p class="file-name">{{ carpeta.nombre }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Separador si hay carpetas y archivos -->
    <div v-if="!carpetaActual && !mostrandoArchivados && listaCarpetas.length > 0 && listaArchivos.length > 0" class="seccion-sep">
      <h3 class="seccion-label">Archivos</h3>
    </div>

    <!-- Grid de archivos -->
    <div class="grid-archivos" :style="{ marginTop: sinSeparador ? '0' : undefined }">
      <div v-for="arc in listaArchivos" :key="arc.id" class="item-archivo documento">
        <div class="archivo-header">
          <button class="btn-icon btn-archive" @click="alternarArchivo(arc)" :title="arc.archivado ? 'Desarchivar' : 'Archivar'">
            {{ arc.archivado ? '📤' : '🗃️' }}
          </button>
          <button class="btn-icon btn-delete" @click="eliminarArchivo(arc.id)" title="Eliminar permanentemente">🗑️</button>
        </div>
        
        <div class="contenido-archivo" @click="descargarArchivo(arc.id, arc.nombre)" title="Clic para descargar">
          <div class="icono">{{ obtenerIcono(arc.nombre) }}</div>
          <p class="file-name">{{ arc.nombre }}</p>
        </div>
      </div>

      <div v-if="listaArchivos.length === 0 && (listaCarpetas.length === 0 || carpetaActual)" class="empty-state" style="grid-column: 1 / -1;">
        <span v-if="carpetaActual">Esta carpeta está vacía. Sube un archivo para comenzar.</span>
        <span v-else-if="mostrandoArchivados">No tienes archivos archivados.</span>
        <span v-else>Aún no has subido ningún archivo.</span>
      </div>
    </div>

    <!-- Modal: Subir Archivo -->
    <BaseModal v-if="mostrarModal" width="480px" @close="mostrarModal = false">
      <h2 class="modal-title">Subir nuevo archivo</h2>
      <p class="modal-info">
        Selecciona un archivo de tu equipo.
        <span v-if="carpetaActual"> Se subirá a <strong>{{ carpetaActual.nombre }}</strong>.</span>
      </p>

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

    <!-- Modal: Nueva Carpeta -->
    <BaseModal v-if="mostrarModalCarpeta" width="400px" @close="mostrarModalCarpeta = false">
      <h2 class="modal-title">Nueva Carpeta</h2>
      <p class="modal-info">Escribe el nombre de la nueva carpeta.</p>

      <div class="form-group">
        <input
          type="text"
          v-model="nombreNuevaCarpeta"
          class="form-control"
          placeholder="Ej. Proyectos, Entregas..."
          @keyup.enter="crearCarpeta"
          autofocus
        />
      </div>

      <div class="modal-actions">
        <button class="btn-text" @click="mostrarModalCarpeta = false">Cancelar</button>
        <button class="btn-primary" @click="crearCarpeta" :disabled="!nombreNuevaCarpeta.trim() || isLoading">
          {{ isLoading ? 'Creando...' : 'Crear Carpeta' }}
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BaseModal from '@/components/BaseModal.vue';

const mostrarModal = ref(false);
const mostrarModalCarpeta = ref(false);
const archivoSeleccionado = ref(null);
const listaArchivos = ref([]);
const listaCarpetas = ref([]);
const carpetaActual = ref(null); // { id, nombre }
const isLoading = ref(false);
const formatosPermitidos = ".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.gif";
const token = localStorage.getItem('token');
const mostrandoArchivados = ref(false);
const nombreNuevaCarpeta = ref('');

const sinSeparador = computed(() => {
  return carpetaActual.value || mostrandoArchivados.value || listaCarpetas.value.length === 0;
});

const obtenerIcono = (nombre) => {
  if (!nombre) return '📄';
  const ext = nombre.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return '📕';
    case 'doc':
    case 'docx': return '📘';
    case 'xls':
    case 'xlsx': return '📗';
    case 'ppt':
    case 'pptx': return '📙';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    case 'zip':
    case 'rar': return '📦';
    default: return '📄';
  }
};

const obtenerArchivos = async () => {
  try {
    let url;
    if (mostrandoArchivados.value) {
      url = 'http://localhost:8080/api/archivos/archivadas';
    } else if (carpetaActual.value) {
      url = `http://localhost:8080/api/archivos?carpetaId=${carpetaActual.value.id}`;
    } else {
      url = 'http://localhost:8080/api/archivos';
    }
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) listaArchivos.value = await res.json();
  } catch (e) {
    console.error("Error al obtener archivos", e);
  }
};

const obtenerCarpetas = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/carpetas', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) listaCarpetas.value = await res.json();
  } catch (e) {
    console.error("Error al obtener carpetas", e);
  }
};

const entrarCarpeta = (carpeta) => {
  carpetaActual.value = carpeta;
  obtenerArchivos();
};

const salirDeCarpeta = () => {
  carpetaActual.value = null;
  obtenerArchivos();
};

const toggleVistaArchivados = () => {
  mostrandoArchivados.value = !mostrandoArchivados.value;
  carpetaActual.value = null;
  obtenerArchivos();
};

const manejarSeleccion = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Caso 5: Rol == 'ALUMNO'
  const usuarioRol = localStorage.getItem('usuarioRol') || 'ALUMNO';
  if (usuarioRol !== 'ALUMNO') {
    alert("Error (Solo los alumnos entregan tareas)");
    event.target.value = '';
    archivoSeleccionado.value = null;
    return;
  }

  // Caso 2: Tamaño <= 100MB
  if (file.size > 100 * 1024 * 1024) {
    alert("Error (Archivo demasiado grande)");
    event.target.value = '';
    archivoSeleccionado.value = null;
    return;
  }

  // Caso 3: Formato en lista blanca
  const ext = "." + file.name.split('.').pop().toLowerCase();
  const formatosValidos = formatosPermitidos.split(',');
  if (!formatosValidos.includes(ext)) {
    alert("Error (Tipo de archivo no permitido)");
    event.target.value = '';
    archivoSeleccionado.value = null;
    return;
  }

  // Caso 4: Regla de entrega (Fecha de vencimiento)
  const entregaVencida = localStorage.getItem('entregaVencida') === 'true';
  if (entregaVencida) {
    alert("Error (La tarea a vencido y no permite entregas tardias)");
    event.target.value = '';
    archivoSeleccionado.value = null;
    return;
  }

  archivoSeleccionado.value = file;
};

const confirmarSubida = async () => {
  if(!archivoSeleccionado.value) return;
  
  isLoading.value = true;
  const formData = new FormData();
  formData.append('file', archivoSeleccionado.value);

  let url = 'http://localhost:8080/api/archivos/upload';
  if (carpetaActual.value) {
    url += `?carpetaId=${carpetaActual.value.id}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
      body: formData 
    });

    if (res.ok) {
      mostrarModal.value = false;
      archivoSeleccionado.value = null;
      obtenerArchivos();
    } else {
      alert("❌ Error al subir el archivo al servidor");
    }
  } catch (error) {
    alert("❌ Error de conexión con el backend");
  } finally {
    isLoading.value = false;
  }
};

const crearCarpeta = async () => {
  if (!nombreNuevaCarpeta.value.trim()) return;
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:8080/api/carpetas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: nombreNuevaCarpeta.value.trim() })
    });
    if (res.ok) {
      mostrarModalCarpeta.value = false;
      nombreNuevaCarpeta.value = '';
      obtenerCarpetas();
    } else {
      alert("Error al crear la carpeta");
    }
  } catch (e) {
    alert("Error de conexión");
  } finally {
    isLoading.value = false;
  }
};

const eliminarCarpeta = async (id) => {
  if (!confirm("¿Eliminar esta carpeta? Los archivos dentro quedarán sin carpeta.")) return;
  try {
    const res = await fetch(`http://localhost:8080/api/carpetas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      obtenerCarpetas();
      obtenerArchivos();
    } else {
      alert("Error al eliminar la carpeta");
    }
  } catch (e) {
    alert("Error de conexión");
  }
};

const eliminarArchivo = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar este archivo de forma permanente?")) return;
  try {
    const res = await fetch(`http://localhost:8080/api/archivos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) obtenerArchivos();
    else alert("Error al eliminar el archivo");
  } catch (e) {
    alert("Error de conexión");
  }
};

const alternarArchivo = async (archivo) => {
  const action = archivo.archivado ? 'desarchivar' : 'archivar';
  try {
    const res = await fetch(`http://localhost:8080/api/archivos/${archivo.id}/${action}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) obtenerArchivos();
    else alert(`Error al ${action} archivo`);
  } catch (e) {
    alert("Error de conexión");
  }
};

const descargarArchivo = async (id, nombre) => {
  try {
    const res = await fetch(`http://localhost:8080/api/archivos/download/${id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      alert("Error al intentar descargar el archivo");
    }
  } catch(e) {
    alert("Error de conexión al descargar");
  }
};

onMounted(() => {
  obtenerArchivos();
  obtenerCarpetas();
});
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
  margin-bottom: 20px; 
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding: 10px 16px;
  background: #F7F5F2;
  border-radius: 10px;
  border: 1px solid #E8E6E1;
}
.breadcrumb-back {
  background: none;
  border: none;
  color: #728DA6;
  font-weight: 500;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.breadcrumb-back:hover { color: #4C657A; }
.breadcrumb-sep { color: #C8C3BE; }
.breadcrumb-current {
  color: #3E2C25;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Secciones */
.seccion-carpetas { margin-bottom: 28px; }
.seccion-sep { margin-bottom: 20px; }
.seccion-label {
  margin: 0 0 16px 0;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9A938E;
}

/* Botones */
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

.btn-outline {
  background: white;
  border: 1px solid #D1CEC7;
  color: #6A625D;
  padding: 11px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: #F7F5F2;
  border-color: #B8B3AC;
  color: #3E2C25;
}

/* Grid */
.grid-archivos { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
  gap: 20px; 
}

/* Items */
.item-archivo { 
  background: #FFFFFF; 
  padding: 15px; 
  border-radius: 12px; 
  text-align: center; 
  border: 1px solid #E8E6E1; 
  transition: all 0.2s ease; 
  box-shadow: 0 4px 16px rgba(62, 44, 37, 0.03); 
  position: relative;
}

.item-archivo:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 8px 24px rgba(62, 44, 37, 0.08); 
  border-color: #D1CEC7; 
}

/* Carpetas tienen fondo diferente */
.carpeta-item {
  cursor: pointer;
  background: #FDFCF9;
  border-color: #EDE9E0;
}
.carpeta-item:hover {
  background: #F9F6EF;
  border-color: #C9C3B5;
}

.archivo-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  gap: 4px;
}

.contenido-archivo {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carpeta-item .contenido-archivo {
  cursor: pointer;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
  opacity: 0;
}

.item-archivo:hover .btn-icon {
  opacity: 1;
}

.btn-icon:hover {
  background: #F0EEEA;
}

.icono { 
  font-size: 44px; 
  margin-bottom: 10px; 
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.04)); 
}

.carpeta-item .icono {
  font-size: 48px;
}

.file-name { 
  margin: 0; 
  color: #4A403B; 
  font-weight: 500; 
  font-size: 0.88rem; 
  word-break: break-word; 
  line-height: 1.4;
}

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

/* Modal */
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

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E8E6E1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background: #FAFAF9;
  color: #3E2C25;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-control:focus {
  outline: none;
  border-color: #728DA6;
  background: #FFFFFF;
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
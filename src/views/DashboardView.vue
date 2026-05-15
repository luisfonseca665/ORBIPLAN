<template>
  <div class="dashboard-view">
    <header class="page-header">
      <h1>Dashboard</h1>
      <p class="subtitle">Resumen de tu espacio de trabajo</p>
    </header>

    <div class="dashboard-layout">
      <div class="columna-izquierda">
        <section class="card perfil-card">
          <div class="perfil-header">
            <div class="avatar" @click="abrirEdicion" style="cursor: pointer;" title="Editar Perfil">
              <img v-if="usuario.fotoUrl" :src="usuario.fotoUrl" class="avatar-img" />
              <span v-else class="avatar-text">{{ iniciales }}</span>
              <div class="avatar-edit-overlay">✏️</div>
            </div>
            <div class="perfil-titulos">
              <h2>{{ usuario.nombre }}</h2>
              <span class="badge-rol">{{ usuario.rol }}</span>
              <button class="btn-editar" @click="abrirEdicion">Editar Perfil</button>
            </div>
          </div>
          <div class="perfil-datos">
            <div class="dato-item">
              <span class="icon">✉️</span>
              <span>{{ usuario.email }}</span>
            </div>
            <div class="dato-item">
              <span class="icon">🏢</span>
              <span>{{ usuario.carrera || 'Carrera no especificada' }}</span>
            </div>
          </div>
        </section>

        <section class="card calendar-card">
          <div class="card-header">
            <h3>Calendario</h3>
          </div>
          <VCalendar
            transparent
            borderless
            class="custom-calendar"
            :attributes="atributosCalendario"
          />
          <div v-if="tareasConFecha.length > 0" class="calendar-legend">
            <span class="legend-dot"></span>
            <span class="legend-text">Tarea con fecha límite</span>
          </div>
        </section>
      </div>

      <div class="columna-derecha">
        <section class="card recientes-card">
          <div class="card-header">
            <h3>Actividad Reciente</h3>
          </div>

          <!-- Estado de carga -->
          <div v-if="cargandoActividad" class="loading-state">
            <div class="loading-spinner"></div>
            <span>Cargando actividad...</span>
          </div>

          <!-- Lista real -->
          <ul v-else-if="actividades.length > 0" class="lista-timeline">
            <li v-for="(item, idx) in actividades" :key="idx" class="timeline-item">
              <div :class="['timeline-icon', iconoClase(item.tipo)]">
                {{ iconoEmoji(item) }}
              </div>
              <div class="timeline-content">
                <p>{{ descripcionActividad(item) }}</p>
                <span class="time">{{ tiempoRelativo(item.fecha) }}</span>
              </div>
            </li>
          </ul>

          <!-- Sin actividad -->
          <div v-else class="empty-actividad">
            <div class="empty-icon">🕐</div>
            <p>No hay actividad reciente aún.</p>
            <span>Crea una tarea o sube un archivo para empezar.</span>
          </div>
        </section>
      </div>
    </div>

    <!-- Modal de Edición / Completar Perfil -->
    <div v-if="showProfileModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">{{ forzarCompletar ? 'Completa tu Perfil' : 'Editar Perfil' }}</h2>
        <p class="modal-subtitle" v-if="forzarCompletar">Antes de continuar, por favor indícanos tu carrera.</p>
        
        <form @submit.prevent="guardarPerfil" class="modal-form">
          <div class="form-group" v-if="!forzarCompletar">
            <label>Foto de Perfil</label>
            <div class="foto-upload-container">
              <img v-if="editForm.fotoUrl" :src="editForm.fotoUrl" class="foto-preview" />
              <div v-else class="foto-placeholder">{{ iniciales }}</div>
              <input type="file" accept="image/*" @change="handleFileUpload" id="fotoInput" />
            </div>
          </div>

          <div class="form-group">
            <label>Nombre de Usuario</label>
            <input type="text" v-model="editForm.nombre" required />
          </div>

          <div class="form-group">
            <label>Carrera</label>
            <select v-model="carreraSeleccionada" required>
              <option value="" disabled>Selecciona tu carrera</option>
              <option v-for="carrera in carrerasDisponibles" :key="carrera" :value="carrera">{{ carrera }}</option>
            </select>
          </div>

          <div class="form-group" v-if="carreraSeleccionada === 'Otra...'">
            <label>Escribe tu carrera</label>
            <input type="text" v-model="editForm.carreraOtra" placeholder="Nombre de la carrera" required />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" v-if="!forzarCompletar" @click="showProfileModal = false">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const usuario = ref({
  nombre: 'Cargando...',
  email: '',
  rol: 'USUARIO',
  carrera: '',
  fotoUrl: ''
})

const showProfileModal = ref(false)
const forzarCompletar = ref(false)
const guardando = ref(false)

// Actividad reciente
const actividades = ref([])
const cargandoActividad = ref(true)

// Tareas para el calendario
const tareasConFecha = ref([])

const carrerasDisponibles = [
  'Gastronomía',
  'Ingeniería Industrial',
  'Ingeniería Ambiental',
  'Ingeniería Electrónica',
  'Ingeniería en Gestión empresarial',
  'Ingeniería en Sistemas Automotrices',
  'Ingeniería en Sistemas Computacionales',
  'Ingeniería en Semiconductores',
  'Otra...'
]

const carreraSeleccionada = ref('')

const editForm = ref({
  nombre: '',
  carreraOtra: '',
  fotoUrl: ''
})

const iniciales = computed(() => {
  if (!usuario.value.nombre || usuario.value.nombre === 'Cargando...') return '...'
  return usuario.value.nombre
    .split(' ')
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// Atributos del calendario basados en fechas de tareas
const atributosCalendario = computed(() => {
  return tareasConFecha.value.map(tarea => ({
    dot: {
      color: 'green',
      style: { backgroundColor: '#4C8B6A' }
    },
    dates: new Date(tarea.fechaVencimiento + 'T12:00:00'),
    popover: {
      label: tarea.titulo
    }
  }))
})

// --- Helpers de Actividad ---

const iconoEmoji = (item) => {
  if (item.tipo === 'archivo') return '📄'
  if (item.archivado) return '✅'
  return '📋'
}

const iconoClase = (tipo) => {
  if (tipo === 'archivo') return 'bg-blue'
  return 'bg-green'
}

const descripcionActividad = (item) => {
  if (item.tipo === 'archivo') return `Subiste el archivo "${item.descripcion}"`
  return `Creaste la tarea "${item.descripcion}"`
}

const tiempoRelativo = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  const ahora = new Date()
  const diffMs = ahora - fecha
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMin / 60)
  const diffDias = Math.floor(diffHoras / 24)

  if (diffMin < 1) return 'Ahora mismo'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
  if (diffDias === 1) {
    const hora = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    return `Ayer a las ${hora}`
  }
  return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

// --- API Calls ---

const cargarActividad = async () => {
  cargandoActividad.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/actividad', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      actividades.value = await res.json()
    }
  } catch (e) {
    console.error('Error al cargar actividad', e)
  } finally {
    cargandoActividad.value = false
  }
}

const cargarTareasParaCalendario = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/tareas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const tareas = await res.json()
      tareasConFecha.value = tareas.filter(t => t.fechaVencimiento)
    }
  } catch (e) {
    console.error('Error al cargar tareas para calendario', e)
  }
}

const abrirEdicion = () => {
  forzarCompletar.value = false
  editForm.value.nombre = usuario.value.nombre
  editForm.value.fotoUrl = usuario.value.fotoUrl
  
  if (usuario.value.carrera) {
    if (carrerasDisponibles.includes(usuario.value.carrera)) {
      carreraSeleccionada.value = usuario.value.carrera
      editForm.value.carreraOtra = ''
    } else {
      carreraSeleccionada.value = 'Otra...'
      editForm.value.carreraOtra = usuario.value.carrera
    }
  } else {
    carreraSeleccionada.value = ''
    editForm.value.carreraOtra = ''
  }
  
  showProfileModal.value = true
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    editForm.value.fotoUrl = e.target.result
  }
  reader.readAsDataURL(file)
}

const guardarPerfil = async () => {
  guardando.value = true
  try {
    const token = localStorage.getItem('token')
    
    let carreraFinal = carreraSeleccionada.value
    if (carreraFinal === 'Otra...') {
      carreraFinal = editForm.value.carreraOtra
    }

    const payload = {
      nombre: editForm.value.nombre,
      carrera: carreraFinal
    }
    if (editForm.value.fotoUrl) {
      payload.fotoUrl = editForm.value.fotoUrl
    }

    const response = await fetch('http://localhost:8080/api/usuarios/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const data = await response.json()
      usuario.value = data
      
      localStorage.setItem('usuarioNombre', data.nombre)
      if (data.fotoUrl) {
        localStorage.setItem('usuarioFoto', data.fotoUrl)
      }
      
      window.location.reload()
      
      showProfileModal.value = false
    } else {
      alert("Error al guardar los cambios")
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error)
  } finally {
    guardando.value = false
  }
}

const obtenerDatosPerfil = async () => {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    const response = await fetch('http://localhost:8080/api/usuarios/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      usuario.value = data
      
      if (!data.carrera || data.carrera.trim() === '') {
        forzarCompletar.value = true
        editForm.value.nombre = data.nombre
        showProfileModal.value = true
      }
      
    } else if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error)
    usuario.value.nombre = "Error de Conexión"
  }
}

onMounted(() => {
  obtenerDatosPerfil()
  cargarActividad()
  cargarTareasParaCalendario()
})
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header { margin-bottom: 35px; }
.page-header h1 { margin: 0; font-size: 2.2rem; color: #3E2C25; font-weight: 700; letter-spacing: -0.03em; }
.subtitle { margin: 6px 0 0 0; color: #857D78; font-size: 1rem; font-weight: 400; }

.dashboard-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  align-items: start;
}

@media (max-width: 900px) {
  .dashboard-layout { grid-template-columns: 1fr; }
}

.columna-izquierda, .columna-derecha { display: flex; flex-direction: column; gap: 30px; }

.card {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E8E6E1;
  box-shadow: 0 4px 24px rgba(62, 44, 37, 0.03);
  padding: 28px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover { 
  box-shadow: 0 8px 32px rgba(62, 44, 37, 0.05); 
}

.perfil-header { 
  display: flex; 
  align-items: center; 
  gap: 18px; 
  margin-bottom: 24px; 
  padding-bottom: 24px; 
  border-bottom: 1px solid #F0EEEA; 
}

.avatar { 
  width: 74px; 
  height: 74px; 
  background: linear-gradient(135deg, #728DA6, #4C657A);
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: white; 
  font-weight: 600; 
  font-size: 1.3rem; 
  letter-spacing: 1px; 
  box-shadow: 0 4px 12px rgba(114, 141, 166, 0.2); 
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-edit-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 0.8rem;
  text-align: center;
  padding: 4px 0;
  opacity: 0;
  transition: opacity 0.2s;
}
.avatar:hover .avatar-edit-overlay {
  opacity: 1;
}

.perfil-titulos h2 { 
  margin: 0 0 6px 0; 
  font-size: 1.2rem; 
  color: #3E2C25; 
  font-weight: 600; 
}

.badge-rol { 
  background: #F2F5F8; 
  color: #5A748A; 
  padding: 4px 10px; 
  border-radius: 20px; 
  font-size: 0.7rem; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
  display: inline-block;
  margin-bottom: 8px;
}

.btn-editar {
  display: block;
  background: none;
  border: 1px solid #E8E6E1;
  color: #728DA6;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-editar:hover {
  background: #F4F7FA;
  color: #4C657A;
}

.dato-item { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  margin-bottom: 14px; 
  color: #6A625D; 
  font-size: 0.95rem; 
}

.icon { filter: grayscale(20%); opacity: 0.8; }

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 24px; 
}

.card-header h3 { 
  margin: 0; 
  font-size: 1.2rem; 
  color: #3E2C25; 
  font-weight: 600; 
}

.btn-text { 
  background: none; 
  border: none; 
  color: #728DA6; 
  font-weight: 500; 
  font-family: inherit;
  cursor: pointer; 
  transition: color 0.2s; 
}

.btn-text:hover { color: #4C657A; }

/* Timeline */
.lista-timeline { list-style: none; padding: 0; margin: 0; }

.timeline-item { 
  display: flex; 
  gap: 18px; 
  padding-bottom: 20px; 
  position: relative; 
}

.timeline-item:not(:last-child)::before { 
  content: ''; 
  position: absolute; 
  top: 40px; 
  left: 21px; 
  width: 2px; 
  height: calc(100% - 40px); 
  background-color: #F0EEEA; 
}

.timeline-icon { 
  width: 44px; 
  height: 44px; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.1rem; 
  z-index: 1; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  flex-shrink: 0;
}

.bg-blue { background: #F4F7FA; border: 1px solid #E2EAF1; }
.bg-green { background: #F5FAF6; border: 1px solid #E0EFE5; }
.bg-yellow { background: #FDF9F0; border: 1px solid #F7EEDB; }

.timeline-content { padding-top: 2px; flex: 1; min-width: 0; }
.timeline-content p { margin: 0 0 4px 0; color: #4A403B; font-size: 0.92rem; line-height: 1.5; word-break: break-word; }
.timeline-content strong { color: #3E2C25; font-weight: 600; }
.timeline-content .time { font-size: 0.8rem; color: #9A938E; font-weight: 500; }

/* Estado vacío actividad */
.empty-actividad {
  text-align: center;
  padding: 30px 20px;
  color: #9A938E;
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}
.empty-actividad p {
  margin: 0 0 6px 0;
  font-size: 1rem;
  font-weight: 500;
  color: #6A625D;
}
.empty-actividad span {
  font-size: 0.87rem;
}

/* Estado de carga */
.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #9A938E;
  font-size: 0.9rem;
  padding: 20px 0;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #E8E6E1;
  border-top-color: #728DA6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Leyenda del calendario */
.calendar-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F0EEEA;
  font-size: 0.8rem;
  color: #9A938E;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4C8B6A;
  flex-shrink: 0;
}

.custom-calendar { width: 100%; }

/* --- Estilos del Modal --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(62, 44, 37, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.modal-title {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: #3E2C25;
}
.modal-subtitle {
  margin: 0 0 24px 0;
  color: #857D78;
  font-size: 0.95rem;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #4A403B;
}
.form-group input[type="text"],
.form-group select {
  padding: 12px 16px;
  border: 1px solid #E8E6E1;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #FAFAF9;
  font-family: inherit;
  color: #3E2C25;
}
.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #728DA6;
}

.foto-upload-container {
  display: flex;
  align-items: center;
  gap: 15px;
}
.foto-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #E8E6E1;
}
.foto-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #728DA6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
.btn-primary {
  background: #728DA6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover:not(:disabled) {
  background: #4C657A;
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-secondary {
  background: white;
  border: 1px solid #E8E6E1;
  color: #6A625D;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #FAFAF9;
}
</style>
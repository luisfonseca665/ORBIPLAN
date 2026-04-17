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
            <div class="avatar">
              <span class="avatar-text">{{ iniciales }}</span>
            </div>
            <div class="perfil-titulos">
              <h2>{{ usuario.nombre }}</h2>
              <span class="badge-rol">{{ usuario.rol }}</span>
            </div>
          </div>
          <div class="perfil-datos">
            <div class="dato-item">
              <span class="icon">✉️</span>
              <span>{{ usuario.email }}</span>
            </div>
            <div class="dato-item">
              <span class="icon">🏢</span>
              <span>Ingeniería en Sistemas</span>
            </div>
          </div>
        </section>

        <section class="card calendar-card">
          <div class="card-header">
            <h3>Calendario</h3>
          </div>
          <VCalendar transparent borderless class="custom-calendar" />
        </section>
      </div>

      <div class="columna-derecha">
        <section class="card recientes-card">
          <div class="card-header">
            <h3>Actividad Reciente</h3>
            <button class="btn-text">Ver todo</button>
          </div>

          <ul class="lista-timeline">
            <li class="timeline-item">
              <div class="timeline-icon bg-blue">📄</div>
              <div class="timeline-content">
                <p>Subiste el archivo <strong>Informe_Proyecto.pdf</strong></p>
                <span class="time">Hace 2 horas</span>
              </div>
            </li>

            <li class="timeline-item">
              <div class="timeline-icon bg-green">✅</div>
              <div class="timeline-content">
                <p>Completaste la tarea <strong>Diagramas de Base de Datos</strong></p>
                <span class="time">Ayer a las 16:30</span>
              </div>
            </li>

            <li class="timeline-item">
              <div class="timeline-icon bg-yellow">📁</div>
              <div class="timeline-content">
                <p>Creaste la nueva carpeta <strong>Documentación Final</strong></p>
                <span class="time">Ayer a las 10:15</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. Estado para almacenar los datos del usuario
const usuario = ref({
  nombre: 'Cargando...',
  email: '',
  rol: 'USUARIO'
})

// 2. Lógica para calcular las iniciales (Ej: "Luis Fonseca" -> "LF")
const iniciales = computed(() => {
  if (!usuario.value.nombre || usuario.value.nombre === 'Cargando...') return '...'
  return usuario.value.nombre
    .split(' ')
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// 3. Petición al Backend para traer los datos reales
const obtenerDatosPerfil = async () => {
  try {
    const token = localStorage.getItem('token')
    
    // Si por alguna razón no hay token, lo mandamos al login
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
    } else if (response.status === 401 || response.status === 403) {
      // Si el token caducó o es inválido, limpiar y redirigir
      localStorage.removeItem('token')
      router.push('/login')
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error)
    usuario.value.nombre = "Error de Conexión"
  }
}

// Ejecutar al cargar la vista
onMounted(() => {
  obtenerDatosPerfil()
})
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header { margin-bottom: 30px; }
.page-header h1 { margin: 0; font-size: 2rem; color: #111827; font-weight: 700; }
.subtitle { margin: 5px 0 0 0; color: #6b7280; font-size: 1rem; }

.dashboard-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 25px;
  align-items: start;
}

@media (max-width: 900px) {
  .dashboard-layout { grid-template-columns: 1fr; }
}

.columna-izquierda, .columna-derecha { display: flex; flex-direction: column; gap: 25px; }

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.perfil-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; }

.avatar { 
  width: 60px; 
  height: 60px; 
  background: linear-gradient(135deg, #003366, #0055aa); 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: white; 
  font-weight: bold; 
  font-size: 1.2rem; 
}

.perfil-titulos h2 { margin: 0 0 5px 0; font-size: 1.1rem; color: #1f2937; }
.badge-rol { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }

.dato-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; color: #4b5563; font-size: 0.9rem; }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-header h3 { margin: 0; font-size: 1.1rem; color: #374151; font-weight: 600; }

.btn-text { background: none; border: none; color: #3b82f6; font-weight: 500; cursor: pointer; }

.lista-timeline { list-style: none; padding: 0; margin: 0; }
.timeline-item { display: flex; gap: 15px; padding-bottom: 20px; position: relative; }
.timeline-item:not(:last-child)::before { content: ''; position: absolute; top: 35px; left: 19px; width: 2px; height: calc(100% - 35px); background-color: #e5e7eb; }

.timeline-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; z-index: 1; }
.bg-blue { background: #eff6ff; }
.bg-green { background: #f0fdf4; }
.bg-yellow { background: #fefce8; }

.timeline-content p { margin: 0 0 4px 0; color: #374151; font-size: 0.95rem; }
.timeline-content .time { font-size: 0.8rem; color: #9ca3af; }

.custom-calendar { width: 100%; }
</style>
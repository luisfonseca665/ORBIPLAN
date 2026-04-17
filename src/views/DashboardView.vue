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

/* Estilo unificado de tarjetas */
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

/* Sección de Perfil */
.perfil-header { 
  display: flex; 
  align-items: center; 
  gap: 18px; 
  margin-bottom: 24px; 
  padding-bottom: 24px; 
  border-bottom: 1px solid #F0EEEA; 
}

.avatar { 
  width: 64px; 
  height: 64px; 
  background: linear-gradient(135deg, #728DA6, #4C657A); /* Gradiente Chambray */
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: white; 
  font-weight: 600; 
  font-size: 1.3rem; 
  letter-spacing: 1px; 
  box-shadow: 0 4px 12px rgba(114, 141, 166, 0.2); 
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
  padding: 5px 12px; 
  border-radius: 20px; 
  font-size: 0.75rem; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
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

/* Encabezados de tarjetas */
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

/* Línea de tiempo (Timeline) */
.lista-timeline { list-style: none; padding: 0; margin: 0; }

.timeline-item { 
  display: flex; 
  gap: 18px; 
  padding-bottom: 24px; 
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
}

/* Colores minimalistas para los iconos de la línea de tiempo */
.bg-blue { background: #F4F7FA; border: 1px solid #E2EAF1; }
.bg-green { background: #F5FAF6; border: 1px solid #E0EFE5; }
.bg-yellow { background: #FDF9F0; border: 1px solid #F7EEDB; }

.timeline-content { padding-top: 2px; }

.timeline-content p { 
  margin: 0 0 6px 0; 
  color: #4A403B; 
  font-size: 0.95rem; 
  line-height: 1.5; 
}

.timeline-content strong { 
  color: #3E2C25; 
  font-weight: 600; 
}

.timeline-content .time { 
  font-size: 0.8rem; 
  color: #9A938E; 
  font-weight: 500; 
}

.custom-calendar { width: 100%; }
</style>
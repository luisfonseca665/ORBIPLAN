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
              <span class="avatar-text">LF</span>
            </div>
            <div class="perfil-titulos">
              <h2>Luis Enrique Foseca</h2>
              <span class="badge-rol">Jefe de Proyecto</span>
            </div>
          </div>
          <div class="perfil-datos">
            <div class="dato-item">
              <span class="icon">✉️</span>
              <span>luis@orbiplan.com</span>
            </div>
            <div class="dato-item">
              <span class="icon">🏢</span>
              <span>Desarrollo de Software</span>
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
                <p>Subiste el archivo <strong>Informe_Ventas_Q3.pdf</strong></p>
                <span class="time">Hace 2 horas</span>
              </div>
            </li>

            <li class="timeline-item">
              <div class="timeline-icon bg-green">✅</div>
              <div class="timeline-content">
                <p>Completaste la tarea <strong>Revisar requerimientos del sistema</strong></p>
                <span class="time">Ayer a las 16:30</span>
              </div>
            </li>

            <li class="timeline-item">
              <div class="timeline-icon bg-yellow">📁</div>
              <div class="timeline-content">
                <p>Creaste la nueva carpeta <strong>Reportes 2025</strong></p>
                <span class="time">Ayer a las 10:15</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
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

.columna-izquierda, .columna-derecha { display: flex; flex-direction: column; gap: 25px; }

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 24px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
}

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-header h3 { margin: 0; font-size: 1.1rem; color: #374151; font-weight: 600; }

.perfil-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; }
.avatar { width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; }
.perfil-titulos h2 { margin: 0 0 5px 0; font-size: 1.1rem; color: #1f2937; }
.badge-rol { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.dato-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; color: #4b5563; font-size: 0.9rem; }

.btn-text { background: none; border: none; color: #3b82f6; font-weight: 500; cursor: pointer; }
.btn-text:hover { text-decoration: underline; }

.lista-timeline { list-style: none; padding: 0; margin: 0; }
.timeline-item { display: flex; gap: 15px; padding-bottom: 20px; position: relative; }
.timeline-item:not(:last-child)::before { content: ''; position: absolute; top: 35px; left: 19px; width: 2px; height: calc(100% - 35px); background-color: #e5e7eb; }
.timeline-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; z-index: 1; }

.bg-blue { background: #eff6ff; }
.bg-green { background: #f0fdf4; }
.bg-yellow { background: #fefce8; }

.timeline-content p { margin: 0 0 4px 0; color: #374151; font-size: 0.95rem; line-height: 1.4; }
.timeline-content .time { font-size: 0.8rem; color: #9ca3af; }

.custom-calendar { width: 100%; font-family: inherit; }
</style>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="logo">
        <h2>ORBIPLAN</h2>
      </div>
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/archivos">Mis Archivos</RouterLink>
        <RouterLink to="/tareas">Mis Tareas</RouterLink>
        <RouterLink to="/notas">Mis Notas</RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="topbar-left">
          <span class="workspace-name">Espacio de Trabajo / Principal</span>
        </div>
        <div class="topbar-right">
          <div class="user-mini-profile">
            <span class="avatar-small">LF</span>
          </div>
          <button class="btn-logout">Salir</button>
        </div>
      </header>
      
      <div class="content-area">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Estilos generales mejorados */
.app-container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
}

.sidebar {
  width: 260px;
  background-color: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0,0,0,0.05);
  z-index: 10;
}

.logo {
  padding: 25px 20px;
  text-align: center;
  border-bottom: 1px solid #334155;
}

.logo h2 { margin: 0; font-weight: 700; letter-spacing: 1px; }

nav { display: flex; flex-direction: column; padding: 20px 0; gap: 5px; }

nav a {
  color: #94a3b8;
  text-decoration: none;
  padding: 12px 25px;
  transition: all 0.2s;
  font-weight: 500;
  border-left: 4px solid transparent;
}

nav a:hover, nav a.router-link-exact-active {
  background-color: #334155;
  color: white;
  border-left: 4px solid #3b82f6;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  background-color: white;
  padding: 15px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.workspace-name {
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-small {
  background: #3b82f6;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.btn-logout {
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #fef2f2;
}

.content-area {
  padding: 35px;
  overflow-y: auto;
  height: 100%;
}
</style>
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import ArchivosView from '../views/ArchivosView.vue'
import TareasView from '../views/TareasView.vue'
import NotasView from '../views/NotasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'archivos',
          name: 'archivos',
          component: ArchivosView
        },
        {
          path: 'tareas',
          name: 'tareas',
          component: TareasView
        },
        {
          path: 'notas',
          name: 'notas',
          component: NotasView
        }
      ]
    }
  ]
})

// --- EL GUARDIÁN DE SEGURIDAD ---
router.beforeEach((to, from, next) => {
  // Verificamos si existe un token en el almacenamiento local [cite: 148]
  const isAuthenticated = localStorage.getItem('token');

  // Si el usuario intenta ir a cualquier ruta que NO sea login y no está autenticado
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' }); // Redirigir al login
  } 
  // Si ya está autenticado e intenta ir al login, lo mandamos al dashboard
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' });
  } 
  // En cualquier otro caso, permitir la navegación
  else {
    next();
  }
});

export default router
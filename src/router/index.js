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

export default router

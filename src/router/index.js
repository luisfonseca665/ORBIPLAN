import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArchivosView from '../views/ArchivosView.vue'
import TareasView from '../views/TareasView.vue'
import NotasView from '../views/NotasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/archivos',
      name: 'archivos',
      component: ArchivosView
    },
    {
      path: '/tareas',
      name: 'tareas',
      component: TareasView
    },
    {
      path: '/notas',
      name: 'notas',
      component: NotasView
    }
  ]
})

export default router
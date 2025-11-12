import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'),
      },
      {
        path: '/parametres',
        name: 'Paramètres',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/user/ParametreUser.vue'),
      },
      {
        path: '/liste',
        name: 'Liste des pc',
        component: () => import(/* webpackChunkName: "liste" */ '@/views/dashboard/Liste.vue'),
        children: [
          {
            path: 'consultation/:id',
            name: 'Consultation',
            component: () =>
              import(/* webpackChunkName: "consultation" */ '@/views/dashboard/Consultation.vue'),
          },
        ],
      },
      {
        path: '/support',
        name: 'Système de support',
        component: () =>
          import(/* webpackChunkName: "support" */ '@/views/support/ListeTicket.vue'),
        children: [
          {
            path: 'create',
            name: 'Créer un ticket de support',
            component: () =>
              import(/* webpackChunkName: "create-ticket" */ '@/views/support/CreateTicket.vue'),
          },
          {
            path: 'read/:id',
            name: 'Details du ticket',
            component: () =>
              import(/* webpackChunkName: "read-ticket" */ '@/views/support/ReadTicket.vue'),
          },
        ],
      },
      {
        path: '/admin/support',
        name: 'Administration',
        component: () =>
          import(/* webpackChunkName: "support" */ '@/views/support/ListeTicket.vue'),
        children: [
          {
            path: 'read/:id',
            name: 'Admin | Details du ticket',
            component: () =>
              import(/* webpackChunkName: "read-ticket" */ '@/views/support/ReadTicket.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Connexion | TrackIT',
    component: () => import(/* webpackChunkName: "login" */ '@/views/pages/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Middleware global pour gérer les redirections
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user') // Vérifie si l'utilisateur est authentifié
  if (to.name === 'Connexion | TrackIT' && isAuthenticated) {
    // Si un utilisateur authentifié essaie d'aller sur la page de connexion, redirigez-le vers le tableau de bord
    next({ name: 'Dashboard' })
  } else if (!isAuthenticated && to.name !== 'Connexion | TrackIT') {
    // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
    next({ name: 'Connexion | TrackIT' })
  } else {
    // Autorise l'accès à toutes les autres routes
    next()
  }
})

export default router

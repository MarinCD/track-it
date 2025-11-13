export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavItem',
    name: 'Liste des ordinateurs',
    to: '/liste',
    icon: 'cil-notes',
  },
  {
    component: 'CNavGroup',
    name: 'Système de support',
    to: '/support',
    icon: 'cil-pencil',
    items: [
      {
        component: 'CNavItem',
        name: 'Créer un ticket',
        to: '/support/create',
      },
      {
        component: 'CNavItem',
        name: 'Vos tickets',
        to: '/support',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Administration',
    to: '/admin',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Système de support',
        to: '/admin/support',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Organization',
    to: '/organisation',
    icon: 'cil-layers',
  },
]

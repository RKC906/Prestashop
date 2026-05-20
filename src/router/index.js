// Définition des routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(), // Utilise l'historique HTML5 classique (sans le # dans l'URL)
  routes
})

export default router
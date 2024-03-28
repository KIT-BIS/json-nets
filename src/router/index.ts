import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import ConfigLoader from './ConfigLoader.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
       {
         path: '/:configID',
         name: 'config',
         component: ConfigLoader
       },
       {
         path: '/:configID/:modelID',
         name: 'model',
         component: ConfigLoader
       },

    //    {
    //      path: '/about',
    //      name: 'about',
    //      // route level code-splitting
    //      // this generates a separate chunk (About.[hash].js) for this route
    //      // which is lazy-loaded when the route is visited.
    //      component: () => import('../views/AboutView.vue')
    //    }
  ]
})

export default router

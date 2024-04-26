import { createRouter, createWebHistory } from 'vue-router'
import ConfigLoader from './ConfigLoader.vue'

/**
 * Router configuration to load config and model based on given url.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      //  {
        //  path: '/',
        //  name: 'home',
        //  component: ConfigLoader
      //  },
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
  ]
})

export default router

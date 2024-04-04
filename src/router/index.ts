import { createRouter, createWebHistory } from 'vue-router'
import ConfigLoader from './ConfigLoader.vue'
import Configurator from '@/configs/configurator.vue'

/**
 * Router configuration to load config and model based on given url.
 */
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
       }, {
        path: '/configurator', 
        name: 'configurator', 
        component: Configurator 
      }
  ]
})

export default router

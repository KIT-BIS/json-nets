import { createRouter, createWebHashHistory } from 'vue-router'
import ConfigLoader from './ConfigLoader.vue'
import Configurator from '@/configs/Configurator.vue'
import NetEditor from '@/components/NetEditor.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'NetEditor',
      component: NetEditor
    },
    {
      path: '/configurator',
      name: 'configurator',
      component: Configurator
    },
    {
      path: '/:configID',
      name: 'config',
      component: ConfigLoader
    },
    {
      path: '/:configID/:modelID',
      name: 'model',
      component: ConfigLoader
    }
  ]
})

export default router

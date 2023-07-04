import './assets/style.scss'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCodemirror from 'vue-codemirror'
import {
  faCircle,
  faSquare,
  faArrowRight,
  faTrash,
  faMousePointer,
  faExpandArrowsAlt,
  faEdit,
  faPlayCircle,
  faFileArrowDown,
  faInfoCircle,
  faPlusCircle,
  faMinusCircle,
  faWandMagicSparkles,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* add icons to the library */
library.add(
  faCircle,
  faSquare,
  faArrowRight,
  faTrash,
  faMousePointer,
  faExpandArrowsAlt,
  faEdit,
  faPlayCircle,
  faFileArrowDown,
  faInfoCircle,
  faPlusCircle,
  faMinusCircle,
  faWandMagicSparkles,
  faQuestion
)

import App from './App.vue'
//import router from './router'

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(VueCodemirror, {
  // keep the global default extensions empty
  // to allow removal of gutters
  extensions: []
})
//app.use(router)

app.mount('#app')
